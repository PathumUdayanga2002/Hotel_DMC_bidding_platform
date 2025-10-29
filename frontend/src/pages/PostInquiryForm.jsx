import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X, Plus, Calendar, DollarSign, Users, Home, Utensils, ArrowLeft } from 'lucide-react';
import { createBidInquiry } from '../services/bidInquiryService';
import {
  SRI_LANKAN_CITIES,
  ROOM_TYPES,
  MEAL_PLANS,
  CURRENCIES,
  validateDateRange,
  validateBudget
} from '../utils/bidInquiryUtils';

const PostInquiryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destinationCities: [],
    country: 'Sri Lanka',
    checkInDate: '',
    checkOutDate: '',
    numberOfRooms: 1,
    numberOfAdults: 2,
    numberOfChildren: 0,
    preferredRoomTypes: [],
    preferredMealPlans: [],
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    specialRequirements: '',
    specialNotes: ''
  });

  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCitySelect = (city) => {
    if (!formData.destinationCities.includes(city)) {
      setFormData(prev => ({
        ...prev,
        destinationCities: [...prev.destinationCities, city]
      }));
    }
    setCitySearch('');
    setShowCityDropdown(false);
  };

  const handleCityRemove = (cityToRemove) => {
    setFormData(prev => ({
      ...prev,
      destinationCities: prev.destinationCities.filter(city => city !== cityToRemove)
    }));
  };

  const handleRoomTypeToggle = (roomType) => {
    setFormData(prev => {
      const types = prev.preferredRoomTypes.includes(roomType)
        ? prev.preferredRoomTypes.filter(t => t !== roomType)
        : [...prev.preferredRoomTypes, roomType];
      return { ...prev, preferredRoomTypes: types };
    });
  };

  const handleMealPlanToggle = (mealPlan) => {
    setFormData(prev => {
      const plans = prev.preferredMealPlans.includes(mealPlan)
        ? prev.preferredMealPlans.filter(p => p !== mealPlan)
        : [...prev.preferredMealPlans, mealPlan];
      return { ...prev, preferredMealPlans: plans };
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter an inquiry title');
      return false;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return false;
    }

    if (formData.destinationCities.length === 0) {
      toast.error('Please select at least one destination city');
      return false;
    }

    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    const dateError = validateDateRange(formData.checkInDate, formData.checkOutDate);
    if (dateError) {
      toast.error(dateError);
      return false;
    }

    if (formData.budgetMin && formData.budgetMax) {
      const budgetError = validateBudget(formData.budgetMin, formData.budgetMax);
      if (budgetError) {
        toast.error(budgetError);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createBidInquiry({
        ...formData,
        budgetMin: parseFloat(formData.budgetMin) || null,
        budgetMax: parseFloat(formData.budgetMax) || null,
        numberOfRooms: parseInt(formData.numberOfRooms),
        numberOfAdults: parseInt(formData.numberOfAdults),
        numberOfChildren: parseInt(formData.numberOfChildren)
      });

      toast.success('Inquiry posted successfully! Hotels will be notified.');
      navigate('/dmc/inquiries');
    } catch (error) {
      console.error('Error creating inquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to post inquiry');
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = SRI_LANKAN_CITIES.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase()) &&
    !formData.destinationCities.includes(city)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dmc/inquiries')}
            className="flex items-center text-cyan-600 hover:text-cyan-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Inquiries
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Post New Bid Inquiry</h1>
          <p className="text-gray-600 mt-2">
            Create a new inquiry and receive competitive bids from approved hotels within 48 hours
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inquiry Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., 5-Day Luxury Tour to Kandy & Galle"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your requirements in detail..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Destination */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
              Destination
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Cities * (Multiple selection)
              </label>
              
              {/* Selected Cities */}
              {formData.destinationCities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.destinationCities.map(city => (
                    <span
                      key={city}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-100 text-cyan-800"
                    >
                      {city}
                      <button
                        type="button"
                        onClick={() => handleCityRemove(city)}
                        className="ml-2 hover:text-cyan-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* City Search */}
              <div className="relative">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  placeholder="Search and select cities..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                
                {/* City Dropdown */}
                {showCityDropdown && filteredCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredCities.map(city => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-4 py-2 hover:bg-cyan-50 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Travel Dates */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Travel Dates</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Guest Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-cyan-600" />
              Guest Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Adults *
                </label>
                <input
                  type="number"
                  name="numberOfAdults"
                  value={formData.numberOfAdults}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Children
                </label>
                <input
                  type="number"
                  name="numberOfChildren"
                  value={formData.numberOfChildren}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
          </section>

          {/* Room Preferences */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2 text-cyan-600" />
              Room Preferences
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Room Types (Multiple selection)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map(roomType => (
                    <button
                      key={roomType.value}
                      type="button"
                      onClick={() => handleRoomTypeToggle(roomType.value)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        formData.preferredRoomTypes.includes(roomType.value)
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-600'
                      }`}
                    >
                      {roomType.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Utensils className="w-4 h-4 mr-2" />
                  Preferred Meal Plans (Multiple selection)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MEAL_PLANS.map(mealPlan => (
                    <button
                      key={mealPlan.value}
                      type="button"
                      onClick={() => handleMealPlanToggle(mealPlan.value)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        formData.preferredMealPlans.includes(mealPlan.value)
                          ? 'bg-cyan-600 text-white border-cyan-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-600'
                      }`}
                    >
                      {mealPlan.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Budget */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-cyan-600" />
              Budget (Per Room Per Night)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Budget
                </label>
                <input
                  type="number"
                  name="budgetMin"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Budget
                </label>
                <input
                  type="number"
                  name="budgetMax"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {CURRENCIES.map(curr => (
                    <option key={curr.value} value={curr.value}>
                      {curr.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Special Requirements */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  rows="3"
                  placeholder="e.g., Wheelchair accessible, Near beach, Spa facilities..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes
                </label>
                <textarea
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any additional notes or preferences..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/dmc/inquiries')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Post Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInquiryForm;
