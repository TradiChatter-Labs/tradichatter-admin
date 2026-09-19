import Layout from '../components/Layout';
import { Settings, Shield, Users, DollarSign, AlertTriangle } from 'lucide-react';

export default function AffiliateSettings() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Program Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure the affiliate system for V2 launch</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">System Frozen — V2 Feature</h3>
            <p className="text-sm text-yellow-700 mt-1">
              The affiliate system is feature-flagged OFF. All affiliate code exists but is inactive.
              It will be enabled in V2 after legal, operational, and payment provider approvals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900">Payment Model</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Commission Model:</span><span className="font-medium text-gray-900">Seller-Paid Direct Split</span></div>
              <div className="flex justify-between"><span>Fund Custody:</span><span className="font-medium text-green-600">None (Flutterwave splits)</span></div>
              <div className="flex justify-between"><span>Payout Method:</span><span className="font-medium text-gray-900">Instant via transaction split</span></div>
              <div className="flex justify-between"><span>Processor:</span><span className="font-medium text-gray-900">Flutterwave only</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900">Commission Structure</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between"><span>Platform Rate:</span><span className="font-medium text-gray-900">2.5% (fixed policy)</span></div>
              <div className="flex justify-between"><span>Tier System:</span><span className="font-medium text-gray-900">5 tiers (1% → 3%)</span></div>
              <div className="flex justify-between"><span>Who Pays:</span><span className="font-medium text-gray-900">Seller (deducted from proceeds)</span></div>
              <div className="flex justify-between"><span>Escrow Support:</span><span className="font-medium text-gray-900">Yes (held until buyer confirms)</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900">Feature Flags</h3>
            </div>
            <div className="space-y-3">
              {[
                { name: 'affiliate_system_enabled', value: false },
                { name: 'affiliate_registration_enabled', value: false },
                { name: 'affiliate_payments_enabled', value: false },
                { name: 'affiliate_dashboard_enabled', value: false },
              ].map(flag => (
                <div key={flag.name} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-mono">{flag.name}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${flag.value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {flag.value ? 'ON' : 'OFF'}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-600">Rollout Percentage</span>
                <span className="text-sm font-medium text-gray-900">0%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-medium text-gray-900">V2 Launch Checklist</h3>
            </div>
            <div className="space-y-2">
              {[
                { task: 'Migrate affiliate DB from Appwrite to Supabase', done: false },
                { task: 'Flutterwave split payment testing', done: false },
                { task: 'Legal review of commission structure', done: false },
                { task: 'Seller opt-in flow QA', done: false },
                { task: 'Affiliate registration flow QA', done: false },
                { task: 'Escrow + affiliate settlement testing', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className={`h-4 w-4 rounded border flex items-center justify-center ${item.done ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {item.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${item.done ? 'text-gray-500 line-through' : 'text-gray-700'}`}>{item.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
