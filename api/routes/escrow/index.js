const express = require('express');
const router = express.Router();
const { adminAuth, requirePermission } = require('../../middleware/adminAuth');
const { auditLog } = require('../../utils/auditLogger');

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._token;
    const sessionToken = req.session?.csrfToken;
    
    if (!token || !sessionToken || token !== sessionToken) {
      return res.status(403).json({ error: 'CSRF token validation failed' });
    }
  }
  next();
};

// Get all escrows with filtering
router.get('/', adminAuth, requirePermission('escrow.view'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT e.*, o.order_number, u1.username as buyer_name, u2.username as seller_name
      FROM escrows e
      JOIN orders o ON e.order_id = o.id
      JOIN users u1 ON o.buyer_id = u1.id
      JOIN users u2 ON o.seller_id = u2.id
    `;
    
    if (status) query += ` WHERE e.status = ?`;
    query += ` ORDER BY e.created_at DESC LIMIT ? OFFSET ?`;
    
    const params = status ? [status, limit, offset] : [limit, offset];
    const escrows = await db.query(query, params);
    
    res.json({ escrows, page, limit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Partial release escrow
router.post('/:id/partial-release', adminAuth, requirePermission('escrow.release'), csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    
    await db.beginTransaction();
    
    // Update escrow
    await db.query(
      'UPDATE escrows SET status = ?, partial_amount = ? WHERE id = ?',
      ['PARTIALLY_RELEASED', amount, id]
    );
    
    // Log action
    await db.query(
      'INSERT INTO escrow_actions (escrow_id, admin_id, action_type, amount, reason) VALUES (?, ?, ?, ?, ?)',
      [id, req.admin.id, 'PARTIAL_RELEASE', amount, reason]
    );
    
    await auditLog(req.admin.id, 'ESCROW_PARTIAL_RELEASE', { escrow_id: id, amount, reason }, req.ip);
    await db.commit();
    
    res.json({ success: true, message: 'Partial release completed' });
  } catch (error) {
    await db.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Force release escrow
router.post('/:id/force-release', adminAuth, requirePermission('escrow.force_release'), csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) return res.status(400).json({ error: 'Reason required for force release' });
    
    await db.beginTransaction();
    
    await db.query('UPDATE escrows SET status = ? WHERE id = ?', ['FORCE_RELEASED', id]);
    await db.query(
      'INSERT INTO escrow_actions (escrow_id, admin_id, action_type, reason) VALUES (?, ?, ?, ?)',
      [id, req.admin.id, 'FORCE_RELEASE', reason]
    );
    
    await auditLog(req.admin.id, 'ESCROW_FORCE_RELEASE', { escrow_id: id, reason }, req.ip);
    await db.commit();
    
    res.json({ success: true, message: 'Force release completed' });
  } catch (error) {
    await db.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Release escrow
router.post('/:id/release', adminAuth, requirePermission('escrow.release'), csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    await db.beginTransaction();
    
    await db.query('UPDATE escrows SET status = ? WHERE id = ?', ['RELEASED', id]);
    await db.query(
      'INSERT INTO escrow_actions (escrow_id, admin_id, action_type, reason) VALUES (?, ?, ?, ?)',
      [id, req.admin.id, 'RELEASE', reason]
    );
    
    await auditLog(req.admin.id, 'ESCROW_RELEASE', { escrow_id: id, reason }, req.ip);
    await db.commit();
    
    res.json({ success: true, message: 'Escrow released successfully' });
  } catch (error) {
    await db.rollback();
    res.status(500).json({ error: error.message });
  }
});

// Refund buyer
router.post('/:id/refund', adminAuth, requirePermission('escrow.refund'), csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    await db.beginTransaction();
    
    await db.query('UPDATE escrows SET status = ? WHERE id = ?', ['REFUNDED', id]);
    await db.query(
      'INSERT INTO escrow_actions (escrow_id, admin_id, action_type, reason) VALUES (?, ?, ?, ?)',
      [id, req.admin.id, 'REFUND', reason]
    );
    
    await auditLog(req.admin.id, 'ESCROW_REFUND', { escrow_id: id, reason }, req.ip);
    await db.commit();
    
    res.json({ success: true, message: 'Refund processed successfully' });
  } catch (error) {
    await db.rollback();
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;