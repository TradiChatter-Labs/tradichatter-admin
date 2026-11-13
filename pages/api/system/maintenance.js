import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('value')
        .eq('key', 'maintenance_mode')
        .single();

      if (error && error.code !== 'PGRST116') {
        return res.status(500).json({ success: false, error: error.message });
      }

      const config = data?.value || {};
      return res.json({
        success: true,
        enabled: config.enabled === true,
        title: config.title || 'System Maintenance',
        message: config.message || 'We are currently performing scheduled maintenance. Please check back soon.',
        updated_at: config.updated_at || null,
        updated_by: config.updated_by || null,
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    const { enabled, title, message, admin_id } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, error: 'enabled (boolean) is required' });
    }

    try {
      const value = {
        enabled,
        title: title || 'System Maintenance',
        message: message || 'We are currently performing scheduled maintenance.',
        updated_at: new Date().toISOString(),
        updated_by: admin_id || 'admin',
      };

      const { error } = await supabase
        .from('system_config')
        .upsert({ key: 'maintenance_mode', value }, { onConflict: 'key' });

      if (error) return res.status(500).json({ success: false, error: error.message });
      return res.json({ success: true, enabled });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
