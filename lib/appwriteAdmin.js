import { Client, Databases, Users, Storage, Functions } from 'node-appwrite';

class AppwriteAdmin {
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'tradichatter-prod')
      .setKey(process.env.APPWRITE_API_KEY || 'your-api-key');
    
    this.databases = new Databases(this.client);
    this.users = new Users(this.client);
    this.storage = new Storage(this.client);
    this.functions = new Functions(this.client);
    
    this.databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main';
    this.collections = {
      users: 'users',
      businesses: 'businesses',
      channels: 'channels',
      messages: 'messages',
      products: 'products',
      orders: 'orders',
      payments: 'payments'
    };
  }

  // User Management
  async getAllUsers(queries = []) {
    try {
      const response = await this.users.list(queries);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUserById(userId) {
    try {
      const response = await this.users.get(userId);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateUser(userId, data) {
    try {
      const response = await this.users.updateName(userId, data.name);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteUser(userId) {
    try {
      await this.users.delete(userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Business Management
  async getAllBusinesses(queries = []) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collections.businesses,
        queries
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getBusiness(businessId) {
    try {
      const response = await this.databases.getDocument(
        this.databaseId,
        this.collections.businesses,
        businessId
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateBusiness(businessId, data) {
    try {
      const response = await this.databases.updateDocument(
        this.databaseId,
        this.collections.businesses,
        businessId,
        data
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async approveBusiness(businessId) {
    return await this.updateBusiness(businessId, { 
      isVerified: true, 
      verificationDate: new Date().toISOString() 
    });
  }

  async rejectBusiness(businessId, reason) {
    return await this.updateBusiness(businessId, { 
      isVerified: false, 
      rejectionReason: reason,
      rejectionDate: new Date().toISOString() 
    });
  }

  // Order Management
  async getAllOrders(queries = []) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collections.orders,
        queries
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getOrder(orderId) {
    try {
      const response = await this.databases.getDocument(
        this.databaseId,
        this.collections.orders,
        orderId
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updateOrderStatus(orderId, status) {
    return await this.updateDocument(this.collections.orders, orderId, { 
      status,
      updatedAt: new Date().toISOString() 
    });
  }

  // Payment Management
  async getAllPayments(queries = []) {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collections.payments,
        queries
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPayment(paymentId) {
    try {
      const response = await this.databases.getDocument(
        this.databaseId,
        this.collections.payments,
        paymentId
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Analytics
  async getDashboardStats() {
    try {
      const [usersResult, businessesResult, ordersResult, paymentsResult] = await Promise.all([
        this.getAllUsers(),
        this.getAllBusinesses(),
        this.getAllOrders(),
        this.getAllPayments()
      ]);

      if (!usersResult.success || !businessesResult.success || 
          !ordersResult.success || !paymentsResult.success) {
        throw new Error('Failed to fetch dashboard data');
      }

      const totalRevenue = paymentsResult.data.documents
        .filter(payment => payment.status === 'completed')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      const stats = {
        totalUsers: usersResult.data.total,
        totalBusinesses: businessesResult.data.total,
        totalOrders: ordersResult.data.total,
        totalRevenue,
        pendingOrders: ordersResult.data.documents.filter(order => order.status === 'pending').length,
        completedOrders: ordersResult.data.documents.filter(order => order.status === 'completed').length,
        verifiedBusinesses: businessesResult.data.documents.filter(business => business.isVerified).length,
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getRevenueAnalytics(period = '30d') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 30);
      }

      const queries = [
        `createdAt>=${startDate.toISOString()}`,
        `createdAt<=${endDate.toISOString()}`,
        'status=completed'
      ];

      const paymentsResult = await this.getAllPayments(queries);
      
      if (!paymentsResult.success) {
        throw new Error('Failed to fetch payment data');
      }

      const dailyRevenue = {};
      paymentsResult.data.documents.forEach(payment => {
        const date = new Date(payment.createdAt).toDateString();
        dailyRevenue[date] = (dailyRevenue[date] || 0) + (payment.amount || 0);
      });

      return { success: true, data: dailyRevenue };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Utility Methods
  async updateDocument(collectionId, documentId, data) {
    try {
      const response = await this.databases.updateDocument(
        this.databaseId,
        collectionId,
        documentId,
        data
      );
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteDocument(collectionId, documentId) {
    try {
      await this.databases.deleteDocument(
        this.databaseId,
        collectionId,
        documentId
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // File Management
  async getFileUrl(bucketId, fileId) {
    try {
      const url = this.storage.getFileView(bucketId, fileId);
      return { success: true, data: url };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Function Execution
  async executeFunction(functionId, data = {}) {
    try {
      const response = await this.functions.createExecution(functionId, JSON.stringify(data));
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new AppwriteAdmin();