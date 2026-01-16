import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
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
  List,
  X,
  CreditCard,
  Clock,
  Calendar,
  Shield,
} from "lucide-react";

const HotelProfileRegister = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    country: "",
    contactEmail: user?.email || "",
    contactNumber: "",
    website: "",
    amenities: "",
    totalRooms: "",
    roomEnvironment: "",      // AC / Non-AC / Mixed
    hotelStars: 1,            // 1-5
    termsAndConditions: "",   // comma separated
  });

  const [certificationFiles, setCertificationFiles] = useState([]);
  const [certificationPreviews, setCertificationPreviews] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

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
      const response = await api.get("/hotel/profile");
      const profile = response.data.data;
      setExistingProfile(profile);

      setFormData({
        name: profile.name || "",
        description: profile.description || "",
        address: profile.address || "",
        city: profile.city || "",
        country: profile.country || "",
        contactEmail: profile.contactEmail || user?.email || "",
        contactNumber: profile.contactNumber || "",
        website: profile.website || "",
        amenities: profile.amenities?.join(", ") || "",
        totalRooms: profile.totalRooms || "",
        roomEnvironment: profile.roomEnvironment || "",
        hotelStars: profile.hotelStars || 1,
        termsAndConditions: profile.termsAndConditions?.join(", ") || "",
      });

      if (profile.certifications?.length) {
        setCertificationPreviews(profile.certifications.map((c) => c));
      }

      if (profile.galleryImages?.length) {
        setGalleryPreviews(profile.galleryImages.map((g) => g));
      }
    } catch {
      console.log("No existing profile found");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCertificationChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > 50 * 1024 * 1024)) {
      toast.error("Each certification file must be smaller than 50MB");
      return;
    }
    setCertificationFiles(files);
    setCertificationPreviews(files.map((f) => f.name));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((f) => f.size > 10 * 1024 * 1024)) {
      toast.error("Each gallery image must be smaller than 10MB");
      return;
    }
    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (type, index) => {
    if (type === "cert") {
      setCertificationPreviews((prev) => prev.filter((_, i) => i !== index));
      setCertificationFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
      setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      const payload = {
        ...formData,
        amenities: formData.amenities.split(",").map((a) => a.trim()),
        termsAndConditions: formData.termsAndConditions.split(",").map((t) => t.trim()),
      };
      submitData.append("profile", new Blob([JSON.stringify(payload)], { type: "application/json" }));

      certificationFiles.forEach((file) => submitData.append("certifications", file));
      galleryFiles.forEach((file) => submitData.append("galleryImages", file));

      await api.post("/hotel/profile", submitData, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success(
        existingProfile
          ? "Profile updated and resubmitted successfully!"
          : "Profile registered successfully! Waiting for admin approval."
      );

      navigate("/hotel/dashboard");
    } catch (error) {
      console.error("Profile registration error:", error);
      toast.error(error.response?.data?.message || "Failed to register profile");
    } finally {
      setLoading(false);
    }
  };

  const isRejected = existingProfile?.status === "REJECTED";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-6">
          <button
            onClick={() => navigate("/hotel/dashboard")}
            className="flex items-center text-teal-600 hover:text-teal-700 mb-4 font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {existingProfile ? "Update Hotel Profile" : "Complete Hotel Profile Registration"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isRejected
              ? "Your previous submission was rejected. Please update and resubmit your profile."
              : "Provide your hotel details to access all platform features"}
          </p>
        </div>

        {isRejected && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
            <h3 className="text-sm font-semibold text-red-800 mb-2">Profile Rejected</h3>
            <p className="text-sm text-red-700">
              <strong>Reason:</strong> {existingProfile.currentRejectionReason || "Not specified"}
            </p>
          </div>
        )}

        {/* Subscription Status Card */}
        {subscription && !subscription.isPendingApproval && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-lg shadow-sm p-6 mb-6 border border-teal-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-teal-600" />
                Subscription Status
              </h2>
              <button
                onClick={() => navigate('/subscription/purchase')}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium"
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
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-teal-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-teal-900">Profile Pending Approval</h3>
                <p className="text-sm text-teal-700 mt-1">
                  Complete your profile below and submit for review. Your 30-day free trial will begin once your profile is approved by our admin team.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Address */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities (comma separated)</label>
              <input type="text" name="amenities" value={formData.amenities} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Total Rooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms *</label>
              <input type="number" name="totalRooms" value={formData.totalRooms} onChange={handleInputChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Room Environment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Environment *</label>
              <select name="roomEnvironment" value={formData.roomEnvironment} onChange={handleInputChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                <option value="">Select environment</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* Hotel Stars */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Stars *</label>
              <select name="hotelStars" value={formData.hotelStars} onChange={handleInputChange} required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                {[1,2,3,4,5].map((n) => (
                  <option key={n} value={n}>{n} Star{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Terms & Conditions (comma separated)</label>
              <textarea name="termsAndConditions" value={formData.termsAndConditions} onChange={handleInputChange} rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Certifications Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" /> Certifications (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  id="certifications"
                  multiple
                  onChange={handleCertificationChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="certifications" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, JPEG, PNG (Max 50MB each)
                  </p>
                </label>
              </div>
              {certificationPreviews.length > 0 && (
                <ul className="mt-2 text-sm text-teal-600 space-y-1">
                  {certificationPreviews.map((file, i) => (
                    <li key={i} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" /> {file}
                      <button type="button" className="ml-2 text-red-500" onClick={() => removePreview("cert", i)}>
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" /> Gallery Images (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  id="galleryImages"
                  multiple
                  onChange={handleGalleryChange}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
                <label htmlFor="galleryImages" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, JPEG, PNG (Max 10MB each)
                  </p>
                </label>
              </div>
              {galleryPreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {galleryPreviews.map((url, i) => (
                    <div key={i} className="relative">
                      <img src={url} alt={`gallery-${i}`} className="w-full h-24 object-cover rounded-lg border" />
                      <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        onClick={() => removePreview("gallery", i)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t">
              <button type="button" onClick={() => navigate("/hotel/dashboard")}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button type="submit" disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-300">
                {loading ? <><Loader className="w-5 h-5 mr-2 animate-spin" />Submitting...</> :
                <><CheckCircle className="w-5 h-5 mr-2" />{existingProfile ? "Update & Resubmit" : "Submit for Approval"}</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HotelProfileRegister;
