// Stub - SQL queries now go through Supabase
const db = { query: async (sql, params) => [[]] };
module.exports = { db };
