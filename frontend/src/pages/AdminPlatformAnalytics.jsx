import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Star,
  AlertTriangle,
  Globe,
  RefreshCw,
  Calendar,
  Building,
  Users,
  CheckCircle
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { getPlatformAnalytics } from '../services/platformAnalyticsService';

const AdminPlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await getPlatformAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch platform analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAnalytics();
      toast.success('Analytics refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh analytics');
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value) => {
    if (!value && value !== 0) return '0%';
    return `${value.toFixed(2)}%`;
  };

  if (loading && !analytics) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const revenue = analytics?.revenueAnalytics || {};
  const performance = analytics?.platformPerformance || {};
  const markets = analytics?.topMarkets || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into platform performance and revenue
          </p>
          {analytics?.period && (
            <p className="text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Period: {analytics.period}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Revenue Analytics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-semibold">Total Revenue (YTD)</p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {formatCurrency(revenue.totalRevenue)}
                </p>
                <div className="mt-3 flex items-center text-sm">
                  <Building className="w-4 h-4 mr-1 text-gray-600" />
                  <span className="text-gray-700">{formatNumber(revenue.totalBookings)} bookings</span>
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-green-600 opacity-50" />
            </div>
          </Card>

          {/* Platform Commission */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold">Platform Commission</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {formatCurrency(revenue.platformCommission)}
                </p>
                <div className="mt-3 flex items-center text-sm text-blue-700">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>5% of total revenue</span>
                </div>
              </div>
              <Activity className="w-12 h-12 text-blue-600 opacity-50" />
            </div>
          </Card>

          {/* Average Booking Value */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-semibold">Average Booking Value</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">
                  {formatCurrency(revenue.averageBookingValue)}
                </p>
                <div className="mt-3 text-sm text-purple-700">
                  Per successful booking
                </div>
              </div>
              <DollarSign className="w-12 h-12 text-purple-600 opacity-50" />
            </div>
          </Card>

          {/* Growth Rate */}
          <Card className={`bg-gradient-to-br ${
            revenue.growthRate >= 0 
              ? 'from-emerald-50 to-emerald-100' 
              : 'from-red-50 to-red-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${
                  revenue.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  Growth Rate
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  revenue.growthRate >= 0 ? 'text-emerald-900' : 'text-red-900'
                }`}>
                  {formatPercentage(revenue.growthRate)}
                </p>
                <div className="mt-3 flex items-center text-sm">
                  {revenue.growthRate >= 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-1 text-emerald-600" />
                      <span className="text-emerald-700">vs previous period</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                      <span className="text-red-700">vs previous period</span>
                    </>
                  )}
                </div>
              </div>
              {revenue.growthRate >= 0 ? (
                <TrendingUp className="w-12 h-12 text-emerald-600 opacity-50" />
              ) : (
                <TrendingDown className="w-12 h-12 text-red-600 opacity-50" />
              )}
            </div>
          </Card>
        </div>

        {/* Additional Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="bg-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Hotels</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatNumber(revenue.activeHotels)}
                </p>
              </div>
              <Building className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card className="bg-white border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active DMCs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatNumber(revenue.activeDMCs)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </Card>

          <Card className="bg-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(revenue.monthlyRevenue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </Card>
        </div>
      </div>

      {/* Platform Performance */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Booking Success Rate */}
          <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-600 font-semibold">Booking Success Rate</p>
                <p className="text-3xl font-bold text-cyan-900 mt-2">
                  {formatPercentage(performance.bookingSuccessRate)}
                </p>
                <div className="mt-3 text-xs text-cyan-700">
                  {formatNumber(performance.successfulBookings)} / {formatNumber(performance.totalInquiries)} inquiries
                </div>
              </div>
              <CheckCircle className="w-12 h-12 text-cyan-600 opacity-50" />
            </div>
          </Card>

          {/* Average Response Time */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-semibold">Avg Response Time</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">
                  {performance.averageResponseTime?.toFixed(1)} <span className="text-lg">hrs</span>
                </p>
                <div className="mt-3 text-xs text-orange-700">
                  Time to first bid
                </div>
              </div>
              <Clock className="w-12 h-12 text-orange-600 opacity-50" />
            </div>
          </Card>

          {/* User Satisfaction */}
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-semibold">User Satisfaction</p>
                <p className="text-3xl font-bold text-yellow-900 mt-2">
                  {performance.userSatisfaction?.toFixed(1)} <span className="text-lg">/ 5</span>
                </p>
                <div className="mt-3 flex items-center text-xs text-yellow-700">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                  Average rating
                </div>
              </div>
              <Star className="w-12 h-12 text-yellow-600 opacity-50" />
            </div>
          </Card>

          {/* Dispute Rate */}
          <Card className={`bg-gradient-to-br ${
            performance.disputeRate < 5 
              ? 'from-green-50 to-green-100' 
              : 'from-red-50 to-red-100'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${
                  performance.disputeRate < 5 ? 'text-green-600' : 'text-red-600'
                }`}>
                  Dispute Rate
                </p>
                <p className={`text-3xl font-bold mt-2 ${
                  performance.disputeRate < 5 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatPercentage(performance.disputeRate)}
                </p>
                <div className="mt-3 text-xs text-gray-700">
                  {formatNumber(performance.totalDisputes)} disputes
                </div>
              </div>
              <AlertTriangle className={`w-12 h-12 opacity-50 ${
                performance.disputeRate < 5 ? 'text-green-600' : 'text-red-600'
              }`} />
            </div>
          </Card>
        </div>
      </div>

      {/* Top Markets */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Markets</h2>
        <Card>
          {markets.length === 0 ? (
            <div className="text-center py-12">
              <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No market data available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Country</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Bookings</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Market Share</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map((market, index) => (
                    <tr
                      key={market.countryCode}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : index === 1
                            ? 'bg-gray-100 text-gray-700'
                            : index === 2
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {market.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-semibold text-gray-900">{market.countryName}</p>
                            <p className="text-xs text-gray-500">{market.countryCode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-gray-900">
                          {formatNumber(market.bookingCount)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-green-700">
                          {formatCurrency(market.revenueValue)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${Math.min(market.marketShare, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold text-gray-900 w-16 text-right">
                            {formatPercentage(market.marketShare)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminPlatformAnalytics;
