import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Card } from '../components/Card';
import DMCDetailsModal from '../components/DMCDetailsModal';
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
  FileText
} from 'lucide-react';

const DMCApprovals = () => {
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
        sortBy: 'submittedAt',
        sortDirection: sortDirection
      };
      
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await api.get('/admin/dmc-approvals', { params });
      setProfiles(response.data.data.profiles);
      setTotalPages(response.data.data.totalPages);
      setTotalElements(response.data.data.totalElements);
    } catch (error) {
      toast.error('Failed to fetch profiles');
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
      const response = await api.get(`/admin/dmc-approvals/${profileId}`);
      setSelectedProfile(response.data.data);
      setModalOpen(true);
    } catch (error) {
      toast.error('Failed to fetch profile details');
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
        color: 'bg-white/10 text-gray-300 border-white/20',
        text: 'Pending'
      },
      UNDER_REVIEW: {
        icon: Clock,
        color: 'bg-white/10 text-gray-300 border-white/20',
        text: 'Under Review'
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'bg-white/10 text-amber-500 border-white/20',
        text: 'Approved'
      },
      REJECTED: {
        icon: XCircle,
        color: 'bg-white/5 text-gray-400 border-white/10',
        text: 'Rejected'
      },
      SUSPENDED: {
        icon: AlertCircle,
        color: 'bg-white/5 text-gray-400 border-white/10',
        text: 'Suspended'
      }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${config.color}`}>
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
    <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">DMC Profile Approvals</h1>
          <p className="text-sm text-gray-400 mt-1">Review and manage DMC registration requests</p>
        </div>
        <button
          onClick={fetchProfiles}
          className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 text-sm"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-amber-500 text-black rounded-lg hover:brightness-110 transition-all font-medium text-sm"
            >
              Search
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {filterButtons.map((filter) => (
              <button
                key={filter.value}
                onClick={() => handleFilterChange(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  statusFilter === filter.value
                    ? 'bg-amber-500 text-black'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Sort & Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {profiles.length} of {totalElements} profiles
            </p>
            <button
              onClick={() => setSortDirection(sortDirection === 'DESC' ? 'ASC' : 'DESC')}
              className="text-sm text-gray-400 hover:text-white flex items-center space-x-1 transition-colors"
            >
              <span>Sort by date:</span>
              <span className="font-medium">{sortDirection === 'DESC' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Loading profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium">No profiles found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Registration No.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-white/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{profile.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{profile.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{profile.businessRegistrationNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(profile.submittedAt).toLocaleDateString('en-US', {
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
                        className="inline-flex items-center px-4 py-2 bg-amber-500 text-black text-sm font-medium rounded-lg hover:brightness-110 transition-all"
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Page {currentPage + 1} of {totalPages}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === index
                      ? 'bg-amber-500 text-black'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DMC Details Modal */}
      {modalOpen && selectedProfile && (
        <DMCDetailsModal
          profile={selectedProfile}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default DMCApprovals;
