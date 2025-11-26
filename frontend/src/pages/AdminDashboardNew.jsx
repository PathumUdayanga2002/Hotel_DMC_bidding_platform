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
  ChevronRight
} from 'lucide-react';

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dmcStats, setDmcStats] = useState(null);
  const [hotelStats, setHotelStats] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [approvalsSubmenuOpen, setApprovalsSubmenuOpen] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [dmcResponse, hotelResponse] = await Promise.all([
        api.get('/admin/dmc-approvals/stats'),
        api.get('/admin/hotel-approvals/stats')
      ]);
      setDmcStats(dmcResponse.data.data);
      setHotelStats(hotelResponse.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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
        { id: 'hotel', name: 'Hotel Profiles', path: '/admin/hotel-approvals', badge: hotelStats?.pending || 0 }
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
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
          <Outlet context={{ dmcStats, hotelStats, refreshStats: fetchStats }} />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardNew;
