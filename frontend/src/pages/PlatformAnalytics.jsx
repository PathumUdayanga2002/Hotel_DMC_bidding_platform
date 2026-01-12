import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Users, 
  Clock, 
  ThumbsUp, 
  AlertCircle,
  Award,
  MapPin,
  Star,
  Filter,
  CreditCard
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states for Top Hotels
  const [sortBy, setSortBy] = useState('totalbids');
  const [minStars, setMinStars] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchAnalytics();
  }, [sortBy, minStars, cityFilter, limit]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for top hotels filter
      const params = new URLSearchParams();
      if (sortBy) params.append('sortBy', sortBy);
      if (minStars) params.append('minStars', minStars);
      if (cityFilter) params.append('city', cityFilter);
      if (limit) params.append('limit', limit);
      
      console.log('Fetching analytics with params:', params.toString());
      
      // Fetch main analytics (will use filtered top hotels)
      const response = await api.get(`/admin/analytics?${params.toString()}`);
      console.log('Analytics response:', response.data);
      
      if (response.data.success) {
        setAnalytics(response.data.data);
        console.log('Top hotels count:', response.data.data?.topHotelMarkets?.length || 0);
      } else {
        toast.error(response.data.message || 'Failed to load analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(2)}%`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <p className="text-yellow-800">No analytics data available</p>
        </div>
      </div>
    );
  }

  const { revenueAnalytics, platformPerformance, topHotelMarkets, period } = analytics;
  
  // Debug logging
  console.log('Analytics data:', analytics);
  console.log('Top Hotel Markets:', topHotelMarkets);
  console.log('Top Hotel Markets length:', topHotelMarkets?.length);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Platform Analytics</h1>
        <p className="text-gray-600">
          Comprehensive insights and performance metrics · {period}
        </p>
      </div>

      {/* Revenue Analytics Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <DollarSign className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Revenue Analytics</h2>
        </div>
        
        {/* First row: 3 main revenue metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Total Revenue YTD */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Total Revenue (YTD)</h3>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {formatCurrency(revenueAnalytics.totalRevenueYTD)}
            </p>
            <p className="text-xs opacity-80">
              From {formatNumber(revenueAnalytics.totalBookingsYTD)} completed bookings
            </p>
          </div>

          {/* Platform Commission  */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Platform Commission</h3>
              <DollarSign className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {formatCurrency(revenueAnalytics.platformCommission)}
            </p>
            <p className="text-xs opacity-80">
              Earned from booking transactions
            </p>
          </div>
          
          {/* Subscription Revenue */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Subscription Revenue</h3>
              <CreditCard className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {formatCurrency(revenueAnalytics.subscriptionRevenue)}
            </p>
            <p className="text-xs opacity-80">
              From active subscriptions (YTD)
            </p>
          </div>
        </div>

        {/* Second row: 2 performance metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Booking Value */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Average Booking Value</h3>
              <Activity className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {formatCurrency(revenueAnalytics.averageBookingValue)}
            </p>
            <p className="text-xs opacity-80">
              Per transaction average
            </p>
          </div>

          {/* Growth Rate */}
          <div className={`bg-gradient-to-br ${
            revenueAnalytics.growthRate >= 0 
              ? 'from-emerald-500 to-emerald-600' 
              : 'from-red-500 to-red-600'
          } rounded-lg shadow-lg p-6 text-white transform transition hover:scale-105`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium opacity-90">Growth Rate (YoY)</h3>
              <TrendingUp className="w-5 h-5 opacity-80" />
            </div>
            <p className="text-3xl font-bold mb-2">
              {revenueAnalytics.growthRate >= 0 ? '+' : ''}
              {formatPercentage(revenueAnalytics.growthRate)}
            </p>
            <p className="text-xs opacity-80">
              Compared to {new Date().getFullYear() - 1}
            </p>
          </div>
        </div>
      </div>

      {/* Platform Performance Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Platform Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Booking Success Rate */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Booking Success Rate</h3>
              <ThumbsUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {formatPercentage(platformPerformance.bookingSuccessRate)}
            </p>
            <p className="text-xs text-gray-500">
              {formatNumber(platformPerformance.acceptedBids)} of {formatNumber(platformPerformance.totalBids)} bids
            </p>
          </div>

          {/* Average Response Time */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Average Response Time</h3>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {platformPerformance.averageResponseTime.toFixed(1)}h
            </p>
            <p className="text-xs text-gray-500">
              Platform processing time
            </p>
          </div>

          {/* User Satisfaction */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">User Satisfaction</h3>
              <ThumbsUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {formatPercentage(platformPerformance.userSatisfaction)}
            </p>
            <p className="text-xs text-gray-500">
              Based on completion rate
            </p>
          </div>

          {/* Dispute Rate */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Dispute Rate</h3>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">
              {formatPercentage(platformPerformance.disputeRate)}
            </p>
            <p className="text-xs text-gray-500">
              {formatNumber(platformPerformance.totalDisputes)} disputed transactions
            </p>
          </div>
        </div>
      </div>

      {/* Top Hotel Markets Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Award className="w-6 h-6 text-yellow-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">Top Market Hotels</h2>
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            
            {/* Sort By Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="totalbids">Sort by Total Bids</option>
              <option value="revenue">Sort by Revenue</option>
              <option value="successrate">Sort by Success Rate</option>
              <option value="avgbidvalue">Sort by Avg Bid Value</option>
            </select>
            
            {/* Minimum Stars Filter */}
            <select
              value={minStars}
              onChange={(e) => setMinStars(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Stars</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Star</option>
            </select>
            
            {/* City Filter */}
            <input
              type="text"
              placeholder="Filter by city..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
            />
            
            {/* Limit Dropdown */}
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
            </select>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Bids
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Bid Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topHotelMarkets && topHotelMarkets.length > 0 ? (
                  topHotelMarkets.map((hotel, index) => (
                    <tr 
                      key={hotel.hotelId || index} 
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && <Award className="w-5 h-5 text-yellow-500 mr-2" />}
                          {index === 1 && <Award className="w-5 h-5 text-gray-400 mr-2" />}
                          {index === 2 && <Award className="w-5 h-5 text-orange-600 mr-2" />}
                          <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {hotel.hotelName || 'N/A'}
                            </div>
                            {hotel.hotelStars && (
                              <div className="flex items-center mt-1">
                                {[...Array(hotel.hotelStars)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{hotel.city}, {hotel.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatNumber(hotel.totalBids)}
                          <span className="text-xs text-gray-500 ml-1">
                            ({hotel.acceptedBids} accepted)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.successRate >= 70 
                            ? 'bg-green-100 text-green-800'
                            : hotel.successRate >= 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {formatPercentage(hotel.successRate)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(hotel.totalRevenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(hotel.averageBidValue)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No hotel data available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
