import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://pdqhtkshsviayusxeytt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key-for-build';

// Service role client — bypasses RLS for admin operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// ─── Users ───────────────────────────────────────────────────────────────────
export async function getUsers({ page = 1, limit = 50, search = '' } = {}) {
  let query = supabase.from('profiles').select('*', { count: 'exact' });
  if (search) query = query.or(`display_name.ilike.%${search}%,phone.ilike.%${search}%`);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  return { data: data || [], total: count || 0, error };
}

export async function getUserById(id) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  return { data, error };
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
  return { data, error };
}

export async function suspendUser(id, reason) {
  return updateUser(id, { suspended: true, suspension_reason: reason, suspended_at: new Date().toISOString() });
}

// ─── Businesses ──────────────────────────────────────────────────────────────
export async function getBusinesses({ page = 1, limit = 50, search = '', status } = {}) {
  let query = supabase.from('businesses').select('*', { count: 'exact' });
  if (search) query = query.ilike('name', `%${search}%`);
  if (status) query = query.eq('status', status);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  return { data: data || [], total: count || 0, error };
}

export async function updateBusiness(id, updates) {
  const { data, error } = await supabase.from('businesses').update(updates).eq('id', id).select().single();
  return { data, error };
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export async function getOrders({ page = 1, limit = 50, status } = {}) {
  let query = supabase.from('orders').select('*, businesses(name)', { count: 'exact' });
  if (status) query = query.eq('status', status);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  return { data: data || [], total: count || 0, error };
}

// ─── Escrow ──────────────────────────────────────────────────────────────────
export async function getEscrows({ page = 1, limit = 50, status } = {}) {
  let query = supabase.from('escrow_transactions').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  return { data: data || [], total: count || 0, error };
}

export async function updateEscrow(id, updates) {
  const { data, error } = await supabase.from('escrow_transactions').update(updates).eq('id', id).select().single();
  return { data, error };
}

// ─── Subscriptions ───────────────────────────────────────────────────────────
export async function getSubscriptions({ page = 1, limit = 50, status } = {}) {
  let query = supabase.from('subscriptions').select('*, businesses(name, owner_id)', { count: 'exact' });
  if (status) query = query.eq('status', status);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  return { data: data || [], total: count || 0, error };
}

export async function updateSubscription(id, updates) {
  const { data, error } = await supabase.from('subscriptions').update(updates).eq('id', id).select().single();
  return { data, error };
}

// ─── Feature Flags ───────────────────────────────────────────────────────────
export async function getFeatureFlags() {
  const { data, error } = await supabase.from('feature_flags').select('*').order('category');
  return { data: data || [], error };
}

export async function updateFeatureFlag(id, enabled, updatedBy) {
  const { data, error } = await supabase
    .from('feature_flags')
    .update({ enabled, updated_by: updatedBy, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function getFeatureFlagByKey(flagKey) {
  const { data, error } = await supabase.from('feature_flags').select('*').eq('flag_key', flagKey).single();
  return { data, error };
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const [users, businesses, orders, escrows, subscriptions] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id, status', { count: 'exact' }),
    supabase.from('orders').select('id, status, total_amount', { count: 'exact' }),
    supabase.from('escrow_transactions').select('id, status, amount', { count: 'exact' }),
    supabase.from('subscriptions').select('id, status, plan', { count: 'exact' }),
  ]);

  const activeBusinesses = (businesses.data || []).filter(b => b.status === 'active').length;
  const totalRevenue = (orders.data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeEscrow = (escrows.data || []).filter(e => e.status === 'active').length;
  const premiumSubs = (subscriptions.data || []).filter(s => s.status === 'active' && s.plan === 'premium').length;

  return {
    totalUsers: users.count || 0,
    totalBusinesses: businesses.count || 0,
    activeBusinesses,
    totalOrders: orders.count || 0,
    totalRevenue,
    activeEscrow,
    premiumSubscriptions: premiumSubs,
    totalSubscriptions: subscriptions.count || 0,
  };
}

// ─── Audit Log ───────────────────────────────────────────────────────────────
export async function logAdminAction({ adminId, action, entityType, entityId, details, ip }) {
  const { error } = await supabase.from('admin_audit_logs').insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
    ip_address: ip,
    created_at: new Date().toISOString(),
  });
  return { error };
}

export default supabase;
