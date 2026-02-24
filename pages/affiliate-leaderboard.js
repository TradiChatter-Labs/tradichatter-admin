import { useState } from 'react';
import Link from 'next/link';
import { Award, Trophy, Medal, Star, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AffiliateLeaderboard() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [leaderboard, setLeaderboard] = useState([
    {
      id: 'AF001',
      name: 'John Smith',
      rank: 1,
      earnings: 125000,
      referrals: 45,
      conversionRate: 78.5,
      badge: 'Gold',
      streak: 6
    },
    {
      id: 'AF003',
      name: 'Mike Davis',
      rank: 2,
      earnings: 98000,
      referrals: 38,
      conversionRate: 72.1,
      badge: 'Silver',
      streak: 4
    },
    {
      id: 'AF004',
      name: 'Lisa Wilson',
      rank: 3,
      earnings: 87000,
      referrals: 35,
      conversionRate: 69.8,
      badge: 'Bronze',
      streak: 3
    },
    {
      id: 'AF005',
      name: 'David Brown',
      rank: 4,
      earnings: 76000,
      referrals: 32,
      conversionRate: 65.2,
      badge: 'Rising Star',
      streak: 2
    },
    {
      id: 'AF006',
      name: 'Emma Johnson',
      rank: 5,
      earnings: 65000,
      referrals: 28,
      conversionRate: 61.4,
      badge: 'Achiever',
      streak: 1
    }
  ]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-orange-500" />;
      default: return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Gold': return 'bg-yellow-100 text-yellow-800';
      case 'Silver': return 'bg-gray-100 text-gray-800';
      case 'Bronze': return 'bg-orange-100 text-orange-800';
      case 'Rising Star': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const updateRankings = () => {
    if (confirm('Recalculate rankings based on current performance?')) {
      alert('Rankings updated successfully!');
    }
  };

  const resetCompetition = () => {
    if (confirm('Reset competition? This will clear all current rankings.')) {
      alert('Competition reset successfully!');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Leaderboard Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage affiliate rankings, competitions, and performance badges.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          {['weekly', 'monthly', 'quarterly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={updateRankings}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Update Rankings
          </button>
          <button
            onClick={resetCompetition}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Reset Competition
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Top Performers</h3>
        <div className="flex justify-center items-end space-x-8">
          {/* 2nd Place */}
          <div className="text-center">
            <div className="w-20 h-16 bg-gray-200 rounded-t-lg flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-gray-600">2</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-300 mx-auto mb-2"></div>
            <p className="text-sm font-medium">{leaderboard[1]?.name}</p>
            <p className="text-xs text-gray-500">₦{leaderboard[1]?.earnings.toLocaleString()}</p>
          </div>

          {/* 1st Place */}
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-t-lg flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-300 mx-auto mb-2"></div>
            <p className="text-sm font-medium">{leaderboard[0]?.name}</p>
            <p className="text-xs text-gray-500">₦{leaderboard[0]?.earnings.toLocaleString()}</p>
          </div>

          {/* 3rd Place */}
          <div className="text-center">
            <div className="w-20 h-12 bg-orange-300 rounded-t-lg flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-orange-200 mx-auto mb-2"></div>
            <p className="text-sm font-medium">{leaderboard[2]?.name}</p>
            <p className="text-xs text-gray-500">₦{leaderboard[2]?.earnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Full Rankings</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {leaderboard.map((affiliate) => (
            <li key={affiliate.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {getRankIcon(affiliate.rank)}
                    </div>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-gray-400 mr-4">
                        #{affiliate.rank}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">{affiliate.name}</p>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(affiliate.badge)}`}>
                            {affiliate.badge}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 space-x-4">
                          <div className="flex items-center">
                            <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-500">₦{affiliate.earnings.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-500">{affiliate.referrals} referrals</p>
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-3 w-3 text-gray-400 mr-1" />
                            <p className="text-sm text-gray-500">{affiliate.conversionRate}% conv.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{affiliate.streak} month streak</p>
                      <p className="text-sm text-gray-500">Consistent performer</p>
                    </div>
                    <button
                      onClick={() => alert(`Managing rewards for ${affiliate.name}`)}
                      className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Manage Rewards
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Competition Settings */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Competition Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Competition Period</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Annual</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ranking Criteria</label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Total Earnings</option>
              <option>Conversion Rate</option>
              <option>Referral Count</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reward Pool</label>
            <input
              type="text"
              placeholder="₦500,000"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => alert('Competition settings saved!')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Settings
          </button>
          <button
            onClick={() => alert('New competition started!')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Start New Competition
          </button>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/affiliate-section" className="text-blue-600 hover:text-blue-500 font-medium">
          ← Back to Affiliate Section
        </Link>
      </div>
    </div>
  );
}