export default function handler(req, res) {
  res.json({
    success: true,
    status: 'v2_planned',
    message: 'Group Buying is a V2 feature. No backend tables exist yet.',
  });
}
