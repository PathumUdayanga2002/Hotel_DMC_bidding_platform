import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { X, Plus, Calendar, DollarSign, Users, Home, Utensils, ArrowLeft, ArrowRight } from 'lucide-react';
import {
  SRI_LANKAN_CITIES,
  ROOM_TYPES,
  MEAL_PLANS,
  CURRENCIES,
  validateDateRange,
  validateBudget
} from '../utils/bidInquiryUtils';

const DMCDirectInquiry = () => {
  const navigate = useNavigate();
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

    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return false;
    }

    const dateValidation = validateDateRange(formData.checkInDate, formData.checkOutDate);
    if (dateValidation) {
      toast.error(dateValidation);
      return false;
    }

    if (formData.budgetMin && formData.budgetMax) {
      const budgetValidation = validateBudget(formData.budgetMin, formData.budgetMax);
      if (budgetValidation) {
        toast.error(budgetValidation);
        return false;
      }
    }

    if (formData.numberOfRooms < 1) {
      toast.error('Number of rooms must be at least 1');
      return false;
    }

    if (formData.numberOfAdults < 1) {
      toast.error('Number of adults must be at least 1');
      return false;
    }

    return true;
  };

  const handleSelectHotels = () => {
    if (!validateForm()) {
      return;
    }

    // Navigate to hotel selection page with form data
    navigate('/dmc/direct-inquiries/select-hotels', { state: { inquiryData: formData } });
  };

  const filteredCities = SRI_LANKAN_CITIES.filter(city =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Direct Inquiry</h1>
              <p className="text-gray-600 mt-2">Create a direct inquiry and send it to specific hotels</p>
            </div>
            <button
              onClick={() => navigate('/dmc/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
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
                  placeholder="e.g., Family Vacation in Colombo & Kandy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="Provide detailed information about your accommodation needs..."
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates & Guests */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Dates & Guests
            </h2>
            
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Number of Rooms *
                </label>
                <input
                  type="number"
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Number of Adults *
                </label>
                <input
                  type="number"
                  name="numberOfAdults"
                  value={formData.numberOfAdults}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Number of Children
                </label>
                <input
                  type="number"
                  name="numberOfChildren"
                  value={formData.numberOfChildren}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Room & Meal Preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-1" />
                  Preferred Room Types
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.values(ROOM_TYPES).map((roomType) => (
                    <button
                      key={roomType}
                      type="button"
                      onClick={() => handleRoomTypeToggle(roomType)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        formData.preferredRoomTypes.includes(roomType)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {roomType}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Utensils className="w-4 h-4 mr-1" />
                  Preferred Meal Plans
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.values(MEAL_PLANS).map((mealPlan) => (
                    <button
                      key={mealPlan}
                      type="button"
                      onClick={() => handleMealPlanToggle(mealPlan)}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        formData.preferredMealPlans.includes(mealPlan)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {mealPlan}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Budget Range
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
                  min="0"
                  step="0.01"
                  placeholder="Min"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  min="0"
                  step="0.01"
                  placeholder="Max"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  placeholder="e.g., Wheelchair accessibility, pet-friendly, etc."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  placeholder="Any other information that might be helpful..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={() => navigate('/dmc/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSelectHotels}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
              >
                <span>Select Hotels</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DMCDirectInquiry;
