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
  Calculator
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
    pricePerRoomPerNight: '',
    roomType: '',
    mealPlan: '',
    bidDescription: '',
    specialOffer: '',
    termsAndConditions: '',
    amenities: [],
    availableFrom: '',
    availableTo: '',
    openToNegotiation: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchInquiryDetails();
  }, [inquiryId]);

  const fetchInquiryDetails = async () => {
    try {
      const response = await getInquiryDetailsForHotel(inquiryId);
      setInquiry(response);
      
      // Pre-fill dates with inquiry dates
      setFormData(prev => ({
        ...prev,
        availableFrom: response.checkInDate,
        availableTo: response.checkOutDate
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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

    if (!formData.roomType) {
      newErrors.roomType = 'Please select a room type';
    }

    if (!formData.mealPlan) {
      newErrors.mealPlan = 'Please select a meal plan';
    }

    if (!formData.bidDescription || formData.bidDescription.trim().length < 20) {
      newErrors.bidDescription = 'Please provide a description (minimum 20 characters)';
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const bidData = {
        inquiryId,
        pricePerRoomPerNight: parseFloat(formData.pricePerRoomPerNight),
        currency: inquiry.currency,
        roomType: formData.roomType,
        mealPlan: formData.mealPlan,
        bidDescription: formData.bidDescription.trim(),
        specialOffer: formData.specialOffer.trim() || null,
        termsAndConditions: formData.termsAndConditions.trim() || null,
        amenities: formData.amenities.length > 0 ? formData.amenities : null,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo,
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
              {/* Pricing Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-cyan-600" />
                  Pricing
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Room per Night <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {inquiry.currency === 'USD' ? '$' :
                         inquiry.currency === 'EUR' ? '€' :
                         inquiry.currency === 'GBP' ? '£' : 'LKR'}
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
                    {inquiry.budgetMin && inquiry.budgetMax && (
                      <p className="text-xs text-gray-500 mt-1">
                        Budget range: {formatPrice(inquiry.budgetMin, inquiry.currency)} - {formatPrice(inquiry.budgetMax, inquiry.currency)}
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
                            {formatPrice(parseFloat(formData.pricePerRoomPerNight), inquiry.currency)} × {inquiry.numberOfRooms} rooms × {inquiry.numberOfNights} nights
                          </p>
                          <p className="text-lg font-bold text-cyan-900 mt-2">
                            Total: {formatPrice(totalPrice, inquiry.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                      Terms & Conditions (Optional)
                    </label>
                    <textarea
                      name="termsAndConditions"
                      value={formData.termsAndConditions}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Cancellation policy, payment terms, additional charges, etc..."
                      disabled={deadlinePassed}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitBidForm;
