import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import NotificationBell from '../components/NotificationBell';
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
  ChevronRight,
  CreditCard
} from 'lucide-react';

const AdminDashboardNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dmcStats, setDmcStats] = useState(null);
  const [hotelStats, setHotelStats] = useState(null);
  const [approvalsSubmenuOpen, setApprovalsSubmenuOpen] = useState(true);

  // Redirect non-admin users
  useEffect(() => {
    if (user && !['ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(user.role)) {
      console.log('Non-admin user detected, redirecting...');
      if (user.role === 'DMC_SUPER_ADMIN' || user.role === 'DMC_STAFF_ADMIN' || user.role === 'DMC_USER') {
        navigate('/dmc/dashboard', { replace: true });
      } else if (user.role === 'HOTEL_SUPER_ADMIN' || user.role === 'HOTEL_STAFF_ADMIN' || user.role === 'HOTEL_USER') {
        navigate('/hotel/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && ['ADMIN', 'PLATFORM_SUPER_ADMIN'].includes(user.role)) {
      fetchStats();
    }
  }, [user]);

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
      // Don't show error toast if it's a 403 (user doesn't have access)
      if (error.response?.status !== 403) {
        toast.error('Failed to fetch dashboard stats');
      }
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
      path: '/admin/user-management',
      disabled: false
    },
    {
      id: 'analytics',
      name: 'Platform Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      disabled: false
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions',
      icon: CreditCard,
      path: '/admin/subscriptions',
      disabled: false
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      disabled: false
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      {/* Top Header - Premium Gradient */}
      <header className="bg-gradient-to-r from-teal-600 to-emerald-600 shadow-lg fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section - Logo & Menu Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
            <div className="flex items-center">
              <div className="bg-white/20 backdrop-blur-md w-10 h-10 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white drop-shadow-md">Admin Portal</h1>
            </div>
          </div>

          {/* Right Section - Notifications & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationBell />

            {/* Messages */}
            <button 
              onClick={() => navigate('/admin/messages')}
              className="relative p-2 rounded-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="w-8 h-8 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-white drop-shadow">{user?.username}</p>
                  <p className="text-xs text-teal-50">Administrator</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <LogOut className="w-5 h-5 text-white" />
                <span className="text-white font-medium hidden lg:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Modern Design */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 shadow-xl transition-transform duration-300 z-20 ${
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
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30'
                      : item.disabled
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-teal-50 hover:shadow-md'
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
                        className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                          isActive(subitem.path)
                            ? 'bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-700 border-l-4 border-teal-500'
                            : subitem.disabled
                            ? 'text-slate-400 cursor-not-allowed'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
                        }`}
                        disabled={subitem.disabled}
                      >
                        <span>{subitem.name}</span>
                        {subitem.badge > 0 && (
                          <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
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

      {/* Main Content - Premium Background */}
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
