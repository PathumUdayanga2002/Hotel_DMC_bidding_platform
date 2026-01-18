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
  AlertTriangle,
  Info,
  X,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import {
  getInquiryById,
  getBidsForInquiry,
  closeInquiry,
  cancelInquiry,
  awardBid,
  rejectBid
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
  const [rejectionReason, setRejectionReason] = useState('');
  const [showBidDetailsModal, setShowBidDetailsModal] = useState(false);
  const [bidDetailsData, setBidDetailsData] = useState(null);

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

  const handleRejectBid = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (rejectionReason.trim().length < 10) {
      toast.error('Rejection reason must be at least 10 characters');
      return;
    }

    setActionLoading(true);
    try {
      await rejectBid(inquiryId, selectedBid.id, rejectionReason);
      toast.success('Bid rejected successfully. Hotel has been notified via email.');
      fetchBids();
      setShowConfirmModal(null);
      setSelectedBid(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast.error(error.response?.data?.message || 'Failed to reject bid');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewBidDetails = (bid) => {
    setBidDetailsData(bid);
    setShowBidDetailsModal(true);
  };

  const handleCloseBidDetailsModal = () => {
    setShowBidDetailsModal(false);
    setBidDetailsData(null);
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
                      onReject={() => {
                        setSelectedBid(bid);
                        setRejectionReason('');
                        setShowConfirmModal('reject');
                      }}
                      onViewDetails={() => handleViewBidDetails(bid)}
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
            else if (showConfirmModal === 'reject') handleRejectBid();
          }}
          onCancel={() => {
            setShowConfirmModal(null);
            setSelectedBid(null);
            setRejectionReason('');
          }}
          loading={actionLoading}
          bid={selectedBid}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
        />
      )}

      {/* Bid Details Modal */}
      {showBidDetailsModal && bidDetailsData && (
        <BidDetailsModal
          bid={bidDetailsData}
          inquiry={inquiry}
          onClose={handleCloseBidDetailsModal}
          onAward={() => {
            handleCloseBidDetailsModal();
            setSelectedBid(bidDetailsData);
            setShowConfirmModal('award');
          }}
          onReject={() => {
            handleCloseBidDetailsModal();
            setSelectedBid(bidDetailsData);
            setRejectionReason('');
            setShowConfirmModal('reject');
          }}
          canTakeAction={canTakeAction}
        />
      )}
    </div>
  );
};

// Bid Card Component
const BidCard = ({ bid, inquiry, canTakeAction, onAward, onReject, onViewDetails }) => {
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
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            Submitted {formatDateTime(bid.submittedAt)}
          </span>
          <button
            onClick={onViewDetails}
            className="flex items-center px-3 py-1.5 text-cyan-600 border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-colors text-xs font-medium"
          >
            <Info className="w-3.5 h-3.5 mr-1.5" />
            See All Details
          </button>
        </div>
        
        {canTakeAction && bid.status === BID_STATUS.PENDING && !isAwarded && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onReject}
              className="flex items-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Bid
            </button>
            <button
              onClick={onAward}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Award className="w-4 h-4 mr-2" />
              Award This Bid
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmModal = ({ type, onConfirm, onCancel, loading, bid, rejectionReason, setRejectionReason }) => {
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
    },
    reject: {
      title: 'Reject Bid',
      message: bid ? `Are you sure you want to reject the bid from ${bid.hotelName}? The hotel will be notified via email and can submit an improved bid if the inquiry is still open.` : '',
      confirmText: 'Reject Bid',
      confirmClass: 'bg-red-600 hover:bg-red-700',
      requiresInput: true
    }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{currentConfig.title}</h3>
        <p className="text-gray-600 mb-6">{currentConfig.message}</p>
        
        {currentConfig.requiresInput && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a clear reason for rejection (min 10 characters)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows={4}
              disabled={loading}
            />
            {rejectionReason.length > 0 && rejectionReason.length < 10 && (
              <p className="text-red-500 text-xs mt-1">
                Minimum 10 characters required ({rejectionReason.length}/10)
              </p>
            )}
          </div>
        )}
        
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
            disabled={loading || (currentConfig.requiresInput && rejectionReason.trim().length < 10)}
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

// Bid Details Modal Component
const BidDetailsModal = ({ bid, inquiry, onClose, onAward, onReject, canTakeAction }) => {
  const totalPrice = calculateTotalPrice(
    bid.pricePerRoomPerNight,
    inquiry.numberOfRooms,
    inquiry.numberOfNights
  );

  const isAwarded = inquiry.awardedBidId === bid.id;
  const isPending = bid.status === BID_STATUS.PENDING;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{bid.bidTitle || 'Bid Details'}</h2>
            <p className="text-sm text-gray-600 mt-1">{bid.hotelName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center space-x-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(bid.status)}`}>
              {getStatusLabel(bid.status)}
            </span>
            {isAwarded && (
              <span className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold">
                <Award className="w-4 h-4 mr-2" />
                Awarded Bid
              </span>
            )}
          </div>

          {/* Hotel Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Building className="w-5 h-5 mr-2 text-cyan-600" />
              Hotel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide">Hotel Name</label>
                <p className="text-sm font-medium text-gray-900 mt-1">{bid.hotelName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide">Location</label>
                <p className="text-sm font-medium text-gray-900 mt-1 flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                  {bid.hotelCity}
                </p>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-600 uppercase tracking-wide">Address</label>
                <p className="text-sm font-medium text-gray-900 mt-1">{bid.hotelAddress}</p>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-cyan-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-cyan-600" />
              Pricing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide">Price per Room/Night</label>
                <p className="text-2xl font-bold text-cyan-600 mt-1">
                  {formatPrice(bid.pricePerRoomPerNight, bid.currency)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide">Total Price</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatPrice(totalPrice, bid.currency)}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide">Available Rooms</label>
                <p className="text-2xl font-bold text-gray-900 mt-1">{bid.availableRooms}</p>
              </div>
            </div>

            {(bid.discountPercentage || bid.discountAmount) && (
              <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-800">
                  💰 Discount Applied: {bid.discountPercentage ? `${bid.discountPercentage}%` : formatPrice(bid.discountAmount, bid.currency)}
                </p>
              </div>
            )}
          </div>

          {/* Room & Meal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="text-xs text-gray-600 uppercase tracking-wide flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Room Type
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-2">{getRoomTypeLabel(bid.roomType)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <label className="text-xs text-gray-600 uppercase tracking-wide flex items-center">
                <Utensils className="w-4 h-4 mr-1" />
                Meal Plan
              </label>
              <p className="text-lg font-semibold text-gray-900 mt-2">{getMealPlanLabel(bid.mealPlan)}</p>
            </div>
          </div>

          {/* Description */}
          {bid.bidDescription && (
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide block mb-2">Bid Description</label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-4 leading-relaxed">
                {bid.bidDescription}
              </p>
            </div>
          )}

          {/* Special Offer */}
          {bid.specialOffer && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <label className="text-xs text-yellow-800 uppercase tracking-wide font-semibold block mb-2">
                🎁 Special Offer
              </label>
              <p className="text-sm text-yellow-900 font-medium">{bid.specialOffer}</p>
            </div>
          )}

          {/* Amenities */}
          {bid.includedAmenities && bid.includedAmenities.length > 0 && (
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide block mb-2">Included Amenities</label>
              <div className="flex flex-wrap gap-2">
                {bid.includedAmenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1.5 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                    ✓ {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          {bid.termsAndConditions && (
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide block mb-2">Terms & Conditions</label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-4 leading-relaxed whitespace-pre-wrap">
                {bid.termsAndConditions}
              </p>
            </div>
          )}

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bid.validityDate && (
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Bid Valid Until</label>
                <p className="text-sm font-medium text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {formatDate(bid.validityDate)}
                </p>
              </div>
            )}
            {bid.openToNegotiation !== undefined && (
              <div>
                <label className="text-xs text-gray-600 uppercase tracking-wide block mb-1">Open to Negotiation</label>
                <p className="text-sm font-medium text-gray-900">
                  {bid.openToNegotiation ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Yes
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center">
                      <XCircle className="w-4 h-4 mr-2" />
                      No
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          {bid.additionalNotes && (
            <div>
              <label className="text-xs text-gray-600 uppercase tracking-wide block mb-2">Additional Notes</label>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-4 leading-relaxed">
                {bid.additionalNotes}
              </p>
            </div>
          )}

          {/* Negotiation Notes (if DMC added any) */}
          {bid.negotiationNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label className="text-xs text-blue-800 uppercase tracking-wide font-semibold block mb-2">
                DMC Negotiation Notes
              </label>
              <p className="text-sm text-blue-900">{bid.negotiationNotes}</p>
            </div>
          )}

          {/* Rejection Reason (if rejected) */}
          {bid.status === BID_STATUS.REJECTED && bid.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <label className="text-xs text-red-800 uppercase tracking-wide font-semibold block mb-2">
                Rejection Reason
              </label>
              <p className="text-sm text-red-900">{bid.rejectionReason}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div>
                <label className="uppercase tracking-wide block mb-1">Submitted At</label>
                <p className="text-gray-900 font-medium">{formatDateTime(bid.submittedAt)}</p>
              </div>
              {bid.updatedAt && bid.updatedAt !== bid.submittedAt && (
                <div>
                  <label className="uppercase tracking-wide block mb-1">Last Updated</label>
                  <p className="text-gray-900 font-medium">{formatDateTime(bid.updatedAt)}</p>
                </div>
              )}
              {bid.acceptedAt && (
                <div>
                  <label className="uppercase tracking-wide block mb-1">Accepted At</label>
                  <p className="text-green-700 font-medium">{formatDateTime(bid.acceptedAt)}</p>
                </div>
              )}
              {bid.rejectedAt && (
                <div>
                  <label className="uppercase tracking-wide block mb-1">Rejected At</label>
                  <p className="text-red-700 font-medium">{formatDateTime(bid.rejectedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        {canTakeAction && isPending && !isAwarded && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={onReject}
              className="flex items-center px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject Bid
            </button>
            <button
              onClick={onAward}
              className="flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Award className="w-4 h-4 mr-2" />
              Award This Bid
            </button>
          </div>
        )}

        {!canTakeAction || !isPending || isAwarded ? (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default InquiryDetailsPage;
