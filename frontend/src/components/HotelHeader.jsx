import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, CreditCard, CheckCircle, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { toast } from 'react-toastify';

const HotelHeader = ({ profileStatus }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

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
    <header className="sticky top-0 bg-white shadow-sm p-4 flex justify-between items-center z-30">
      <div>{renderProfileStatus()}</div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/subscription/purchase')}
          className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
        >
          <CreditCard className="w-4 h-4 mr-2 inline" /> Upgrade Plan
        </button>

        <NotificationBell />

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.username || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email || ''}</p>
          </div>
          <User className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 p-2" />
        </div>

        <button 
          onClick={handleLogout} 
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default HotelHeader;
