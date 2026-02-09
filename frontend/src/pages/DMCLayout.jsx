import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import NotificationBell from '../components/NotificationBell';
import SubscriptionReminder from '../components/SubscriptionReminder';
import {
  Plane,
  LogOut,
  User,
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
  CreditCard
} from 'lucide-react';

const DMCLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isSuperAdmin, isStaff } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileStatus, setProfileStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  const fetchProfileStatus = async () => {
    try {
      const response = await api.get('/dmc/profile/status');
      setProfileStatus(response.data.data);
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
      PENDING: { icon: Clock, color: 'yellow', text: 'Pending Review' },
      UNDER_REVIEW: { icon: Clock, color: 'blue', text: 'Under Review' },
      APPROVED: { icon: CheckCircle, color: 'teal', text: 'Approved' },
      REJECTED: { icon: XCircle, color: 'red', text: 'Rejected' },
      SUSPENDED: { icon: XCircle, color: 'red', text: 'Suspended' }
    };

    const config = statusConfig[profileStatus.status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <div className={`flex items-center space-x-2 px-4 py-2 bg-${config.color}-50 border border-${config.color}-200 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${config.color}-600`} />
        <span className={`text-sm font-medium text-${config.color}-800`}>{config.text}</span>
      </div>
    );
  };

  const menuItems = [
    {
      id: 'home',
      name: 'Dashboard',
      icon: Inbox,
      path: '/dmc/dashboard',
      requiresApproval: false
    },
    {
      id: 'complete-profile',
      name: 'Complete Profile',
      icon: FileText,
      path: '/dmc/profile/register',
      requiresApproval: false,
      showOnlyIfNotApproved: true
    },
    {
      id: 'post',
      name: 'Post Bid Inquiry',
      icon: PlusCircle,
      path: '/dmc/inquiries/post',
      requiresApproval: true
    },
    {
      id: 'inquiries',
      name: 'My Inquiries',
      icon: Search,
      path: '/dmc/inquiries',
      requiresApproval: true
    },
    {
      id: 'received-contracts',
      name: 'Received Contracts',
      icon: FileText,
      path: '/dmc/received-contracts',
      requiresApproval: true
    },
    // {
    //   id: 'bids',
    //   name: 'My Bids',
    //   icon: Gavel,
    //   path: '/dmc/my-bids',
    //   requiresApproval: true
    // },
    {
      id: 'direct',
      name: 'Direct Inquiries',
      icon: TrendingUp,
      path: '/dmc/direct-inquiries/history',
      requiresApproval: true
    },
    {
      id: 'staff',
      name: 'Staff Management',
      icon: Users,
      path: '/dmc/staff',
      requiresApproval: true,
      showForSuperAdminOnly: true
    },
    {
      id: 'myprofile',
      name: 'Profile',
      icon: User,
      path: '/dmc/profile',
      requiresApproval: true,
      hideForStaff: true
    }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.showOnlyIfNotApproved && profileStatus?.isApproved) return false;
    if (item.showForSuperAdminOnly && !isSuperAdmin()) return false;
    if (item.hideForStaff && isStaff()) return false;
    return true;
  });

  const isActiveRoute = (path) => {
    if (path === '/dmc/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center">
              <div className="bg-teal-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl lg:text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-600">
                DMC Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Subscription Reminder */}
            <SubscriptionReminder />

            {/* Upgrade Button */}
            <button
              onClick={() => navigate('/subscription/purchase')}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-md font-medium"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Upgrade Plan</span>
            </button>

            {/* Status Badge */}
            {getStatusBadge()}

            {/* Notifications */}
            <NotificationBell />

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

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="h-full overflow-y-auto py-4">
            {/* Menu Items */}
            <div className="space-y-1 px-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                const isDisabled = item.requiresApproval && !profileStatus?.isApproved;

                return (
                  <button
                    key={item.id}
                    onClick={() => !isDisabled && navigate(item.path)}
                    disabled={isDisabled}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-teal-50 text-teal-600 font-medium'
                        : isDisabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    title={isDisabled ? 'Complete profile approval required' : ''}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
          <div className="p-6">
            <Outlet context={{ profileStatus }} />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DMCLayout;
