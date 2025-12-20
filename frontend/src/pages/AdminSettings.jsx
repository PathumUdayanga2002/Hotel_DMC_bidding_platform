import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { Card } from '../components';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Commission Settings State
  const [commissionSettings, setCommissionSettings] = useState({
    platformCommissionRate: '',
    paymentProcessingFee: '',
    minimumBookingValue: '',
  });

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    autoApprovalThreshold: '',
    bidResponseTimeHours: '',
    platformSupportEmail: '',
  });

  // Settings metadata
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updatedBy, setUpdatedBy] = useState(null);
  const [version, setVersion] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/settings');
      if (response.data.success) {
        const data = response.data.data;
        
        setCommissionSettings({
          platformCommissionRate: data.platformCommissionRate || '',
          paymentProcessingFee: data.paymentProcessingFee || '',
          minimumBookingValue: data.minimumBookingValue || '',
        });

        setSystemSettings({
          autoApprovalThreshold: data.autoApprovalThreshold || '',
          bidResponseTimeHours: data.bidResponseTimeHours || '',
          platformSupportEmail: data.platformSupportEmail || '',
        });

        setLastUpdated(data.updatedAt);
        setUpdatedBy(data.updatedBy);
        setVersion(data.version);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCommissionChange = (field, value) => {
    setCommissionSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSystemChange = (field, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCommissionSettings = () => {
    const { platformCommissionRate, paymentProcessingFee, minimumBookingValue } = commissionSettings;

    if (!platformCommissionRate || platformCommissionRate < 0 || platformCommissionRate > 100) {
      toast.error('Platform commission rate must be between 0 and 100%');
      return false;
    }

    if (!paymentProcessingFee || paymentProcessingFee < 0 || paymentProcessingFee > 100) {
      toast.error('Payment processing fee must be between 0 and 100%');
      return false;
    }

    if (!minimumBookingValue || minimumBookingValue < 0) {
      toast.error('Minimum booking value must be greater than or equal to 0');
      return false;
    }

    return true;
  };

  const validateSystemSettings = () => {
    const { autoApprovalThreshold, bidResponseTimeHours, platformSupportEmail } = systemSettings;

    if (!autoApprovalThreshold || autoApprovalThreshold < 0) {
      toast.error('Auto approval threshold must be greater than or equal to 0');
      return false;
    }

    if (!bidResponseTimeHours || bidResponseTimeHours < 1 || bidResponseTimeHours > 720) {
      toast.error('Bid response time must be between 1 and 720 hours');
      return false;
    }

    if (!platformSupportEmail || !platformSupportEmail.includes('@')) {
      toast.error('Please provide a valid support email address');
      return false;
    }

    return true;
  };

  const handleUpdateCommissionSettings = async () => {
    if (!validateCommissionSettings()) return;

    setSaving(true);
    try {
      const response = await api.put('/admin/settings/commission', {
        platformCommissionRate: parseFloat(commissionSettings.platformCommissionRate),
        paymentProcessingFee: parseFloat(commissionSettings.paymentProcessingFee),
        minimumBookingValue: parseFloat(commissionSettings.minimumBookingValue),
      });

      if (response.data.success) {
        toast.success('Commission settings updated successfully');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error updating commission settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update commission settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSystemSettings = async () => {
    if (!validateSystemSettings()) return;

    setSaving(true);
    try {
      const response = await api.put('/admin/settings/system', {
        autoApprovalThreshold: parseFloat(systemSettings.autoApprovalThreshold),
        bidResponseTimeHours: parseInt(systemSettings.bidResponseTimeHours),
        platformSupportEmail: systemSettings.platformSupportEmail,
      });

      if (response.data.success) {
        toast.success('System settings updated successfully');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error updating system settings:', error);
      toast.error(error.response?.data?.message || 'Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Platform Settings</h1>
          <p className="text-gray-600">Configure commission rates, payment settings, and system parameters</p>
          
          {lastUpdated && (
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </div>
              {updatedBy && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  By: {updatedBy}
                </div>
              )}
              {version && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Version: {version}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Commission Settings Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Commission Settings</h2>
                  <p className="text-gray-600 text-sm">Configure platform fees and minimum booking requirements</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Platform Commission Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Platform Commission Rate (%)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Current rate applies to all new bookings
                  </p>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={commissionSettings.platformCommissionRate}
                    onChange={(e) => handleCommissionChange('platformCommissionRate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 5.0"
                  />
                </div>

                {/* Payment Processing Fee */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment Processing Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={commissionSettings.paymentProcessingFee}
                    onChange={(e) => handleCommissionChange('paymentProcessingFee', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2.5"
                  />
                </div>

                {/* Minimum Booking Value */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Minimum Booking Value (Rs)
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={commissionSettings.minimumBookingValue}
                    onChange={(e) => handleCommissionChange('minimumBookingValue', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10000"
                  />
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdateCommissionSettings}
                  disabled={saving}
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Commission Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* System Settings Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 rounded-lg p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                  <p className="text-gray-600 text-sm">Configure operational parameters and thresholds</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Auto Approval Threshold */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Auto Approval Threshold ($)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Bookings above this amount require manual approval
                  </p>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={systemSettings.autoApprovalThreshold}
                    onChange={(e) => handleSystemChange('autoApprovalThreshold', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 1000"
                  />
                </div>

                {/* Bid Response Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bid Response Time (Hours)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="720"
                    value={systemSettings.bidResponseTimeHours}
                    onChange={(e) => handleSystemChange('bidResponseTimeHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 48"
                  />
                </div>

                {/* Platform Support Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Platform Support Email
                  </label>
                  <input
                    type="email"
                    value={systemSettings.platformSupportEmail}
                    onChange={(e) => handleSystemChange('platformSupportEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="support@example.com"
                  />
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdateSystemSettings}
                  disabled={saving}
                  className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update System Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>Commission rate changes apply to all new bookings from the time of update</li>
                    <li>Existing bookings will use the commission rate that was active at the time of booking</li>
                    <li>Auto-approval threshold helps manage risk for high-value transactions</li>
                    <li>Bid response time determines how long hotels have to respond to inquiry bids</li>
                    <li>All changes are logged with timestamp and admin information for audit purposes</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
