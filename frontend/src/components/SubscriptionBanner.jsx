import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, CreditCard, X, Info, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Subscription Banner Component
 * Shows trial countdown, subscription status, and renewal prompts
 * Handles users without subscription (pending profile approval)
 */
const SubscriptionBanner = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [noSubscription, setNoSubscription] = useState(false);
  const navigate = useNavigate();
  const { user, isStaff } = useAuth();

  // Staff members shouldn't see subscription banner
  // They use their organization's subscription (managed by super admin)
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
      // If 404 or no subscription found, user is pending approval
      if (error.response?.status === 404 || error.response?.data?.message?.includes('not found')) {
        setNoSubscription(true);
      }
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || dismissed) return null;

  // Show pending approval banner if no subscription exists
  if (noSubscription || !subscription) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-semibold">Profile Pending Approval</p>
            <p className="text-sm opacity-90">
              Complete your profile and wait for admin approval. Your 30-day free trial will start once approved!
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-blue-100 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { status, daysRemaining, isTrial, isExpired, isPendingApproval } = subscription;

  // Show pending approval banner
  if (status === 'PENDING_APPROVAL' || isPendingApproval) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-semibold">Profile Pending Approval</p>
            <p className="text-sm opacity-90">
              {subscription.message || "Complete your profile and wait for admin approval. Your 30-day free trial will start once approved!"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-blue-100 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Don't show banner if subscription is active and has more than 7 days
  if (status === 'ACTIVE' && daysRemaining > 7) return null;

  const getBannerStyle = () => {
    if (isExpired) return 'bg-red-50 border-red-200 text-red-800';
    if (isTrial && daysRemaining <= 7) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (status === 'ACTIVE' && daysRemaining <= 7) return 'bg-orange-50 border-orange-200 text-orange-800';
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  const getIcon = () => {
    if (isExpired) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (isTrial) return <Clock className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 text-blue-600" />;
  };

  const getMessage = () => {
    if (isExpired) {
      return (
        <>
          <strong>Subscription Expired!</strong> Your subscription has expired. 
          Renew now to continue accessing premium features.
        </>
      );
    }
    if (isTrial) {
      return (
        <>
          <strong>Free Trial:</strong> {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining. 
          Subscribe now to continue after your trial ends!
        </>
      );
    }
    if (status === 'ACTIVE' && daysRemaining <= 7) {
      return (
        <>
          <strong>Subscription Expiring Soon:</strong> Your subscription expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}. 
          Renew now to avoid interruption.
        </>
      );
    }
    return null;
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${getBannerStyle()} border-b px-4 py-3 shadow-md`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <p className="text-sm font-medium">{getMessage()}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-current rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          {isExpired || daysRemaining <= 7 ? (
            <button
              onClick={() => navigate('/subscription/purchase')}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-current rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
            >
              <CreditCard className="w-4 h-4" />
              <span>{isExpired ? 'Renew Now' : 'Subscribe Now'}</span>
            </button>
          ) : null}
          
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
