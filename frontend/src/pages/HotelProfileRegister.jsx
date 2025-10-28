import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Building2,
  MapPin,
  Globe,
  Phone,
  Mail,
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle,
  Loader,
  Home,
  ImageIcon,
  Award,
  List
} from 'lucide-react';

const HotelProfileRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    contactEmail: user?.email || '',
    contactNumber: '',
    website: '',
    amenities: '',
    galleryImages: '',
    totalRooms: '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      const response = await api.get('/hotel/profile');
      const profile = response.data.data;
      setExistingProfile(profile);

      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || '',
        contactEmail: profile.contactEmail || user?.email || '',
        contactNumber: profile.contactNumber || '',
        website: profile.website || '',
        amenities: profile.amenities?.join(', ') || '',
        galleryImages: profile.galleryImages?.join(', ') || '',
        totalRooms: profile.totalRooms || '',
      });

      if (profile.certifications?.length) {
        setFilePreviews(profile.certifications);
      }
    } catch {
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
    const files = Array.from(e.target.files);
    if (files.some(f => f.size > 50 * 1024 * 1024)) {
      toast.error('Each file must be smaller than 50MB');
      return;
    }
    setSelectedFiles(files);
    setFilePreviews(files.map(f => f.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      const payload = {
        ...formData,
        amenities: formData.amenities.split(',').map(a => a.trim()),
        galleryImages: formData.galleryImages.split(',').map(a => a.trim())
      };

      const profileBlob = new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      });
      submitData.append('profile', profileBlob);

      selectedFiles.forEach(file => {
        submitData.append('certifications', file);
      });

      await api.post('/hotel/profile', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(existingProfile
        ? 'Profile updated and resubmitted successfully! Waiting for admin approval.'
        : 'Profile registered successfully! Waiting for admin approval.'
      );

      navigate('/hotel/dashboard');
    } catch (error) {
      console.error('Profile registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to register profile');
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
            onClick={() => navigate('/hotel/dashboard')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {existingProfile ? 'Update Hotel Profile' : 'Complete Hotel Profile Registration'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRejected
              ? 'Your previous submission was rejected. Please update and resubmit your profile.'
              : 'Provide your hotel details to access all platform features'}
          </p>
        </div>

        {/* Rejection Notice */}
        {isRejected && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Profile Rejected</h3>
            <p className="text-sm text-red-700">
              <strong>Reason:</strong> {existingProfile.currentRejectionReason || 'Not specified'}
            </p>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hotel Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-2" /> Hotel Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter hotel name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" /> Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Briefly describe your hotel"
              />
            </div>

            {/* Address, City, Country */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" /> Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Street address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" /> Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+94771234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" /> Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-2" /> Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="https://yourhotel.com"
              />
            </div>

            {/* Amenities & Gallery */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <List className="w-4 h-4 inline mr-2" /> Amenities (comma separated)
              </label>
              <input
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="Pool, Spa, Free Wi-Fi, Gym"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" /> Gallery Image URLs (comma separated)
              </label>
              <input
                type="text"
                name="galleryImages"
                value={formData.galleryImages}
                onChange={handleInputChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Total Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="w-4 h-4 inline mr-2" /> Total Rooms *
              </label>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Enter total number of rooms"
              />
            </div>

            {/* Certifications Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" /> Certifications (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  id="certifications"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="certifications" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, JPEG, PNG (Max 50MB each)</p>
                </label>
              </div>
              {filePreviews.length > 0 && (
                <ul className="mt-2 text-sm text-green-600 space-y-1">
                  {filePreviews.map((file, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> {file}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/hotel/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 flex items-center"
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
              <li>• Your profile will be reviewed by the admin</li>
              <li>• You will get notified once approved or rejected</li>
              <li>• Pending hotels can still access messages and notifications</li>
              <li>• Full access is unlocked after approval</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelProfileRegister;
