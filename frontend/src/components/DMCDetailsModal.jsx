import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  FileText,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  ExternalLink,
  MessageSquare,
  Send
} from 'lucide-react';

const DMCDetailsModal = ({ profile, onClose }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [showStatusChange, setShowStatusChange] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this DMC profile?')) return;

    setActionLoading(true);
    try {
      await api.put(`/admin/dmc-approvals/${profile.id}/approve`);
      toast.success('DMC profile approved successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    if (!confirm('Are you sure you want to reject this DMC profile?')) return;

    setActionLoading(true);
    try {
      await api.put(`/admin/dmc-approvals/${profile.id}/reject`, {
        reason: rejectionReason
      });
      toast.success('DMC profile rejected successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject profile');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;

    setActionLoading(true);
    try {
      const payload = { status: newStatus };
      
      // If changing to REJECTED, require reason
      if (newStatus === 'REJECTED') {
        if (!rejectionReason.trim()) {
          toast.error('Please provide a rejection reason');
          setActionLoading(false);
          return;
        }
        payload.rejectionReason = rejectionReason;
      }

      await api.put(`/admin/dmc-approvals/${profile.id}/status`, payload);
      toast.success('Status updated successfully');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/admin/dmc-approvals/${profile.id}/notes`, {
        content: newNote
      });
      toast.success('Note added successfully');
      setNewNote('');
      setShowNoteInput(false);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add note');
    } finally {
      setActionLoading(false);
    }
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
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">DMC Profile Details</h2>
            <p className="text-sm text-gray-600 mt-1">{profile.companyName}</p>
          </div>
          <div className="flex items-center space-x-3">
            {getStatusBadge(profile.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Company Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Company Name</p>
                  <p className="font-medium text-gray-900">{profile.companyName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Business Registration Number</p>
                  <p className="font-medium text-gray-900">{profile.businessRegistrationNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Mail className="w-4 h-4 mr-1 text-gray-500" />
                    {profile.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1 text-gray-500" />
                    {profile.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Website</p>
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-green-600 hover:text-green-700 flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    {profile.website}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium text-gray-900 flex items-start">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-0.5" />
                    {profile.address}
                  </p>
                </div>
              </div>
            </div>

            {/* SLTDA Certification */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                SLTDA Certification
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">File Name</p>
                    <p className="font-medium text-gray-900">{profile.fileName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={profile.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </a>
                    <a
                      href={profile.fileUrl}
                      download
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Submission Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Submitted At</p>
                  <p className="font-medium text-gray-900">
                    {new Date(profile.submittedAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {profile.approvedAt && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Approved At</p>
                      <p className="font-medium text-gray-900">
                        {new Date(profile.approvedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Approved By</p>
                      <p className="font-medium text-gray-900">{profile.approvedByUsername || 'N/A'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Rejection History */}
            {profile.rejectionHistory && profile.rejectionHistory.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Rejection History
                </h3>
                <div className="space-y-3">
                  {profile.rejectionHistory.map((rejection, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-900">Reason:</p>
                          <p className="text-sm text-red-800 mt-1">{rejection.reason}</p>
                        </div>
                        <p className="text-xs text-red-600">
                          {new Date(rejection.rejectedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Admin Notes (Internal)
                </h3>
                <button
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {showNoteInput ? 'Cancel' : '+ Add Note'}
                </button>
              </div>

              {showNoteInput && (
                <div className="mb-4 bg-green-50 border border-green-200 p-4 rounded-lg">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={actionLoading || !newNote.trim()}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Add Note
                  </button>
                </div>
              )}

              {profile.adminNotes && profile.adminNotes.length > 0 ? (
                <div className="space-y-3">
                  {profile.adminNotes.map((note) => (
                    <div key={note.noteId} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-900">{note.adminUsername}</p>
                          <p className="text-sm text-blue-800 mt-1">{note.content}</p>
                        </div>
                        <p className="text-xs text-blue-600">
                          {new Date(note.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No admin notes yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer - Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {profile.status !== 'APPROVED' && profile.status !== 'REJECTED' ? (
            <div className="space-y-3">
              {/* Primary Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-medium"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Profile
                </button>
                <button
                  onClick={() => setShowRejectInput(!showRejectInput)}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Profile
                </button>
              </div>

              {/* Reject Input */}
              {showRejectInput && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-red-900 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide a clear reason for rejection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}

              {/* Status Change */}
              <div>
                <button
                  onClick={() => setShowStatusChange(!showStatusChange)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  {showStatusChange ? 'Cancel Status Change' : 'Change Status'}
                </button>
                {showStatusChange && (
                  <div className="mt-2 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Select New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">-- Select Status --</option>
                      <option value="PENDING">Pending</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                    {newStatus === 'REJECTED' && (
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Rejection reason (required for rejected status)"
                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="2"
                      />
                    )}
                    <button
                      onClick={handleStatusChange}
                      disabled={actionLoading || !newStatus}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Update Status
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 mb-3">
                This profile has been {profile.status.toLowerCase()}. You can still change the status if needed.
              </p>
              <button
                onClick={() => setShowStatusChange(!showStatusChange)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Status
              </button>
              {showStatusChange && (
                <div className="mt-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  >
                    <option value="">-- Select Status --</option>
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                  {newStatus === 'REJECTED' && (
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Rejection reason (required)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-2"
                      rows="2"
                    />
                  )}
                  <button
                    onClick={handleStatusChange}
                    disabled={actionLoading || !newStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DMCDetailsModal;
