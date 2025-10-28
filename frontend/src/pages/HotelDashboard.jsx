import React, { useState, useEffect } from 'react';
import {
  Building2,
  LogOut,
  User,
  FileText,
  Send,
  MessageSquare,
  Lock,
  Bell,
  CheckCircle2,
  FilePlus,
  Compass,
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // your axios instance

// --- UI Components ---
const Card = ({ className = '', children }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 ${className}`}>{children}</div>
);

const Button = ({ variant = 'default', onClick, children, className = '' }) => {
  let styles =
    'px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
  if (variant === 'outline') styles += ' border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-cyan-500';
  else if (variant === 'primary') styles += ' bg-white text-cyan-600 hover:bg-cyan-50 focus:ring-cyan-500';
  else if (variant === 'ghost') styles += ' text-gray-600 hover:bg-gray-100 focus:ring-gray-400';
  else styles += ' bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500';
  return (
    <button onClick={onClick} className={`${styles} ${className}`}>
      {children}
    </button>
  );
};

// --- Loading Spinner ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="w-12 h-12 text-cyan-600 animate-spin" />
  </div>
);

// --- CTACard ---
const CTACard = ({ title, message, buttonText, icon: Icon }) => (
  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl p-8 md:p-12 text-center flex flex-col items-center">
    <div className="bg-white/20 p-4 rounded-full mb-4">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-3xl font-bold mb-2">{title}</h3>
    <p className="text-lg text-cyan-100 max-w-2xl mb-6">{message}</p>
    <Button variant="primary">
      <CheckCircle2 className="w-5 h-5 mr-2" />
      {buttonText}
    </Button>
  </div>
);

// --- InfoCard ---
const InfoCard = ({ title, message, icon: Icon, iconColor, bgColor }) => (
  <Card className={`${bgColor} border ${bgColor.replace('bg-', 'border-')}-200`}>
    <div className="flex items-center">
      <Icon className={`w-10 h-10 ${iconColor} mr-4`} />
      <div>
        <h3 className={`text-xl font-bold ${iconColor.replace('text-', 'text-')}-800`}>{title}</h3>
        <p className={`${iconColor.replace('text-', 'text-')}-700 mt-1`}>{message}</p>
      </div>
    </div>
  </Card>
);

// --- StatCards ---
const StatCards = ({ dashboardData }) => {
  const stats = [
    { title: 'Active Inquiries', value: dashboardData.activeInquiries || 0, icon: FilePlus, color: 'text-green-500', bgColor: 'bg-green-50' },
    { title: 'Proposals Received', value: dashboardData.proposalsReceived || 0, icon: Send, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { title: 'Messages', value: dashboardData.messages || 0, icon: MessageSquare, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-full ${stat.bgColor}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- Sidebar ---
const Sidebar = ({ profileStatus }) => {
  const isApproved = profileStatus === 'APPROVED';
  const navItems = [
    { name: 'My Profile', icon: User, locked: false },
    { name: 'Browse DMCs', icon: Compass, locked: !isApproved },
    { name: 'My Inquiries', icon: FileText, locked: !isApproved },
    { name: 'Received Proposals', icon: Send, locked: !isApproved },
    { name: 'Messages', icon: MessageSquare, locked: !isApproved },
  ];

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col flex-shrink-0">
      <div className="flex items-center justify-center h-16 border-b shadow-sm">
        <div className="bg-cyan-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-cyan-600">Hotel Portal</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href="#"
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  item.locked ? 'text-gray-400 opacity-70 cursor-not-allowed' : 'text-gray-600 hover:bg-cyan-50 hover:text-cyan-600'
                }`}
                onClick={(e) => item.locked && e.preventDefault()}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="flex-1">{item.name}</span>
                {item.locked && profileStatus !== 'LOADING' && <Lock className="w-4 h-4" />}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-gray-400">&copy; 2025 Hotel Portal</p>
      </div>
    </aside>
  );
};

// --- Dashboard Header ---
const DashboardHeader = ({ user, handleLogout, profileStatus }) => {
  const renderProfileStatus = () => {
    switch (profileStatus) {
      case 'LOADING':
        return (
          <div className="text-sm font-medium px-4 py-2 rounded-lg text-gray-500 flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Checking status...
          </div>
        );
      case 'NOT_REGISTERED':
        return (
          <div className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-lg flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Profile Not Registered
          </div>
        );
      case 'PENDING_APPROVAL':
        return (
          <div className="bg-yellow-100 text-yellow-800 text-sm font-medium px-4 py-2 rounded-lg flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Profile Pending Approval
          </div>
        );
      case 'APPROVED':
        return (
          <div className="bg-green-100 text-green-800 text-sm font-medium px-4 py-2 rounded-lg flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Profile Approved
          </div>
        );
      default:
        return (
          <div className="bg-red-100 text-red-800 text-sm font-medium px-4 py-2 rounded-lg flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Status Error
          </div>
        );
    }
  };

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center flex-shrink-0 z-10">
      <div>{renderProfileStatus()}</div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'user@hotel.com'}</p>
          </div>
          <User className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 p-2" />
        </div>

        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  );
};

// --- Main HotelDashboard Component ---
const HotelDashboard = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();

  const [profileStatus, setProfileStatus] = useState('LOADING');
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setProfileStatus('LOADING');
      setError(null);
      setDashboardData(null);

      try {
        const response = await api.get('/hotel/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const apiResponse = response.data;

        if (apiResponse.success) {
          setDashboardData(apiResponse.data);
          setProfileStatus('APPROVED');
        } else {
          setError(apiResponse.message);
          if (apiResponse.message.includes('not found')) setProfileStatus('NOT_REGISTERED');
          else if (apiResponse.message.includes('pending')) setProfileStatus('PENDING_APPROVAL');
          else setProfileStatus('ERROR');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        if (err.response?.status === 403) {
          const msg = err.response.data?.message || 'Access forbidden';
          setError(msg);
          if (msg.includes('not found')) setProfileStatus('NOT_REGISTERED');
          else if (msg.includes('pending')) setProfileStatus('PENDING_APPROVAL');
          else setProfileStatus('ERROR');
        } else if (err.response?.status === 401) {
          setError('Unauthorized. Logging out...');
          setTimeout(() => handleLogout(), 1500);
        } else {
          setError(err.message || 'Network error');
          setProfileStatus('ERROR');
        }
      }
    };

    fetchDashboardData();
  }, [token]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-inter">
      <Sidebar profileStatus={profileStatus} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} handleLogout={handleLogout} profileStatus={profileStatus} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'Hotel Manager'}!
          </h2>
          <p className="text-gray-600 mb-8">Manage your hotel's needs and connect with DMCs.</p>

          {profileStatus === 'LOADING' && <LoadingSpinner />}
          {profileStatus === 'NOT_REGISTERED' && (
            <CTACard
              title="Complete Your Hotel Profile"
              message="Register your hotel details to access all platform features and start sending inquiries to DMCs."
              buttonText="Complete Profile Registration"
              icon={Building2}
            />
          )}
          {profileStatus === 'PENDING_APPROVAL' && (
            <InfoCard
              title="Profile Pending Approval"
              message="Your hotel profile has been submitted and is pending admin approval. You will have access to the dashboard features once approved."
              icon={Clock}
              iconColor="text-yellow-600"
              bgColor="bg-yellow-50"
            />
          )}
          {profileStatus === 'APPROVED' && dashboardData && <StatCards dashboardData={dashboardData} />}
          {profileStatus === 'ERROR' && error && (
            <InfoCard
              title="An Error Occurred"
              message={error}
              icon={AlertTriangle}
              iconColor="text-red-600"
              bgColor="bg-red-50"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default HotelDashboard;
