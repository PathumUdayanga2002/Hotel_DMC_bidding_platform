import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  Key, 
  Search,
  X,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

const DMCStaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    profilePhotoUrl: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await api.get('/dmc/staff');
      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/dmc/staff', formData);
      if (response.data.success) {
        const { staff: newStaff, generatedPassword: password } = response.data.data;
        setGeneratedPassword(password);
        setShowAddModal(false);
        setShowPasswordModal(true);
        fetchStaff();
        toast.success('Staff member created successfully');
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create staff member');
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/dmc/staff/${selectedStaff.id}`, formData);
      if (response.data.success) {
        setShowEditModal(false);
        fetchStaff();
        toast.success('Staff member updated successfully');
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update staff member');
    }
  };

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      const response = await api.put(`/dmc/staff/${staffId}/toggle-status`);
      if (response.data.success) {
        fetchStaff();
        toast.success(`Staff ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      }
    } catch (error) {
      toast.error('Failed to update staff status');
    }
  };

  const handleResetPassword = async (staffId) => {
    try {
      const response = await api.post(`/dmc/staff/${staffId}/reset-password`);
      if (response.data.success) {
        setGeneratedPassword(response.data.data.newPassword);
        setShowPasswordModal(true);
        toast.success('Password reset successfully');
      }
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (window.confirm(`Are you sure you want to delete ${staffName}? This action cannot be undone.`)) {
      try {
        await api.delete(`/dmc/staff/${staffId}`);
        fetchStaff();
        toast.success('Staff member deleted successfully');
      } catch (error) {
        toast.error('Failed to delete staff member');
      }
    }
  };

  const openEditModal = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormData({
      fullName: staffMember.fullName || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      position: staffMember.position || '',
      profilePhotoUrl: staffMember.profilePhotoUrl || ''
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: '',
      profilePhotoUrl: ''
    });
    setSelectedStaff(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredStaff = staff.filter(s =>
    s.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center">
                <Users className="w-6 h-6 text-amber-500 mr-3" />
                Staff Management
              </h1>
              <p className="text-sm text-gray-400 mt-2">Manage your DMC staff members and their access</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:brightness-110 text-black px-4 py-2 rounded-lg flex items-center space-x-2 transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add Staff Member</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No staff members found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 text-amber-500 hover:text-amber-400 font-medium"
              >
                Add your first staff member
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredStaff.map((staffMember) => (
                  <tr key={staffMember.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {staffMember.profilePhotoUrl ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={staffMember.profilePhotoUrl}
                              alt={staffMember.fullName}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                              <span className="text-amber-500 font-semibold text-lg">
                                {staffMember.fullName?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{staffMember.fullName}</div>
                          <div className="text-sm text-gray-400">{staffMember.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {staffMember.position || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {staffMember.phone || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staffMember.isActive
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {staffMember.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {staffMember.lastLoginAt
                        ? new Date(staffMember.lastLoginAt).toLocaleDateString()
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(staffMember)}
                          className="text-amber-500 hover:text-amber-400 p-2 hover:bg-white/5 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(staffMember.id, staffMember.isActive)}
                          className={`p-2 rounded ${
                            staffMember.isActive
                              ? 'text-yellow-500 hover:text-yellow-400 hover:bg-white/5'
                              : 'text-green-500 hover:text-green-400 hover:bg-white/5'
                          }`}
                          title={staffMember.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(staffMember.id)}
                          className="text-purple-500 hover:text-purple-400 p-2 hover:bg-white/5 rounded"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember.id, staffMember.fullName)}
                          className="text-red-500 hover:text-red-400 p-2 hover:bg-white/5 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Staff Count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredStaff.length} of {staff.length} staff member{staff.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Add New Staff Member</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Sales Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.profilePhotoUrl}
                    onChange={(e) => setFormData({ ...formData, profilePhotoUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:brightness-110 text-black rounded-lg font-medium"
                >
                  Create Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white">Edit Staff Member</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateStaff} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.profilePhotoUrl}
                    onChange={(e) => setFormData({ ...formData, profilePhotoUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:brightness-110 text-black rounded-lg font-medium"
                >
                  Update Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-amber-500/10 rounded-full mb-4">
                <Key className="w-6 h-6 text-amber-500" />
              </div>
              <h2 className="text-lg font-semibold text-white text-center mb-2">
                Generated Password
              </h2>
              <p className="text-sm text-gray-400 text-center mb-6">
                Please save this password. It won't be shown again.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono font-semibold text-white">
                    {generatedPassword}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="ml-4 p-2 text-amber-500 hover:bg-white/5 rounded"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setGeneratedPassword('');
                  setCopied(false);
                }}
                className="w-full px-4 py-2 bg-amber-500 hover:brightness-110 text-black rounded-lg font-medium"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DMCStaffManagement;
