// HARD FREEZE: Escrow operations disabled — DELAYED_PAYOUT feature not approved
export default function handler(req, res) {
  res.status(403).json({
    error: 'Delayed Payout is disabled. No escrow operations allowed.',
    reason: 'Feature requires legal, operational, and payment provider approvals'
  });
}
