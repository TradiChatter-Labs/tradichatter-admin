import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bot, RefreshCw, ToggleLeft, ToggleRight, AlertTriangle, Activity, MessageSquare, Zap, Shield, Loader2 } from 'lucide-react';

const AGENT_TYPES = [
  { key: 'sales', name: 'Sales Agent', description: 'Pre-sale buyer conversations', color: 'blue' },
  { key: 'support', name: 'Support Agent', description: 'Post-sale customer support', color: 'green' },
  { key: 'marketing', name: 'Marketing Agent', description: 'Product descriptions, ads, promos', color: 'purple' },
  { key: 'followup', name: 'Follow-Up Agent', description: 'Recover abandoned conversations', color: 'orange' },
  { key: 'recommendation', name: 'Recommendation Agent', description: 'Cross-sell/upsell suggestions', color: 'teal' },
  { key: 'lead', name: 'Lead Agent', description: 'Score buyer purchase intent', color: 'red' },
];

export default function AIAgentDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [agentStatus, setAgentStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [killSwitchActive, setKillSwitchActive] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, statusRes] = await Promise.all([
        fetch('/api/ai-agents?action=metrics'),
        fetch('/api/ai-agents?action=status'),
      ]);
      const metricsJson = await metricsRes.json();
      const statusJson = await statusRes.json();

      if (metricsJson.success) setMetrics(metricsJson);
      if (statusJson.success) {
        setAgentStatus(statusJson.agents || {});
        setKillSwitchActive(statusJson.kill_switch_active || false);
      }
    } catch (err) {
      console.error('Fetch AI data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = async (agentType, currentEnabled) => {
    setToggling(agentType);
    try {
      const res = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', agent_type: agentType, enabled: !currentEnabled }),
      });
      const json = await res.json();
      if (json.success) {
        setAgentStatus(prev => ({ ...prev, [agentType]: { ...prev[agentType], enabled: !currentEnabled } }));
      } else {
        alert('Toggle failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setToggling(null);
    }
  };

  const handleKillSwitch = async (enable) => {
    const action = enable ? 'enable-all' : 'kill-all';
    const msg = enable ? 'Enable all AI agents?' : '⚠️ KILL SWITCH: Disable ALL AI agents immediately?';
    if (!confirm(msg)) return;

    const reason = enable ? 'Admin re-enabled' : prompt('Reason for kill switch:');
    if (!enable && !reason) return;

    try {
      const res = await fetch('/api/ai-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      const json = await res.json();
      if (json.success) {
        setKillSwitchActive(!enable);
        fetchData();
      } else {
        alert('Failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Agent Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Monitor and control the 6-agent AI workforce for Premium sellers.</p>
        </div>
        <button onClick={fetchData} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Kill Switch */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${killSwitchActive ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className={`h-6 w-6 mr-3 ${killSwitchActive ? 'text-red-600' : 'text-green-600'}`} />
            <div>
              <h3 className="font-medium text-gray-900">
                Kill Switch: {killSwitchActive ? 'ACTIVE — All agents disabled' : 'Inactive — Agents running normally'}
              </h3>
              <p className="text-sm text-gray-500">Emergency control to disable all AI agents instantly</p>
            </div>
          </div>
          {killSwitchActive ? (
            <button onClick={() => handleKillSwitch(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Re-enable All
            </button>
          ) : (
            <button onClick={() => handleKillSwitch(false)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              🛑 Kill All Agents
            </button>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <MessageSquare className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Conversations</p>
                <p className="text-2xl font-bold">{metrics.total_conversations || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Active Today</p>
                <p className="text-2xl font-bold text-green-600">{metrics.active_today || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Avg Response Time</p>
                <p className="text-2xl font-bold">{metrics.avg_response_ms || 0}ms</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <div className="flex items-center">
              <Bot className="h-5 w-5 text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Businesses Using AI</p>
                <p className="text-2xl font-bold">{metrics.businesses_active || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Per-Agent Controls */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Agent Controls</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {AGENT_TYPES.map((agent) => {
            const status = agentStatus[agent.key] || {};
            const isEnabled = status.enabled !== false && !killSwitchActive;
            return (
              <div key={agent.key} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Bot className={`h-5 w-5 text-${agent.color}-500`} />
                    <h4 className="font-medium text-gray-900">{agent.name}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${isEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 ml-8">{agent.description}</p>
                  {status.requests_today !== undefined && (
                    <p className="text-xs text-gray-400 mt-1 ml-8">
                      Today: {status.requests_today} requests | Avg: {status.avg_latency_ms || 0}ms
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleAgent(agent.key, isEnabled)}
                  disabled={toggling === agent.key || killSwitchActive}
                  className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
                    isEnabled ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {toggling === agent.key ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : isEnabled ? (
                    <ToggleRight className="h-6 w-6" />
                  ) : (
                    <ToggleLeft className="h-6 w-6" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6 flex gap-4">
        <Link href="/ai-agents/conversations" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
          View Conversation Logs →
        </Link>
        <Link href="/ai-agents/kill-switch" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium">
          Kill Switch History →
        </Link>
      </div>
    </div>
  );
}
