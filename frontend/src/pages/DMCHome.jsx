import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  FileText,
  Gavel,
  Search,
  TrendingUp,
  Users,
  Award,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getDMCDashboardStats } from '../services/bidInquiryService';

// Landing page inspired colors (teal, emerald, white)
const COLORS = {
  primary: '#14b8a6',      // teal-500
  secondary: '#10b981',    // emerald-500
  tertiary: '#06b6d4',     // cyan-500
  accent: '#0891b2',       // cyan-600
  success: '#059669',      // emerald-600
  warning: '#f59e0b',      // amber-500
  danger: '#ef4444',       // red-500
  gray: '#6b7280'          // gray-500
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.accent];

const DMCHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profileStatus } = useOutletContext();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [period, setPeriod] = useState('daily'); // daily, weekly, monthly
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
  }, [period]);

  useEffect(() => {
    if (stats) {
      // Trigger chart animations after data loads
      setTimeout(() => setAnimateCharts(true), 100);
    }
  }, [stats]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDMCDashboardStats(period);
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  // Prepare data for charts
  const timeSeriesData = period === 'daily' ? stats.dailyStats :
                         period === 'weekly' ? stats.weeklyStats :
                         stats.monthlyStats;

  const bidStatusData = Object.entries(stats.bidStatusDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  const inquiryStatusData = Object.entries(stats.inquiryStatusDistribution || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-sm p-6 mb-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username}!
        </h2>
        <p className="opacity-90">
          Manage your DMC operations and respond to hotel inquiries
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bids Received</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBidsReceived}</p>
              <p className="text-xs text-teal-600 mt-1">Avg {stats.averageBidsPerInquiry?.toFixed(1)} per inquiry</p>
            </div>
            <div className="bg-teal-100 rounded-full p-3">
              <Gavel className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.openInquiries}</p>
              <p className="text-xs text-blue-600 mt-1">{stats.pendingBids} pending bids</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Award Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.bidAwardRate?.toFixed(1)}%</p>
              <p className="text-xs text-emerald-600 mt-1">{stats.awardedInquiries} awarded</p>
            </div>
            <div className="bg-emerald-100 rounded-full p-3">
              <Award className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 transform transition-all hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejection Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.bidRejectionRate?.toFixed(1)}%</p>
              <p className="text-xs text-red-600 mt-1">{stats.rejectedBids} rejected</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-6 flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-teal-600" />
          Analytics Period
        </h3>
        <div className="flex space-x-2">
          {['daily', 'weekly', 'monthly'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === p
                  ? 'bg-teal-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart - Inquiries & Bids Over Time */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inquiries & Bids Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="label" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="inquiries" 
                stroke={COLORS.primary} 
                strokeWidth={3}
                dot={{ fill: COLORS.primary, r: 4 }}
                name="Inquiries Posted"
                animationDuration={animateCharts ? 1500 : 0}
              />
              <Line 
                type="monotone" 
                dataKey="bidsReceived" 
                stroke={COLORS.secondary} 
                strokeWidth={3}
                dot={{ fill: COLORS.secondary, r: 4 }}
                name="Bids Received"
                animationDuration={animateCharts ? 1500 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Awards & Rejections */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Awards & Rejections
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="label" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="awarded" 
                fill={COLORS.success} 
                name="Awarded"
                radius={[8, 8, 0, 0]}
                animationDuration={animateCharts ? 1000 : 0}
              />
              <Bar 
                dataKey="rejected" 
                fill={COLORS.danger} 
                name="Rejected"
                radius={[8, 8, 0, 0]}
                animationDuration={animateCharts ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Bid Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Bid Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bidStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={animateCharts ? 1200 : 0}
              >
                {bidStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Inquiry Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Inquiry Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inquiryStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationDuration={animateCharts ? 1200 : 0}
              >
                {inquiryStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Cities by Bids */}
      {stats.topCitiesByBids && stats.topCitiesByBids.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Cities by Bid Activity
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topCitiesByBids} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis type="category" dataKey="city" stroke="#6b7280" style={{ fontSize: '12px' }} width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="inquiryCount" 
                fill={COLORS.primary} 
                name="Inquiries"
                radius={[0, 8, 8, 0]}
                animationDuration={animateCharts ? 1000 : 0}
              />
              <Bar 
                dataKey="bidCount" 
                fill={COLORS.secondary} 
                name="Bids Received"
                radius={[0, 8, 8, 0]}
                animationDuration={animateCharts ? 1000 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Call to Action */}
      {!profileStatus?.isApproved && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg shadow-lg p-8 text-white text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Complete Your DMC Profile</h3>
          <p className="mb-6 opacity-90">
            Register your company details to access all platform features and start bidding on hotel inquiries.
          </p>
          <button
            onClick={() => navigate('/dmc/profile/register')}
            className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Complete Profile Registration
          </button>
        </div>
      )}
    </>
  );
};

export default DMCHome;
