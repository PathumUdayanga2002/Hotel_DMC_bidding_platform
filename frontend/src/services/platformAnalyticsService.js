import api from './api';

/**
 * Platform Analytics Service
 * Handles API calls for platform analytics
 */

const ANALYTICS_BASE_URL = '/admin/analytics';

/**
 * Get platform analytics for current year (YTD)
 */
export const getPlatformAnalytics = async () => {
  const response = await api.get(ANALYTICS_BASE_URL);
  return response.data;
};

/**
 * Get platform analytics for a specific year
 */
export const getPlatformAnalyticsByYear = async (year) => {
  const response = await api.get(`${ANALYTICS_BASE_URL}/year/${year}`);
  return response.data;
};

/**
 * Get platform analytics for a custom period
 */
export const getPlatformAnalyticsByPeriod = async (startDate, endDate) => {
  const response = await api.get(`${ANALYTICS_BASE_URL}/period`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export default {
  getPlatformAnalytics,
  getPlatformAnalyticsByYear,
  getPlatformAnalyticsByPeriod
};
