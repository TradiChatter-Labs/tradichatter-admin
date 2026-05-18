import { supabase, getDashboardStats } from '../lib/supabaseAdmin.js';

// Primary database: Supabase (same as mobile app)
// Legacy: Appwrite (read-only, for migration period)

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
    if (error) throw error;
    console.log('✅ Admin portal connected to Supabase');
    return true;
  } catch (error) {
    console.warn('⚠️ Supabase connection failed:', error.message);
    return false;
  }
};

const initDatabase = async () => {
  const isConnected = await testConnection();
  console.log(`📊 Admin database: Supabase ${isConnected ? 'connected' : 'unavailable'}`);
  return isConnected;
};

export { supabase, testConnection, initDatabase, getDashboardStats };
