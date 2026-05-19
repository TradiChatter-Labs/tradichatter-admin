import bcrypt from 'bcryptjs';
import { supabase, logAdminAction } from '../../../lib/supabaseAdmin';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, name, role, is_active, mfa_enabled, last_login, created_at')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, users: data });
  }

  if (req.method === 'POST') {
    const { email, name, password, role = 'viewer' } = req.body;
    if (!email || !name || !password) return res.status(400).json({ error: 'email, name, and password required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const validRoles = ['super_admin', 'admin', 'moderator', 'viewer'];
    if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('admin_users')
      .insert({ email: email.toLowerCase(), name, password_hash, role, is_active: true })
      .select('id, email, name, role, is_active, created_at')
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'Email already exists' });
      return res.status(500).json({ error: error.message });
    }

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: 'ADMIN_USER_CREATED',
      entityType: 'admin_user',
      entityId: data.id,
      details: { email, name, role },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.status(201).json({ success: true, user: data });
  }

  if (req.method === 'PATCH') {
    const { id, action, role, name } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    let updates = {};
    if (action === 'suspend') updates = { is_active: false };
    else if (action === 'reactivate') updates = { is_active: true };
    else if (action === 'change_role' && role) updates = { role };
    else if (action === 'update_name' && name) updates = { name };
    else return res.status(400).json({ error: 'Invalid action' });

    const { data, error } = await supabase
      .from('admin_users')
      .update(updates)
      .eq('id', id)
      .select('id, email, name, role, is_active')
      .single();

    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: `ADMIN_USER_${action.toUpperCase()}`,
      entityType: 'admin_user',
      entityId: id,
      details: { action, ...updates },
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true, user: data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    const { error } = await supabase.from('admin_users').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    const adminId = req.headers['x-admin-id'] || 'unknown';
    await logAdminAction({
      adminId,
      action: 'ADMIN_USER_DELETED',
      entityType: 'admin_user',
      entityId: id,
      details: {},
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
    });

    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
