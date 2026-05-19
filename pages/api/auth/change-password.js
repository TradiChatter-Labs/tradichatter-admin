import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, logAdminAction } from '../../../lib/supabaseAdmin';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin-secret-key-change-in-production';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Get admin from token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    let decoded;
    try { decoded = jwt.verify(token, ADMIN_JWT_SECRET); }
    catch { return res.status(401).json({ error: 'Invalid token' }); }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Current and new password required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters' });

    // Fetch admin with password hash
    const { data: admin, error: fetchErr } = await supabase
      .from('admin_users')
      .select('id, password_hash')
      .eq('id', decoded.adminId)
      .single();

    if (fetchErr || !admin) return res.status(404).json({ error: 'Admin not found' });

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    // Hash and update
    const newHash = await bcrypt.hash(newPassword, 10);
    const { error: updateErr } = await supabase
      .from('admin_users')
      .update({ password_hash: newHash })
      .eq('id', admin.id);

    if (updateErr) return res.status(500).json({ error: 'Failed to update password' });

    await logAdminAction({
      adminId: admin.id,
      action: 'PASSWORD_CHANGED',
      entityType: 'admin_user',
      entityId: admin.id,
      details: { self_service: true },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
