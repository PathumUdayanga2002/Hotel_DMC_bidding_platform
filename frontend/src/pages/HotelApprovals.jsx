import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Card } from '../components/Card';
import HotelDetailsModal from '../components/HotelDetailsModal';
import {
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Building2
} from 'lucide-react';

const HotelApprovals = () => {
  const { refreshStats } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('DESC');

  useEffect(() => {
    fetchProfiles();
  }, [currentPage, statusFilter, sortDirection]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        size: pageSize,
        sortBy: 'createdAt',
        sortDirection: sortDirection
      };
      
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/admin/hotel-approvals', { params });
      setProfiles(response.data.data.profiles);
      setTotalPages(response.data.data.totalPages);
      setTotalElements(response.data.data.totalElements);
    } catch (error) {
      // Don't show error for 403 - user will be redirected by ProtectedRoute
      if (error.response?.status === 403) {
        console.log('Access denied - redirecting...');
        return;
      }
      toast.error('Failed to fetch hotel profiles');
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchProfiles();
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(0);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  };

  const handleViewDetails = async (profileId) => {
    try {
      const response = await api.get(`/admin/hotel-approvals/${profileId}`);
      setSelectedProfile(response.data.data);
      setModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch hotel profile details');
      console.error('Error fetching profile details:', error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProfile(null);
    fetchProfiles();
    refreshStats();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        text: 'Pending'
      },
      UNDER_REVIEW: {
        icon: Clock,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        text: 'Under Review'
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        text: 'Approved'
      },
      REJECTED: {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'Rejected'
      },
      SUSPENDED: {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        text: 'Suspended'
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const filterButtons = [
    { label: 'All', value: '', count: null },
    { label: 'Pending', value: 'PENDING', color: 'yellow' },
    { label: 'Under Review', value: 'UNDER_REVIEW', color: 'blue' },
    { label: 'Approved', value: 'APPROVED', color: 'green' },
    { label: 'Rejected', value: 'REJECTED', color: 'red' },
    { label: 'Suspended', value: 'SUSPENDED', color: 'red' }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hotel Profile Approvals</h1>
          <p className="text-gray-600 mt-2">Review and manage hotel registration requests</p>
        </div>
        <button
          onClick={fetchProfiles}
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by hotel name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 shrink-0" />
            {filterButtons.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sort & Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {profiles.length} of {totalElements} hotel profiles
            </p>
            <button
              onClick={() => setSortDirection(sortDirection === 'DESC' ? 'ASC' : 'DESC')}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <span>Sort by date:</span>
              <span className="font-medium">{sortDirection === 'DESC' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Profiles Table */}
      <Card>
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading hotel profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No hotel profiles found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{profile.contactEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {profile.city}, {profile.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(profile.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(profile.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === index
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Hotel Details Modal */}
      {modalOpen && selectedProfile && (
        <HotelDetailsModal
          profile={selectedProfile}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default HotelApprovals;
