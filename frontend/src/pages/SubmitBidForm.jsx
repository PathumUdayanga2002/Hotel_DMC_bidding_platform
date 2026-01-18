import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Home,
  Utensils,
  DollarSign,
  FileText,
  Loader2,
  AlertTriangle,
  Check,
  Calculator,
  Eye,
  X
} from 'lucide-react';
import { getInquiryDetailsForHotel, submitBid } from '../services/bidInquiryService';
import {
  ROOM_TYPES,
  MEAL_PLANS,
  formatDate,
  formatPrice,
  getTimeRemaining,
  validateBidPrice,
  getRoomTypeLabel,
  getMealPlanLabel,
  calculateTotalPrice,
  isDeadlinePassed
} from '../utils/bidInquiryUtils';

const SubmitBidForm = () => {
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    bidTitle: '',
    pricePerRoomPerNight: '',
    totalPrice: '',
    availableRooms: '',
    currency: '',
    roomType: '',
    mealPlan: '',
    bidDescription: '',
    specialOffer: '',
    termsAndConditions: '',
    validityDate: '',
    amenities: [],
    availableFrom: '',
    availableTo: '',
    openToNegotiation: false
  });

  const [errors, setErrors] = useState({});
  const [showInquiryDetails, setShowInquiryDetails] = useState(false);

  useEffect(() => {
    fetchInquiryDetails();
  }, [inquiryId]);

  const fetchInquiryDetails = async () => {
    try {
      const response = await getInquiryDetailsForHotel(inquiryId);
      setInquiry(response);
      
      // Pre-fill dates and currency with inquiry data
      setFormData(prev => ({
        ...prev,
        availableFrom: response.checkInDate,
        availableTo: response.checkOutDate,
        currency: response.currency || 'USD'
      }));
    } catch (error) {
      console.error('Error fetching inquiry:', error);
      toast.error('Failed to load inquiry details');
      navigate('/hotel/inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // Auto-calculate totalPrice when pricePerRoomPerNight changes
      if (name === 'pricePerRoomPerNight' && value && inquiry) {
        const calculatedTotal = parseFloat(value) * inquiry.numberOfRooms * inquiry.numberOfNights;
        newFormData.totalPrice = calculatedTotal.toFixed(2);
      }
      
      return newFormData;
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bidTitle || formData.bidTitle.trim().length < 10) {
      newErrors.bidTitle = 'Bid title is required (minimum 10 characters)';
    }

    if (!formData.pricePerRoomPerNight || parseFloat(formData.pricePerRoomPerNight) <= 0) {
      newErrors.pricePerRoomPerNight = 'Please enter a valid price';
    } else if (inquiry.budgetMin && inquiry.budgetMax) {
      const priceValidation = validateBidPrice(
        parseFloat(formData.pricePerRoomPerNight),
        inquiry.budgetMin,
        inquiry.budgetMax
      );
      if (!priceValidation.isValid) {
        newErrors.pricePerRoomPerNight = priceValidation.message;
      }
    }

    if (!formData.totalPrice || parseFloat(formData.totalPrice) <= 0) {
      newErrors.totalPrice = 'Please enter a valid total price';
    }

    if (!formData.availableRooms || parseInt(formData.availableRooms) <= 0) {
      newErrors.availableRooms = 'Please enter number of available rooms';
    }

    if (!formData.roomType) {
      newErrors.roomType = 'Please select a room type';
    }

    if (!formData.mealPlan) {
      newErrors.mealPlan = 'Please select a meal plan';
    }

    if (!formData.currency) {
      newErrors.currency = 'Please select a currency';
    }

    if (!formData.bidDescription || formData.bidDescription.trim().length < 20) {
      newErrors.bidDescription = 'Please provide a description (minimum 20 characters)';
    }

    if (!formData.termsAndConditions || formData.termsAndConditions.trim().length < 50) {
      newErrors.termsAndConditions = 'Terms and conditions are required (minimum 50 characters)';
    }

    if (!formData.validityDate) {
      newErrors.validityDate = 'Please select bid validity date';
    } else if (new Date(formData.validityDate) <= new Date()) {
      newErrors.validityDate = 'Validity date must be in the future';
    }

    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Please select availability start date';
    }

    if (!formData.availableTo) {
      newErrors.availableTo = 'Please select availability end date';
    }

    if (formData.availableFrom && formData.availableTo) {
      if (new Date(formData.availableTo) <= new Date(formData.availableFrom)) {
        newErrors.availableTo = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    
    // Show toast notifications for each error
    if (Object.keys(newErrors).length > 0) {
      // Show the first 3 errors to avoid overwhelming the user
      const errorMessages = Object.values(newErrors).slice(0, 3);
      errorMessages.forEach((message, index) => {
        setTimeout(() => {
          toast.error(message, {
            position: "top-right",
            autoClose: 4000,
          });
        }, index * 200); // Stagger the toasts slightly
      });
      
      if (Object.keys(newErrors).length > 3) {
        setTimeout(() => {
          toast.warning(`${Object.keys(newErrors).length - 3} more field(s) need attention`, {
            position: "top-right",
            autoClose: 4000,
          });
        }, 600);
      }
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Validation function now handles toast notifications
      return;
    }

    setSubmitting(true);
    try {
      const bidData = {
        inquiryId,
        bidTitle: formData.bidTitle.trim(),
        pricePerRoomPerNight: parseFloat(formData.pricePerRoomPerNight),
        totalPrice: parseFloat(formData.totalPrice),
        availableRooms: parseInt(formData.availableRooms),
        currency: formData.currency,
        roomType: formData.roomType,
        mealPlan: formData.mealPlan,
        bidDescription: formData.bidDescription.trim(),
        termsAndConditions: formData.termsAndConditions.trim(),
        validityDate: formData.validityDate,
        specialOffer: formData.specialOffer.trim() || null,
        includedAmenities: formData.amenities.length > 0 ? formData.amenities : null,
        additionalNotes: `Available from ${formData.availableFrom} to ${formData.availableTo}`,
        openToNegotiation: formData.openToNegotiation
      };

      await submitBid(bidData);
      toast.success('Bid submitted successfully!');
      navigate('/hotel/bids');
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast.error(error.response?.data?.message || 'Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
      </div>
    );
  }

  if (!inquiry) return null;

  const deadlinePassed = isDeadlinePassed(inquiry.deadline);
  const totalPrice = formData.pricePerRoomPerNight
    ? calculateTotalPrice(
        parseFloat(formData.pricePerRoomPerNight),
        inquiry.numberOfRooms,
        inquiry.numberOfNights
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/hotel/inquiries')}
            className="flex items-center text-cyan-600 hover:text-cyan-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Available Inquiries
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Your Bid</h1>
          <p className="text-gray-600">Review the inquiry details and submit your competitive bid</p>
        </div>

        {deadlinePassed && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Deadline Passed</p>
                <p className="text-sm text-red-700 mt-1">
                  The bidding deadline for this inquiry has passed. You can no longer submit a bid.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bid Title Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Bid Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bid Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="bidTitle"
                    value={formData.bidTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Beach Resort - Premium Rooms with Ocean View"
                    disabled={deadlinePassed}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      errors.bidTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.bidTitle && (
                    <p className="text-red-500 text-sm mt-1">{errors.bidTitle}</p>
                  )}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-cyan-600" />
                  Pricing
                </h2>

                <div className="space-y-4">
                  {/* Currency Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.currency ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select currency</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="LKR">LKR - Sri Lankan Rupee</option>
                      <option value="INR">INR - Indian Rupee</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                    {errors.currency && (
                      <p className="text-red-500 text-sm mt-1">{errors.currency}</p>
                    )}
                    {inquiry.currency && (
                      <p className="text-xs text-gray-500 mt-1">
                        Inquiry currency: {inquiry.currency}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Room per Night <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {formData.currency === 'USD' ? '$' :
                         formData.currency === 'EUR' ? '€' :
                         formData.currency === 'GBP' ? '£' : 'LKR'}
                      </span>
                      <input
                        type="number"
                        name="pricePerRoomPerNight"
                        value={formData.pricePerRoomPerNight}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        disabled={deadlinePassed}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                          errors.pricePerRoomPerNight ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.pricePerRoomPerNight && (
                      <p className="text-red-500 text-sm mt-1">{errors.pricePerRoomPerNight}</p>
                    )}
                    {inquiry.budgetMin && inquiry.budgetMax && formData.currency && (
                      <p className="text-xs text-gray-500 mt-1">
                        Budget range: {formatPrice(inquiry.budgetMin, formData.currency)} - {formatPrice(inquiry.budgetMax, formData.currency)}
                      </p>
                    )}
                  </div>

                  {/* Total Price Calculator */}
                  {formData.pricePerRoomPerNight && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Calculator className="w-5 h-5 text-cyan-600 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-cyan-900 mb-2">Price Calculation:</p>
                          <p className="text-xs text-cyan-700">
                            {formatPrice(parseFloat(formData.pricePerRoomPerNight), formData.currency)} × {inquiry.numberOfRooms} rooms × {inquiry.numberOfNights} nights
                          </p>
                          <p className="text-lg font-bold text-cyan-900 mt-2">
                            Total: {formatPrice(totalPrice, formData.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          {formData.currency === 'USD' ? '$' :
                           formData.currency === 'EUR' ? '€' :
                           formData.currency === 'GBP' ? '£' : 'LKR'}
                        </span>
                        <input
                          type="number"
                          name="totalPrice"
                          value={formData.totalPrice}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          disabled={deadlinePassed}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                            errors.totalPrice ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.totalPrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.totalPrice}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Rooms <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="availableRooms"
                        value={formData.availableRooms}
                        onChange={handleInputChange}
                        min="1"
                        placeholder="Number of rooms available"
                        disabled={deadlinePassed}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                          errors.availableRooms ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.availableRooms && (
                        <p className="text-red-500 text-sm mt-1">{errors.availableRooms}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Inquiry requests: {inquiry.numberOfRooms} rooms
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Validity Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="validityDate"
                      value={formData.validityDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.validityDate ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.validityDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.validityDate}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      How long is this bid valid?
                    </p>
                  </div>
                </div>
              </div>

              {/* Room Details Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-cyan-600" />
                  Room Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="roomType"
                      value={formData.roomType}
                      onChange={handleInputChange}
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.roomType ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select room type</option>
                      {Object.entries(ROOM_TYPES).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    {errors.roomType && (
                      <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>
                    )}
                    {inquiry.preferredRoomTypes?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Preferred: {inquiry.preferredRoomTypes.map(t => getRoomTypeLabel(t)).join(', ')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meal Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="mealPlan"
                      value={formData.mealPlan}
                      onChange={handleInputChange}
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.mealPlan ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select meal plan</option>
                      {Object.entries(MEAL_PLANS).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value}
                        </option>
                      ))}
                    </select>
                    {errors.mealPlan && (
                      <p className="text-red-500 text-sm mt-1">{errors.mealPlan}</p>
                    )}
                    {inquiry.preferredMealPlans?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Preferred: {inquiry.preferredMealPlans.map(p => getMealPlanLabel(p)).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Availability Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
                  Availability
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleInputChange}
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.availableFrom ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.availableFrom && (
                      <p className="text-red-500 text-sm mt-1">{errors.availableFrom}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="availableTo"
                      value={formData.availableTo}
                      onChange={handleInputChange}
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.availableTo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.availableTo && (
                      <p className="text-red-500 text-sm mt-1">{errors.availableTo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Hotel Amenities</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Swimming Pool', 'Spa & Wellness', 'Free WiFi', 'Parking', 'Restaurant', 'Bar', 
                    'Gym', 'Airport Transfer', 'Room Service', 'Laundry', 'Conference Room', 'Kids Club'].map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        disabled={deadlinePassed}
                        className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-cyan-600" />
                  Bid Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="bidDescription"
                      value={formData.bidDescription}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your hotel, location, unique features, and why the DMC should choose your bid..."
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none ${
                        errors.bidDescription ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.bidDescription && (
                      <p className="text-red-500 text-sm mt-1">{errors.bidDescription}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.bidDescription.length} / minimum 20 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Offer (Optional)
                    </label>
                    <textarea
                      name="specialOffer"
                      value={formData.specialOffer}
                      onChange={handleInputChange}
                      rows={2}
                      placeholder="Any special discounts, complimentary services, or promotional offers..."
                      disabled={deadlinePassed}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Cancellation policy, payment terms, additional charges, etc..."
                      disabled={deadlinePassed}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none ${
                        errors.termsAndConditions ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.termsAndConditions && (
                      <p className="text-red-500 text-sm mt-1">{errors.termsAndConditions}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="openToNegotiation"
                        checked={formData.openToNegotiation}
                        onChange={handleInputChange}
                        disabled={deadlinePassed}
                        className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                      />
                      <span className="text-sm text-gray-700">Open to price negotiation</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/hotel/inquiries')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || deadlinePassed}
                  className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Submit Bid
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Inquiry Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Summary</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Title</label>
                  <p className="text-sm font-medium text-gray-900">{inquiry.title}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Destinations
                  </label>
                  <p className="text-sm text-gray-900">
                    {inquiry.destinationCities?.join(', ')}
                  </p>
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Dates
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDate(inquiry.checkInDate)} - {formatDate(inquiry.checkOutDate)}
                  </p>
                  <p className="text-xs text-gray-500">{inquiry.numberOfNights} nights</p>
                </div>

                <div>
                  <label className="text-xs text-gray-600 flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Guests
                  </label>
                  <p className="text-sm text-gray-900">
                    {inquiry.numberOfRooms} Rooms
                  </p>
                  <p className="text-xs text-gray-500">
                    {inquiry.numberOfAdults} Adults, {inquiry.numberOfChildren} Children
                  </p>
                </div>

                <div className="pt-3 border-t">
                  <label className="text-xs text-gray-600">Deadline</label>
                  <p className="text-sm font-medium text-cyan-600">
                    {getTimeRemaining(inquiry.deadline)}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(inquiry.deadline)}</p>
                </div>

                {/* View Full Details Button */}
                <button
                  onClick={() => setShowInquiryDetails(true)}
                  className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Details Modal */}
        {showInquiryDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Inquiry Full Details</h2>
                <button
                  onClick={() => setShowInquiryDetails(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Inquiry Title</label>
                      <p className="text-sm text-gray-900">{inquiry.title}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Status</label>
                      <p className="text-sm text-gray-900">{inquiry.status}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Deadline</label>
                      <p className="text-sm text-gray-900">{formatDate(inquiry.deadline)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Currency</label>
                      <p className="text-sm text-gray-900">{inquiry.currency}</p>
                    </div>
                  </div>
                </div>

                {/* Inquiry Description */}
                {inquiry.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Inquiry Description</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {inquiry.description}
                    </p>
                  </div>
                )}

                {/* Destination & Dates */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Destination & Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        Destinations
                      </label>
                      <p className="text-sm text-gray-900">{inquiry.destinationCities?.join(', ')}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Check-in Date
                      </label>
                      <p className="text-sm text-gray-900">{formatDate(inquiry.checkInDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Check-out Date
                      </label>
                      <p className="text-sm text-gray-900">{formatDate(inquiry.checkOutDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Number of Nights</label>
                      <p className="text-sm text-gray-900">{inquiry.numberOfNights}</p>
                    </div>
                  </div>
                </div>

                {/* Guest Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Guest Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Number of Rooms</label>
                      <p className="text-sm text-gray-900">{inquiry.numberOfRooms}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Adults</label>
                      <p className="text-sm text-gray-900">{inquiry.numberOfAdults}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Children</label>
                      <p className="text-sm text-gray-900">{inquiry.numberOfChildren}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Total Guests</label>
                      <p className="text-sm text-gray-900">{inquiry.numberOfAdults + inquiry.numberOfChildren}</p>
                    </div>
                  </div>
                </div>

                {/* Budget & Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Budget & Preferences</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inquiry.budgetMin && inquiry.budgetMax && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Budget Range</label>
                        <p className="text-sm text-gray-900">
                          {formatPrice(inquiry.budgetMin, inquiry.currency)} - {formatPrice(inquiry.budgetMax, inquiry.currency)}
                        </p>
                      </div>
                    )}
                    {inquiry.preferredRoomTypes?.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Preferred Room Types</label>
                        <p className="text-sm text-gray-900">
                          {inquiry.preferredRoomTypes.map(t => getRoomTypeLabel(t)).join(', ')}
                        </p>
                      </div>
                    )}
                    {inquiry.preferredMealPlans?.length > 0 && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Preferred Meal Plans</label>
                        <p className="text-sm text-gray-900">
                          {inquiry.preferredMealPlans.map(p => getMealPlanLabel(p)).join(', ')}
                        </p>
                      </div>
                    )}
                    {inquiry.tripType && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Trip Type</label>
                        <p className="text-sm text-gray-900">{inquiry.tripType}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Special Requirements */}
                {inquiry.specialRequirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requirements</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {inquiry.specialRequirements}
                    </p>
                  </div>
                )}

                {/* Additional Notes */}
                {inquiry.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {inquiry.additionalNotes}
                    </p>
                  </div>
                )}

                {/* Contact Information */}
                {(inquiry.contactName || inquiry.contactEmail || inquiry.contactPhone) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inquiry.contactName && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Contact Name</label>
                          <p className="text-sm text-gray-900">{inquiry.contactName}</p>
                        </div>
                      )}
                      {inquiry.contactEmail && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Contact Email</label>
                          <p className="text-sm text-gray-900">{inquiry.contactEmail}</p>
                        </div>
                      )}
                      {inquiry.contactPhone && (
                        <div>
                          <label className="text-xs font-medium text-gray-600">Contact Phone</label>
                          <p className="text-sm text-gray-900">{inquiry.contactPhone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Inquiry Metadata */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Inquiry Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inquiry.id && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Inquiry ID</label>
                        <p className="text-xs text-gray-600 font-mono break-all">{inquiry.id}</p>
                      </div>
                    )}
                    {inquiry.createdAt && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Created On</label>
                        <p className="text-sm text-gray-900">{formatDate(inquiry.createdAt)}</p>
                      </div>
                    )}
                    {inquiry.updatedAt && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Last Updated</label>
                        <p className="text-sm text-gray-900">{formatDate(inquiry.updatedAt)}</p>
                      </div>
                    )}
                    {inquiry.source && (
                      <div>
                        <label className="text-xs font-medium text-gray-600">Inquiry Source</label>
                        <p className="text-sm text-gray-900">{inquiry.source}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
                <button
                  onClick={() => setShowInquiryDetails(false)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitBidForm;
