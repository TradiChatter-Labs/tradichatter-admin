// Appwrite Security Database Setup Script
// Run this to create security collections with proper permissions

import { Client, Databases, Permission, Role } from 'appwrite';
import { APPWRITE_SECURITY_COLLECTIONS } from '../config/appwriteSecuritySchema.js';

class SecurityDatabaseSetup {
  constructor() {
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);
    
    this.databases = new Databases(this.client);
    this.databaseId = 'tradichatter_security';
  }

  async setupSecurityDatabase() {
    try {
      console.log('🔧 Setting up TradiChatter Security Database...');

      // Create security database
      await this.createSecurityDatabase();

      // Create all security collections
      await this.createSecurityEventsCollection();
      await this.createSecurityMetricsCollection();
      await this.createSecurityIncidentsCollection();

      console.log('✅ Security database setup completed successfully!');
    } catch (error) {
      console.error('❌ Failed to setup security database:', error);
      throw error;
    }
  }

  async createSecurityDatabase() {
    try {
      await this.databases.create(this.databaseId, 'TradiChatter Security');
      console.log('✅ Created security database');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  Security database already exists');
      } else {
        throw error;
      }
    }
  }

  async createSecurityEventsCollection() {
    const config = APPWRITE_SECURITY_COLLECTIONS.SECURITY_EVENTS;
    
    try {
      // Create collection
      await this.databases.createCollection(
        this.databaseId,
        config.collectionId,
        config.name,
        [
          Permission.read(Role.team('security')),
          Permission.read(Role.team('admin')),
          Permission.create(Role.team('system')),
          Permission.create(Role.team('security'))
        ]
      );

      // Create attributes
      for (const attr of config.attributes) {
        await this.createAttribute(config.collectionId, attr);
      }

      // Create indexes
      for (const index of config.indexes) {
        await this.databases.createIndex(
          this.databaseId,
          config.collectionId,
          index.key,
          index.type,
          index.attributes,
          index.orders
        );
      }

      console.log('✅ Created security_events collection');
    } catch (error) {
      if (error.code === 409) {
        console.log('ℹ️  security_events collection already exists');
      } else {
        throw error;
      }
    }
  }

  async createAttribute(collectionId, attr) {
    try {
      switch (attr.type) {
        case 'string':
          await this.databases.createStringAttribute(
            this.databaseId,
            collectionId,
            attr.key,
            attr.size,
            attr.required,
            attr.default,
            attr.array
          );
          break;
        case 'integer':
          await this.databases.createIntegerAttribute(
            this.databaseId,
            collectionId,
            attr.key,
            attr.required,
            attr.min,
            attr.max,
            attr.default,
            attr.array
          );
          break;
        case 'enum':
          await this.databases.createEnumAttribute(
            this.databaseId,
            collectionId,
            attr.key,
            attr.elements,
            attr.required,
            attr.default,
            attr.array
          );
          break;
        case 'datetime':
          await this.databases.createDatetimeAttribute(
            this.databaseId,
            collectionId,
            attr.key,
            attr.required,
            attr.default,
            attr.array
          );
          break;
        case 'boolean':
          await this.databases.createBooleanAttribute(
            this.databaseId,
            collectionId,
            attr.key,
            attr.required,
            attr.default,
            attr.array
          );
          break;
      }
    } catch (error) {
      if (error.code === 409) {
        return;
      }
      throw error;
    }
  }
}

export default SecurityDatabaseSetup;