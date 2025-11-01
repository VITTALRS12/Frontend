// File: src/pages/ReferralDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import ReferralShare from '../components/ReferralShare';
import './n.css';

const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3000');

const ReferralDashboard = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/referral-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.data);
    } catch (err) {
      setError('Failed to load referral stats.');
    }
  };

  const fetchReferrals = async (f = filter) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/user/referrals?filter=${f}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReferrals(res.data.data);
    } catch (err) {
      setError('Failed to load referrals.');
      setReferrals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
      fetchReferrals();
    }
  }, [filter, token]);

  useEffect(() => {
    socket.on('referral:update', (data) => {
      if (data.userId === user?._id) {
        fetchStats();
        fetchReferrals();
      }
    });
    return () => socket.off('referral:update');
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Referral Dashboard</h2>

      {user?.referralCode && <ReferralShare referralCode={user.referralCode} />}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white shadow p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700">Total Referrals</h4>
            <p className="text-2xl font-bold text-blue-600">{stats.totalReferrals}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700">Paid Referrals</h4>
            <p className="text-2xl font-bold text-green-600">{stats.paidReferrals}</p>
          </div>
          <div className="bg-white shadow p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700">Total Earnings</h4>
            <p className="text-2xl font-bold text-emerald-600">₹{stats.totalEarnings}</p>
          </div>
        </div>
      )}

      {/* <div className="marquee-container">
        <div className="marquee-content">
          💸 Refer and Win Money 💸 Refer and Win Money 💸 Refer and Win Money 💸 Refer and Win Money 💸
        </div>
      </div> */}

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('paid')}
          className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
        >
          Paid
        </button>
        <button
          onClick={() => setFilter('unpaid')}
          className={`filter-btn ${filter === 'unpaid' ? 'active' : ''}`}
        >
          Unpaid
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {referrals.length === 0 ? (
            <p className="text-gray-500">No referrals found.</p>
          ) : (
            referrals.map((ref, idx) => (
              <div key={idx} className="referral-card">
                <div className="flex items-center gap-4">
                  <div className="referral-avatar">{ref.avatar}</div>
                  <div>
                    <p className="font-medium text-gray-800">{ref.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(ref.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    ref.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {ref.status.toUpperCase()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralDashboard;
