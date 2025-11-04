import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Settings as SettingsIcon,
  DollarSign,
  Percent,
  CreditCard,
  Clock,
  Mail,
  Shield,
  RefreshCw,
  Save,
  RotateCcw
} from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  getPlatformSettings,
  updateCommissionSettings,
  updateSystemSettings,
  resetToDefaults
} from '../services/settingsService';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Commission Settings State
  const [commissionForm, setCommissionForm] = useState({
    platformCommissionRate: '',
    paymentProcessingFee: '',
    minimumBookingValue: ''
  });

  // System Settings State
  const [systemForm, setSystemForm] = useState({
    autoApprovalThreshold: '',
    bidResponseTime: '',
    platformSupportEmail: '',
    additionalSupportEmails: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getPlatformSettings();
      const data = response.data;
      setSettings(data);

      // Populate commission form
      if (data.commissionSettings) {
        setCommissionForm({
          platformCommissionRate: data.commissionSettings.platformCommissionRate || '',
          paymentProcessingFee: data.commissionSettings.paymentProcessingFee || '',
          minimumBookingValue: data.commissionSettings.minimumBookingValue || ''
        });
      }

      // Populate system form
      if (data.systemSettings) {
        setSystemForm({
          autoApprovalThreshold: data.systemSettings.autoApprovalThreshold || '',
          bidResponseTime: data.systemSettings.bidResponseTime || '',
          platformSupportEmail: data.systemSettings.platformSupportEmail || '',
          additionalSupportEmails: data.systemSettings.additionalSupportEmails || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to fetch platform settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSystemChange = (e) => {
    const { name, value } = e.target;
    setSystemForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateCommission = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateCommissionSettings(commissionForm);
      toast.success('Commission settings updated successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error updating commission settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update commission settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSystem = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await updateSystemSettings(systemForm);
      toast.success('System settings updated successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error updating system settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm('Are you sure you want to reset all settings to default values?')) {
      return;
    }

    try {
      setSaving(true);
      await resetToDefaults();
      toast.success('Settings reset to defaults successfully');
      await fetchSettings();
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage commission rates, payment fees, and system configurations
          </p>
          {settings?.updatedAt && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {new Date(settings.updatedAt).toLocaleString()}
              {settings.updatedBy && ` by ${settings.updatedBy}`}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            onClick={fetchSettings}
            variant="outline"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleResetToDefaults}
            variant="outline"
            disabled={saving}
            className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      {/* Commission Settings */}
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Commission Settings</h2>
              <p className="text-sm text-gray-600">Configure platform commission and payment fees</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateCommission}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Platform Commission Rate */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Percent className="w-4 h-4 inline mr-2 text-green-600" />
                Platform Commission Rate (%)
              </label>
              <Input
                type="number"
                name="platformCommissionRate"
                value={commissionForm.platformCommissionRate}
                onChange={handleCommissionChange}
                placeholder="e.g., 5.0"
                step="0.01"
                min="0"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage charged on each booking
              </p>
            </div>

            {/* Payment Processing Fee */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <CreditCard className="w-4 h-4 inline mr-2 text-blue-600" />
                Payment Processing Fee (%)
              </label>
              <Input
                type="number"
                name="paymentProcessingFee"
                value={commissionForm.paymentProcessingFee}
                onChange={handleCommissionChange}
                placeholder="e.g., 2.5"
                step="0.01"
                min="0"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Payment gateway processing fee
              </p>
            </div>

            {/* Minimum Booking Value */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2 text-purple-600" />
                Minimum Booking Value (Rs.)
              </label>
              <Input
                type="number"
                name="minimumBookingValue"
                value={commissionForm.minimumBookingValue}
                onChange={handleCommissionChange}
                placeholder="e.g., 5000"
                step="0.01"
                min="0"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum value for bookings
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating...' : 'Update Commission Settings'}
            </Button>
          </div>
        </form>
      </Card>

      {/* System Settings */}
      <Card>
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">System Settings</h2>
              <p className="text-sm text-gray-600">Configure system behavior and support contacts</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdateSystem}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Auto Approval Threshold */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Shield className="w-4 h-4 inline mr-2 text-green-600" />
                Auto Approval Threshold (Rs.)
              </label>
              <Input
                type="number"
                name="autoApprovalThreshold"
                value={systemForm.autoApprovalThreshold}
                onChange={handleSystemChange}
                placeholder="e.g., 10000"
                step="0.01"
                min="0"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Bookings below this amount are auto-approved
              </p>
            </div>

            {/* Bid Response Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2 text-orange-600" />
                Bid Response Time (hours)
              </label>
              <Input
                type="number"
                name="bidResponseTime"
                value={systemForm.bidResponseTime}
                onChange={handleSystemChange}
                placeholder="e.g., 48"
                min="1"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Default time limit for hotels to respond to inquiries
              </p>
            </div>

            {/* Platform Support Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-blue-600" />
                Platform Support Email
              </label>
              <Input
                type="email"
                name="platformSupportEmail"
                value={systemForm.platformSupportEmail}
                onChange={handleSystemChange}
                placeholder="support@example.com"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primary support email address
              </p>
            </div>

            {/* Additional Support Emails */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2 text-purple-600" />
                Additional Support Emails
              </label>
              <Input
                type="text"
                name="additionalSupportEmails"
                value={systemForm.additionalSupportEmails}
                onChange={handleSystemChange}
                placeholder="admin@example.com, help@example.com"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated list of additional support emails
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating...' : 'Update System Settings'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Current Values Summary */}
      <Card className="bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Settings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Platform Commission</p>
            <p className="text-2xl font-bold text-green-700">
              {commissionForm.platformCommissionRate}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Payment Fee</p>
            <p className="text-2xl font-bold text-blue-700">
              {commissionForm.paymentProcessingFee}%
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Min. Booking Value</p>
            <p className="text-2xl font-bold text-purple-700">
              Rs. {Number(commissionForm.minimumBookingValue).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Auto Approval Threshold</p>
            <p className="text-2xl font-bold text-green-700">
              Rs. {Number(systemForm.autoApprovalThreshold).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Bid Response Time</p>
            <p className="text-2xl font-bold text-orange-700">
              {systemForm.bidResponseTime} hrs
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Support Email</p>
            <p className="text-sm font-semibold text-blue-700 truncate">
              {systemForm.platformSupportEmail}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminSettings;
