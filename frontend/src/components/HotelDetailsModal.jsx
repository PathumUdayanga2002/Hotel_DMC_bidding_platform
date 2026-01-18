import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import {
  X,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  User,
  FileText,
  Image as ImageIcon,
  Download,
  Eye,
  MessageSquare,
  History
} from 'lucide-react';

const HotelDetailsModal = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [actionType, setActionType] = useState(null); // 'approve', 'reject', 'status', 'note'
  const [rejectionReason, setRejectionReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Image viewer state
  const [viewingImage, setViewingImage] = useState(null);

  // Debug: log profile data whenever it changes or when modal opens
  useEffect(() => {
    console.log('HotelDetailsModal - profile data:', profile);
  }, [profile]);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this hotel profile?')) {
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/hotel-approvals/${profile.id}/approve`);
      toast.success('Hotel profile approved successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve hotel profile');
      console.error('Error approving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/admin/hotel-approvals/${profile.id}/reject`, { reason: rejectionReason });
      toast.success('Hotel profile rejected successfully');
      setActionType(null);
      setRejectionReason('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject hotel profile');
      console.error('Error rejecting profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    setLoading(true);
    try {
      const payload = { status: newStatus };
      if (adminNote.trim()) {
        payload.adminNote = adminNote;
      }
      
      await api.put(`/admin/hotel-approvals/${profile.id}/status`, payload);
      toast.success('Hotel profile status updated successfully');
      setActionType(null);
      setNewStatus('');
      setAdminNote('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!adminNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/admin/hotel-approvals/${profile.id}/notes`, { note: adminNote });
      toast.success('Admin note added successfully');
      setActionType(null);
      setAdminNote('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add note');
      console.error('Error adding note:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pending' },
      UNDER_REVIEW: { icon: Clock, color: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Under Review' },
      APPROVED: { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200', text: 'Approved' },
      REJECTED: { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200', text: 'Rejected' },
      SUSPENDED: { icon: AlertCircle, color: 'bg-red-100 text-red-800 border-red-200', text: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4 mr-2" />
        {config.text}
      </span>
    );
  };

  const InfoRow = ({ icon: Icon, label, value, fullWidth = false }) => (
    <div className={`${fullWidth ? 'col-span-2' : ''}`}>
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-sm font-medium text-gray-900 mt-1">{value || 'N/A'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building2 className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-600">{profile.city}, {profile.country}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {getStatusBadge(profile.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-6">
            {['details', 'certifications', 'gallery', 'history', 'notes'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <InfoRow icon={Building2} label="Hotel Name" value={profile.name} />
                  <InfoRow icon={MapPin} label="City" value={profile.city} />
                  <InfoRow icon={Globe} label="Country" value={profile.country} />
                  <InfoRow icon={Mail} label="Contact Email" value={profile.contactEmail} />
                  <InfoRow icon={Phone} label="Contact Number" value={profile.contactNumber} />
                  <InfoRow icon={Globe} label="Website" value={profile.website} />
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{profile.address}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{profile.description}</p>
                </div>
              </div>

              {/* Amenities */}
              {profile.amenities && profile.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Total Rooms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Capacity</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Total Rooms:</span> {profile.totalRooms}
                  </p>
                </div>
              </div>

              
              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Environment</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {profile.roomEnvironment || "N/A"}
                  </p>
                </div>
              </div>

              {/* Hotel Star Rating */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Star Rating</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    {profile.hotelStars ? `${profile.hotelStars} Star${profile.hotelStars > 1 ? "s" : ""}` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              {profile.termsAndConditions && profile.termsAndConditions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
                  <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                    {profile.termsAndConditions.map((t, index) => (
                      <li key={index}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Submission Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <InfoRow
                    icon={Calendar}
                    label="Submitted On"
                    value={new Date(profile.createdAt).toLocaleString()}
                  />
                  {profile.approvedAt && (
                    <>
                      <InfoRow
                        icon={Calendar}
                        label="Approved On"
                        value={new Date(profile.approvedAt).toLocaleString()}
                      />
                      <InfoRow
                        icon={User}
                        label="Approved By"
                        value={profile.approvedByUsername}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Rejection Reason */}
              {profile.rejectionReason && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Current Rejection Reason</h3>
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <p className="text-sm text-red-700">{profile.rejectionReason}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Certifications ({profile.certifications?.length || 0})
              </h3>
              {profile.certifications && profile.certifications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {profile.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Certification {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            {cert.split('/').pop()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <a
                          href={cert}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <a
                          href={cert}
                          download
                          className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No certifications uploaded</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gallery Images ({profile.galleryImages?.length || 0})
              </h3>
              {profile.galleryImages && profile.galleryImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {profile.galleryImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer rounded-lg overflow-hidden aspect-square"
                      onClick={() => setViewingImage(image)}
                    >
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No gallery images uploaded</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejection History</h3>
              {profile.rejectionHistory && profile.rejectionHistory.length > 0 ? (
                <div className="space-y-3">
                  {profile.rejectionHistory.map((record, index) => (
                    <div
                      key={index}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <History className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-medium text-red-700">
                            Rejected by {record.rejectedBy}
                          </span>
                        </div>
                        <span className="text-xs text-red-600">
                          {new Date(record.rejectedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-red-700 mt-2">{record.reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No rejection history</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Notes (Internal)</h3>
              {profile.adminNotes && profile.adminNotes.length > 0 ? (
                <div className="space-y-3">
                  {profile.adminNotes.map((note) => (
                    <div
                      key={note.noteId}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">
                            {note.adminUsername}
                          </span>
                        </div>
                        <span className="text-xs text-blue-600">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 mt-2">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No admin notes yet</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Dialogs */}
        {actionType === 'reject' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-red-50">
            <h4 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h4>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a detailed reason for rejection..."
              className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        )}

        {actionType === 'status' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Change Status</h4>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3"
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Optional: Add a note about this status change..."
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={loading || !newStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        {actionType === 'note' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-blue-50">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Add Admin Note</h4>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Enter your internal note here..."
              className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={loading || !adminNote.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        {!actionType && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setActionType('note')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add Note</span>
              </button>
              <button
                onClick={() => setActionType('status')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Change Status
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActionType('reject')}
                disabled={profile.status === 'REJECTED'}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={handleApprove}
                disabled={profile.status === 'APPROVED' || loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Approve'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-60 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setViewingImage(null)}
        >
          <button
            onClick={() => setViewingImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={viewingImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default HotelDetailsModal;
