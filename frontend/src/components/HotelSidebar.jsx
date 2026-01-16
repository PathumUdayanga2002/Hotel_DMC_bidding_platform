import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Building2,
  User,
  FileText,
  Send,
  MessageSquare,
  Inbox,
  TrendingUp,
  Users,
  Activity,
  Mail
} from 'lucide-react';

const HotelSidebar = ({ profileStatus, isSuperAdmin, isStaff, pendingInquiriesCount, activeItem, setActiveItem, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const isApproved = profileStatus === 'APPROVED';
  const navItems = [
    { name: 'My Profile', icon: User, path: '/hotel/profile/register', locked: false, hideForStaff: true },
    { name: 'Available Inquiries', icon: Inbox, path: '/hotel/inquiries', locked: !isApproved },
    { name: 'Direct Inquiries', icon: Mail, path: '/hotel/direct-inquiries', locked: !isApproved },
    { name: 'My Bids', icon: TrendingUp, path: '/hotel/bids', locked: !isApproved },
    { name: 'My Inquiries', icon: FileText, locked: !isApproved },
    { name: 'Received Proposals', icon: Send, locked: !isApproved },
    { name: 'My Contracts', icon: FileText, path: '/hotel/mycontracts', locked: !isApproved },
    { name: 'Send Contracts', icon: FileText, path: '/hotel/sendcontracts', locked: !isApproved },
    { name: 'Staff Management', icon: Users, path: '/hotel/staff', locked: !isApproved, showForSuperAdminOnly: true },
    { name: 'Activity Logs', icon: Activity, path: '/hotel/activity-logs', locked: !isApproved },
  ];

  return (
    <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white shadow-md flex flex-col flex-shrink-0`}>
      <div className="flex items-center justify-center h-16 border-b shadow-sm">
        <div className="bg-cyan-600 w-8 h-8 rounded-lg flex items-center justify-center mr-2">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-cyan-600">Hotel Portal</h1>
      </div>

      <nav className="p-4 space-y-2">
        {navItems
          .filter((item) => {
            if (item.hideForStaff && isStaff) return false;
            if (item.showForSuperAdminOnly && !isSuperAdmin) return false;
            return true;
          })
          .map((item) => {
            const Icon = item.icon;
            const locked = item.locked;

            return (
              <button
                key={item.name}
                onClick={() => {
                  try {
                    setSidebarOpen(true);
                    setActiveItem && setActiveItem(item.name);
                    localStorage.setItem('hotel_sidebar_open', 'true');
                    localStorage.setItem('hotel_sidebar_active', item.name);
                  } catch (e) {}

                  if (!locked) navigate(item.path);
                  else toast.warning('Please complete profile registration and wait for admin approval');
                }}
                disabled={locked}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  locked
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : item.name === activeItem
                      ? 'bg-cyan-50 text-green-600'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
                {item.name === 'Direct Inquiries' && pendingInquiriesCount > 0 && !locked && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pendingInquiriesCount}
                  </span>
                )}
              </button>
            );
          })}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-gray-400">© 2025 Hotel Portal</p>
      </div>
    </aside>
  );
};

export default HotelSidebar;
