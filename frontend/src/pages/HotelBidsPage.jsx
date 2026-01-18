import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye
} from 'lucide-react';
import { getMyBids, withdrawBid, getHotelStats } from '../services/bidInquiryService';
import {
  BID_STATUS,
  formatDate,
  formatDateTime,
  formatPrice,
  getStatusColor,
  getStatusLabel,
  getRoomTypeLabel,
  getMealPlanLabel,
  calculateTotalPrice,
  calculateWinRate
} from '../utils/bidInquiryUtils';

const HotelBidsPage = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;

  useEffect(() => {
    fetchBids();
    fetchStats();
  }, [currentPage, activeTab]);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const statusFilter = activeTab === 'ALL' ? null : activeTab;
      const response = await getMyBids(currentPage, pageSize, statusFilter);
      setBids(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast.error('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getHotelStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleWithdrawBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to withdraw this bid?')) {
      return;
    }

    try {
      await withdrawBid(bidId);
      toast.success('Bid withdrawn successfully');
      fetchBids();
      fetchStats();
    } catch (error) {
      console.error('Error withdrawing bid:', error);
      toast.error(error.response?.data?.message || 'Failed to withdraw bid');
    }
  };

  const handleSearch = async () => {
    // Implementation for search would go here
    toast.info('Search functionality coming soon');
  };

  const tabs = [
    { key: 'ALL', label: 'All Bids', count: stats?.totalBids || 0 },
    { key: BID_STATUS.PENDING, label: 'Pending', count: stats?.pendingBids || 0 },
    { key: BID_STATUS.ACCEPTED, label: 'Accepted', count: stats?.acceptedBids || 0 },
    { key: BID_STATUS.REJECTED, label: 'Rejected', count: stats?.rejectedBids || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bids</h1>
          <p className="text-gray-600">Track and manage all your submitted bids</p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={<FileText className="w-6 h-6" />}
              label="Total Bids"
              value={stats.totalBids || 0}
              color="cyan"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Pending"
              value={stats.pendingBids || 0}
              color="yellow"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              label="Accepted"
              value={stats.acceptedBids || 0}
              color="green"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Win Rate"
              value={`${calculateWinRate(stats.acceptedBids, stats.totalBids)}%`}
              color="purple"
            />
          </div>
        )}

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex space-x-1">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setCurrentPage(0);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search bids..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Bids List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
            </div>
          ) : bids.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bids found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'ALL'
                  ? "You haven't submitted any bids yet"
                  : `No ${activeTab.toLowerCase()} bids`}
              </p>
              <button
                onClick={() => navigate('/hotel/inquiries')}
                className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Browse Available Inquiries
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {bids.map(bid => (
                <BidRow
                  key={bid.id}
                  bid={bid}
                  onWithdraw={handleWithdrawBid}
                  onViewDetails={() => navigate(`/hotel/inquiries/${bid.inquiryId}`)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 px-6 py-4 border-t">
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
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    cyan: 'bg-cyan-100 text-cyan-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Bid Row Component
const BidRow = ({ bid, onWithdraw, onViewDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate total price if we have inquiry details
  const totalPrice = bid.inquiryRooms && bid.inquiryNights
    ? calculateTotalPrice(bid.pricePerRoomPerNight, bid.inquiryRooms, bid.inquiryNights)
    : null;

  const canWithdraw = bid.status === BID_STATUS.PENDING;

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            {/* Status Icon */}
            <div className={`p-2 rounded-lg mt-1 ${
              bid.status === BID_STATUS.ACCEPTED ? 'bg-green-100' :
              bid.status === BID_STATUS.REJECTED ? 'bg-red-100' :
              bid.status === BID_STATUS.WITHDRAWN ? 'bg-gray-100' :
              'bg-yellow-100'
            }`}>
              {bid.status === BID_STATUS.ACCEPTED ? (
                <Award className="w-5 h-5 text-green-600" />
              ) : bid.status === BID_STATUS.REJECTED ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className="w-5 h-5 text-yellow-600" />
              )}
            </div>

            {/* Bid Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {bid.inquiryTitle || 'Untitled Inquiry'}
                  </h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    {bid.inquiryCities && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {Array.isArray(bid.inquiryCities) 
                          ? bid.inquiryCities.slice(0, 2).join(', ')
                          : bid.inquiryCities}
                        {Array.isArray(bid.inquiryCities) && bid.inquiryCities.length > 2 && (
                          <span className="ml-1">+{bid.inquiryCities.length - 2}</span>
                        )}
                      </span>
                    )}
                    {bid.inquiryCheckIn && bid.inquiryCheckOut && (
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(bid.inquiryCheckIn)} - {formatDate(bid.inquiryCheckOut)}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(bid.status)}`}>
                  {getStatusLabel(bid.status)}
                </span>
              </div>

              {/* Bid Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <label className="text-xs text-gray-600">Your Bid (per room/night)</label>
                  <p className="text-lg font-bold text-cyan-600">
                    {formatPrice(bid.pricePerRoomPerNight, bid.currency)}
                  </p>
                </div>
                {totalPrice && (
                  <div>
                    <label className="text-xs text-gray-600">Total Bid Value</label>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(totalPrice, bid.currency)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-gray-600">Room Type</label>
                  <p className="text-sm font-medium text-gray-900">
                    {getRoomTypeLabel(bid.roomType)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Meal Plan</label>
                  <p className="text-sm font-medium text-gray-900">
                    {getMealPlanLabel(bid.mealPlan)}
                  </p>
                </div>
              </div>

              {/* Expandable Details */}
              {showDetails && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-2">
                  {bid.bidDescription && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">Description</label>
                      <p className="text-sm text-gray-900">{bid.bidDescription}</p>
                    </div>
                  )}
                  {bid.specialOffer && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">Special Offer</label>
                      <p className="text-sm text-gray-900">{bid.specialOffer}</p>
                    </div>
                  )}
                  {bid.amenities && bid.amenities.length > 0 && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">Amenities</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {bid.amenities.map(amenity => (
                          <span key={amenity} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {bid.availableFrom && bid.availableTo && (
                    <div>
                      <label className="text-xs font-medium text-gray-600">Availability</label>
                      <p className="text-sm text-gray-900">
                        {formatDate(bid.availableFrom)} - {formatDate(bid.availableTo)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Submitted {formatDateTime(bid.submittedAt)}</span>
                  {bid.openToNegotiation && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Open to negotiation
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-3 py-1 text-sm text-cyan-600 hover:bg-cyan-50 rounded transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {showDetails ? 'Hide' : 'Show'} Details
                  </button>
                  <button
                    onClick={onViewDetails}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                  >
                    View Inquiry
                  </button>
                  {canWithdraw && (
                    <button
                      onClick={() => onWithdraw(bid.id)}
                      className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBidsPage;
