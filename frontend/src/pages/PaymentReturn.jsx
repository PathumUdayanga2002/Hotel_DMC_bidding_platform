import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Loader, AlertTriangle, Home, FileText } from 'lucide-react';
import React from 'react';

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing'); // processing, success, pending, error
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [error, setError] = useState('');

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setStatus('error');
      setError('No order information found');
      return;
    }

    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(`/payments/order/${orderId}`);
        const payment = response.data;

        setPaymentInfo(payment);

        if (payment.status === 'COMPLETED') {
          setStatus('success');
          // Clear stored payment info
          localStorage.removeItem('currentPayment');
        } else if (payment.status === 'PROCESSING') {
          setStatus('pending');
        } else if (payment.status === 'FAILED' || payment.status === 'CANCELLED') {
          setStatus('error');
          setError('Payment was not successful. Please try again.');
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
        setError(error.response?.data?.message || 'Failed to verify payment status');
      }
    };

    // Initial check
    checkPaymentStatus();

    // Poll for status updates if processing
    const interval = setInterval(() => {
      if (status === 'processing' || status === 'pending') {
        checkPaymentStatus();
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [orderId, status]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
      case 'pending':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Loader className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Processing Payment...
            </h1>
            <p className="text-gray-600 mb-6">
              Please wait while we confirm your payment with PayHere.
              <br />
              This may take a few moments.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                Do not close this window or press the back button.
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-8">
              Your payment has been processed successfully.
              <br />
              The hotel will be notified about your booking.
            </p>

            {paymentInfo && (
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto mb-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium text-gray-900">{paymentInfo.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-900">
                      {paymentInfo.currency} {paymentInfo.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {paymentInfo.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium text-gray-900">{paymentInfo.paymentMethod || 'PayHere'}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/dmc/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium transition-all flex items-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/dmc/payments')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Payments
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              {error || 'Your payment could not be processed.'}
            </p>

            {paymentInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto mb-8">
                <p className="text-sm text-red-800">
                  Order ID: <span className="font-medium">{paymentInfo.orderId}</span>
                  <br />
                  Status: <span className="font-medium">{paymentInfo.status}</span>
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/dmc/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium transition-all flex items-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentReturn;
