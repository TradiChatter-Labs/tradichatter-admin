// Stub - audit logging now handled by supabaseAdmin.logAdminAction
module.exports = {
  logFinancialAction: async (data) => { console.log('Audit:', data.action); },
  logSystemAction: async (...args) => { console.log('System audit:', args[1]); },
};
