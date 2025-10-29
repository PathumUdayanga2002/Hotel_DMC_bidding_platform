import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Shield,
  LogOut,
  User,
  Bell,
  MessageSquare,
  Menu,
  X,
  LayoutDashboard,
  FileCheck,
  Users,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Users as UsersIcon,
  DollarSign,
  CreditCard,
  Activity,
  Star,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dmcStats, setDmcStats] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [approvalsSubmenuOpen, setApprovalsSubmenuOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 3450,
    monthlyRevenue: 2845000,
    platformFees: 142000,
    activeInquiries: 340,
    monthlyBookings: 1240,
    userSatisfaction: 4.8,
    systemUptime: 99.9
  });

   // State for recent activities from database
  const [recentActivity, setRecentActivity] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Icon mapping for dynamic icons
  const iconComponents = {
    CheckCircle,
    Calendar,
    DollarSign,
    Clock,
    Settings,
    FileCheck,
    Activity
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dmc-approvals/stats');
      setDmcStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };


  //TODO:
   // Fetch recent activities from MongoDB
    const fetchRecentActivities = async () => {
    try {
      setLoadingActivities(true);
      const response = await api.get('/activities/recent');
      if (response.data.success) {
        setRecentActivity(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      toast.error('Failed to load recent activities');
      // Fallback to sample data if API fails
      setRecentActivity(getSampleActivities());
    } finally {
      setLoadingActivities(false);
    }
  };
  //TODO:

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      submenu: null
    },
    {
      id: 'approvals',
      name: 'Profile Approvals',
      icon: FileCheck,
      path: null,
      submenu: [
        { id: 'dmc', name: 'DMC Profiles', path: '/admin/dmc-approvals', badge: dmcStats?.pending || 0 },
        { id: 'hotel', name: 'Hotel Profiles', path: '/admin/hotel-approvals', disabled: true }
      ]
    },
    {
      id: 'users',
      name: 'User Management',
      icon: Users,
      path: '/admin/users',
      disabled: true
    },
    {
      id: 'analytics',
      name: 'Platform Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      disabled: true
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      disabled: true
    }
  ];

  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleMenuClick = (item) => {
    if (item.disabled) {
      toast.info('This feature is coming soon');
      return;
    }

    if (item.submenu) {
      if (item.id === 'approvals') {
        setApprovalsSubmenuOpen(!approvalsSubmenuOpen);
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  //TODO:
   // Render recent activity section
  const renderRecentActivity = () => {
    if (loadingActivities) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {recentActivity.map((activity) => {
          const IconComponent = iconComponents[activity.icon] || Activity;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor.replace('text', 'bg')} bg-opacity-10`}>
                <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  //TODO:

  // Render dashboard content when on the main dashboard route
  const renderDashboardContent = () => {
    if (location.pathname !== '/admin/dashboard') {
      return <Outlet context={{ dmcStats, refreshStats: fetchStats }} />;
    }

    return (
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Total Users</p>
                {/* {loadingStats ? (
                  <div className ="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-24 mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 mt-2"></div>
                  </div>
                  ):(
                    <>
                      <h3 className="text-3xl font-bold text-gray-900 mt-2">
                         {formatNumber(statsData.totalUsers)}
                      </h3>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                         <span className="text-sm text-green-600 font-medium">
                          +{statsData.userGrowthPercent}% this month
                         </span>
                      </div>
                    </>
                  )} */}

                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UsersIcon className="w-6 h-6 text-blue-600" />
                  </div>
              </div>
              <div>

                


      
    

          
                
                {/* <h3 className="text-3xl font-bold text-gray-900 mt-2">3,450</h3>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12% this month</span>
                </div> */}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Monthly Revenue Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">$2845K</h3>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+18% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Platform Fees Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Fees</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">$142K</h3>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+15% this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Health */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Inquiries:</span>
                <span className="font-semibold text-gray-900">340</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Bookings:</span>
                <span className="font-semibold text-gray-900">1240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">User Satisfaction:</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-semibold text-gray-900">4.8/5.0</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">System Uptime:</span>
                <span className="font-semibold text-green-600">99.9%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.iconColor.replace('text', 'bg')} bg-opacity-10`}>
                      <IconComponent className={`w-4 h-4 ${activity.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Pending Approvals</p>
                <h3 className="text-2xl font-bold mt-2">{dmcStats?.pending || 12}</h3>
              </div>
              <FileCheck className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Approved This Month</p>
                <h3 className="text-2xl font-bold mt-2">{dmcStats?.approvedThisMonth || 24}</h3>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total DMCs</p>
                <h3 className="text-2xl font-bold mt-2">{dmcStats?.total || 156}</h3>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Revenue Growth</p>
                <h3 className="text-2xl font-bold mt-2">+18%</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-200" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section - Logo & Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center">
              <div className="bg-green-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-green-600">Admin Portal</h1>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Messages */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-40">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/admin/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-green-50 text-green-600'
                      : item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  disabled={item.disabled}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.submenu && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        item.id === 'approvals' && approvalsSubmenuOpen ? 'rotate-90' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {item.submenu && item.id === 'approvals' && approvalsSubmenuOpen && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.submenu.map((subitem) => (
                      <button
                        key={subitem.id}
                        onClick={() => {
                          if (!subitem.disabled) {
                            navigate(subitem.path);
                          } else {
                            toast.info('This feature is coming soon');
                          }
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActive(subitem.path)
                            ? 'bg-green-50 text-green-600'
                            : subitem.disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                        disabled={subitem.disabled}
                      >
                        <span>{subitem.name}</span>
                        {subitem.badge > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {subitem.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="p-6">
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardNew;