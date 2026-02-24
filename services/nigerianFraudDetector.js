// TradiChatter Nigerian Context Fraud Detection Rules
// Specialized fraud detection for Nigerian market patterns
//
// 🔒 SECURITY LAYER FROZEN - DO NOT MODIFY WITHOUT AUTHORIZATION
// Fraud detection patterns and thresholds are finalized

export class NigerianFraudDetector {
  constructor() {
    this.deviceFingerprints = new Map(); // Track device usage
    this.phoneNumbers = new Map(); // Track phone number usage
    this.emailPatterns = new Map(); // Track email patterns
    this.kycDocuments = new Map(); // Track KYC document usage
    this.transactionPatterns = new Map(); // Track transaction patterns
  }

  // Detect multi-account usage patterns
  async detectMultiAccountUsage(entityId, entityType, metadata) {
    const multiAccountRisks = [];
    const { phone, email, device_id, ip_address } = metadata;

    // Phone number reuse detection
    if (phone) {
      const phoneRisk = await this.checkPhoneReuse(entityId, phone);
      if (phoneRisk.detected) multiAccountRisks.push(phoneRisk);
    }

    // Device fingerprint detection
    if (device_id) {
      const deviceRisk = await this.checkDeviceReuse(entityId, device_id);
      if (deviceRisk.detected) multiAccountRisks.push(deviceRisk);
    }

    // Email pattern detection
    if (email) {
      const emailRisk = await this.checkEmailPatterns(entityId, email);
      if (emailRisk.detected) multiAccountRisks.push(emailRisk);
    }

    // IP address clustering
    if (ip_address) {
      const ipRisk = await this.checkIPClustering(entityId, ip_address);
      if (ipRisk.detected) multiAccountRisks.push(ipRisk);
    }

    return {
      detected: multiAccountRisks.length > 0,
      risk_score: this.calculateMultiAccountRisk(multiAccountRisks),
      patterns: multiAccountRisks,
      recommendation: this.getMultiAccountRecommendation(multiAccountRisks)
    };
  }

  // Check phone number reuse (common in Nigerian fraud)
  async checkPhoneReuse(entityId, phone) {
    if (!this.phoneNumbers.has(phone)) {
      this.phoneNumbers.set(phone, []);
    }

    const phoneUsers = this.phoneNumbers.get(phone);
    const existingUser = phoneUsers.find(u => u.entity_id !== entityId);

    if (existingUser) {
      phoneUsers.push({ entity_id: entityId, timestamp: Date.now() });
      
      return {
        detected: true,
        type: 'PHONE_REUSE',
        risk_score: 35,
        details: {
          phone: phone.replace(/\d{4}$/, '****'), // Mask last 4 digits
          shared_with: existingUser.entity_id,
          accounts_count: phoneUsers.length,
          nigerian_context: 'Multiple accounts with same phone number'
        }
      };
    }

    phoneUsers.push({ entity_id: entityId, timestamp: Date.now() });
    return { detected: false, risk_score: 0 };
  }

  // Check device fingerprint reuse
  async checkDeviceReuse(entityId, deviceId) {
    if (!this.deviceFingerprints.has(deviceId)) {
      this.deviceFingerprints.set(deviceId, []);
    }

    const deviceUsers = this.deviceFingerprints.get(deviceId);
    const existingUsers = deviceUsers.filter(u => u.entity_id !== entityId);

    if (existingUsers.length > 0) {
      deviceUsers.push({ entity_id: entityId, timestamp: Date.now() });
      
      return {
        detected: true,
        type: 'DEVICE_REUSE',
        risk_score: Math.min(existingUsers.length * 15, 45),
        details: {
          device_id: deviceId.substring(0, 8) + '****',
          shared_accounts: existingUsers.length,
          total_accounts: deviceUsers.length,
          nigerian_context: 'Single device used for multiple accounts'
        }
      };
    }

    deviceUsers.push({ entity_id: entityId, timestamp: Date.now() });
    return { detected: false, risk_score: 0 };
  }

  // Detect unusual high-value/rapid transaction patterns
  async detectTransactionAnomalies(entityId, transactionData) {
    const { amount, currency, timestamp, transaction_type } = transactionData;
    const anomalies = [];

    // High-value transaction detection (Nigerian context)
    const highValueAnomaly = this.checkHighValueTransaction(amount, currency);
    if (highValueAnomaly.detected) anomalies.push(highValueAnomaly);

    // Rapid transaction pattern
    const rapidAnomaly = await this.checkRapidTransactions(entityId, timestamp, amount);
    if (rapidAnomaly.detected) anomalies.push(rapidAnomaly);

    // Unusual timing patterns (Nigerian business hours)
    const timingAnomaly = this.checkUnusualTiming(timestamp);
    if (timingAnomaly.detected) anomalies.push(timingAnomaly);

    // Round number patterns (common in fraud)
    const roundNumberAnomaly = this.checkRoundNumberPattern(amount);
    if (roundNumberAnomaly.detected) anomalies.push(roundNumberAnomaly);

    return {
      detected: anomalies.length > 0,
      risk_score: this.calculateTransactionRisk(anomalies),
      anomalies: anomalies,
      recommendation: this.getTransactionRecommendation(anomalies)
    };
  }

  // Check high-value transactions for Nigerian context
  checkHighValueTransaction(amount, currency) {
    const ngnThresholds = {
      very_high: 2000000, // 2M NGN
      high: 1000000,      // 1M NGN
      medium: 500000      // 500k NGN
    };

    if (currency === 'NGN' && amount >= ngnThresholds.very_high) {
      return {
        detected: true,
        type: 'VERY_HIGH_VALUE_NGN',
        risk_score: 40,
        details: {
          amount: amount,
          currency: currency,
          threshold: ngnThresholds.very_high,
          nigerian_context: 'Very high value NGN transaction requires verification'
        }
      };
    } else if (currency === 'NGN' && amount >= ngnThresholds.high) {
      return {
        detected: true,
        type: 'HIGH_VALUE_NGN',
        risk_score: 25,
        details: {
          amount: amount,
          currency: currency,
          threshold: ngnThresholds.high,
          nigerian_context: 'High value NGN transaction'
        }
      };
    }

    return { detected: false, risk_score: 0 };
  }

  // Check rapid transaction patterns
  async checkRapidTransactions(entityId, timestamp, amount) {
    if (!this.transactionPatterns.has(entityId)) {
      this.transactionPatterns.set(entityId, []);
    }

    const transactions = this.transactionPatterns.get(entityId);
    const recentWindow = 600000; // 10 minutes
    const recentTransactions = transactions.filter(tx => 
      timestamp - tx.timestamp < recentWindow
    );

    // Add current transaction
    transactions.push({ timestamp, amount });
    recentTransactions.push({ timestamp, amount });

    // Check for rapid pattern (10+ transactions in 10 minutes)
    if (recentTransactions.length >= 10) {
      const totalAmount = recentTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      return {
        detected: true,
        type: 'RAPID_TRANSACTION_PATTERN',
        risk_score: Math.min(recentTransactions.length * 3, 50),
        details: {
          transaction_count: recentTransactions.length,
          time_window: '10 minutes',
          total_amount: totalAmount,
          nigerian_context: 'Rapid transaction pattern common in fraud'
        }
      };
    }

    return { detected: false, risk_score: 0 };
  }

  // Detect KYC/document fraud patterns
  async detectKYCFraud(entityId, kycData) {
    const { document_type, document_number, document_image, verification_status } = kycData;
    const kycRisks = [];

    // Document reuse detection
    if (document_number) {
      const reuseRisk = await this.checkDocumentReuse(entityId, document_type, document_number);
      if (reuseRisk.detected) kycRisks.push(reuseRisk);
    }

    // Nigerian document validation
    const validationRisk = this.validateNigerianDocument(document_type, document_number);
    if (validationRisk.detected) kycRisks.push(validationRisk);

    // Rapid KYC submission pattern
    const rapidKYCRisk = await this.checkRapidKYCSubmissions(entityId);
    if (rapidKYCRisk.detected) kycRisks.push(rapidKYCRisk);

    return {
      detected: kycRisks.length > 0,
      risk_score: this.calculateKYCRisk(kycRisks),
      fraud_patterns: kycRisks,
      recommendation: this.getKYCRecommendation(kycRisks)
    };
  }

  // Check document reuse (critical for Nigerian market)
  async checkDocumentReuse(entityId, documentType, documentNumber) {
    const docKey = `${documentType}_${documentNumber}`;
    
    if (!this.kycDocuments.has(docKey)) {
      this.kycDocuments.set(docKey, []);
    }

    const docUsers = this.kycDocuments.get(docKey);
    const existingUser = docUsers.find(u => u.entity_id !== entityId);

    if (existingUser) {
      docUsers.push({ entity_id: entityId, timestamp: Date.now() });
      
      return {
        detected: true,
        type: 'DOCUMENT_REUSE',
        risk_score: 45,
        details: {
          document_type: documentType,
          document_number: documentNumber.replace(/\d{4}$/, '****'),
          shared_with: existingUser.entity_id,
          nigerian_context: 'Same document used for multiple accounts'
        }
      };
    }

    docUsers.push({ entity_id: entityId, timestamp: Date.now() });
    return { detected: false, risk_score: 0 };
  }

  // Validate Nigerian document formats
  validateNigerianDocument(documentType, documentNumber) {
    const patterns = {
      NIN: /^\d{11}$/, // National Identification Number
      BVN: /^\d{11}$/, // Bank Verification Number
      DRIVERS_LICENSE: /^[A-Z]{3}\d{9}[A-Z]{2}$/, // Nigerian driver's license
      VOTERS_CARD: /^[A-Z0-9]{19}$/, // Permanent Voter's Card
      PASSPORT: /^[A-Z]\d{8}$/ // Nigerian passport
    };

    const pattern = patterns[documentType];
    if (pattern && !pattern.test(documentNumber)) {
      return {
        detected: true,
        type: 'INVALID_DOCUMENT_FORMAT',
        risk_score: 30,
        details: {
          document_type: documentType,
          expected_format: pattern.toString(),
          nigerian_context: 'Invalid Nigerian document format'
        }
      };
    }

    return { detected: false, risk_score: 0 };
  }

  // Detect rapid order cancellations/refund abuse
  async detectRefundAbuse(entityId, refundData) {
    const { refund_amount, order_id, cancellation_reason, timestamp } = refundData;
    const refundRisks = [];

    // Rapid cancellation pattern
    const rapidCancellation = await this.checkRapidCancellations(entityId, timestamp);
    if (rapidCancellation.detected) refundRisks.push(rapidCancellation);

    // High-value refund pattern
    const highValueRefund = this.checkHighValueRefund(refund_amount);
    if (highValueRefund.detected) refundRisks.push(highValueRefund);

    // Suspicious cancellation reasons
    const suspiciousReason = this.checkSuspiciousCancellationReason(cancellation_reason);
    if (suspiciousReason.detected) refundRisks.push(suspiciousReason);

    return {
      detected: refundRisks.length > 0,
      risk_score: this.calculateRefundRisk(refundRisks),
      abuse_patterns: refundRisks,
      recommendation: this.getRefundRecommendation(refundRisks)
    };
  }

  // Calculate risk scores
  calculateMultiAccountRisk(risks) {
    return Math.min(risks.reduce((sum, risk) => sum + risk.risk_score, 0), 60);
  }

  calculateTransactionRisk(anomalies) {
    return Math.min(anomalies.reduce((sum, anomaly) => sum + anomaly.risk_score, 0), 70);
  }

  calculateKYCRisk(risks) {
    return Math.min(risks.reduce((sum, risk) => sum + risk.risk_score, 0), 80);
  }

  calculateRefundRisk(risks) {
    return Math.min(risks.reduce((sum, risk) => sum + risk.risk_score, 0), 50);
  }

  // Get recommendations
  getMultiAccountRecommendation(risks) {
    if (risks.some(r => r.type === 'PHONE_REUSE' || r.type === 'DEVICE_REUSE')) {
      return 'VERIFY_IDENTITY_AND_RESTRICT_ACCOUNT_CREATION';
    }
    return 'ENHANCED_MONITORING';
  }

  getTransactionRecommendation(anomalies) {
    if (anomalies.some(a => a.type === 'VERY_HIGH_VALUE_NGN')) {
      return 'MANUAL_VERIFICATION_REQUIRED';
    }
    return 'ENHANCED_TRANSACTION_MONITORING';
  }

  getKYCRecommendation(risks) {
    if (risks.some(r => r.type === 'DOCUMENT_REUSE')) {
      return 'REJECT_KYC_AND_FLAG_ACCOUNT';
    }
    return 'ADDITIONAL_VERIFICATION_REQUIRED';
  }

  getRefundRecommendation(risks) {
    return 'REVIEW_REFUND_PATTERN_AND_LIMIT_FUTURE_ORDERS';
  }

  // Placeholder methods for additional checks
  async checkEmailPatterns(entityId, email) {
    // Check for suspicious email patterns (disposable emails, etc.)
    return { detected: false, risk_score: 0 };
  }

  async checkIPClustering(entityId, ipAddress) {
    // Check for IP address clustering patterns
    return { detected: false, risk_score: 0 };
  }

  checkUnusualTiming(timestamp) {
    // Check for transactions outside normal Nigerian business hours
    return { detected: false, risk_score: 0 };
  }

  checkRoundNumberPattern(amount) {
    // Check for suspicious round number patterns
    return { detected: false, risk_score: 0 };
  }

  async checkRapidKYCSubmissions(entityId) {
    // Check for rapid KYC submission patterns
    return { detected: false, risk_score: 0 };
  }

  async checkRapidCancellations(entityId, timestamp) {
    // Check for rapid order cancellation patterns
    return { detected: false, risk_score: 0 };
  }

  checkHighValueRefund(amount) {
    // Check for high-value refund patterns
    return { detected: false, risk_score: 0 };
  }

  checkSuspiciousCancellationReason(reason) {
    // Check for suspicious cancellation reasons
    return { detected: false, risk_score: 0 };
  }
}