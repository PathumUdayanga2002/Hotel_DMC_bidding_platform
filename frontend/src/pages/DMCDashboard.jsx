import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NotificationBell from '../components/NotificationBell';
import {
  Plane,
  LogOut,
  User,
  Bell,
  MessageSquare,
  FileText,
  Search,
  Gavel,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
  Inbox,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

const DMCDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isSuperAdmin, isStaff } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const getStatusBadge = () => {
    if (!profileStatus || !profileStatus.status) {
      return (
        <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Profile Not Registered</span>
        </div>
      );
    }

    const statusConfig = {
      PENDING: {
        icon: Clock,
        color: 'yellow',
        text: 'Pending Review'
      },
      UNDER_REVIEW: {
        icon: Clock,
        color: 'blue',
        text: 'Under Review'
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'green',
        text: 'Approved'
      },
      REJECTED: {
        icon: XCircle,
        color: 'red',
        text: 'Rejected'
      },
      SUSPENDED: {
        icon: AlertCircle,
        color: 'red',
        text: 'Suspended'
      }
    };

    const config = statusConfig[profileStatus.status] || statusConfig.PENDING;
    const Icon = config.icon;
    const colorClasses = {
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
      <div className={`flex items-center space-x-2 px-4 py-2 border rounded-lg ${colorClasses[config.color]}`}>
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    );
  };

  const isFeatureLocked = () => {
    return !profileStatus?.isApproved;
  };

  const menuItems = [
    {
      id: 'profile',
      name: 'Complete Profile',
      icon: FileText,
      path: '/dmc/profile/register',
      locked: false,
      hideForStaff: true // Hide for staff members
    },
    {
      id: 'post-inquiry',
      name: 'Post Bid Inquiry',
      icon: PlusCircle,
      path: '/dmc/inquiries/post',
      locked: false
    },
    {
      id: 'my-inquiries',
      name: 'My Inquiries',
      icon: Inbox,
      path: '/dmc/inquiries',
      locked: false
    },
    {
      id: 'received-contracts',
      name: 'Received Contracts',
      icon: FileText,
      path: '/dmc/received-contracts',
      locked: false
    },
    {
      id: 'browse',
      name: 'Browse Inquiries',
      icon: Search,
      path: '/dmc/browse-inquiries',
      locked: true
    },
    {
      id: 'bids',
      name: 'My Bids',
      icon: Gavel,
      path: '/dmc/my-bids',
      locked: true
    },
    {
      id: 'direct',
      name: 'Direct Inquiries',
      icon: TrendingUp,
      path: '/dmc/direct-inquiries',
      locked: false
    },
    {
      id: 'staff',
      name: 'Staff Management',
      icon: Users,
      path: '/dmc/staff',
      locked: false,
      showForSuperAdminOnly: true // Only show to super admin
    },
    {
      id: 'activity-logs',
      name: 'Activity Logs',
      icon: Activity,
      path: '/dmc/activity-logs',
      locked: false
    },
    {
      id: 'myprofile',
      name: 'Profile',
      icon: User,
      path: '/dmc/profile',
      locked: false,
      hideForStaff: true // Hide for staff members
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center">
              <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-green-600">DMC Portal</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            {getStatusBadge()}

            {/* Notifications */}
            <NotificationBell />

            {/* Messages */}
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="p-4 space-y-2">
            {menuItems
              .filter((item) => {
                // Hide items marked hideForStaff if user is staff
                if (item.hideForStaff && isStaff()) return false;
                // Only show items marked showForSuperAdminOnly if user is super admin
                if (item.showForSuperAdminOnly && !isSuperAdmin()) return false;
                return true;
              })
              .map((item) => {
                const Icon = item.icon;
                const locked = item.locked && isFeatureLocked();

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (!locked) {
                        navigate(item.path);
                      } else {
                        toast.warning('Please complete profile registration and wait for admin approval');
                      }
                    }}
                    disabled={locked}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      locked
                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {locked && (
                      <svg
                        className="w-4 h-4 ml-auto"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Registration Status Banner */}
          {profileStatus && profileStatus.status && profileStatus.status !== 'APPROVED' && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-blue-800">
                    Profile Registration Status: {profileStatus.status?.replace('_', ' ')}
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    {profileStatus.status === 'PENDING' &&
                      'Your profile is waiting for admin review. You will be notified once approved.'}
                    {profileStatus.status === 'UNDER_REVIEW' &&
                      'Your profile is currently being reviewed by our admin team.'}
                    {profileStatus.status === 'REJECTED' &&
                      `Your profile was rejected. Reason: ${profileStatus.rejectionReason || 'Not specified'}. Please update and resubmit.`}
                  </p>
                  {profileStatus.status === 'REJECTED' && (
                    <button
                      onClick={() => navigate('/dmc/profile/register')}
                      className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Update & Resubmit Profile →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-600">
              Manage your DMC operations and respond to hotel inquiries
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Bids</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <Gavel className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Inquiries</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <MessageSquare className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {!profileStatus?.isApproved && (
            <div className="bg-linear-to-r from-green-500 to-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-2">Complete Your DMC Profile</h3>
              <p className="mb-6 opacity-90">
                Register your company details to access all platform features and start bidding on hotel inquiries.
              </p>
              <button
                onClick={() => navigate('/dmc/profile/register')}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Complete Profile Registration
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Registration Modal - shown for new users */}
      {showRegistrationModal && !profileStatus?.profileExists && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Welcome to DMC Portal!
              </h3>
              <p className="text-gray-600 mb-6">
                To access all features, please complete your company profile registration.
                Your registration will be reviewed by our admin team.
              </p>
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  navigate('/dmc/profile/register');
                }}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Complete Profile Now
              </button>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="w-full mt-3 text-gray-600 hover:text-gray-800 text-sm"
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
