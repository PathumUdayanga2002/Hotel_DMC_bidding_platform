import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NotificationBell from '../components/NotificationBell';
import { Plane, LogOut, FileText } from 'lucide-react';

const DMCDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  const fetchProfileStatus = async () => {
    try {
      const response = await api.get('/dmc/profile/status');
      setProfileStatus(response.data.data);
      
      // Show modal if profile doesn't exist
      if (!response.data.data.profileExists) {
        setShowRegistrationModal(true);
      }
    } catch (error) {
      console.error('Error fetching profile status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Minimal status text for subtle header display
  const getStatusText = () => {
    if (!profileStatus || !profileStatus.status) return 'Not Registered';
    return profileStatus.status.replace('_', ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 h-16 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="h-full flex items-center justify-between px-6 lg:px-12">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DMC Dashboard</h1>
              <p className="text-xs text-gray-400">Status: {getStatusText()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-white">{user?.username}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-amber-500 text-black font-medium py-2 px-4 rounded-lg hover:brightness-110 transition"
              title="Sign Out"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden"><LogOut className="w-5 h-5" /></span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-10 space-y-8">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user?.username}!</h2>
          <p className="text-sm text-gray-400">Manage your DMC operations and respond to hotel inquiries</p>
        </section>

        {/* KPI Cards */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Active Bids', value: 0 },
              { label: 'New Inquiries', value: 0 },
              { label: 'Messages', value: 0 },
              { label: 'Revenue This Week', value: '$0.00' }
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-2xl font-semibold text-white mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action - Minimal */}
        {!profileStatus?.isApproved && (
          <section>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg text-gray-300 mb-2">Complete Your DMC Profile</h3>
              <p className="text-sm text-gray-400 mb-4">
                Register your company details to access all platform features and start bidding on hotel inquiries.
              </p>
              <button
                onClick={() => navigate('/dmc/profile/register')}
                className="bg-amber-500 text-black font-medium py-2 px-4 rounded-lg hover:brightness-110 transition"
              >
                Complete Profile Registration
              </button>
            </div>
          </section>
        )}

        {/* Hotels Table */}
        <section>
          <h3 className="text-lg text-gray-300 mb-3">Hotels</h3>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-gray-300">
                <tr>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Inquiries</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="hover:bg-white/10">
                  <td className="px-4 py-3 text-gray-400" colSpan={3}>No data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bookings Table */}
        <section>
          <h3 className="text-lg text-gray-300 mb-3">Bookings</h3>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <table className="w-full text-left">
              <thead className="text-xs uppercase text-gray-300">
                <tr>
                  <th className="px-4 py-3">Hotel</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="hover:bg-white/10">
                  <td className="px-4 py-3 text-gray-400" colSpan={4}>No data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Registration Modal - shown for new users */}
      {showRegistrationModal && !profileStatus?.profileExists && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Welcome to DMC Portal</h3>
              <p className="text-gray-400 mb-6">
                To access all features, please complete your company profile registration. Your registration will be reviewed by our admin team.
              </p>
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  navigate('/dmc/profile/register');
                }}
                className="w-full bg-amber-500 text-black py-2 px-4 rounded-lg font-medium hover:brightness-110 transition"
              >
                Complete Profile Now
              </button>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="w-full mt-3 text-gray-400 hover:text-gray-200 text-sm"
              >
                I'll do this later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DMCDashboard;
