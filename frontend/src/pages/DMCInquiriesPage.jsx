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
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Bid Inquiries</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your hotel booking inquiries and review bids</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dmc/inquiries/post')}
                className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 transition-all font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Inquiry
              </button>
              <button
                onClick={() => navigate('/dmc/dashboard')}
                className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-12 py-10">
        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Inquiries"
              value={stats.totalInquiries}
              icon={Filter}
            />
            <StatCard
              title="Open Inquiries"
              value={stats.openInquiries}
              icon={Clock}
            />
            <StatCard
              title="Awarded"
              value={stats.awardedInquiries}
              icon={CheckCircle}
            />
            <StatCard
              title="Total Bids Received"
              value={stats.totalBidsReceived}
              icon={DollarSign}
            />
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search inquiries by title or description..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 transition-all font-medium"
            >
              Search
            </button>
            {searchKeyword && (
              <button
                onClick={() => {
                  setSearchKeyword('');
                  fetchInquiries();
                }}
                className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 mb-8">
          <div className="flex border-b border-white/10 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = getTabIcon(tab.key);
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'border-amber-500 text-white bg-white/5'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/10 text-gray-400'
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
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No inquiries found</h3>
            <p className="text-sm text-gray-400 mb-6">
              {searchKeyword
                ? 'Try adjusting your search terms'
                : 'Start by posting your first bid inquiry'}
            </p>
            {!searchKeyword && (
              <button
                onClick={() => navigate('/dmc/inquiries/post')}
                className="inline-flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 transition-all font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
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
              <div className="mt-8 flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
                <div className="text-sm text-gray-400">
                  Showing {pagination.page * pagination.size + 1} to{' '}
                  {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of{' '}
                  {pagination.totalElements} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(index)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pagination.page === index
                          ? 'bg-amber-500 text-black font-medium'
                          : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
const StatCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-white mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-amber-500/10">
          <Icon className="w-5 h-5 text-amber-500" />
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
    <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {/* BidID pill: short readable id, tooltip with full id, click to copy */}
            {inquiry.id && (
              (() => {
                const fullId = String(inquiry.id);
                const short = fullId.length > 8 ? fullId.slice(0, 8).toUpperCase() : fullId.toUpperCase();
                const pillClasses = inquiry.status === BID_INQUIRY_STATUS.OPEN
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : inquiry.status === BID_INQUIRY_STATUS.AWARDED
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : inquiry.status === BID_INQUIRY_STATUS.CANCELLED
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/10 text-gray-400 border border-white/10';
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

            <h3 className="text-lg font-semibold text-white">{inquiry.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(inquiry.status)}`}>
              {getStatusLabel(inquiry.status)}
            </span>
          </div>
          <p className="text-sm text-gray-400">{truncateText(inquiry.description, 150)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-amber-500" />
          <span className="font-medium">{inquiry.destinationCities?.join(', ') || 'N/A'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Calendar className="w-4 h-4 mr-2 text-amber-500" />
          <span>{formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <DollarSign className="w-4 h-4 mr-2 text-amber-500" />
          <span>
            {inquiry.budgetMin && inquiry.budgetMax
              ? `${formatPrice(inquiry.budgetMin, inquiry.currency)} - ${formatPrice(inquiry.budgetMax, inquiry.currency)}`
              : 'Budget flexible'}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-amber-500" />
          <span className={isExpiringSoon ? 'text-red-400 font-semibold' : ''}>
            {timeRemaining}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-400">
            <span className="font-semibold text-white">{inquiry.bidCount || 0}</span> {getBidCountLabel(inquiry.bidCount)}
          </span>
          <span className="text-gray-400">
            <span className="font-semibold text-white">{inquiry.viewCount || 0}</span> views
          </span>
          <span className="text-gray-500">Posted {formatDate(inquiry.postedAt)}</span>
        </div>

        <button
          onClick={() => navigate(`/dmc/inquiries/${inquiry.id}`)}
          className="flex items-center px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 transition-all font-medium"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
      </div>

      {isExpiringSoon && inquiry.status === BID_INQUIRY_STATUS.OPEN && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-sm text-red-400 font-medium">
            Deadline approaching! Close inquiry or award a bid soon.
          </span>
        </div>
      )}
    </div>
  );
};

export default DMCInquiriesPage;
