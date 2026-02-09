import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2,
  LogOut,
  User,
  FileText,
  Send,
  MessageSquare,
  Lock,
  Bell,
  CheckCircle2,
  FilePlus,
  Compass,
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
  Inbox,
  TrendingUp,
  Users,
  Activity,
  Mail,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // your axios instance
import NotificationBell from '../components/NotificationBell';
import { hotelService } from '../services/hotelService';
import SubscriptionBanner from '../components/SubscriptionBanner';

// --- UI Components ---
const Card = ({ className = '', children }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>{children}</div>
);

const Button = ({ variant = 'default', onClick, children, className = '' }) => {
  let styles =
    'px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md hover:shadow-lg';
  if (variant === 'outline') styles += ' border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-teal-500';
  else if (variant === 'primary') styles += ' bg-gradient-to-r from-teal-500 to-emerald-600 text-white focus:ring-teal-500';
  else if (variant === 'ghost') styles += ' text-gray-600 hover:bg-gray-100 focus:ring-gray-400';
  else styles += ' bg-gradient-to-r from-teal-500 to-emerald-600 text-white focus:ring-teal-500';
  return (
    <button onClick={onClick} className={`${styles} ${className}`}>
      {children}
    </button>
  );
};

// --- Loading Spinner ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
  </div>
);

// --- CTACard ---
// --- CTACard ---
const CTACard = ({ title, message, buttonText, icon: Icon, onButtonClick }) => (
  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl p-8 md:p-12 text-center flex flex-col items-center">
    <div className="bg-white/20 p-4 rounded-full mb-4">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-3xl font-bold mb-2">{title}</h3>
    <p className="text-lg text-teal-100 max-w-2xl mb-6">{message}</p>
    <Button variant="primary" onClick={onButtonClick}>
      <CheckCircle2 className="w-5 h-5 mr-2" />
      {buttonText}
    </Button>
  </div>
);


// --- InfoCard ---
const InfoCard = ({ title, message, icon: Icon, iconColor, bgColor }) => (
  <Card className={`${bgColor} border ${bgColor.replace('bg-', 'border-')}-200`}>
    <div className="flex items-center">
      <Icon className={`w-10 h-10 ${iconColor} mr-4`} />
      <div>
        <h3 className={`text-xl font-bold ${iconColor.replace('text-', 'text-')}-800`}>{title}</h3>
        <p className={`${iconColor.replace('text-', 'text-')}-700 mt-1`}>{message}</p>
      </div>
    </div>
  </Card>
);

// --- StatCards ---
const StatCards = ({ bidStats, pendingInquiriesCount }) => {
  const stats = [
    { title: 'Available Inquiries', value: bidStats?.totalAvailableInquiries || 0, icon: FilePlus, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { title: 'Bids Submitted', value: bidStats?.totalBidsSubmitted || 0, icon: Send, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { title: 'Pending Bids', value: bidStats?.pendingBids || 0, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { title: 'Win Rate', value: `${Math.round(bidStats?.winRate || 0)}%`, icon: TrendingUp, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
    { title: 'Direct Inquiries', value: pendingInquiriesCount || 0, icon: Inbox, color: 'text-slate-600', bgColor: 'bg-slate-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-full ${stat.bgColor}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};

// Sidebar was moved to a reusable component in ../components/HotelSidebar.jsx

// Dashboard header moved to `components/HotelHeader.jsx` and is rendered by the HotelLayout

// --- Main HotelDashboard Component ---
const HotelDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token, isSuperAdmin, isStaff } = useAuth();

  const [profileStatus, setProfileStatus] = useState('LOADING');
  const [dashboardData, setDashboardData] = useState(null);
  const [bidStats, setBidStats] = useState(null);
  const [bids, setBids] = useState([]);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('monthly');
  const [error, setError] = useState(null);
  const [pendingInquiriesCount, setPendingInquiriesCount] = useState(0);
  

  const timeframeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const buildSeries = (sourceBids, range) => {
    const now = new Date();
    const configs = {
      daily: {
        count: 7,
        label: 'MMM d',
        startOf: (date) => startOfDay(date),
        sub: (date, amount) => subDays(date, amount),
        add: (date, amount) => addDays(date, amount)
      },
      weekly: {
        count: 8,
        label: "MMM d",
        startOf: (date) => startOfWeek(date, { weekStartsOn: 1 }),
        sub: (date, amount) => subWeeks(date, amount),
        add: (date, amount) => addWeeks(date, amount)
      },
      monthly: {
        count: 12,
        label: 'MMM',
        startOf: (date) => startOfMonth(date),
        sub: (date, amount) => subMonths(date, amount),
        add: (date, amount) => addMonths(date, amount)
      },
      yearly: {
        count: 5,
        label: 'yyyy',
        startOf: (date) => startOfYear(date),
        sub: (date, amount) => subYears(date, amount),
        add: (date, amount) => addYears(date, amount)
      }
    };

    const config = configs[range];
    const buckets = [];

    for (let i = config.count - 1; i >= 0; i -= 1) {
      const anchor = config.sub(now, i);
      const start = config.startOf(anchor);
      const end = config.add(start, 1);
      buckets.push({
        label: format(start, config.label),
        start,
        end,
        bids: 0,
        amount: 0,
        accepted: 0,
        rejected: 0
      });
    }

    const normalizedBids = sourceBids
      .map((bid) => {
        const submittedAt = bid?.submittedAt ? parseISO(bid.submittedAt) : null;
        if (!submittedAt || Number.isNaN(submittedAt.getTime())) {
          return null;
        }
        return {
          ...bid,
          submittedAt,
          totalPrice: Number(bid.totalPrice) || 0
        };
      })
      .filter(Boolean);

    normalizedBids.forEach((bid) => {
      buckets.forEach((bucket) => {
        if (
          isWithinInterval(bid.submittedAt, {
            start: bucket.start,
            end: bucket.end
          })
        ) {
          bucket.bids += 1;
          bucket.amount += bid.totalPrice;
          if (bid.status === 'ACCEPTED') bucket.accepted += 1;
          if (bid.status === 'REJECTED') bucket.rejected += 1;
        }
      });
    });

    return { buckets, normalizedBids };
  };

  const analytics = useMemo(() => {
    if (!bids.length) {
      return {
        series: [],
        outcome: [],
        summary: {
          totalAmount: 0,
          awardedRate: 0,
          rejectedRate: 0,
          totalBids: 0,
          accepted: 0,
          rejected: 0,
          pending: 0,
          withdrawn: 0
        }
      };
    }

    const { buckets, normalizedBids } = buildSeries(bids, timeframe);
    const timeframeStart = buckets[0]?.start || new Date(0);
    const timeframeBids = normalizedBids.filter((bid) => bid.submittedAt >= timeframeStart);

    const accepted = timeframeBids.filter((bid) => bid.status === 'ACCEPTED').length;
    const rejected = timeframeBids.filter((bid) => bid.status === 'REJECTED').length;
    const pending = timeframeBids.filter((bid) => bid.status === 'PENDING').length;
    const withdrawn = timeframeBids.filter((bid) => bid.status === 'WITHDRAWN').length;
    const totalBids = timeframeBids.length;
    const totalAmount = timeframeBids.reduce((sum, bid) => sum + bid.totalPrice, 0);

    const series = buckets.map((bucket) => ({
      label: bucket.label,
      bids: bucket.bids,
      amount: Math.round(bucket.amount),
      accepted: bucket.accepted,
      rejected: bucket.rejected
    }));

    const outcome = [
      { name: 'Awarded', value: accepted, color: '#14b8a6' },
      { name: 'Rejected', value: rejected, color: '#f43f5e' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Withdrawn', value: withdrawn, color: '#94a3b8' }
    ];

    return {
      series,
      outcome,
      summary: {
        totalAmount,
        awardedRate: totalBids ? (accepted / totalBids) * 100 : 0,
        rejectedRate: totalBids ? (rejected / totalBids) * 100 : 0,
        totalBids,
        accepted,
        rejected,
        pending,
        withdrawn
      }
    };
  }, [bids, timeframe]);

  const formatCurrency = (value, currency = 'LKR') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0
      }).format(value);
    } catch (error) {
      return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setProfileStatus('LOADING');
      setError(null);
      setDashboardData(null);
      setBidStats(null);
      setBids([]);
      setPendingInquiriesCount(0);
      setIsAnalyticsLoading(true);

      try {
        const response = await api.get('/hotel/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const apiResponse = response.data;

        if (apiResponse.success) {
          setDashboardData(apiResponse.data);
          setProfileStatus('APPROVED');

          try {
            const statsResponse = await api.get('/hotel/bids/stats', {
              headers: { Authorization: `Bearer ${token}` }
            });
            setBidStats(statsResponse.data);
          } catch (statsError) {
            console.error('Error fetching bid stats:', statsError);
          }

          try {
            const pageSize = 200;
            let page = 0;
            let totalPages = 1;
            let allBids = [];

            while (page < totalPages && page < 10) {
              const bidsResponse = await api.get('/hotel/bids/search', {
                params: { keyword: '', page, size: pageSize },
                headers: { Authorization: `Bearer ${token}` }
              });

              const pageData = bidsResponse.data?.content ? bidsResponse.data : bidsResponse.data?.data;
              const content = pageData?.content || [];
              totalPages = pageData?.totalPages ?? 1;

              allBids = [...allBids, ...content];
              page += 1;
            }

            setBids(allBids);
          } catch (bidsError) {
            console.error('Error fetching bids for analytics:', bidsError);
          }
          
          // Fetch direct inquiries to count pending ones
          try {
            const inquiriesResponse = await hotelService.getDirectInquiries();
            if (inquiriesResponse.data && inquiriesResponse.data.success) {
              const inquiries = inquiriesResponse.data.data || [];
              const pendingCount = inquiries.filter(inq => inq.status === 'SENT').length;
              setPendingInquiriesCount(pendingCount);
            }
          } catch (inquiryErr) {
            console.error('Error fetching direct inquiries count:', inquiryErr);
            // Don't fail the whole dashboard if inquiries fail to load
          }
        } else {
          setError(apiResponse.message);
          if (apiResponse.message.includes('not found')) setProfileStatus('NOT_REGISTERED');
          else if (apiResponse.message.includes('pending')) setProfileStatus('PENDING_APPROVAL');
          else setProfileStatus('ERROR');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 403) {
          const msg = err.response.data?.message || 'Access forbidden';
          setError(msg);
          if (msg.includes('not found')) setProfileStatus('NOT_REGISTERED');
          else if (msg.includes('pending')) setProfileStatus('PENDING_APPROVAL');
          else setProfileStatus('ERROR');
        } else if (err.response?.status === 401) {
          setError('Unauthorized. Logging out...');
          setTimeout(() => handleLogout(), 1500);
        } else {
          setError(err.message || 'Network error');
          setProfileStatus('ERROR');
        }
      }

      setIsAnalyticsLoading(false);
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const showAnalytics = profileStatus === 'APPROVED' && !isAnalyticsLoading;

  return (
    <div className="flex h-screen bg-slate-50 font-display">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {/* Subscription Status Banner */}
          <SubscriptionBanner />
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {dashboardData?.hotelName || user?.username || 'Hotel Manager'}!
          </h2>
          <p className="text-gray-600 mb-8">Manage your hotel's needs and connect with DMCs.</p>

          {profileStatus === 'LOADING' && <LoadingSpinner />}
          {profileStatus === 'NOT_REGISTERED' && (
            <CTACard
              title="Complete Your Hotel Profile"
              message="Register your hotel details to access all platform features and start sending inquiries to DMCs."
              buttonText="Complete Profile Registration"
              icon={Building2}
              onButtonClick={() => navigate('/hotel/profile/register')}
            />
          )}

          {profileStatus === 'PENDING_APPROVAL' && (
            <InfoCard
              title="Profile Pending Approval"
              message="Your hotel profile has been submitted and is pending admin approval. You will have access to the dashboard features once approved."
              icon={Clock}
              iconColor="text-yellow-600"
              bgColor="bg-yellow-50"
            />
          )}
          {profileStatus === 'APPROVED' && (
            <StatCards bidStats={bidStats} pendingInquiriesCount={pendingInquiriesCount} />
          )}
          {profileStatus === 'ERROR' && error && (
            <InfoCard
              title="An Error Occurred"
              message={error}
              icon={AlertTriangle}
              iconColor="text-red-600"
              bgColor="bg-red-50"
            />
          )}

          {profileStatus === 'APPROVED' && isAnalyticsLoading && (
            <div className="mt-10">
              <LoadingSpinner />
            </div>
          )}

          {showAnalytics && (
            <section className="mt-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Bid Performance Analytics</h3>
                  <p className="text-gray-600">
                    Track bid value, award rate, and rejection trends across timeframes.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {timeframeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTimeframe(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        timeframe === option.value
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6"
              >
                <Card className="border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Bid Amount</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(analytics.summary.totalAmount)}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-teal-100">
                      <CreditCard className="w-6 h-6 text-teal-600" />
                    </div>
                  </div>
                </Card>

                <Card className="border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Awarded Rate</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(analytics.summary.awardedRate)}%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-emerald-100">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </Card>

                <Card className="border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Rejection Rate</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {Math.round(analytics.summary.rejectedRate)}%
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-rose-100">
                      <AlertTriangle className="w-6 h-6 text-rose-600" />
                    </div>
                  </div>
                </Card>

                <Card className="border border-slate-100 bg-gradient-to-br from-slate-50 via-white to-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Bids</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {analytics.summary.totalBids}
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-slate-100">
                      <Activity className="w-6 h-6 text-slate-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8"
              >
                <Card className="xl:col-span-2 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Bid Amount Trend</h4>
                      <p className="text-sm text-gray-500">Total bid value per period</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-teal-50 text-teal-700 rounded-full">
                      Point chart
                    </span>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          cursor={{ stroke: '#14b8a6', strokeWidth: 1 }}
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke="url(#lineGlow)"
                          strokeWidth={3}
                          dot={{ r: 4, stroke: '#14b8a6', strokeWidth: 2, fill: '#ffffff' }}
                          activeDot={{ r: 6 }}
                          animationDuration={1200}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Bid Outcomes</h4>
                      <p className="text-sm text-gray-500">Awarded vs rejected</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                      Pie chart
                    </span>
                  </div>
                  <div className="h-72 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analytics.outcome}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          animationDuration={900}
                        >
                          {analytics.outcome.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {analytics.outcome.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">{entry.name}</span>
                        <span className="ml-auto font-semibold text-gray-900">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-6"
              >
                <Card className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Bid Volume</h4>
                      <p className="text-sm text-gray-500">Bids submitted per period</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full">
                      Bar chart
                    </span>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.series} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.7} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip
                          cursor={{ fill: '#e2f2f8' }}
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 24px rgba(15, 23, 42, 0.08)'
                          }}
                        />
                        <Bar dataKey="bids" fill="url(#barGlow)" radius={[8, 8, 0, 0]} animationDuration={1100} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default HotelDashboard;
