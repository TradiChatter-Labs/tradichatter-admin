const { adminAuth, requirePermission, auditLog } = require('../../../../../api/middleware/adminAuth');

export default async function handler(req, res) {
  await adminAuth(req, res, async () => {
    await requirePermission('system', 'manage')(req, res, async () => {
      if (req.method === 'POST') {
        return await retryWebhook(req, res);
      }
      res.status(405).json({ error: 'Method not allowed' });
    });
  });
}

async function retryWebhook(req, res) {
  try {
    const { id } = req.query;
    const adminId = req.admin.id;
    
    const [log] = await db.query('SELECT * FROM webhook_logs WHERE id = ?', [id]);
    if (!log.length) {
      return res.status(404).json({ error: 'Webhook log not found' });
    }

    const webhookData = log[0];
    
    // Check retry limit
    if (webhookData.retry_count >= 5) {
      return res.status(400).json({ error: 'Maximum retry attempts reached' });
    }
    
    // Update status to processing
    await db.query(
      'UPDATE webhook_logs SET processing_status = ?, retry_count = retry_count + 1, last_retry_at = NOW() WHERE id = ?',
      ['PROCESSING', id]
    );
    
    let success = false;
    let errorMessage = null;
    
    try {
      // Process webhook based on type
      const payload = JSON.parse(webhookData.payload);
      success = await processWebhookByType(payload, webhookData.webhook_type);
    } catch (processingError) {
      errorMessage = processingError.message;
      console.error('Webhook processing error:', processingError);
    }
    
    // Update final status
    await db.query(
      'UPDATE webhook_logs SET processing_status = ?, error_message = ?, processed_at = NOW() WHERE id = ?',
      [success ? 'SUCCESS' : 'FAILED', errorMessage, id]
    );
    
    // Comprehensive audit logging
    await AuditLoggingService.logWebhookAction(
      adminId,
      'WEBHOOK_RETRY',
      id,
      {
        webhookType: webhookData.webhook_type,
        retryCount: webhookData.retry_count + 1,
        success,
        errorMessage,
        originalTimestamp: webhookData.created_at
      },
      req.ip,
      req.headers['user-agent']
    );
    
    res.json({ 
      success, 
      retried: true, 
      retryCount: webhookData.retry_count + 1,
      errorMessage 
    });
  } catch (error) {
    console.error('Webhook retry error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function processWebhookByType(payload, type) {
  try {
    switch (type) {
      case 'PAYMENT_COMPLETED':
        return await processPaymentWebhook(payload);
      case 'TRANSFER_COMPLETED':
        return await processTransferWebhook(payload);
      case 'PAYOUT_COMPLETED':
        return await processPayoutWebhook(payload);
      default:
        console.log('Unknown webhook type:', type);
        return false;
    }
  } catch (error) {
    console.error(`Error processing ${type} webhook:`, error);
    return false;
  }
}

async function processPaymentWebhook(payload) {
  const { tx_ref, status, amount } = payload.data;
  
  if (status === 'successful') {
    await db.query(
      'UPDATE transactions SET status = ?, flutterwave_status = ? WHERE reference = ?',
      ['COMPLETED', status, tx_ref]
    );
    return true;
  }
  return false;
}

async function processTransferWebhook(payload) {
  const { reference, status } = payload.data;
  
  await db.query(
    'UPDATE transfers SET status = ?, flutterwave_status = ? WHERE reference = ?',
    [status === 'SUCCESSFUL' ? 'COMPLETED' : 'FAILED', status, reference]
  );
  return true;
}

async function processPayoutWebhook(payload) {
  const { reference, status } = payload.data;
  
  await db.query(
    'UPDATE payouts SET status = ?, flutterwave_status = ?, completed_at = NOW() WHERE flutterwave_reference = ?',
    [status === 'SUCCESSFUL' ? 'COMPLETED' : 'FAILED', status, reference]
  );
  return true;
}