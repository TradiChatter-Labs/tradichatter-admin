-- ADMIN AUTHENTICATION TABLES (Completely separate from mobile app)

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'CONTENT_ADMIN') DEFAULT 'SUPPORT_ADMIN',
    status ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'PENDING',
    two_fa_secret VARCHAR(255),
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Sessions Table
CREATE TABLE IF NOT EXISTS admin_sessions (
    id VARCHAR(255) PRIMARY KEY,
    admin_id VARCHAR(255) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Failed Login Attempts Table
CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    failure_reason VARCHAR(255),
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Invitations Table
CREATE TABLE IF NOT EXISTS admin_invitations (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('SUPER_ADMIN', 'FINANCE_ADMIN', 'SUPPORT_ADMIN', 'CONTENT_ADMIN') DEFAULT 'SUPPORT_ADMIN',
    invited_by VARCHAR(255) NOT NULL,
    invitation_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invited_by) REFERENCES admin_users(id)
);

-- Create default super admin (Change password immediately after first login)
INSERT INTO admin_users (id, email, password_hash, full_name, role, status, two_fa_enabled) 
VALUES (
    'admin_001', 
    'admin@tradichatter.com', 
    '$2b$12$LQv3c1yqBw2uuCD5Mi48Oe.1p.KZn/.jDllSXNVHlqhKthjdHIDAi', -- password: Admin123!@#
    'System Administrator',
    'SUPER_ADMIN',
    'ACTIVE',
    FALSE
) ON DUPLICATE KEY UPDATE id=id;

-- Create indexes for performance
CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_login_attempts_email ON admin_login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON admin_login_attempts(ip_address);