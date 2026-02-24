// API endpoint for creating Flutterwave subaccounts
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { businessId } = req.body;

  try {
    // Get business details from database
    const business = await getBusinessById(businessId);
    
    if (!business) {
      return res.status(404).json({ success: false, message: 'Business not found' });
    }

    // Create Flutterwave subaccount
    const flutterwaveResponse = await fetch('https://api.flutterwave.com/v3/subaccounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account_bank: business.bankCode,
        account_number: business.accountNumber,
        business_name: business.businessName,
        business_email: business.email,
        business_contact: business.phone,
        business_contact_mobile: business.phone,
        business_mobile: business.phone,
        split_type: 'percentage',
        split_value: 0.025 // 2.5% platform fee
      })
    });

    const flutterwaveData = await flutterwaveResponse.json();

    if (flutterwaveData.status === 'success') {
      // Update database with subaccount ID
      await updateBusinessSubaccount(businessId, flutterwaveData.data.subaccount_id);
      
      res.status(200).json({
        success: true,
        subaccountId: flutterwaveData.data.subaccount_id,
        message: 'Subaccount created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: flutterwaveData.message || 'Failed to create subaccount'
      });
    }
  } catch (error) {
    console.error('Subaccount creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Mock database functions - replace with real database calls
async function getBusinessById(businessId) {
  // Simulate database lookup
  return {
    id: businessId,
    businessName: 'Tech Solutions Ltd',
    email: 'emeka@techsolutions.com',
    phone: '+234 802 345 6789',
    bankCode: '058', // GTBank
    accountNumber: '0123456789'
  };
}

async function updateBusinessSubaccount(businessId, subaccountId) {
  // Simulate database update
  console.log(`Updated business ${businessId} with subaccount ${subaccountId}`);
  return true;
}