import admin from './firebase-admin';

class MobileAppIntegration {
  constructor() {
    this.isEnabled = process.env.MOBILE_APP_CONTROL_ENABLED === 'true';
    this.db = null;
    this.initialize();
  }

  async initialize() {
    try {
      if (this.isEnabled && admin.apps.length > 0) {
        this.db = admin.firestore();
        console.log('✅ Mobile App Integration initialized');
      } else {
        console.log('📱 Mobile App Integration disabled or Firebase unavailable');
      }
    } catch (error) {
      console.error('❌ Mobile App Integration initialization failed:', error);
      this.db = null;
    }
  }

  // Safe method to get mobile app data without affecting existing functionality
  async getMobileAppUsers() {
    if (!this.db) return { success: false, data: [], error: 'Integration not available' };
    
    try {
      const usersRef = this.db.collection('users');
      const snapshot = await usersRef.limit(100).get();
      
      const users = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email || 'N/A',
          displayName: data.displayName || data.name || 'Unknown User',
          userType: data.userType || 'customer',
          businessId: data.businessId || null,
          createdAt: data.createdAt?.toDate() || new Date(),
          isActive: data.isActive !== false
        });
      });

      return { success: true, data: users };
    } catch (error) {
      console.error('Error getting mobile app users:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getMobileAppBusinesses() {
    if (!this.db) return { success: false, data: [], error: 'Integration not available' };
    
    try {
      const businessesRef = this.db.collection('businesses');
      const snapshot = await businessesRef.limit(100).get();
      
      const businesses = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        businesses.push({
          id: doc.id,
          name: data.name || 'Unknown Business',
          description: data.description || '',
          ownerId: data.ownerId || null,
          categories: data.categories || [],
          isActive: data.isActive !== false,
          rating: data.rating || 0,
          totalOrders: data.totalOrders || 0,
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });

      return { success: true, data: businesses };
    } catch (error) {
      console.error('Error getting mobile app businesses:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  async getMobileAppOrders() {
    if (!this.db) return { success: false, data: [], error: 'Integration not available' };
    
    try {
      const ordersRef = this.db.collection('orders');
      const snapshot = await ordersRef.orderBy('createdAt', 'desc').limit(100).get();
      
      const orders = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        orders.push({
          id: doc.id,
          businessId: data.businessId || null,
          customerId: data.customerId || null,
          status: data.status || 'pending',
          totalAmount: data.totalAmount || 0,
          items: data.items || [],
          createdAt: data.createdAt?.toDate() || new Date()
        });
      });

      return { success: true, data: orders };
    } catch (error) {
      console.error('Error getting mobile app orders:', error);
      return { success: false, data: [], error: error.message };
    }
  }

  // Safe method to update mobile app data (non-destructive)
  async updateBusinessStatus(businessId, isActive) {
    if (!this.db) return { success: false, error: 'Integration not available' };
    
    try {
      const businessRef = this.db.collection('businesses').doc(businessId);
      const businessDoc = await businessRef.get();
      
      if (!businessDoc.exists) {
        return { success: false, error: 'Business not found' };
      }

      await businessRef.update({
        isActive,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'admin_portal'
      });

      return { success: true, message: `Business ${isActive ? 'activated' : 'deactivated'} successfully` };
    } catch (error) {
      console.error('Error updating business status:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserStatus(userId, isActive) {
    if (!this.db) return { success: false, error: 'Integration not available' };
    
    try {
      const userRef = this.db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return { success: false, error: 'User not found' };
      }

      await userRef.update({
        isActive,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedBy: 'admin_portal'
      });

      return { success: true, message: `User ${isActive ? 'activated' : 'suspended'} successfully` };
    } catch (error) {
      console.error('Error updating user status:', error);
      return { success: false, error: error.message };
    }
  }

  // Get real-time statistics
  async getMobileAppStats() {
    if (!this.db) return { success: false, data: {}, error: 'Integration not available' };
    
    try {
      const [usersResult, businessesResult, ordersResult] = await Promise.all([
        this.getMobileAppUsers(),
        this.getMobileAppBusinesses(),
        this.getMobileAppOrders()
      ]);

      const stats = {
        totalUsers: usersResult.success ? usersResult.data.length : 0,
        activeUsers: usersResult.success ? usersResult.data.filter(u => u.isActive).length : 0,
        totalBusinesses: businessesResult.success ? businessesResult.data.length : 0,
        activeBusinesses: businessesResult.success ? businessesResult.data.filter(b => b.isActive).length : 0,
        totalOrders: ordersResult.success ? ordersResult.data.length : 0,
        totalRevenue: ordersResult.success ? ordersResult.data.reduce((sum, o) => sum + o.totalAmount, 0) : 0,
        lastUpdated: new Date().toISOString()
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting mobile app stats:', error);
      return { success: false, data: {}, error: error.message };
    }
  }

  // Check integration health
  async checkHealth() {
    try {
      if (!this.isEnabled) {
        return { status: 'disabled', message: 'Mobile app integration is disabled' };
      }

      if (!this.db) {
        return { status: 'error', message: 'Firebase connection not available' };
      }

      // Test connection with a simple query
      await this.db.collection('users').limit(1).get();
      return { status: 'healthy', message: 'Mobile app integration is working' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

// Export singleton instance
export const mobileAppIntegration = new MobileAppIntegration();
export default mobileAppIntegration;