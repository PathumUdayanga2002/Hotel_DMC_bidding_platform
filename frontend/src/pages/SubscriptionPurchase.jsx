import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Check, CreditCard, Clock, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/**
 * Subscription Purchase Page
 * Shows pricing plans and handles PayHere payment integration
 */
const SubscriptionPurchase = () => {
  const [plans, setPlans] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('YEARLY');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlansAndSubscription();
    
    // Load PayHere script and ensure it's ready
    const loadPayHereScript = () => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (window.payhere) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://www.payhere.lk/lib/payhere.js';
        script.async = true;
        script.onload = () => {
          console.log('PayHere script loaded successfully');
          resolve();
        };
        script.onerror = () => {
          console.error('Failed to load PayHere script');
          reject(new Error('Failed to load PayHere script'));
        };
        document.body.appendChild(script);
      });
    };

    loadPayHereScript().catch(error => {
      console.error('PayHere initialization error:', error);
      toast.error('Payment system initialization failed');
    });
    
    return () => {
      // Cleanup: remove script if needed
      const scripts = document.querySelectorAll('script[src*="payhere"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  const fetchPlansAndSubscription = async () => {
    try {
      const [plansResponse, subscriptionResponse] = await Promise.all([
        api.get('/subscription/plans'),
        api.get('/subscription/status')
      ]);
      
      if (plansResponse.data.success) {
        setPlans(plansResponse.data.data);
      }
      
      if (subscriptionResponse.data.success) {
        setSubscription(subscriptionResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    // Check if PayHere is loaded
    if (!window.payhere) {
      toast.error('Payment system not ready. Please refresh the page.');
      return;
    }

    setPurchasing(true);

    try {
      const response = await api.post(`/subscription/purchase?plan=${selectedPlan}`);
      
      if (response.data.success) {
        const paymentData = response.data.data;
        
        console.log('Payment data received:', paymentData);
        
        // Configure PayHere callbacks BEFORE starting payment
        window.payhere.onCompleted = function onCompleted(orderId) {
          console.log('Payment completed. OrderID:', orderId);
          toast.success('Payment successful! Your subscription is now active.');
          setTimeout(() => {
            // Redirect based on user role
            const userRole = user?.role;
            if (userRole?.includes('HOTEL')) {
              navigate('/hotel/dashboard');
            } else if (userRole?.includes('DMC')) {
              navigate('/dmc/dashboard');
            } else {
              navigate('/');
            }
          }, 2000);
        };

        window.payhere.onDismissed = function onDismissed() {
          console.log('Payment dismissed');
          toast.info('Payment cancelled');
          setPurchasing(false);
        };

        window.payhere.onError = function onError(error) {
          console.error('Payment error:', error);
          toast.error(`Payment failed: ${error || 'Unknown error'}`);
          setPurchasing(false);
        };

        // Validate payment data structure
        if (!paymentData.merchant_id || !paymentData.order_id || !paymentData.amount) {
          toast.error('Invalid payment configuration');
          setPurchasing(false);
          return;
        }

        console.log('Initiating PayHere payment with sandbox:', paymentData.sandbox);
        
        // Start PayHere payment (this opens PayHere modal, NOT an AJAX request)
        window.payhere.startPayment(paymentData);
        
      } else {
        toast.error(response.data.message || 'Failed to initialize payment');
        setPurchasing(false);
      }
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast.error(error.response?.data?.message || 'Failed to process payment');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            {subscription?.isTrial 
              ? `${subscription.daysRemaining} days remaining in your free trial`
              : 'Select the perfect plan for your business'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Monthly Plan */}
          <div
            className={`bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-200 ${
              selectedPlan === 'MONTHLY' 
                ? 'ring-4 ring-blue-500 scale-105' 
                : 'hover:scale-102'
            }`}
            onClick={() => setSelectedPlan('MONTHLY')}
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Monthly Plan</h3>
                {selectedPlan === 'MONTHLY' && (
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">${plans?.monthly?.price}</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>30 days access</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited inquiries & bids</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Analytics dashboard</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Yearly Plan */}
          <div
            className={`bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-200 relative ${
              selectedPlan === 'YEARLY' 
                ? 'ring-4 ring-indigo-500 scale-105' 
                : 'hover:scale-102'
            }`}
            onClick={() => setSelectedPlan('YEARLY')}
          >
            <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-bl-lg">
              <span className="font-semibold">BEST VALUE</span>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Yearly Plan</h3>
                {selectedPlan === 'YEARLY' && (
                  <div className="bg-indigo-500 text-white rounded-full p-1">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">${plans?.yearly?.price}</span>
                <span className="text-gray-600 ml-2">/year</span>
              </div>
              
              <p className="text-indigo-600 font-semibold mb-6">
                Save $400 per year! 🎉
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>365 days access</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Unlimited inquiries & bids</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Premium support</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span>Priority feature requests</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {purchasing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                <span>
                  Subscribe to {selectedPlan === 'MONTHLY' ? 'Monthly' : 'Yearly'} Plan - 
                  ${selectedPlan === 'MONTHLY' ? plans?.monthly?.price : plans?.yearly?.price}
                </span>
              </>
            )}
          </button>
          
          {/* Security Info */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-gray-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Secure payment powered by PayHere</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            What's Included in Every Plan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Access</h3>
              <p className="text-gray-600 text-sm">Access the platform anytime, anywhere</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Limits</h3>
              <p className="text-gray-600 text-sm">Unlimited bids and inquiries</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPurchase;
