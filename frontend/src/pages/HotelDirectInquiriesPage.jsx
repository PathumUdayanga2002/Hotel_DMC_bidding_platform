import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  FileText,
  Mail,
  Building2,
  Clock,
  Phone,
  User,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { hotelService } from '../services/hotelService';
import {
  formatDate,
  formatPrice,
  getRoomTypeLabel,
  getMealPlanLabel
} from '../utils/bidInquiryUtils';

const HotelDirectInquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    fetchDirectInquiries();
  }, []);

  const fetchDirectInquiries = async () => {
    setLoading(true);
    try {
      const response = await hotelService.getDirectInquiries();
      if (response.data && response.data.success) {
        setInquiries(response.data.data || []);
      } else {
        toast.error('Failed to load direct inquiries');
      }
    } catch (error) {
      console.error('Error fetching direct inquiries:', error);
      toast.error('Failed to load direct inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status?.toLowerCase() === filter;
  });

  const handleConfirmClick = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowConfirmModal(true);
  };

  const handleConfirmInquiry = async () => {
    if (!selectedInquiry) return;

    setConfirming(true);
    try {
      const response = await hotelService.confirmDirectInquiry(selectedInquiry.id);
      if (response.data && response.data.success) {
        toast.success('Inquiry confirmed successfully!');
        setShowConfirmModal(false);
        setSelectedInquiry(null);
        // Refresh the inquiries list
        fetchDirectInquiries();
      } else {
        toast.error('Failed to confirm inquiry');
      }
    } catch (error) {
      console.error('Error confirming inquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to confirm inquiry');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Direct Inquiries</h1>
          <p className="text-gray-600">Inquiries sent directly to your hotel by DMCs</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({inquiries.length})
            </button>
            <button
              onClick={() => setFilter('sent')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'sent'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({inquiries.filter(i => i.status === 'SENT').length})
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'confirmed'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmed ({inquiries.filter(i => i.status === 'CONFIRMED').length})
            </button>
            <button
              onClick={() => setFilter('reviewed')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'reviewed'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reviewed ({inquiries.filter(i => i.status === 'REVIEWED').length})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
          </div>
        ) : filteredInquiries.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No direct inquiries found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'You have not received any direct inquiries from DMCs yet.'
                : `No ${filter} inquiries found.`}
            </p>
          </div>
        ) : (
          /* Inquiries Grid */
          <div className="grid grid-cols-1 gap-6">
            {filteredInquiries.map(inquiry => (
              <DirectInquiryCard 
                key={inquiry.id} 
                inquiry={inquiry} 
                onConfirmClick={handleConfirmClick}
              />
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Confirm Inquiry</h3>
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={confirming}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{selectedInquiry.title}</h4>
                    <p className="text-sm text-gray-600">{selectedInquiry.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-cyan-600" />
                      <span>{formatDate(selectedInquiry.checkInDate)} - {formatDate(selectedInquiry.checkOutDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Users className="w-4 h-4 mr-2 text-cyan-600" />
                      <span>{selectedInquiry.numberOfRooms} Room(s) • {selectedInquiry.numberOfAdults} Adult(s)</span>
                    </div>
                    {selectedInquiry.budgetMin && selectedInquiry.budgetMax && (
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="w-4 h-4 mr-2 text-cyan-600" />
                        <span>{formatPrice(selectedInquiry.budgetMin, selectedInquiry.currency)} - {formatPrice(selectedInquiry.budgetMax, selectedInquiry.currency)}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> By confirming this inquiry, you acknowledge that you have received it and will provide a response to the DMC.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={confirming}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInquiry}
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center justify-center"
                    disabled={confirming}
                  >
                    {confirming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Inquiry
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Direct Inquiry Card Component
const DirectInquiryCard = ({ inquiry, onConfirmClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SENT':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'REVIEWED':
        return 'bg-purple-100 text-purple-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{inquiry.title}</h3>
            <p className="text-cyan-50 text-sm">{inquiry.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(inquiry.status)}`}>
            {inquiry.status || 'SENT'}
          </span>
        </div>
        <div className="mt-4 flex items-center text-cyan-50 text-sm">
          <Clock className="w-4 h-4 mr-2" />
          Sent on {formatDate(inquiry.createdAt)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Destination */}
            {inquiry.destinationCities && inquiry.destinationCities.length > 0 && (
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-cyan-600" />
                  Destination Cities
                </label>
                <div className="flex flex-wrap gap-2">
                  {inquiry.destinationCities.map(city => (
                    <span key={city} className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-medium">
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Country */}
            {inquiry.country && (
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-cyan-600" />
                  Country
                </label>
                <p className="text-gray-900 font-medium">{inquiry.country}</p>
              </div>
            )}

            {/* Travel Dates */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
                Travel Dates
              </label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900 font-medium">
                  {formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {calculateNights(inquiry.checkInDate, inquiry.checkOutDate)} nights
                </p>
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Users className="w-5 h-5 mr-2 text-cyan-600" />
                Guest Information
              </label>
              <div className="bg-gray-50 p-3 rounded-lg space-y-1">
                <p className="text-gray-900">
                  <span className="font-medium">{inquiry.numberOfRooms}</span> Room{inquiry.numberOfRooms > 1 ? 's' : ''}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">{inquiry.numberOfAdults}</span> Adult{inquiry.numberOfAdults > 1 ? 's' : ''}
                </p>
                <p className="text-gray-900">
                  <span className="font-medium">{inquiry.numberOfChildren}</span> Child{inquiry.numberOfChildren !== 1 ? 'ren' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Budget */}
            {inquiry.budgetMin && inquiry.budgetMax && (
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-5 h-5 mr-2 text-cyan-600" />
                  Budget Range (Per Room/Night)
                </label>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-700">
                    {formatPrice(inquiry.budgetMin, inquiry.currency)} - {formatPrice(inquiry.budgetMax, inquiry.currency)}
                  </p>
                </div>
              </div>
            )}

            {/* Room Types */}
            {inquiry.preferredRoomTypes && inquiry.preferredRoomTypes.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Preferred Room Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {inquiry.preferredRoomTypes.map(type => (
                    <span key={type} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                      {getRoomTypeLabel(type)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Meal Plans */}
            {inquiry.preferredMealPlans && inquiry.preferredMealPlans.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Preferred Meal Plans
                </label>
                <div className="flex flex-wrap gap-2">
                  {inquiry.preferredMealPlans.map(plan => (
                    <span key={plan} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium">
                      {getMealPlanLabel(plan)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Special Requirements */}
            {inquiry.specialRequirements && (
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <AlertCircle className="w-5 h-5 mr-2 text-cyan-600" />
                  Special Requirements
                </label>
                <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  {inquiry.specialRequirements}
                </p>
              </div>
            )}

            {/* Special Notes */}
            {inquiry.specialNotes && (
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-5 h-5 mr-2 text-cyan-600" />
                  Additional Notes
                </label>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {inquiry.specialNotes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 pt-6 border-t">
          {inquiry.status?.toUpperCase() === 'CONFIRMED' ? (
            <div className="flex-1 px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Inquiry Confirmed
            </div>
          ) : (
            <button 
              onClick={() => onConfirmClick(inquiry)}
              className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold flex items-center justify-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm Inquiry
            </button>
          )}
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelDirectInquiriesPage;
