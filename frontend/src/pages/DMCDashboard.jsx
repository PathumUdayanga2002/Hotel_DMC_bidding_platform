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
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-gray-300">Profile Not Registered</span>
        </div>
      );
    }

    const statusConfig = {
      PENDING: {
        icon: Clock,
        color: 'amber',
        text: 'Pending Review'
      },
      UNDER_REVIEW: {
        icon: Clock,
        color: 'amber',
        text: 'Under Review'
      },
      APPROVED: {
        icon: CheckCircle,
        color: 'amber',
        text: 'Approved'
      },
      REJECTED: {
        icon: XCircle,
        color: 'gray',
        text: 'Rejected'
      },
      SUSPENDED: {
        icon: AlertCircle,
        color: 'gray',
        text: 'Suspended'
      }
    };

    const config = statusConfig[profileStatus.status] || statusConfig.PENDING;
    const Icon = config.icon;
    const colorClasses = {
      amber: 'bg-white/10 border-white/20 text-gray-300',
      gray: 'bg-white/5 border-white/10 text-gray-400'
    };

    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 border rounded-lg ${colorClasses[config.color]}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium">{config.text}</span>
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
      locked: true
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
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Top Navigation */}
      <header className="bg-black/20 backdrop-blur-sm sticky top-0 z-40 border-b border-white/10">
        <div className="flex justify-between items-center px-6 lg:px-12 h-16">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-white/10 text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 w-8 h-8 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-white">DMC Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            {getStatusBadge()}

            {/* Notifications */}
            <NotificationBell />

            {/* Messages */}
            <button className="relative p-2 rounded-lg hover:bg-white/10 text-gray-300">
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
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
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-black/20 backdrop-blur-sm border-r border-white/10 transition-transform duration-300 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="p-4 space-y-1">
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
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                      locked
                        ? 'text-gray-500 cursor-not-allowed bg-white/5'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.name}</span>
                    {locked && (
                      <svg
                        className="w-3.5 h-3.5 ml-auto"
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
        <main className="flex-1 px-6 lg:px-12 py-10">
          {/* Registration Status Banner */}
          {profileStatus && profileStatus.status && profileStatus.status !== 'APPROVED' && (
            <div className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">
                    Profile Registration Status: {profileStatus.status?.replace('_', ' ')}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
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
                      className="mt-3 text-sm font-medium bg-amber-500 text-black px-4 py-2 rounded-lg hover:brightness-110 transition-all"
                    >
                      Update & Resubmit Profile →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-sm text-gray-400">
              Manage your DMC operations and respond to hotel inquiries
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Bids</p>
                  <p className="text-2xl font-semibold text-white mt-1">0</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5">
                  <Gavel className="w-6 h-6 text-gray-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">New Inquiries</p>
                  <p className="text-2xl font-semibold text-white mt-1">0</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5">
                  <Search className="w-6 h-6 text-gray-300" />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Messages</p>
                  <p className="text-2xl font-semibold text-white mt-1">0</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2.5">
                  <MessageSquare className="w-6 h-6 text-gray-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {!profileStatus?.isApproved && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-white mb-2">Complete Your DMC Profile</h3>
              <p className="mb-6 text-sm text-gray-400 max-w-md mx-auto">
                Register your company details to access all platform features and start bidding on hotel inquiries.
              </p>
              <button
                onClick={() => navigate('/dmc/profile/register')}
                className="bg-amber-500 text-black px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
              >
                Complete Profile Registration
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Registration Modal - shown for new users */}
      {showRegistrationModal && !profileStatus?.profileExists && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="bg-white/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Welcome to DMC Portal!
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                To access all features, please complete your company profile registration.
                Your registration will be reviewed by our admin team.
              </p>
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  navigate('/dmc/profile/register');
                }}
                className="w-full bg-amber-500 text-black px-4 py-2 rounded-lg font-medium hover:brightness-110 transition-all"
              >
                Complete Profile Now
              </button>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="w-full mt-3 text-gray-400 hover:text-white text-sm transition-colors"
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
