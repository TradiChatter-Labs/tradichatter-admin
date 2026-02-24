// API endpoint for document verification with external providers
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { requestId, documentType } = req.body;

  try {
    // Simulate different provider integrations
    let verificationResult;

    switch (documentType) {
      case 'cac_certificate':
        verificationResult = await verifyCACDocument(req.body);
        break;
      case 'tax_id':
        verificationResult = await verifyFIRSDocument(req.body);
        break;
      case 'bank_statement':
        verificationResult = await verifyBankDocument(req.body);
        break;
      default:
        verificationResult = await verifyGenericDocument(req.body);
    }

    res.status(200).json(verificationResult);
  } catch (error) {
    console.error('Document verification error:', error);
    res.status(500).json({ 
      verified: false, 
      provider: 'Error', 
      details: 'Verification failed' 
    });
  }
}

async function verifyCACDocument(data) {
  // Simulate CAC API integration
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
  
  return {
    verified: Math.random() > 0.3, // 70% success rate
    provider: 'CAC Nigeria',
    details: {
      companyName: 'Tech Solutions Ltd',
      registrationNumber: 'RC123456',
      status: 'Active',
      verifiedAt: new Date().toISOString()
    }
  };
}

async function verifyFIRSDocument(data) {
  // Simulate FIRS API integration
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    verified: Math.random() > 0.2, // 80% success rate
    provider: 'FIRS Nigeria',
    details: {
      tinNumber: 'TIN123456789',
      taxpayerName: 'Tech Solutions Ltd',
      status: 'Valid',
      verifiedAt: new Date().toISOString()
    }
  };
}

async function verifyBankDocument(data) {
  // Simulate bank verification
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    verified: Math.random() > 0.4, // 60% success rate
    provider: 'Bank Verification',
    details: {
      accountNumber: '0123456789',
      accountName: 'Tech Solutions Ltd',
      bankName: 'GTBank',
      verifiedAt: new Date().toISOString()
    }
  };
}

async function verifyGenericDocument(data) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    verified: Math.random() > 0.5, // 50% success rate
    provider: 'Manual Review',
    details: {
      reviewedBy: 'System',
      verifiedAt: new Date().toISOString()
    }
  };
}