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
  Check,
  X
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
  const [viewingHotel, setViewingHotel] = useState(null); // For details modal

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
        profile.name?.toLowerCase().includes(query) ||
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
                  className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    isSelected ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  {/* Hotel Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-400 to-green-600">
                    {profile.galleryImages && profile.galleryImages.length > 0 ? (
                      <img
                        src={profile.galleryImages[0]}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="w-16 h-16 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                              </svg>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-16 h-16 text-white opacity-80" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-2 shadow-lg">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Hotel Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 flex-1 line-clamp-1">
                        {profile.name || 'Hotel Name Not Available'}
                      </h3>
                      {profile.hotelStars && (
                        <div className="flex items-center text-yellow-500 ml-2">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-sm font-medium">{profile.hotelStars}</span>
                        </div>
                      )}
                    </div>

                    {profile.city && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="text-sm font-medium">{profile.city}</span>
                      </div>
                    )}

                    {profile.address && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {profile.address}
                      </p>
                    )}

                    {profile.description && (
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                        {profile.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingHotel(hotel);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        See Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleHotelToggle(hotel.id);
                        }}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {isSelected ? (
                          <span className="flex items-center justify-center">
                            <Check className="w-4 h-4 mr-1" />
                            Selected
                          </span>
                        ) : (
                          'Select'
                        )}
                      </button>
                    </div>
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

      {/* Hotel Details Modal */}
      {viewingHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewingHotel.profile?.name || 'Hotel Details'}
              </h2>
              <button
                onClick={() => setViewingHotel(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Hotel Images Gallery */}
              {viewingHotel.profile?.galleryImages && viewingHotel.profile.galleryImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Hotel Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {viewingHotel.profile.galleryImages.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden group">
                        <img
                          src={image}
                          alt={`${viewingHotel.profile.name} - ${index + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingHotel.profile?.city && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">City</p>
                        <p className="text-sm text-gray-900">{viewingHotel.profile.city}</p>
                      </div>
                    </div>
                  )}
                  {viewingHotel.profile?.hotelStars && (
                    <div className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5 fill-current" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Star Rating</p>
                        <p className="text-sm text-gray-900">{viewingHotel.profile.hotelStars} Star</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {viewingHotel.profile?.address && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
                  <p className="text-gray-700">{viewingHotel.profile.address}</p>
                </div>
              )}

              {/* Description */}
              {viewingHotel.profile?.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{viewingHotel.profile.description}</p>
                </div>
              )}

              {/* Amenities */}
              {viewingHotel.profile?.amenities && viewingHotel.profile.amenities.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingHotel.profile.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full border border-green-200"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Room Environment */}
              {viewingHotel.profile?.roomEnvironment && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Room Environment</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200">
                      {viewingHotel.profile.roomEnvironment}
                    </span>
                  </div>
                </div>
              )}

              {/* Total Rooms */}
              {viewingHotel.profile?.totalRooms && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Capacity</h3>
                  <p className="text-gray-700">
                    <span className="font-medium">Total Rooms:</span> {viewingHotel.profile.totalRooms}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => setViewingHotel(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleHotelToggle(viewingHotel.id);
                  setViewingHotel(null);
                }}
                className={`px-6 py-2 rounded-lg font-medium ${
                  selectedHotels.includes(viewingHotel.id)
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {selectedHotels.includes(viewingHotel.id) ? 'Remove from Selection' : 'Select This Hotel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DMCHotelSelection;
