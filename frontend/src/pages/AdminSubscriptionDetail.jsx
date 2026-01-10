import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  User,
  Mail,
  Building2,
  Plane,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Shield
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

/**
 * Admin Subscription Detail Page
 * View detailed information about a specific subscription
 */
const AdminSubscriptionDetail = () => {
  const { subscriptionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptionDetails();
  }, [subscriptionId]);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/subscriptions/${subscriptionId}`);
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch subscription details');
      console.error(error);
      navigate('/admin/subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (sub) => {
    if (!sub) return null;
    
    if (sub.isExpired) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="w-4 h-4 mr-1" />
          Expired
        </span>
      );
    }
    
    if (sub.isTrial) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" />
          Trial
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-4 h-4 mr-1" />
        Active
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    // Handle trial subscriptions (plan is null)
    if (!plan || plan === null) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          TRIAL
        </span>
      );
    }
    
    const colors = {
      'MONTHLY': 'bg-blue-100 text-blue-800',
      'YEARLY': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors[plan] || 'bg-gray-100 text-gray-800'}`}>
        {plan}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Not Found</h2>
          <button
            onClick={() => navigate('/admin/subscriptions')}
            className="text-cyan-600 hover:text-cyan-700"
          >
            Back to Subscriptions
          </button>
        </div>
      </div>
    );
  }

  const user = subscription.user || {};

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/subscriptions')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Subscriptions
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {user.role?.includes('HOTEL') ? (
                <Building2 className="w-12 h-12 text-cyan-600 bg-cyan-50 rounded-full p-2.5 mr-4" />
              ) : (
                <Plane className="w-12 h-12 text-green-600 bg-green-50 rounded-full p-2.5 mr-4" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username || 'N/A'}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-1" />
                  {user.email || 'N/A'}
                </p>
              </div>
            </div>
            <div className="text-right">
              {getStatusBadge(subscription)}
              <div className="mt-2">
                {getPlanBadge(subscription.plan)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subscription Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-cyan-600" />
              Subscription Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Subscription ID</label>
                <p className="text-gray-900 mt-1 font-mono text-sm">{subscription.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Plan Type</label>
                <p className="text-gray-900 mt-1">{subscription.plan || 'TRIAL'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  {subscription.isExpired ? (
                    <p className="text-red-600 font-medium">Expired</p>
                  ) : subscription.isTrial ? (
                    <p className="text-yellow-600 font-medium">Trial Period</p>
                  ) : (
                    <p className="text-green-600 font-medium">Active Subscription</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Price</label>
                <p className="text-gray-900 mt-1 text-2xl font-bold">
                  {!subscription.plan || subscription.isTrial ? 'Free Trial' : 
                   subscription.plan === 'MONTHLY' ? '$200/month' : 
                   subscription.plan === 'YEARLY' ? '$2,000/year' : 
                   'Free Trial'}
                </p>
              </div>

              {subscription.autoRenew && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Auto-renewal enabled
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-cyan-600" />
              Timeline
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <p className="text-gray-900 mt-1">{formatDate(subscription.startDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <p className="text-gray-900 mt-1">{formatDate(subscription.endDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Days Remaining</label>
                <p className={`mt-1 text-2xl font-bold ${
                  subscription.daysRemaining <= 7 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {subscription.daysRemaining} days
                </p>
              </div>

              {subscription.daysRemaining <= 7 && subscription.daysRemaining > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Expiring soon
                  </p>
                </div>
              )}

              {subscription.isExpired && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    Subscription has expired
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-cyan-600" />
              User Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">User ID</label>
                <p className="text-gray-900 mt-1 font-mono text-sm">{user.id || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Username</label>
                <p className="text-gray-900 mt-1">{user.username || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 mt-1">{user.email || 'N/A'}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <div className="mt-1">
                  {user.role?.includes('HOTEL') ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                      <Building2 className="w-4 h-4 mr-1" />
                      Hotel Manager
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Plane className="w-4 h-4 mr-1" />
                      DMC Manager
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Approval Status</label>
                <div className="mt-1">
                  {user.approved ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-4 h-4 mr-1" />
                      Pending Approval
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-cyan-600" />
              Additional Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Created At</label>
                <p className="text-gray-900 mt-1">{formatDate(subscription.createdAt)}</p>
              </div>

              {subscription.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="text-gray-900 mt-1">{formatDate(subscription.updatedAt)}</p>
                </div>
              )}

              {subscription.cancelledAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Cancelled At</label>
                  <p className="text-gray-900 mt-1 text-red-600">{formatDate(subscription.cancelledAt)}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Trial Period</label>
                <p className="text-gray-900 mt-1">{subscription.isTrial ? 'Yes (7 days)' : 'No'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptionDetail;
