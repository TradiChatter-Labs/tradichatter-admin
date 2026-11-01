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
// Source of truth is the businesses table — not a separate subscriptions table.
export async function getSubscriptions({ page = 1, limit = 50, status } = {}) {
  let query = supabase
    .from('businesses')
    .select(
      'id, business_name, owner_id, subscription_plan, subscription_status, subscription_expires_at, trial_started_at, trial_expires_at, admin_granted_by, admin_granted_at, admin_grant_reason, created_at',
      { count: 'exact' }
    );
  if (status && status !== 'all') query = query.eq('subscription_status', status);
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  // Normalise shape so the UI works with consistent field names
  const normalised = (data || []).map(b => ({
    id: b.id,
    business_id: b.id,
    plan: b.subscription_plan || 'free',
    status: b.subscription_status || 'active',
    start_date: b.trial_started_at || b.created_at,
    end_date: b.subscription_expires_at || b.trial_expires_at || null,
    admin_granted_by: b.admin_granted_by || null,
    admin_granted_at: b.admin_granted_at || null,
    admin_grant_reason: b.admin_grant_reason || null,
    businesses: { name: b.business_name, owner_id: b.owner_id },
  }));

  return { data: normalised, total: count || 0, error };
}

// Update subscription status directly on the businesses table
export async function updateSubscription(id, updates) {
  // Map old subscriptions-table field names to businesses table field names
  const mapped = {};
  if (updates.status) mapped.subscription_status = updates.status;
  if (updates.admin_notes) mapped.admin_grant_reason = updates.admin_notes;
  if (updates.updated_at) mapped.updated_at = updates.updated_at;

  const { data, error } = await supabase
    .from('businesses')
    .update(mapped)
    .eq('id', id)
    .select('id, business_name, subscription_plan, subscription_status, subscription_expires_at')
    .single();
  return { data, error };
}

// Grant a subscription directly to a business (admin override — bypasses payment)
// Writes to businesses table which is the source of truth for the mobile app.
export async function grantSubscription(businessId, plan, durationDays, adminId, reason) {
  if (!['business', 'premium'].includes(plan)) return { data: null, error: { message: 'Invalid plan' } };
  if (!businessId || !adminId) return { data: null, error: { message: 'businessId and adminId required' } };

  const now = new Date();
  const expiresAt = new Date(now.getTime() + Number(durationDays) * 24 * 60 * 60 * 1000);

  const { data, error } = await supabase
    .from('businesses')
    .update({
      subscription_plan: plan,
      subscription_status: 'active',
      subscription_expires_at: expiresAt.toISOString(),
      admin_granted_by: adminId,
      admin_granted_at: now.toISOString(),
      admin_grant_reason: reason || null,
      updated_at: now.toISOString(),
    })
    .eq('id', businessId)
    .select('id, business_name, subscription_plan, subscription_status, subscription_expires_at, admin_granted_by, admin_granted_at')
    .single();

  return { data, error, expiresAt: expiresAt.toISOString() };
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
  const [users, businesses, orders, escrows] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id, status, subscription_plan, subscription_status', { count: 'exact' }),
    supabase.from('orders').select('id, status, total_amount', { count: 'exact' }),
    supabase.from('escrow_transactions').select('id, status, amount', { count: 'exact' }),
  ]);

  const activeBusinesses = (businesses.data || []).filter(b => b.status === 'active').length;
  const totalRevenue = (orders.data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const activeEscrow = (escrows.data || []).filter(e => e.status === 'active').length;
  const premiumSubs = (businesses.data || []).filter(b => b.subscription_status === 'active' && b.subscription_plan === 'premium').length;
  const totalSubs = (businesses.data || []).filter(b => b.subscription_plan !== 'free').length;

  return {
    totalUsers: users.count || 0,
    totalBusinesses: businesses.count || 0,
    activeBusinesses,
    totalOrders: orders.count || 0,
    totalRevenue,
    activeEscrow,
    premiumSubscriptions: premiumSubs,
    totalSubscriptions: totalSubs,
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
