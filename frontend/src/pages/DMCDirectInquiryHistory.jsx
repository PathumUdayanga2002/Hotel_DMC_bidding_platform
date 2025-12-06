import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Loader2,
  FileText,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Mail,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { directInquiryService } from '../services/directInquiryService';
import {
  formatDate,
  formatPrice,
  getRoomTypeLabel,
  getMealPlanLabel
} from '../utils/bidInquiryUtils';

const DMCDirectInquiryHistory = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, sent, confirmed, rejected, reviewed
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await directInquiryService.getMyDirectInquiries();
      if (response.data && response.data.success) {
        setInquiries(response.data.data || []);
      } else {
        toast.error('Failed to load inquiry history');
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiry history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await directInquiryService.deleteDirectInquiry(inquiryId);
      if (response.data && response.data.success) {
        toast.success('Inquiry deleted successfully');
        fetchInquiries();
      } else {
        toast.error('Failed to delete inquiry');
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    } finally {
      setDeleting(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    if (filter === 'all') return true;
    return inquiry.status?.toLowerCase() === filter;
  });

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SENT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REVIEWED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'SENT':
        return <Mail className="w-4 h-4" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-4 h-4" />;
      case 'REVIEWED':
        return <Eye className="w-4 h-4" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Direct Inquiry History</h1>
              <p className="text-gray-600">View and manage your direct inquiries sent to hotels</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/dmc/direct-inquiries')}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Inquiry</span>
              </button>
              <button
                onClick={() => navigate('/dmc/dashboard')}
                className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            </div>
          </div>
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
              Sent ({inquiries.filter(i => i.status === 'SENT').length})
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
            <button
              onClick={() => setFilter('rejected')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filter === 'rejected'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({inquiries.filter(i => i.status === 'REJECTED').length})
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
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'You have not created any direct inquiries yet.'
                : `No ${filter} inquiries found.`}
            </p>
          </div>
        ) : (
          /* Inquiries Grid */
          <div className="grid grid-cols-1 gap-6">
            {filteredInquiries.map(inquiry => (
              <InquiryCard
                key={inquiry.id}
                inquiry={inquiry}
                onViewDetails={(inq) => {
                  setSelectedInquiry(inq);
                  setShowDetailsModal(true);
                }}
                onDelete={handleDelete}
                deleting={deleting}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedInquiry && (
          <DetailsModal
            inquiry={selectedInquiry}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedInquiry(null);
            }}
            getStatusColor={getStatusColor}
          />
        )}
      </div>
    </div>
  );
};

// Inquiry Card Component
const InquiryCard = ({ inquiry, onViewDetails, onDelete, deleting, getStatusColor, getStatusIcon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{inquiry.title}</h3>
            <p className="text-cyan-50 text-sm line-clamp-2">{inquiry.description}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(inquiry.status)}`}>
            {getStatusIcon(inquiry.status)}
            {inquiry.status || 'SENT'}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between text-cyan-50 text-sm">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Sent on {formatDate(inquiry.createdAt)}
          </div>
          <div className="flex items-center">
            <Building2 className="w-4 h-4 mr-2" />
            Sent to {inquiry.hotelIds?.length || 0} hotel(s)
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dates */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 mr-2 text-cyan-600" />
              Travel Dates
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 text-sm">
                {formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}
              </p>
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 mr-2 text-cyan-600" />
              Guests
            </label>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-900 text-sm">
                {inquiry.numberOfRooms} Room(s), {inquiry.numberOfAdults} Adult(s)
              </p>
            </div>
          </div>

          {/* Budget */}
          {inquiry.budgetMin && inquiry.budgetMax && (
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 mr-2 text-cyan-600" />
                Budget Range
              </label>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-900 text-sm font-semibold">
                  {formatPrice(inquiry.budgetMin, inquiry.currency)} - {formatPrice(inquiry.budgetMax, inquiry.currency)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3 pt-6 border-t">
          <button
            onClick={() => onViewDetails(inquiry)}
            className="flex-1 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold flex items-center justify-center"
          >
            <Eye className="w-5 h-5 mr-2" />
            View Details
          </button>
          <button
            onClick={() => onDelete(inquiry.id)}
            disabled={deleting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center disabled:opacity-50"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Details Modal Component
const DetailsModal = ({ inquiry, onClose, getStatusColor }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full my-8">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Inquiry Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Title and Description */}
          <div className="mb-6">
            <h4 className="text-xl font-bold text-gray-900 mb-2">{inquiry.title}</h4>
            <p className="text-gray-700">{inquiry.description}</p>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border mt-3 ${getStatusColor(inquiry.status)}`}>
              Status: {inquiry.status || 'SENT'}
            </span>
          </div>

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

              {/* Travel Dates */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
                  Travel Dates
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-900">
                    {formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}
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
                  <p className="text-gray-900">Rooms: {inquiry.numberOfRooms}</p>
                  <p className="text-gray-900">Adults: {inquiry.numberOfAdults}</p>
                  <p className="text-gray-900">Children: {inquiry.numberOfChildren}</p>
                </div>
              </div>

              {/* Hotels Sent To */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-5 h-5 mr-2 text-cyan-600" />
                  Hotels
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-900">Sent to {inquiry.hotelIds?.length || 0} hotel(s)</p>
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
                    <p className="text-xl font-bold text-green-700">
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
        </div>

        <div className="p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DMCDirectInquiryHistory;
