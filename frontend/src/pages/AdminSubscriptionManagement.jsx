import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Users, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  Mail,
  Building2,
  Plane
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * Admin Subscription Management Page
 * View all user subscriptions, payment history, and statistics
 */
const AdminSubscriptionManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    trial: 0,
    expired: 0,
    revenue: 0
  });

  useEffect(() => {
    fetchAllSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptionsData();
  }, [subscriptions, searchTerm, filterStatus, filterPlan]);

  const fetchAllSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/subscriptions?size=1000');
      if (response.data.success) {
        // Backend returns Spring Data Page object with 'content' array
        const pageData = response.data.data || {};
        const subs = Array.isArray(pageData) ? pageData : (pageData.content || []);
        setSubscriptions(subs);
        calculateStats(subs);
      }
    } catch (error) {
      toast.error('Failed to fetch subscriptions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subs) => {
    const stats = {
      total: subs.length,
      active: subs.filter(s => s.status === 'ACTIVE' && !s.isTrial).length,
      trial: subs.filter(s => s.isTrial).length,
      expired: subs.filter(s => s.isExpired).length,
      revenue: subs
        .filter(s => s.plan === 'MONTHLY' || s.plan === 'YEARLY')
        .reduce((sum, s) => {
          if (s.plan === 'MONTHLY') return sum + 200;
          if (s.plan === 'YEARLY') return sum + 2000;
          return sum;
        }, 0)
    };
    setStats(stats);
  };

  const filterSubscriptionsData = () => {
    let filtered = [...subscriptions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'ALL') {
      if (filterStatus === 'ACTIVE') {
        filtered = filtered.filter(sub => sub.status === 'ACTIVE' && !sub.isExpired);
      } else if (filterStatus === 'TRIAL') {
        filtered = filtered.filter(sub => sub.isTrial);
      } else if (filterStatus === 'EXPIRED') {
        filtered = filtered.filter(sub => sub.isExpired);
      }
    }

    // Plan filter
    if (filterPlan !== 'ALL') {
      filtered = filtered.filter(sub => sub.plan === filterPlan);
    }

    setFilteredSubscriptions(filtered);
  };

  const getStatusBadge = (subscription) => {
    if (subscription.isExpired) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </span>
      );
    }
    if (subscription.isTrial) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Trial
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const colors = {
      TRIAL: 'bg-gray-100 text-gray-800',
      MONTHLY: 'bg-blue-100 text-blue-800',
      YEARLY: 'bg-purple-100 text-purple-800'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[plan] || 'bg-gray-100 text-gray-800'}`}>
        {plan}
      </span>
    );
  };

  const exportToCSV = () => {
    const csvData = filteredSubscriptions.map(sub => ({
      User: sub.user?.username || 'N/A',
      Email: sub.user?.email || 'N/A',
      Plan: sub.plan,
      Status: sub.isExpired ? 'Expired' : sub.isTrial ? 'Trial' : 'Active',
      StartDate: new Date(sub.startDate).toLocaleDateString(),
      EndDate: new Date(sub.endDate).toLocaleDateString(),
      DaysRemaining: sub.daysRemaining
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Subscriptions exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="w-8 h-8 mr-3 text-cyan-600" />
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all user subscriptions and payment history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trial Users</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.trial}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.expired}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">${stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 opacity-80" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="ALL">All Plans</option>
                <option value="TRIAL">Trial</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
              
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
                title="Export to CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                      <p>No subscriptions found</p>
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {subscription.user?.role?.includes('HOTEL') ? (
                              <Building2 className="w-8 h-8 text-cyan-600 bg-cyan-50 rounded-full p-1.5" />
                            ) : (
                              <Plane className="w-8 h-8 text-green-600 bg-green-50 rounded-full p-1.5" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {subscription.user?.username || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {subscription.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPlanBadge(subscription.plan)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(subscription.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          subscription.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {subscription.daysRemaining} days
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/subscriptions/${subscription.id}`)}
                          className="text-cyan-600 hover:text-cyan-900 flex items-center"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionManagement;
