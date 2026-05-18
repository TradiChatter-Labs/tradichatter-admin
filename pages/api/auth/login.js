import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

// Rate limiting storage (in production, use Redis or database)
const loginAttempts = new Map();
const lockedAccounts = new Map();

// Production security check
if (process.env.NODE_ENV === 'production' && ADMIN_JWT_SECRET === 'admin-secret-key-change-in-production') {
  throw new Error('CRITICAL: Default admin JWT secret detected in production. Set ADMIN_JWT_SECRET environment variable.');
}

// Supabase admin lookup
import { supabase } from '../../../lib/supabaseAdmin';

async function findAdmin(email) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email.toLowerCase())
    .eq('is_active', true)
    .single();
  if (error || !data) return null;
  return data;
}

// Rate limiting helper
function checkRateLimit(ip, email) {
  const key = `${ip}_${email}`;
  const now = Date.now();
  
  // Check if account is locked
  if (lockedAccounts.has(email)) {
    const lockTime = lockedAccounts.get(email);
    if (now - lockTime < LOCKOUT_TIME) {
      return { allowed: false, reason: 'Account temporarily locked due to too many failed attempts' };
    } else {
      // Unlock account
      lockedAccounts.delete(email);
      loginAttempts.delete(key);
    }
  }
  
  // Check rate limit
  const attempts = loginAttempts.get(key) || [];
  const recentAttempts = attempts.filter(time => now - time < LOCKOUT_TIME);
  
  if (recentAttempts.length >= MAX_LOGIN_ATTEMPTS) {
    lockedAccounts.set(email, now);
    return { allowed: false, reason: 'Too many login attempts. Account locked for 15 minutes.' };
  }
  
  return { allowed: true };
}

// Log failed attempt
function logFailedAttempt(ip, email) {
  const key = `${ip}_${email}`;
  const attempts = loginAttempts.get(key) || [];
  attempts.push(Date.now());
  loginAttempts.set(key, attempts);
  
  // Security logging
  console.warn(`[ADMIN_SECURITY] Failed login attempt for ${email} from ${ip} at ${new Date().toISOString()}`);
}

// Clear successful login attempts
function clearAttempts(ip, email) {
  const key = `${ip}_${email}`;
  loginAttempts.delete(key);
  lockedAccounts.delete(email);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check rate limiting
    const rateLimitCheck = checkRateLimit(clientIP, email);
    if (!rateLimitCheck.allowed) {
      console.warn(`[ADMIN_SECURITY] Rate limit exceeded for ${email} from ${clientIP}`);
      return res.status(429).json({ error: rateLimitCheck.reason });
    }

    // Find admin in Supabase
    const admin = await findAdmin(email);
    if (!admin) {
      logFailedAttempt(clientIP, email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password_hash);
    if (!isValidPassword) {
      logFailedAttempt(clientIP, email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Clear failed attempts on successful login
    clearAttempts(clientIP, email);

    // Update last_login
    await supabase.from('admin_users').update({ last_login: new Date().toISOString() }).eq('id', admin.id);

    console.log(`[ADMIN_SECURITY] Successful login for ${email} from ${clientIP} at ${new Date().toISOString()}`);

    // Create JWT token
    const token = jwt.sign(
      { 
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
        loginTime: Date.now(),
        ip: clientIP
      },
      ADMIN_JWT_SECRET,
      { expiresIn: '8h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', 
      `admin_token=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Strict; Max-Age=28800; Path=/`
    );

    res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}