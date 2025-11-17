import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Eye,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { getAvailableInquiries } from '../services/bidInquiryService';
import {
  formatDate,
  formatPrice,
  getTimeRemaining,
  isDeadlineApproaching,
  truncateText,
  getRoomTypeLabel,
  getMealPlanLabel
} from '../utils/bidInquiryUtils';

const HotelInquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const pageSize = 9;

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, cityFilter]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const response = await getAvailableInquiries(cityFilter || null, currentPage, pageSize);
      setInquiries(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load available inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchInquiries();
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setCityFilter('');
    setCurrentPage(0);
    fetchInquiries();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              onClick={() => navigate('/hotel/dashboard')}
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Back to Dashboard
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Bid Inquiries</h1>
              <p className="text-gray-600">Browse and submit bids for available inquiries from DMCs</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by keyword</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search inquiries..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="md:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by city</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                <option value="Colombo">Colombo</option>
                <option value="Kandy">Kandy</option>
                <option value="Galle">Galle</option>
                <option value="Negombo">Negombo</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Ella">Ella</option>
                <option value="Sigiriya">Sigiriya</option>
                <option value="Bentota">Bentota</option>
                <option value="Mirissa">Mirissa</option>
                <option value="Trincomalee">Trincomalee</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors h-10"
              >
                Search
              </button>
              {(searchKeyword || cityFilter) && (
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors h-10"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          /* Empty State (Modified) */
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            {!cityFilter ? (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a destination to get started</h3>
                <p className="text-gray-600">
                  Please choose a city from the filter above to view available inquiries.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries available</h3>
                <p className="text-gray-600">
                  {searchKeyword
                    ? 'Try adjusting your search keyword or clear filters.'
                    : 'No active inquiries found for this destination. Check back later!'}
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Inquiries Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {inquiries.map(inquiry => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index)}
                      className={`w-10 h-10 rounded-lg transition-colors ${
                        currentPage === index
                          ? 'bg-cyan-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Inquiry Card Component
const InquiryCard = ({ inquiry }) => {
  const navigate = useNavigate();
  const timeRemaining = getTimeRemaining(inquiry.deadline);
  const isExpiring = isDeadlineApproaching(inquiry.deadline);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{inquiry.title}</h3>
        <p className="text-gray-600 text-sm">{truncateText(inquiry.description, 100)}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Destination Cities */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            Destinations
          </label>
          <div className="flex flex-wrap gap-1">
            {inquiry.destinationCities?.slice(0, 3).map(city => (
              <span key={city} className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-xs">
                {city}
              </span>
            ))}
            {inquiry.destinationCities?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{inquiry.destinationCities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Travel Dates */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
            <Calendar className="w-4 h-4 mr-1" />
            Travel Dates
          </label>
          <p className="text-sm text-gray-900">
            {formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}
          </p>
          <p className="text-xs text-gray-500">{inquiry.numberOfNights} nights</p>
        </div>

        {/* Guests */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
            <Users className="w-4 h-4 mr-1" />
            Guests
          </label>
          <p className="text-sm text-gray-900">
            {inquiry.numberOfRooms} Rooms • {inquiry.numberOfAdults} Adults • {inquiry.numberOfChildren} Children
          </p>
        </div>

        {/* Budget */}
        {inquiry.budgetMin && inquiry.budgetMax && (
          <div>
            <label className="flex items-center text-sm font-medium text-gray-600 mb-1">
              <DollarSign className="w-4 h-4 mr-1" />
              Budget Range (Per Room/Night)
            </label>
            <p className="text-lg font-bold text-cyan-600">
              {formatPrice(inquiry.budgetMin, inquiry.currency)} - {formatPrice(inquiry.budgetMax, inquiry.currency)}
            </p>
          </div>
        )}

        {/* Room Types */}
        {inquiry.preferredRoomTypes?.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Preferred Room Types</label>
            <div className="flex flex-wrap gap-1">
              {inquiry.preferredRoomTypes.slice(0, 2).map(type => (
                <span key={type} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {getRoomTypeLabel(type)}
                </span>
              ))}
              {inquiry.preferredRoomTypes.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{inquiry.preferredRoomTypes.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Meal Plans */}
        {inquiry.preferredMealPlans?.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-600 mb-1 block">Preferred Meal Plans</label>
            <div className="flex flex-wrap gap-1">
              {inquiry.preferredMealPlans.slice(0, 2).map(plan => (
                <span key={plan} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {getMealPlanLabel(plan)}
                </span>
              ))}
              {inquiry.preferredMealPlans.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  +{inquiry.preferredMealPlans.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        {isExpiring && (
          <div className="mb-3 flex items-center text-red-600 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Deadline approaching soon!
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {inquiry.viewCount || 0}
            </span>
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {inquiry.bidCount || 0} bids
            </span>
          </div>
          
          <div className={`flex items-center text-sm font-medium ${isExpiring ? 'text-red-600' : 'text-cyan-600'}`}>
            <Clock className="w-4 h-4 mr-1" />
            {timeRemaining}
          </div>
        </div>

        <button
          onClick={() => navigate(`/hotel/inquiries/${inquiry.id}/bid`)}
          className="w-full flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
        >
          View Details & Submit Bid
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default HotelInquiriesPage;
