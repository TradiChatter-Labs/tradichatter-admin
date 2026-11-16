import { supabase } from '../../../lib/supabaseAdmin';

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const { base64, filename, mimetype } = req.body;
  if (!base64 || !filename) return res.status(400).json({ success: false, error: 'base64 and filename required' });

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(mimetype)) {
    return res.status(400).json({ success: false, error: 'Only jpg, png, webp allowed' });
  }

  const buffer = Buffer.from(base64, 'base64');
  const ext = filename.split('.').pop().toLowerCase();
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(uniqueName, buffer, { contentType: mimetype, upsert: false });

  if (error) return res.status(500).json({ success: false, error: error.message });

  const { data: { publicUrl } } = supabase.storage
    .from('blog-images')
    .getPublicUrl(uniqueName);

  return res.status(200).json({ success: true, url: publicUrl });
}
