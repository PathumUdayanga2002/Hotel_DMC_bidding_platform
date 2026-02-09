import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Compact Subscription Reminder Component for Top Bar
 * Shows trial countdown or subscription expiry as a special note
 */
const SubscriptionReminder = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noSubscription, setNoSubscription] = useState(false);
  const { isStaff } = useAuth();

  // Staff members shouldn't see subscription reminder
  if (isStaff()) return null;

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get('/subscription/status');
      if (response.data.success) {
        setSubscription(response.data.data);
        setNoSubscription(false);
      }
    } catch (error) {
      if (error.response?.status === 404 || error.response?.data?.message?.includes('not found')) {
        setNoSubscription(true);
      }
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  // Show pending approval note if no subscription exists
  if (noSubscription || !subscription) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-xs font-medium text-blue-800">Profile Pending Approval</span>
      </div>
    );
  }

  const { status, daysRemaining, isTrial, isExpired, isPendingApproval } = subscription;

  // Show pending approval note
  if (status === 'PENDING_APPROVAL' || isPendingApproval) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="text-xs font-medium text-blue-800">Profile Pending Approval</span>
      </div>
    );
  }

  // Show expiry warning
  if (isExpired) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
        <span className="text-xs font-medium text-red-800">Subscription Expired</span>
      </div>
    );
  }

  // Show trial countdown
  if (isTrial) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
        <span className="text-xs font-medium text-yellow-800">
          Free Trial: {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
        </span>
      </div>
    );
  }

  // Show subscription expiry warning (last 7 days)
  if (status === 'ACTIVE' && daysRemaining <= 7) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-lg">
        <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
        <span className="text-xs font-medium text-orange-800">
          Expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
        </span>
      </div>
    );
  }

  // Don't show anything if subscription is active with more than 7 days remaining
  return null;
};

export default SubscriptionReminder;
