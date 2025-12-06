import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Building2,
  Mail,
  Phone,
  Globe,
  Check
} from 'lucide-react';
import { hotelService } from '../services/hotelService';
import { directInquiryService } from '../services/directInquiryService';

const DMCHotelSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inquiryData = location.state?.inquiryData;

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!inquiryData) {
      toast.error('No inquiry data found. Please fill the form first.');
      navigate('/dmc/direct-inquiries');
      return;
    }
    fetchApprovedHotels();
  }, []);

  useEffect(() => {
    filterHotels();
  }, [searchQuery, hotels]);

  const fetchApprovedHotels = async () => {
    try {
      setLoading(true);
      const response = await hotelService.getApprovedHotels();
      console.log('Hotels response:', response);
      
      // Handle the response structure - response.data contains the ApiResponse
      const apiResponse = response.data;
      if (apiResponse && apiResponse.success) {
        setHotels(apiResponse.data || []);
        setFilteredHotels(apiResponse.data || []);
      } else {
        toast.error('Failed to load hotels');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      console.error('Error response:', error.response);
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please logout and login again as a DMC user.');
      } else {
        toast.error('Failed to load hotels. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterHotels = () => {
    if (!searchQuery.trim()) {
      setFilteredHotels(hotels);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = hotels.filter(hotel => {
      const profile = hotel.profile || {};
      return (
        profile.hotelName?.toLowerCase().includes(query) ||
        profile.city?.toLowerCase().includes(query) ||
        profile.address?.toLowerCase().includes(query) ||
        profile.description?.toLowerCase().includes(query)
      );
    });
    setFilteredHotels(filtered);
  };

  const handleHotelToggle = (hotelId) => {
    setSelectedHotels(prev => {
      if (prev.includes(hotelId)) {
        return prev.filter(id => id !== hotelId);
      } else {
        return [...prev, hotelId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedHotels.length === 0) {
      toast.warning('Please select at least one hotel');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        ...inquiryData,
        hotelIds: selectedHotels
      };

      await directInquiryService.createDirectInquiry(payload);
      
      toast.success(`Direct inquiry sent to ${selectedHotels.length} hotel(s) successfully!`);
      navigate('/dmc/dashboard');
    } catch (error) {
      console.error('Error submitting direct inquiry:', error);
      toast.error(error.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/dmc/direct-inquiries', { state: { inquiryData } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hotels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Select Hotels</h1>
              <p className="text-gray-600 mt-2">
                Choose one or more hotels to send your direct inquiry
              </p>
            </div>
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Form</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search hotels by name, city, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Selection Summary */}
          {selectedHotels.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                {selectedHotels.length} hotel(s) selected
              </p>
            </div>
          )}
        </div>

        {/* Hotels Grid */}
        {filteredHotels.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No hotels found' : 'No approved hotels available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'There are currently no approved hotels in the system'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const profile = hotel.profile || {};
              const isSelected = selectedHotels.includes(hotel.id);

              return (
                <div
                  key={hotel.id}
                  onClick={() => handleHotelToggle(hotel.id)}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                >
                  {/* Selection Indicator */}
                  <div className="relative">
                    {profile.logoUrl ? (
                      <img
                        src={profile.logoUrl}
                        alt={profile.hotelName}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2">
                        <Check className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1">
                        {profile.hotelName || 'Hotel Name Not Available'}
                      </h3>
                      {profile.starRating && (
                        <div className="flex items-center text-yellow-500 ml-2">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="ml-1 text-sm font-medium">{profile.starRating}</span>
                        </div>
                      )}
                    </div>

                    {profile.city && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{profile.city}</span>
                      </div>
                    )}

                    {profile.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {profile.description}
                      </p>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-2 pt-4 border-t border-gray-200">
                      {profile.email && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{profile.email}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{profile.website}</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    {profile.address && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {profile.address}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons */}
        {filteredHotels.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={handleBack}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || selectedHotels.length === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirm & Send ({selectedHotels.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DMCHotelSelection;
