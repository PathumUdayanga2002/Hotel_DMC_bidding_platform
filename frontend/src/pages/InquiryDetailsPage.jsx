import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Home,
  Utensils,
  DollarSign,
  Clock,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  Ban,
  Award,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import {
  getInquiryById,
  getBidsForInquiry,
  closeInquiry,
  cancelInquiry,
  awardBid
} from '../services/bidInquiryService';
import {
  BID_INQUIRY_STATUS,
  BID_STATUS,
  formatDate,
  formatDateTime,
  formatPrice,
  getStatusColor,
  getStatusLabel,
  getTimeRemaining,
  getRoomTypeLabel,
  getMealPlanLabel,
  calculateTotalPrice,
  isDeadlinePassed
} from '../utils/bidInquiryUtils';

const InquiryDetailsPage = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);

  useEffect(() => {
    fetchInquiryDetails();
    fetchBids();
  }, [inquiryId]);

  const fetchInquiryDetails = async () => {
    try {
      const response = await getInquiryById(inquiryId);
      setInquiry(response);
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      toast.error('Failed to load inquiry details');
      navigate('/dmc/inquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await getBidsForInquiry(inquiryId, 0, 50);
      setBids(response.content || []);
    } catch (error) {
      console.error('Error fetching bids:', error);
    }
  };

  const handleCloseInquiry = async () => {
    setActionLoading(true);
    try {
      await closeInquiry(inquiryId);
      toast.success('Inquiry closed successfully');
      fetchInquiryDetails();
      setShowConfirmModal(null);
    } catch (error) {
      console.error('Error closing inquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to close inquiry');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelInquiry = async () => {
    setActionLoading(true);
    try {
      await cancelInquiry(inquiryId);
      toast.success('Inquiry cancelled successfully');
      fetchInquiryDetails();
      setShowConfirmModal(null);
    } catch (error) {
      console.error('Error cancelling inquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel inquiry');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAwardBid = async (bidId) => {
    setActionLoading(true);
    try {
      const response = await awardBid(inquiryId, bidId);
      toast.success('Bid awarded successfully! Redirecting to payment...');
      
      console.log('Award bid response:', response); // Debug log
      
      // Backend returns AwardBidResponse with payment info
      if (response?.inquiryId && response?.bidId) {
        // Redirect to payment initiation page with payment details
        setTimeout(() => {
          navigate(`/payment/initiate?inquiryId=${response.inquiryId}&bidId=${response.bidId}&amount=${response.bidAmount}&currency=${response.currency || 'USD'}`);
        }, 1500);
      } else {
        // If no payment info, just refresh the page
        fetchInquiryDetails();
        fetchBids();
      }
      
      setShowConfirmModal(null);
      setSelectedBid(null);
    } catch (error) {
      console.error('Error awarding bid:', error);
      toast.error(error.response?.data?.message || 'Failed to award bid');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
      </div>
    );
  }

  if (!inquiry) return null;

  const timeRemaining = getTimeRemaining(inquiry.deadline);
  const deadlinePassed = isDeadlinePassed(inquiry.deadline);
  const canTakeAction = inquiry.status === BID_INQUIRY_STATUS.OPEN && !deadlinePassed;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dmc/inquiries')}
            className="flex items-center text-cyan-600 hover:text-cyan-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Inquiries
          </button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{inquiry.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(inquiry.status)}`}>
                  {getStatusLabel(inquiry.status)}
                </span>
              </div>
              <p className="text-gray-600">Posted on {formatDateTime(inquiry.postedAt)}</p>
            </div>

            {/* Action Buttons */}
            {canTakeAction && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowConfirmModal('close')}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Close Inquiry
                </button>
                <button
                  onClick={() => setShowConfirmModal('cancel')}
                  className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Inquiry
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inquiry Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Inquiry Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                  <p className="text-gray-900">{inquiry.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Destination Cities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.destinationCities?.map(city => (
                        <span key={city} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Travel Dates
                    </label>
                    <p className="text-gray-900">
                      {formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}
                    </p>
                    <p className="text-sm text-gray-600">{inquiry.numberOfNights} nights</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <Users className="w-4 h-4 inline mr-1" />
                      Guests
                    </label>
                    <p className="text-gray-900">
                      {inquiry.numberOfAdults} Adults, {inquiry.numberOfChildren} Children
                    </p>
                    <p className="text-sm text-gray-600">{inquiry.numberOfRooms} Rooms</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Budget (Per Room/Night)
                    </label>
                    <p className="text-gray-900">
                      {inquiry.budgetMin && inquiry.budgetMax
                        ? `${formatPrice(inquiry.budgetMin, inquiry.currency)} - ${formatPrice(inquiry.budgetMax, inquiry.currency)}`
                        : 'Flexible'}
                    </p>
                  </div>
                </div>

                {inquiry.preferredRoomTypes?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <Home className="w-4 h-4 inline mr-1" />
                      Preferred Room Types
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.preferredRoomTypes.map(type => (
                        <span key={type} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {getRoomTypeLabel(type)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {inquiry.preferredMealPlans?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <Utensils className="w-4 h-4 inline mr-1" />
                      Preferred Meal Plans
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {inquiry.preferredMealPlans.map(plan => (
                        <span key={plan} className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          {getMealPlanLabel(plan)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {inquiry.specialRequirements && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Special Requirements</label>
                    <p className="text-gray-900">{inquiry.specialRequirements}</p>
                  </div>
                )}

                {inquiry.specialNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Special Notes</label>
                    <p className="text-gray-900">{inquiry.specialNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bids Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Received Bids ({bids.length})
                </h2>
              </div>

              {bids.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No bids received yet</p>
                  <p className="text-sm text-gray-500 mt-2">Hotels will be able to submit bids until the deadline</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.map(bid => (
                    <BidCard
                      key={bid.id}
                      bid={bid}
                      inquiry={inquiry}
                      canTakeAction={canTakeAction}
                      onAward={() => {
                        setSelectedBid(bid);
                        setShowConfirmModal('award');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deadline Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-cyan-600" />
                Deadline
              </h3>
              <div className={`text-center p-4 rounded-lg ${
                deadlinePassed ? 'bg-red-50' : 'bg-cyan-50'
              }`}>
                <p className={`text-2xl font-bold ${
                  deadlinePassed ? 'text-red-600' : 'text-cyan-600'
                }`}>
                  {timeRemaining}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {formatDateTime(inquiry.deadline)}
                </p>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Views
                  </span>
                  <span className="font-semibold text-gray-900">{inquiry.viewCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Total Bids
                  </span>
                  <span className="font-semibold text-gray-900">{inquiry.bidCount || 0}</span>
                </div>
                {inquiry.status === BID_INQUIRY_STATUS.AWARDED && inquiry.awardedBidId && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Awarded
                    </span>
                    <span className="font-semibold text-green-600">Yes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Card */}
            {deadlinePassed && inquiry.status === BID_INQUIRY_STATUS.OPEN && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Deadline Passed</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The bidding deadline has passed. Close the inquiry or award a bid.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showConfirmModal && (
        <ConfirmModal
          type={showConfirmModal}
          onConfirm={() => {
            if (showConfirmModal === 'close') handleCloseInquiry();
            else if (showConfirmModal === 'cancel') handleCancelInquiry();
            else if (showConfirmModal === 'award') handleAwardBid(selectedBid.id);
          }}
          onCancel={() => {
            setShowConfirmModal(null);
            setSelectedBid(null);
          }}
          loading={actionLoading}
          bid={selectedBid}
        />
      )}
    </div>
  );
};

// Bid Card Component
const BidCard = ({ bid, inquiry, canTakeAction, onAward }) => {
  const totalPrice = calculateTotalPrice(
    bid.pricePerRoomPerNight,
    inquiry.numberOfRooms,
    inquiry.numberOfNights
  );

  const isAwarded = inquiry.awardedBidId === bid.id;

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-all ${
      isAwarded ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900">{bid.hotelName}</h4>
          <p className="text-sm text-gray-600">{bid.hotelCity} • {bid.hotelAddress}</p>
        </div>
        {isAwarded && (
          <span className="flex items-center px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
            <Award className="w-3 h-3 mr-1" />
            Awarded
          </span>
        )}
        {!isAwarded && (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bid.status)}`}>
            {getStatusLabel(bid.status)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-600">Price per Room/Night</label>
          <p className="text-lg font-bold text-cyan-600">
            {formatPrice(bid.pricePerRoomPerNight, bid.currency)}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-600">Total Price</label>
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(totalPrice, bid.currency)}
          </p>
        </div>
        <div>
          <label className="text-xs text-gray-600">Room Type</label>
          <p className="text-sm font-medium text-gray-900">{getRoomTypeLabel(bid.roomType)}</p>
        </div>
        <div>
          <label className="text-xs text-gray-600">Meal Plan</label>
          <p className="text-sm font-medium text-gray-900">{getMealPlanLabel(bid.mealPlan)}</p>
        </div>
      </div>

      {bid.specialOffer && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Special Offer:</strong> {bid.specialOffer}
          </p>
        </div>
      )}

      {bid.bidDescription && (
        <p className="text-sm text-gray-600 mb-3">{bid.bidDescription}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-xs text-gray-500">
          Submitted {formatDateTime(bid.submittedAt)}
        </span>
        
        {canTakeAction && bid.status === BID_STATUS.PENDING && !isAwarded && (
          <button
            onClick={onAward}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Award className="w-4 h-4 mr-2" />
            Award This Bid
          </button>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmModal = ({ type, onConfirm, onCancel, loading, bid }) => {
  const config = {
    close: {
      title: 'Close Inquiry',
      message: 'Are you sure you want to close this inquiry? No more bids will be accepted.',
      confirmText: 'Close Inquiry',
      confirmClass: 'bg-gray-600 hover:bg-gray-700'
    },
    cancel: {
      title: 'Cancel Inquiry',
      message: 'Are you sure you want to cancel this inquiry? This action cannot be undone.',
      confirmText: 'Cancel Inquiry',
      confirmClass: 'bg-red-600 hover:bg-red-700'
    },
    award: {
      title: 'Award Bid',
      message: bid ? `Are you sure you want to award this bid to ${bid.hotelName}? The hotel will be notified and the inquiry will be closed.` : '',
      confirmText: 'Award Bid',
      confirmClass: 'bg-green-600 hover:bg-green-700'
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{currentConfig.title}</h3>
        <p className="text-gray-600 mb-6">{currentConfig.message}</p>
        
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center ${currentConfig.confirmClass}`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              currentConfig.confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailsPage;
