-- ADMIN-SPECIFIC TABLES (Won't affect mobile app)

-- Enhanced Escrow Management
CREATE TABLE IF NOT EXISTS escrow_actions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    escrow_id VARCHAR(255) NOT NULL,
    admin_id VARCHAR(255) NOT NULL,
    action_type ENUM('RELEASE', 'REFUND', 'PARTIAL_RELEASE', 'FORCE_RELEASE', 'DISPUTE_RESOLVED') NOT NULL,
    amount DECIMAL(10,2),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS escrow_audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    escrow_id VARCHAR(255) NOT NULL,
    admin_id VARCHAR(255) NOT NULL,
    action TEXT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payouts Management
CREATE TABLE IF NOT EXISTS payouts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id VARCHAR(255) NOT NULL,
    subaccount_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    flutterwave_reference VARCHAR(255),
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL
);

-- Webhook Logs
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    webhook_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    signature_verified BOOLEAN DEFAULT FALSE,
    processing_status ENUM('SUCCESS', 'FAILED', 'PENDING') DEFAULT 'PENDING',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhook_retry_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    webhook_log_id INT NOT NULL,
    retry_count INT DEFAULT 0,
    next_retry_at TIMESTAMP,
    FOREIGN KEY (webhook_log_id) REFERENCES webhook_logs(id)
);

-- Enhanced KYC Management
CREATE TABLE IF NOT EXISTS kyc_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(255) NOT NULL,
    provider ENUM('MONO', 'ONEID', 'PASSBASE') NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED') DEFAULT 'PENDING',
    provider_reference VARCHAR(255),
    admin_id VARCHAR(255),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS kyc_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kyc_request_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (kyc_request_id) REFERENCES kyc_requests(id)
);

CREATE TABLE IF NOT EXISTS kyc_audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kyc_request_id INT NOT NULL,
    admin_id VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kyc_request_id) REFERENCES kyc_requests(id)
);

-- Seller Subaccounts
CREATE TABLE IF NOT EXISTS subaccounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id VARCHAR(255) NOT NULL UNIQUE,
    flutterwave_subaccount_id VARCHAR(255) NOT NULL,
    account_bank VARCHAR(100),
    account_number VARCHAR(50),
    business_name VARCHAR(255),
    status ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subaccount_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subaccount_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    admin_id VARCHAR(255),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subaccount_id) REFERENCES subaccounts(id)
);

-- Admin RBAC System
CREATE TABLE IF NOT EXISTS admin_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES admin_roles(id),
    FOREIGN KEY (permission_id) REFERENCES admin_permissions(id)
);

CREATE TABLE IF NOT EXISTS admin_user_roles (
    admin_id VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    assigned_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (admin_id, role_id),
    FOREIGN KEY (role_id) REFERENCES admin_roles(id)
);

-- Comprehensive Audit Logging
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id VARCHAR(255) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Templates & Broadcasts
CREATE TABLE IF NOT EXISTS notification_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT NOT NULL,
    variables JSON,
    type ENUM('EMAIL', 'SMS', 'PUSH', 'IN_APP') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS broadcasts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    template_id INT NOT NULL,
    segment_criteria JSON,
    status ENUM('DRAFT', 'SCHEDULED', 'SENDING', 'COMPLETED', 'FAILED') DEFAULT 'DRAFT',
    scheduled_at TIMESTAMP NULL,
    sent_count INT DEFAULT 0,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES notification_templates(id)
);

-- Insert default admin roles and permissions
INSERT INTO admin_roles (name, description) VALUES 
('SUPER_ADMIN', 'Full system access'),
('FINANCE_ADMIN', 'Escrow, payouts, financial reconciliation'),
('SUPPORT_ADMIN', 'KYC, disputes, chat moderation'),
('CONTENT_ADMIN', 'Product moderation, content management');

INSERT INTO admin_permissions (name, resource, action) VALUES 
('escrow.manage', 'escrow', 'manage'),
('payouts.manage', 'payouts', 'manage'),
('kyc.manage', 'kyc', 'manage'),
('users.manage', 'users', 'manage'),
('reports.view', 'reports', 'view'),
('system.manage', 'system', 'manage');