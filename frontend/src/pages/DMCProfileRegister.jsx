import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle,
  Loader
} from 'lucide-react';

const DMCProfileRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    businessRegistrationNumber: '',
    contactNumber: '',
    email: user?.email || ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      const response = await api.get('/dmc/profile');
      const profile = response.data.data;
      setExistingProfile(profile);
      
      // Pre-fill form with existing data
      setFormData({
        companyName: profile.companyName || '',
        address: profile.address || '',
        businessRegistrationNumber: profile.businessRegistrationNumber || '',
        contactNumber: profile.contactNumber || '',
        email: profile.email || user?.email || ''
      });

      if (profile.sltdaCertificationFileName) {
        setFilePreview(profile.sltdaCertificationFileName);
      }
    } catch (error) {
      // Profile doesn't exist yet, that's fine
      console.log('No existing profile found');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, JPEG, and PNG files are allowed');
        return;
      }

      setSelectedFile(file);
      setFilePreview(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      
      // Add profile data as JSON blob
      const profileBlob = new Blob([JSON.stringify(formData)], {
        type: 'application/json'
      });
      submitData.append('profile', profileBlob);

      // Add file if selected
      if (selectedFile) {
        submitData.append('sltdaCertification', selectedFile);
      }

      await api.post('/dmc/profile/register', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(existingProfile 
        ? 'Profile updated and resubmitted successfully! Waiting for admin approval.'
        : 'Profile registered successfully! Waiting for admin approval.'
      );
      
      navigate('/dmc/dashboard');

    } catch (error) {
      console.error('Profile registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register profile');
    } finally {
      setLoading(false);
    }
  };

  const isRejected = existingProfile?.status === 'REJECTED';

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">
            {existingProfile ? 'Update DMC Profile' : 'DMC Profile Registration'}
          </h1>
          <button
            onClick={() => navigate('/dmc/dashboard')}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        <p className="text-sm text-gray-400">
          {isRejected 
            ? 'Your previous submission was rejected. Please review the feedback and resubmit your profile.'
            : 'Complete your company profile to unlock all platform features and start receiving inquiries'
          }
        </p>
      </div>

        {/* Rejection Notice */}
        {isRejected && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Profile Rejected</h3>
                <div className="mt-2 text-sm text-gray-400">
                  <p><strong className="text-gray-300">Reason:</strong> {existingProfile.currentRejectionReason || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 max-w-3xl mx-auto">
          {/* Form Title */}
          <div className="mb-8 pb-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white mb-2">Company Information</h2>
            <p className="text-sm text-gray-400">Please provide accurate details about your DMC company</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Name */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Building className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>Company Name</span>
                  <span className="text-amber-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="e.g., Paradise Tours & Travels Ltd."
              />
            </div>

            {/* Address */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>Business Address</span>
                  <span className="text-amber-500">*</span>
                </label>
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 transition-all resize-none"
                placeholder="e.g., No. 123, Main Street, Colombo 07, Sri Lanka"
              />
              <p className="text-xs text-gray-400 flex items-center">
                <span className="mr-1">💡</span>
                Include full address with city and postal code
              </p>
            </div>

            {/* Business Registration Number */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>Business Registration Number</span>
                  <span className="text-amber-500">*</span>
                </label>
              </div>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="e.g., PV 12345 or BRN/2024/001234"
              />
              <p className="text-xs text-gray-400 flex items-center">
                <span className="mr-1">💡</span>
                Your official company registration number
              </p>
            </div>

            {/* Contact Number */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>Contact Number</span>
                  <span className="text-amber-500">*</span>
                </label>
              </div>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                pattern="[+]?[0-9]{10,15}"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                placeholder="+94771234567"
              />
              <p className="text-xs text-gray-400 flex items-center">
                <span className="mr-1">💡</span>
                Format: +94771234567 (10-15 digits with country code)
              </p>
            </div>

            {/* Email Address */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>Email Address</span>
                  <span className="text-amber-500">*</span>
                </label>
                <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded">Account Email</span>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                readOnly
              />
              <p className="text-xs text-gray-400 flex items-center">
                <span className="mr-1">🔒</span>
                This is your registered account email and cannot be changed
              </p>
            </div>

            {/* SLTDA Certification Upload */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-amber-500" />
                  </div>
                  <span>SLTDA Certification</span>
                  <span className="text-gray-400 text-sm font-normal">(Optional)</span>
                </label>
              </div>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-amber-500 hover:bg-white/5 transition-all cursor-pointer group">
                <input
                  type="file"
                  id="sltdaCertification"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label
                  htmlFor="sltdaCertification"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center mb-4 transition-all">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <p className="text-sm font-medium text-gray-300 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    PDF, JPG, JPEG, PNG (Max 50MB)
                  </p>
                </label>
              </div>
              {filePreview && (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center text-sm text-amber-500">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{filePreview}</span>
                </div>
              )}
              <p className="text-xs text-gray-400 flex items-center">
                <span className="mr-1">💡</span>
                Upload your Sri Lanka Tourism Development Authority certification
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-8 border-t border-white/10">
              <button
                type="button"
                onClick={() => navigate('/dmc/dashboard')}
                className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all font-medium text-sm order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all order-1 sm:order-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {existingProfile ? 'Update & Resubmit Profile' : 'Submit Profile for Approval'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-white mb-3">What happens next?</h4>
                <ul className="text-sm text-gray-400 space-y-2.5">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 flex-shrink-0">✓</span>
                    <span>Your profile will be submitted for admin review</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 flex-shrink-0">✓</span>
                    <span>You will receive an email notification once approved/rejected</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 flex-shrink-0">✓</span>
                    <span>You can access Profile, Messages, and Notifications during review</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-2 flex-shrink-0">✓</span>
                    <span>Other features will be unlocked after approval</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default DMCProfileRegister;
