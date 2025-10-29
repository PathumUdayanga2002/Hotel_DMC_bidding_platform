import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import {
  FileCheck,
  TrendingUp,
  Users,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const AdminHome = () => {
  const { dmcStats } = useOutletContext();
  const navigate = useNavigate();

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

  const recentActivity = [
    { action: 'New DMC Registration', time: '2 minutes ago', status: 'pending' },
    { action: 'Profile Approved', time: '1 hour ago', status: 'success' },
    { action: 'Profile Rejected', time: '3 hours ago', status: 'error' },
    { action: 'Status Changed to Under Review', time: '5 hours ago', status: 'info' }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600',
            yellow: 'bg-yellow-100 text-yellow-600',
            green: 'bg-green-100 text-green-600',
            red: 'bg-red-100 text-red-600'
          };

          return (
            <Card
              key={index}
              className={`${stat.action ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
              onClick={stat.action}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-sm mt-2 ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {stat.change} from last week
                    </p>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
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
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const colorClasses = {
                  green: 'bg-green-100 text-green-600',
                  blue: 'bg-blue-100 text-blue-600',
                  purple: 'bg-purple-100 text-purple-600'
                };

                return (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      action.disabled
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${colorClasses[action.color]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{action.title}</p>
                        <p className="text-sm text-gray-500">{action.description}</p>
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
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const statusColors = {
                pending: 'bg-yellow-100 text-yellow-600',
                success: 'bg-green-100 text-green-600',
                error: 'bg-red-100 text-red-600',
                info: 'bg-blue-100 text-blue-600'
              };

              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${statusColors[activity.status]}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-4">DMC Profile Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
    </div>
  );
};

export default AdminHome;
