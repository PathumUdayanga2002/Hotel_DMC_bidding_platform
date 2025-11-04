import api from './api';

/**
 * Platform Settings Service
 * Handles API calls for platform settings management
 */

const SETTINGS_BASE_URL = '/admin/settings';

/**
 * Get current platform settings
 */
export const getPlatformSettings = async () => {
  const response = await api.get(SETTINGS_BASE_URL);
  return response.data;
};

/**
 * Update commission settings
 */
export const updateCommissionSettings = async (commissionSettings) => {
  const response = await api.put(`${SETTINGS_BASE_URL}/commission`, commissionSettings);
  return response.data;
};

/**
 * Update system settings
 */
export const updateSystemSettings = async (systemSettings) => {
  const response = await api.put(`${SETTINGS_BASE_URL}/system`, systemSettings);
  return response.data;
};

/**
 * Update all platform settings
 */
export const updateAllSettings = async (settings) => {
  const response = await api.put(SETTINGS_BASE_URL, settings);
  return response.data;
};

/**
 * Reset settings to default values
 */
export const resetToDefaults = async () => {
  const response = await api.post(`${SETTINGS_BASE_URL}/reset`);
  return response.data;
};

export default {
  getPlatformSettings,
  updateCommissionSettings,
  updateSystemSettings,
  updateAllSettings,
  resetToDefaults
};
