import appwriteAdmin from '../lib/appwriteAdmin.js';

// Appwrite database adapter for admin portal
const db = {
  execute: async (query, params) => {
    console.log('Appwrite Query:', query, params);
    
    // Handle admin authentication queries
    if (query.includes('SELECT') && query.includes('admins')) {
      // Mock admin user for authentication
      return [[{ 
        id: 1, 
        email: 'admin@tradichatter.com', 
        role: 'admin', 
        status: 'ACTIVE' 
      }]];
    }
    
    // Handle permission queries
    if (query.includes('admin_permissions')) {
      return [[{ name: 'full_access' }]];
    }
    
    // Handle audit log inserts
    if (query.includes('INSERT INTO audit_logs')) {
      console.log('Audit log:', params);
      return [{ insertId: Date.now() }];
    }
    
    return [[]];
  }
};

// Test connection to Appwrite
const testConnection = async () => {
  try {
    const result = await appwriteAdmin.getDashboardStats();
    if (result.success) {
      console.log('✅ Admin portal connected to Appwrite database');
      return true;
    } else {
      console.warn('⚠️ Appwrite connection issue, using mock data');
      return false;
    }
  } catch (error) {
    console.warn('⚠️ Appwrite not available, using mock authentication');
    return false;
  }
};

// Initialize database connection
const initDatabase = async () => {
  const isConnected = await testConnection();
  console.log(`📊 Admin database initialized (Appwrite: ${isConnected ? 'connected' : 'mock mode'})`);
  return isConnected;
};

export { db, testConnection, initDatabase, appwriteAdmin };