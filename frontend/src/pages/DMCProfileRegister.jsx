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
  Loader,
  CreditCard,
  Clock,
  Calendar,
  Shield
} from 'lucide-react';

// Utility function to sanitize input and prevent XSS
const sanitizeInput = (input) => {
  if (!input) return '';
  // Remove potential XSS patterns
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Validate input against SQL injection patterns
const containsSQLInjection = (input) => {
  if (!input) return false;
  const sqlPatterns = [
    /('|(\-\-)|(;)|(\|\|)|(\*))/i,  // Basic SQL injection characters
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i // SQL keywords
  ];
  return sqlPatterns.some(pattern => pattern.test(input));
};

const DMCProfileRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
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
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.get("/subscription/status");
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      console.log("No subscription found");
    }
  };

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
    
    // Check for SQL injection patterns
    if (containsSQLInjection(value)) {
      toast.error('Invalid input detected. Please remove special characters.');
      return;
    }
    
    // Sanitize input to prevent XSS
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
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
    
    // Validate SLTDA certificate is required
    if (!selectedFile && !existingProfile?.sltdaCertificationFileName) {
      toast.error('SLTDA Certification is required. Please upload your certificate.');
      return;
    }
    
    // Additional validation for all fields
    if (!formData.companyName || !formData.address || !formData.businessRegistrationNumber || 
        !formData.contactNumber || !formData.email) {
      toast.error('All fields are required');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Validate phone number format
    const phoneRegex = /^[+]?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid contact number (10-15 digits)');
      return;
    }
    
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
      
      // Handle validation errors from backend
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message;
        
        // Check if it's a validation error with multiple fields
        if (error.response?.data?.errors) {
          // Multiple validation errors
          const errors = error.response.data.errors;
          Object.keys(errors).forEach(field => {
            toast.error(`${field}: ${errors[field]}`);
          });
        } else if (errorMessage) {
          // Single error message
          toast.error(errorMessage);
        } else {
          toast.error('Validation failed. Please check your inputs.');
        }
      } else if (error.response?.status === 413) {
        toast.error('File size is too large. Maximum 50MB allowed.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to register profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isRejected = existingProfile?.status === 'REJECTED';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dmc/dashboard')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {existingProfile ? 'Update DMC Profile' : 'Complete DMC Profile Registration'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRejected 
              ? 'Your previous submission was rejected. Please update and resubmit your profile.'
              : 'Provide your company details to access all platform features'
            }
          </p>
        </div>

        {/* Rejection Notice */}
        {isRejected && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Profile Rejected</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p><strong>Reason:</strong> {existingProfile.currentRejectionReason || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Status Card */}
        {subscription && !subscription.isPendingApproval && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm p-6 mb-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Subscription Status
              </h2>
              <button
                type="button"
                onClick={() => navigate('/subscription/purchase')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Upgrade Plan
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Shield className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Current Plan</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{subscription.plan}</p>
                {subscription.isTrial && (
                  <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                    FREE TRIAL
                  </span>
                )}
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Days Remaining</span>
                </div>
                <p className={`text-xl font-bold ${subscription.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-900'}`}>
                  {subscription.daysRemaining} days
                </p>
                <span className={`text-xs ${subscription.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
                  {subscription.isExpired ? 'Expired' : subscription.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Expires On</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(subscription.endDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
                <span className="text-xs text-gray-500">
                  Started: {new Date(subscription.startDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pending Approval Message */}
        {subscription?.isPendingApproval && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Profile Pending Approval</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Complete your profile below and submit for review. Your 30-day free trial will begin once your profile is approved by our admin team.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your complete business address"
              />
            </div>

            {/* Business Registration Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Business Registration Number *
              </label>
              <input
                type="text"
                name="businessRegistrationNumber"
                value={formData.businessRegistrationNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your business registration number"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                General Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                pattern="[+]?[0-9]{10,15}"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+94771234567"
              />
              <p className="text-xs text-gray-500 mt-1">Format: +94771234567 (10-15 digits)</p>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">This is your account email</p>
            </div>

            {/* SLTDA Certification Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                SLTDA Certification *
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Required: Sri Lanka Tourism Development Authority certification
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
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
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, JPEG, PNG (Max 50MB)
                  </p>
                </label>
              </div>
              {filePreview && (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>{filePreview}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dmc/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {existingProfile ? 'Update & Resubmit' : 'Submit for Approval'}
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your profile will be submitted for admin review</li>
              <li>• You will receive an email notification once approved/rejected</li>
              <li>• You can access Profile, Messages, and Notifications during review</li>
              <li>• Other features will be unlocked after approval</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMCProfileRegister;
