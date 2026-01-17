import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import api from '../services/api';
import {
  FileCheck,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  RefreshCw
} from 'lucide-react';

const AdminHome = () => {
  const { dmcStats, hotelStats, refreshStats } = useOutletContext();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    // Format as date if older than 7 days
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    setLoadingActivity(true);
    try {
      const response = await api.get('/admin/recent-activity');
      if (response.data.success) {
        setRecentActivity(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      // Fallback to empty array if API fails
      setRecentActivity([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchRecentActivity();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRecentActivity();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Total DMC Profiles',
      value: dmcStats?.total || 0,
      icon: FileCheck,
      color: 'blue',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Pending Approval',
      value: dmcStats?.pending || 0,
      icon: Clock,
      color: 'yellow',
      change: '+5',
      changeType: 'increase',
      action: () => navigate('/admin/dmc-approvals?status=PENDING')
    },
    {
      title: 'Approved Profiles',
      value: dmcStats?.approved || 0,
      icon: CheckCircle,
      color: 'green',
      change: '+8',
      changeType: 'increase'
    },
    {
      title: 'Under Review',
      value: dmcStats?.underReview || 0,
      icon: Activity,
      color: 'blue',
      change: '0',
      changeType: 'neutral',
      action: () => navigate('/admin/dmc-approvals?status=UNDER_REVIEW')
    }
  ];

  const quickActions = [
    {
      title: 'Review DMC Profiles',
      description: 'Approve or reject pending DMC registrations',
      icon: FileCheck,
      color: 'green',
      action: () => navigate('/admin/dmc-approvals')
    },
    {
      title: 'Review Hotel Profiles',
      description: 'Approve or reject pending hotel registrations',
      icon: Building2,
      color: 'green',
      action: () => navigate('/admin/hotel-approvals')
    },
    {
      title: 'Manage Users',
      description: 'View and manage platform users',
      icon: Users,
      color: 'blue',
      disabled: true
    },
    {
      title: 'View Analytics',
      description: 'Check platform performance metrics',
      icon: TrendingUp,
      color: 'purple',
      disabled: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Dashboard Overview</h1>
        <p className="text-slate-600 mt-2 text-lg">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-gradient-to-br from-teal-500 to-teal-600 text-white',
            yellow: 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white',
            green: 'bg-gradient-to-br from-emerald-500 to-green-600 text-white',
            red: 'bg-gradient-to-br from-red-500 to-pink-600 text-white'
          };

          return (
            <Card
              key={index}
              className={`bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 ${stat.action ? 'cursor-pointer hover:scale-105' : ''}`}
              onClick={stat.action}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm mt-2 font-medium ${
                      stat.changeType === 'increase' ? 'text-emerald-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 
                      'text-slate-600'
                    }`}>
                      {stat.change} from last week
                    </p>
                  )}
                </div>
                <div className={`p-4 rounded-xl shadow-lg ${colorClasses[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colorClasses = {
                  green: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
                  blue: 'bg-gradient-to-br from-teal-500 to-blue-600 text-white',
                  purple: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                };

                return (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 ${
                      action.disabled
                        ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl shadow-md ${colorClasses[action.color]}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-900">{action.title}</p>
                        <p className="text-sm text-slate-600">{action.description}</p>
                      </div>
                    </div>
                    {!action.disabled && <ArrowRight className="w-5 h-5 text-gray-400" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Recent Activity</h2>
            <button
              onClick={fetchRecentActivity}
              disabled={loadingActivity}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-300 disabled:opacity-50"
              title="Refresh activity"
            >
              <RefreshCw className={`w-5 h-5 text-teal-600 ${loadingActivity ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {loadingActivity ? (
            <div className="py-12 text-center">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-slate-500 mt-3">Loading activity...</p>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const statusColors = {
                  pending: 'bg-gradient-to-r from-yellow-400 to-orange-500',
                  success: 'bg-gradient-to-r from-emerald-500 to-green-600',
                  approved: 'bg-gradient-to-r from-emerald-500 to-green-600',
                  error: 'bg-gradient-to-r from-red-500 to-pink-600',
                  rejected: 'bg-gradient-to-r from-red-500 to-pink-600',
                  info: 'bg-gradient-to-r from-teal-500 to-blue-600',
                  underreview: 'bg-gradient-to-r from-teal-500 to-blue-600'
                };

                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className={`w-3 h-3 rounded-full mt-1.5 shadow-md ${statusColors[activity.status?.toLowerCase()] || statusColors.info}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-500">{formatTime(activity.time || activity.timestamp)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DMC Status Breakdown */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">DMC Profile Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total', value: dmcStats?.total || 0, color: 'gray', icon: FileCheck },
              { label: 'Pending', value: dmcStats?.pending || 0, color: 'yellow', icon: Clock },
              { label: 'Under Review', value: dmcStats?.underReview || 0, color: 'blue', icon: Activity },
              { label: 'Approved', value: dmcStats?.approved || 0, color: 'green', icon: CheckCircle },
              { label: 'Rejected', value: dmcStats?.rejected || 0, color: 'red', icon: XCircle },
              { label: 'Suspended', value: dmcStats?.suspended || 0, color: 'red', icon: AlertCircle }
            ].map((status, index) => {
              const Icon = status.icon;
              const colorClasses = {
                gray: 'border-gray-200 bg-gray-50',
                yellow: 'border-yellow-200 bg-yellow-50',
                blue: 'border-blue-200 bg-blue-50',
                green: 'border-green-200 bg-green-50',
                red: 'border-red-200 bg-red-50'
              };
              const iconColors = {
                gray: 'text-gray-600',
                yellow: 'text-yellow-600',
                blue: 'text-blue-600',
                green: 'text-green-600',
                red: 'text-red-600'
              };

              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${colorClasses[status.color]}`}>
                  <Icon className={`w-5 h-5 mb-2 ${iconColors[status.color]}`} />
                  <p className="text-2xl font-bold text-gray-900">{status.value}</p>
                  <p className="text-sm text-gray-600">{status.label}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Hotel Status Breakdown */}
        <Card className="bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-6">Hotel Profile Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total', value: hotelStats?.total || 0, color: 'gray', icon: Building2 },
              { label: 'Pending', value: hotelStats?.pending || 0, color: 'yellow', icon: Clock },
              { label: 'Under Review', value: hotelStats?.underReview || 0, color: 'blue', icon: Activity },
              { label: 'Approved', value: hotelStats?.approved || 0, color: 'green', icon: CheckCircle },
              { label: 'Rejected', value: hotelStats?.rejected || 0, color: 'red', icon: XCircle },
              { label: 'Suspended', value: hotelStats?.suspended || 0, color: 'red', icon: AlertCircle }
            ].map((status, index) => {
              const Icon = status.icon;
              const colorClasses = {
                gray: 'border-gray-200 bg-gray-50',
                yellow: 'border-yellow-200 bg-yellow-50',
                blue: 'border-blue-200 bg-blue-50',
                green: 'border-green-200 bg-green-50',
                red: 'border-red-200 bg-red-50'
              };
              const iconColors = {
                gray: 'text-gray-600',
                yellow: 'text-yellow-600',
                blue: 'text-blue-600',
                green: 'text-green-600',
                red: 'text-red-600'
              };

              return (
                <div key={index} className={`p-4 rounded-lg border-2 ${colorClasses[status.color]}`}>
                  <Icon className={`w-5 h-5 mb-2 ${iconColors[status.color]}`} />
                  <p className="text-2xl font-bold text-gray-900">{status.value}</p>
                  <p className="text-sm text-gray-600">{status.label}</p>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
