// Unified connector to all TradiChatter microservices
// Each service is called via its internal API key

const SERVICES = {
  backend: {
    name: 'Rust Backend',
    url: process.env.RUST_BACKEND_URL || 'http://localhost:8080',
    healthPath: '/health',
    apiKey: process.env.RUST_SERVICE_TOKEN || '',
  },
  aiAgents: {
    name: 'AI Agent Service',
    url: process.env.AI_AGENT_SERVICE_URL || 'http://localhost:8100',
    healthPath: '/health',
    apiKey: process.env.AI_AGENT_API_KEY || '',
  },
  voiceTranslation: {
    name: 'Voice & Video Translation',
    url: process.env.VOICE_TRANSLATION_URL || 'http://localhost:8200',
    healthPath: '/health',
    apiKey: process.env.VOICE_TRANSLATION_API_KEY || '',
  },
  sourceHub: {
    name: 'SourceHub',
    url: process.env.SOURCEHUB_URL || 'http://localhost:8300',
    healthPath: '/health',
    apiKey: process.env.SOURCEHUB_API_KEY || '',
  },
  avs: {
    name: 'AVS Engine',
    url: process.env.AVS_ENGINE_URL || 'http://localhost:8400',
    healthPath: '/health',
    apiKey: process.env.AVS_API_KEY || '',
  },
  communication: {
    name: 'Communication Service',
    url: process.env.COMMS_SERVICE_URL || 'http://localhost:8500',
    healthPath: '/health',
    apiKey: process.env.COMMS_API_KEY || '',
  },
};

async function callService(serviceKey, path, { method = 'GET', body, timeout = 5000 } = {}) {
  const service = SERVICES[serviceKey];
  if (!service) throw new Error(`Unknown service: ${serviceKey}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': service.apiKey,
        'X-Admin-Source': 'tradichatter-admin',
      },
      signal: controller.signal,
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${service.url}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, status: 0, data: null, error: 'timeout' };
    }
    return { ok: false, status: 0, data: null, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Health Checks ───────────────────────────────────────────────────────────
export async function checkAllServicesHealth() {
  const results = {};
  const checks = Object.entries(SERVICES).map(async ([key, svc]) => {
    const start = Date.now();
    const res = await callService(key, svc.healthPath);
    const latency = Date.now() - start;
    results[key] = {
      name: svc.name,
      status: res.ok ? 'healthy' : res.error === 'timeout' ? 'timeout' : 'unhealthy',
      latency,
      details: res.data,
      error: res.error || null,
    };
  });
  await Promise.all(checks);
  return results;
}

export async function checkServiceHealth(serviceKey) {
  const svc = SERVICES[serviceKey];
  if (!svc) return { status: 'unknown', error: 'Service not configured' };
  const start = Date.now();
  const res = await callService(serviceKey, svc.healthPath);
  return {
    name: svc.name,
    status: res.ok ? 'healthy' : 'unhealthy',
    latency: Date.now() - start,
    details: res.data,
    error: res.error || null,
  };
}

// ─── AI Agent Service ────────────────────────────────────────────────────────
export async function getAIAgentMetrics() {
  return callService('aiAgents', '/api/admin/metrics');
}

export async function toggleAIAgent(agentType, enabled, businessId = null) {
  return callService('aiAgents', '/api/admin/toggle-agent', {
    method: 'POST',
    body: { agent_type: agentType, enabled, business_id: businessId },
  });
}

export async function getAIConversationLogs({ businessId, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  if (businessId) params.set('business_id', businessId);
  return callService('aiAgents', `/api/admin/conversations?${params}`);
}

// ─── Voice Translation Service ───────────────────────────────────────────────
export async function getVoiceTranslationStats() {
  return callService('voiceTranslation', '/api/admin/stats');
}

export async function getVoiceLanguages() {
  return callService('voiceTranslation', '/translate/languages');
}

// ─── SourceHub ───────────────────────────────────────────────────────────────
export async function getSourceHubSuppliers({ page = 1, limit = 50 } = {}) {
  return callService('sourceHub', `/api/admin/suppliers?page=${page}&limit=${limit}`);
}

export async function getSourceHubOrders({ page = 1, limit = 50, status } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);
  return callService('sourceHub', `/api/admin/orders?${params}`);
}

export async function getSourceHubEscrows({ status } = {}) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  return callService('sourceHub', `/api/admin/escrows?${params}`);
}

export async function getSourceHubTreasury() {
  return callService('sourceHub', '/api/admin/treasury');
}

export async function resolveSourceHubDispute(disputeId, resolution) {
  return callService('sourceHub', `/api/admin/disputes/${disputeId}/resolve`, {
    method: 'POST',
    body: resolution,
  });
}

// ─── AVS Engine ──────────────────────────────────────────────────────────────
export async function getAVSPendingReviews() {
  return callService('avs', '/api/admin/pending-reviews');
}

export async function getAVSSupplierScore(supplierId) {
  return callService('avs', `/api/verify/supplier/${supplierId}/score`);
}

export async function getAVSSupplierAudit(supplierId) {
  return callService('avs', `/api/verify/supplier/${supplierId}/audit`);
}

export async function overrideAVSDecision(supplierId, decision, reason) {
  return callService('avs', '/api/admin/override', {
    method: 'POST',
    body: { supplier_id: supplierId, decision, reason },
  });
}

export async function getAVSWeights() {
  return callService('avs', '/api/learning/weights/current');
}

export async function tuneAVSWeights() {
  return callService('avs', '/api/learning/weights/tune', { method: 'POST' });
}

export async function getAVSAccuracy() {
  return callService('avs', '/api/learning/accuracy');
}

// ─── Backend (Rust) ──────────────────────────────────────────────────────────
export async function getBackendFeatureFlags() {
  return callService('backend', '/api/admin/feature-flags');
}

export async function updateBackendFeatureFlag(flagId, enabled) {
  return callService('backend', `/api/admin/feature-flags/${flagId}`, {
    method: 'PATCH',
    body: { enabled },
  });
}

// ─── Communication Service ───────────────────────────────────────────────────
export async function getEmailStats() {
  return callService('communication', '/api/admin/stats');
}

export async function getEmailLogs({ brand, status, limit = 50, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  if (brand) params.set('brand', brand);
  if (status) params.set('status', status);
  return callService('communication', `/api/admin/logs?${params}`);
}

export async function sendEmail({ brand, to, subject, template, html, variables, priority = 'individual' }) {
  return callService('communication', '/api/email/send', {
    method: 'POST',
    body: { brand, to, subject, template, html, variables, priority, triggered_by: 'admin' },
  });
}

// Templates
export async function getEmailTemplates(brand) {
  const params = brand ? `?brand=${brand}` : '';
  return callService('communication', `/api/templates${params}`);
}

export async function getEmailTemplate(id) {
  return callService('communication', `/api/templates/${id}`);
}

export async function createEmailTemplate(data) {
  return callService('communication', '/api/templates', { method: 'POST', body: data });
}

export async function updateEmailTemplate(id, data) {
  return callService('communication', `/api/templates/${id}`, { method: 'PUT', body: data });
}

export async function deleteEmailTemplate(id) {
  return callService('communication', `/api/templates/${id}`, { method: 'DELETE' });
}

export async function previewEmailTemplate(data) {
  return callService('communication', '/api/templates/preview', { method: 'POST', body: data });
}

// Campaigns
export async function sendCampaign(data) {
  return callService('communication', '/api/campaigns/send', { method: 'POST', body: data, timeout: 30000 });
}

export async function getCampaigns({ brand, limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit, offset });
  if (brand) params.set('brand', brand);
  return callService('communication', `/api/campaigns?${params}`);
}

export async function getCampaign(id) {
  return callService('communication', `/api/campaigns/${id}`);
}

export async function cancelCampaign(id) {
  return callService('communication', `/api/campaigns/${id}/cancel`, { method: 'POST' });
}

// Segments
export async function resolveSegment(filters) {
  return callService('communication', '/api/segments/resolve', { method: 'POST', body: { filters } });
}

export async function getSegments() {
  return callService('communication', '/api/segments');
}

export async function createSegment(data) {
  return callService('communication', '/api/segments', { method: 'POST', body: data });
}

export async function deleteSegment(id) {
  return callService('communication', `/api/segments/${id}`, { method: 'DELETE' });
}

export { SERVICES, callService };
