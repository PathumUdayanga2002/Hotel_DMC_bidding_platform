import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import React from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { 
  CreditCard, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  FileText,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const PaymentInitiation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [countdown, setCountdown] = useState(900); // 15 minutes in seconds

  const inquiryId = searchParams.get('inquiryId');
  const bidId = searchParams.get('bidId');

  useEffect(() => {
    if (!inquiryId || !bidId) {
      toast.error('Invalid payment request');
      navigate('/dmc/dashboard');
    }
  }, [inquiryId, bidId, navigate]);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInitiatePayment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payments/initiate', {
        inquiryId,
        bidId,
        returnUrl: `${window.location.origin}/payment/return`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        notifyUrl: `${import.meta.env.VITE_API_BASE_URL}/webhooks/payhere/notify`
      });

      const { checkoutUrl, paymentId, orderId } = response.data;

      // Store payment info in localStorage for tracking
      localStorage.setItem('currentPayment', JSON.stringify({
        paymentId,
        orderId,
        inquiryId,
        bidId,
        initiatedAt: new Date().toISOString()
      }));

      // Redirect to PayHere checkout
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  const fetchPaymentPreview = async () => {
    try {
      // Fetch the inquiry details which contains the awarded bid information
      const response = await api.get(`/dmc/inquiries/${inquiryId}`);
      const inquiry = response.data;
      
      console.log('Inquiry response:', inquiry);

      // Check if this inquiry has an awarded bid
      if (!inquiry.awardedBidId || inquiry.awardedBidId !== bidId) {
        toast.error('This bid has not been awarded yet or bid mismatch');
        navigate('/dmc/dashboard');
        return;
      }

      // Get amount and currency from URL params or use inquiry data
      const amount = searchParams.get('amount');
      const currency = searchParams.get('currency') || inquiry.currency || 'USD';

      // Calculate price per room per night
      const totalAmount = parseFloat(amount) || 0;
      const numberOfRooms = inquiry.numberOfRooms || 1;
      const numberOfNights = inquiry.numberOfNights || 1;
      const pricePerRoom = numberOfRooms > 0 && numberOfNights > 0 
        ? totalAmount / (numberOfRooms * numberOfNights) 
        : 0;

      setPaymentDetails({
        inquiryTitle: inquiry.title || 'N/A',
        hotelName: inquiry.awardedHotelName || 'N/A',
        totalAmount: totalAmount,
        currency: currency,
        numberOfRooms: numberOfRooms,
        numberOfNights: numberOfNights,
        pricePerRoom: pricePerRoom
      });
    } catch (error) {
      console.error('Error fetching payment preview:', error);
      toast.error('Failed to load payment details');
      
      // Try to use URL params as fallback
      const amount = parseFloat(searchParams.get('amount')) || 0;
      const currency = searchParams.get('currency') || 'USD';
      
      setPaymentDetails({
        inquiryTitle: 'Payment Required',
        hotelName: 'N/A',
        totalAmount: amount,
        currency: currency,
        numberOfRooms: 1,
        numberOfNights: 1,
        pricePerRoom: amount
      });
    }
  };

  useEffect(() => {
    if (inquiryId && bidId) {
      fetchPaymentPreview();
    }
  }, [inquiryId, bidId]);

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const platformCommission = (paymentDetails.totalAmount || 0) * 0.05;
  const hotelPayout = (paymentDetails.totalAmount || 0) * 0.95;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600">
            You have awarded the bid. Please complete the payment to confirm the booking.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-yellow-600 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Time remaining to complete payment
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatTime(countdown)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Payment Summary
            </h2>
          </div>

          <div className="p-6">
            {/* Booking Details */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
                Booking Details
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inquiry:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.inquiryTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hotel:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.hotelName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rooms:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.numberOfRooms} rooms × {paymentDetails.numberOfNights} nights
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per room/night:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.currency} {(paymentDetails.pricePerRoom || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
                Payment Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bid Amount:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.currency} {(paymentDetails.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform Commission (5%):</span>
                  <span className="text-gray-700">
                    {paymentDetails.currency} {(platformCommission || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Hotel Payout (95%):</span>
                  <span className="text-gray-700">
                    {paymentDetails.currency} {(hotelPayout || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount to Pay:
                </span>
                <span className="text-2xl font-bold text-cyan-600">
                  {paymentDetails.currency} {(paymentDetails.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Information:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>You will be redirected to PayHere payment gateway</li>
                <li>Payment must be completed within 15 minutes</li>
                <li>Your booking will be confirmed once payment is successful</li>
                <li>Hotel will receive 95% of the payment amount after admin approval</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dmc/dashboard')}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleInitiatePayment}
            disabled={loading || countdown === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Security Badge */}
        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
          Secure payment powered by PayHere
        </div>
      </div>
    </div>
  );
};

export default PaymentInitiation;
