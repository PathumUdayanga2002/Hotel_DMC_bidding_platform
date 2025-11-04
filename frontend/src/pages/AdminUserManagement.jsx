import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Users,
  Building,
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  FileCheck,
  FileX,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import {
  getUserManagementStats,
  getPendingApprovals,
  approveRequest,
  rejectRequest
} from '../services/userManagementService';

const AdminUserManagement = () => {
  const [stats, setStats] = useState(null);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await getUserManagementStats();
      setStats(statsResponse.data);

      // Fetch pending approvals
      const approvalsResponse = await getPendingApprovals({
        page: currentPage,
        size: 10
      });
      
      setPendingApprovals(approvalsResponse.data.approvals);
      setTotalPages(approvalsResponse.data.totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch user management data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (approval) => {
    setSelectedApproval(approval);
    setShowDetailsModal(true);
  };

  const handleApprove = async (approval) => {
    if (!window.confirm(`Are you sure you want to approve this ${approval.type}?`)) {
      return;
    }

    try {
      setProcessing(true);
      await approveRequest(approval.id, approval.type);
      toast.success(`${approval.type} approved successfully`);
      fetchData();
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error approving:', error);
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = (approval) => {
    setSelectedApproval(approval);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await rejectRequest(selectedApproval.id, selectedApproval.type, rejectReason);
      toast.success(`${selectedApproval.type} rejected successfully`);
      fetchData();
      setShowRejectModal(false);
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error rejecting:', error);
      toast.error(error.response?.data?.message || 'Failed to reject');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage hotels, DMCs, and pending approvals</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Hotels */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total Hotels</p>
              <p className="text-3xl font-bold text-blue-900">{stats?.totalHotels || 0}</p>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>Approved: {stats?.approvedHotels || 0}</span>
                </div>
                <div className="flex items-center text-yellow-700">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Pending: {stats?.pendingHotels || 0}</span>
                </div>
              </div>
            </div>
            <Building className="w-12 h-12 text-blue-600 opacity-50" />
          </div>
        </Card>

        {/* Total DMCs */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-semibold">Total DMCs</p>
              <p className="text-3xl font-bold text-purple-900">{stats?.totalDMCs || 0}</p>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>Approved: {stats?.approvedDMCs || 0}</span>
                </div>
                <div className="flex items-center text-yellow-700">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Pending: {stats?.pendingDMCs || 0}</span>
                </div>
              </div>
            </div>
            <Users className="w-12 h-12 text-purple-600 opacity-50" />
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-semibold">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-900">{stats?.totalPendingApprovals || 0}</p>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex items-center text-gray-700">
                  <Building className="w-3 h-3 mr-1" />
                  <span>Hotels: {stats?.pendingHotels || 0}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-3 h-3 mr-1" />
                  <span>DMCs: {stats?.pendingDMCs || 0}</span>
                </div>
              </div>
            </div>
            <Clock className="w-12 h-12 text-yellow-600 opacity-50" />
          </div>
        </Card>

        {/* Rejected */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-semibold">Rejected</p>
              <p className="text-3xl font-bold text-red-900">
                {(stats?.rejectedHotels || 0) + (stats?.rejectedDMCs || 0)}
              </p>
              <div className="mt-2 text-xs space-y-1">
                <div className="flex items-center text-gray-700">
                  <Building className="w-3 h-3 mr-1" />
                  <span>Hotels: {stats?.rejectedHotels || 0}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-3 h-3 mr-1" />
                  <span>DMCs: {stats?.rejectedDMCs || 0}</span>
                </div>
              </div>
            </div>
            <XCircle className="w-12 h-12 text-red-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Pending Approvals List */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
          <span className="text-sm text-gray-600">
            Total: {stats?.totalPendingApprovals || 0}
          </span>
        </div>

        {pendingApprovals.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          approval.type === 'HOTEL'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {approval.type}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">{approval.name}</h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{approval.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{approval.contactEmail}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{approval.contactNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{formatDate(approval.appliedDate)}</span>
                      </div>
                    </div>

                    {/* Document Status */}
                    <div className="mt-3 flex items-center">
                      {approval.documentsVerified ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <FileCheck className="w-4 h-4 mr-2" />
                          <span>Documents Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600 text-sm">
                          <FileX className="w-4 h-4 mr-2" />
                          <span>Documents Pending</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(approval)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      Review
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(approval)}
                      disabled={processing}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(approval)}
                      disabled={processing}
                      className="flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {showDetailsModal && selectedApproval && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedApproval.type} Details
                </h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{selectedApproval.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold">{selectedApproval.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{selectedApproval.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{selectedApproval.contactNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold">{selectedApproval.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Applied Date</p>
                      <p className="font-semibold">{formatDate(selectedApproval.appliedDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Type-specific Info */}
                {selectedApproval.type === 'HOTEL' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">City</p>
                        <p className="font-semibold">{selectedApproval.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold">{selectedApproval.country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-semibold">{selectedApproval.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Rooms</p>
                        <p className="font-semibold">{selectedApproval.totalRooms || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApproval.type === 'DMC' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">DMC Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Company Name</p>
                        <p className="font-semibold">{selectedApproval.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Registration Number</p>
                        <p className="font-semibold">{selectedApproval.businessRegistrationNumber}</p>
                      </div>
                      {selectedApproval.sltdaCertificationUrl && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">SLTDA Certification</p>
                          <a
                            href={selectedApproval.sltdaCertificationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Certificate
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Document Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Status</h3>
                  <div className="flex items-center">
                    {selectedApproval.documentsVerified ? (
                      <div className="flex items-center text-green-600">
                        <FileCheck className="w-5 h-5 mr-2" />
                        <span>All documents verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>Documents pending verification</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleApprove(selectedApproval)}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2 inline" />
                  {processing ? 'Processing...' : 'Approve'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleReject(selectedApproval);
                  }}
                  disabled={processing}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2 inline" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reject {selectedApproval?.type}</h2>
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting this application.
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows="4"
                placeholder="Enter rejection reason..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={confirmReject}
                  className="flex-1"
                  disabled={processing || !rejectReason.trim()}
                >
                  {processing ? 'Processing...' : 'Confirm Reject'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
