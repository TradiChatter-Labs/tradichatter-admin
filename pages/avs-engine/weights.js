import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, RefreshCw, Zap, BarChart3 } from 'lucide-react';

export default function AVSWeights() {
  const [weights, setWeights] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tuning, setTuning] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [weightsRes, accuracyRes] = await Promise.all([
        fetch('/api/avs-engine?action=weights'),
        fetch('/api/avs-engine?action=accuracy'),
      ]);
      const weightsJson = await weightsRes.json();
      const accuracyJson = await accuracyRes.json();
      if (weightsJson.success) setWeights(weightsJson);
      if (accuracyJson.success) setAccuracy(accuracyJson);
    } catch (err) {
      console.error('Fetch weights error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTune = async () => {
    if (!confirm('Run weight tuning? This will adjust agent weights based on real outcome data.')) return;
    setTuning(true);
    try {
      const res = await fetch('/api/avs-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tune-weights' }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Weights tuned successfully');
        fetchData();
      } else {
        alert('Tuning failed: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setTuning(false);
    }
  };

  const defaultWeights = [
    { agent: 'Identity Consistency', key: 'identity', defaultWeight: 35, description: 'Dojah result + name/doc matching' },
    { agent: 'Web Intelligence', key: 'web_intel', defaultWeight: 25, description: 'Domain age, SSL, WHOIS, web presence' },
    { agent: 'Product Authenticity', key: 'product', defaultWeight: 20, description: 'Image duplication, pricing anomalies' },
    { agent: 'Communication Behavior', key: 'communication', defaultWeight: 10, description: 'Scam keywords, pressure tactics' },
    { agent: 'Business Intelligence', key: 'business', defaultWeight: 10, description: 'Registration docs, address validation' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AVS — Weight Tuning</h1>
          <p className="mt-1 text-sm text-gray-600">View and adjust AI agent weights. Weights auto-tune based on real outcomes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchData} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </button>
          <button
            onClick={handleTune}
            disabled={tuning}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {tuning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
            Run Weight Tuning
          </button>
        </div>
      </div>

      {/* Accuracy Overview */}
      {accuracy && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Overall Accuracy</p>
            <p className="text-2xl font-bold text-green-600">{accuracy.overall_accuracy || 0}%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">True Positive Rate</p>
            <p className="text-2xl font-bold">{accuracy.true_positive_rate || 0}%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">False Positive Rate</p>
            <p className="text-2xl font-bold text-red-600">{accuracy.false_positive_rate || 0}%</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <p className="text-sm text-gray-500">Outcomes Recorded</p>
            <p className="text-2xl font-bold">{accuracy.total_outcomes || 0}</p>
          </div>
        </div>
      )}

      {/* Current Weights */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Current Agent Weights</h3>
        <div className="space-y-4">
          {defaultWeights.map((agent) => {
            const currentWeight = weights?.weights?.[agent.key] || agent.defaultWeight;
            return (
              <div key={agent.key} className="flex items-center gap-4">
                <div className="w-48">
                  <p className="text-sm font-medium text-gray-900">{agent.agent}</p>
                  <p className="text-xs text-gray-500">{agent.description}</p>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-red-500 h-4 rounded-full transition-all"
                      style={{ width: `${currentWeight}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right">
                  <span className="text-lg font-bold text-gray-900">{currentWeight}%</span>
                </div>
                <div className="w-20 text-right">
                  <span className="text-xs text-gray-400">default: {agent.defaultWeight}%</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          Weights must sum to 100%. They are automatically adjusted by the learning loop based on supplier outcome data.
        </p>
      </div>

      {/* Learning Loop Explanation */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">How Weight Tuning Works</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>1. Supplier gets verified → trades on SourceHub → outcome recorded (good/bad)</p>
          <p>2. Weight Tuner analyzes which agents predicted correctly vs incorrectly</p>
          <p>3. Agents that predicted well get higher weight, poor predictors get lower weight</p>
          <p>4. Future verifications use updated weights → more accurate scores over time</p>
        </div>
      </div>

      <div className="mt-6">
        <Link href="/avs-engine" className="text-red-600 hover:text-red-500 font-medium">← Back to Verification Queue</Link>
      </div>
    </div>
  );
}
