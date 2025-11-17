import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Ban,
  AlertCircle,
  Calendar,
  MapPin,
  DollarSign,
  Loader2
  ,ArrowLeft
} from 'lucide-react';
import { getMyInquiries, getDMCStats, searchInquiries } from '../services/bidInquiryService';
import {
  BID_INQUIRY_STATUS,
  formatDate,
  getStatusColor,
  getStatusLabel,
  getTimeRemaining,
  isDeadlineApproaching,
  formatPrice,
  truncateText,
  getBidCountLabel
} from '../utils/bidInquiryUtils';

const DMCInquiriesPage = () => {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchInquiries();
  }, [activeTab, pagination.page]);

  const fetchStats = async () => {
    try {
      const response = await getDMCStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'ALL' ? null : activeTab;
      const response = await getMyInquiries(pagination.page, pagination.size, status);
      
      setInquiries(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchInquiries();
      return;
    }

    setLoading(true);
    try {
      const response = await searchInquiries(searchKeyword, pagination.page, pagination.size);
      setInquiries(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error searching inquiries:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTabIcon = (tab) => {
    const icons = {
      ALL: Filter,
      OPEN: Clock,
      CLOSED: CheckCircle,
      AWARDED: CheckCircle,
      CANCELLED: XCircle
    };
    return icons[tab] || Filter;
  };

  const tabs = [
    { key: 'ALL', label: 'All Inquiries', count: stats?.totalInquiries || 0 },
    { key: BID_INQUIRY_STATUS.OPEN, label: 'Open', count: stats?.openInquiries || 0 },
    { key: BID_INQUIRY_STATUS.CLOSED, label: 'Closed', count: stats?.closedInquiries || 0 },
    { key: BID_INQUIRY_STATUS.AWARDED, label: 'Awarded', count: stats?.awardedInquiries || 0 },
    { key: BID_INQUIRY_STATUS.CANCELLED, label: 'Cancelled', count: stats?.cancelledInquiries || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dmc/dashboard')}
                className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bid Inquiries</h1>
                <p className="text-gray-600 mt-1">Manage your hotel booking inquiries and review bids</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dmc/inquiries/post')}
              className="flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Post New Inquiry
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Inquiries"
              value={stats.totalInquiries}
              icon={Filter}
              color="blue"
            />
            <StatCard
              title="Open Inquiries"
              value={stats.openInquiries}
              icon={Clock}
              color="green"
            />
            <StatCard
              title="Awarded"
              value={stats.awardedInquiries}
              icon={CheckCircle}
              color="purple"
            />
            <StatCard
              title="Total Bids Received"
              value={stats.totalBidsReceived}
              icon={DollarSign}
              color="yellow"
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search inquiries by title or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Search
            </button>
            {searchKeyword && (
              <button
                onClick={() => {
                  setSearchKeyword('');
                  fetchInquiries();
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = getTabIcon(tab.key);
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-cyan-600 text-cyan-600 bg-cyan-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Inquiry List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600 mb-6">
              {searchKeyword
                ? 'Try adjusting your search terms'
                : 'Start by posting your first bid inquiry'}
            </p>
            {!searchKeyword && (
              <button
                onClick={() => navigate('/dmc/inquiries/post')}
                className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post New Inquiry
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {inquiries.map(inquiry => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} navigate={navigate} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between bg-white rounded-lg shadow-md p-4">
                <div className="text-sm text-gray-700">
                  Showing {pagination.page * pagination.size + 1} to{' '}
                  {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                  {pagination.totalElements} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pagination.page === index
                          ? 'bg-cyan-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Statistics Card Component
const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Inquiry Card Component
const InquiryCard = ({ inquiry, navigate }) => {
  const timeRemaining = getTimeRemaining(inquiry.deadline);
  const isExpiringSoon = isDeadlineApproaching(inquiry.deadline);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 border-l-4 border-cyan-600">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {/* BidID pill: short readable id, tooltip with full id, click to copy */}
            {inquiry.id && (
              (() => {
                const fullId = String(inquiry.id);
                const short = fullId.length > 8 ? fullId.slice(0, 8).toUpperCase() : fullId.toUpperCase();
                const pillClasses = inquiry.status === BID_INQUIRY_STATUS.OPEN
                  ? 'bg-green-50 text-green-700'
                  : inquiry.status === BID_INQUIRY_STATUS.AWARDED
                  ? 'bg-yellow-50 text-yellow-700'
                  : inquiry.status === BID_INQUIRY_STATUS.CANCELLED
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-100 text-gray-600';
                return (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard?.writeText(fullId)
                        .then(() => toast.success('Full ID copied'))
                        .catch(() => toast.error('Copy failed'));
                    }}
                    title={`Full ID: ${fullId} — click to copy`}
                    className={`px-3 py-1 rounded-lg font-medium text-sm transition-colors mr-2 ${pillClasses}`}
                  >
                    {`BidID-${short}`}
                  </button>
                );
              })()
            )}

            <h3 className="text-xl font-bold text-gray-900">{inquiry.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(inquiry.status)}`}>
              {getStatusLabel(inquiry.status)}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{truncateText(inquiry.description, 150)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-cyan-600" />
          <span className="font-medium">{inquiry.destinationCities?.join(', ') || 'N/A'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-cyan-600" />
          <span>{formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2 text-cyan-600" />
          <span>
            {inquiry.budgetMin && inquiry.budgetMax
              ? `${formatPrice(inquiry.budgetMin, inquiry.currency)} - ${formatPrice(inquiry.budgetMax, inquiry.currency)}`
              : 'Budget flexible'}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-cyan-600" />
          <span className={isExpiringSoon ? 'text-red-600 font-semibold' : ''}>
            {timeRemaining}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{inquiry.bidCount || 0}</span> {getBidCountLabel(inquiry.bidCount)}
          </span>
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{inquiry.viewCount || 0}</span> views
          </span>
          <span className="text-gray-500">Posted {formatDate(inquiry.postedAt)}</span>
        </div>

        <button
          onClick={() => navigate(`/dmc/inquiries/${inquiry.id}`)}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
      </div>

      {isExpiringSoon && inquiry.status === BID_INQUIRY_STATUS.OPEN && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-sm text-red-700 font-medium">
            Deadline approaching! Close inquiry or award a bid soon.
          </span>
        </div>
      )}
    </div>
  );
};

export default DMCInquiriesPage;
