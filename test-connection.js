// Test script to verify mobile app connection
const { testMobileAppConnection } = require('./services/mobile-app-integration');

async function runConnectionTest() {
  console.log('🔄 Testing mobile app connection...');
  
  try {
    const result = await testMobileAppConnection();
    
    if (result.success) {
      console.log('✅ Connection successful!');
      console.log('📊 Stats:', result.stats);
      console.log('👥 Users found:', result.userCount);
      console.log('🏢 Businesses found:', result.businessCount);
    } else {
      console.log('❌ Connection failed:', result.error);
    }
  } catch (error) {
    console.log('💥 Test error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  runConnectionTest();
}

module.exports = { runConnectionTest };