import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import HotelSidebar from '../components/HotelSidebar';
import HotelHeader from '../components/HotelHeader';
import api from '../services/api';
import { hotelService } from '../services/hotelService';
import { useAuth } from '../context/AuthContext';

const HotelLayout = () => {
  const { token, isSuperAdmin, isStaff } = useAuth();
  const [profileStatus, setProfileStatus] = useState('LOADING');
  const [pendingInquiriesCount, setPendingInquiriesCount] = useState(0);

  // Sidebar state persisted across hotel pages
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const val = localStorage.getItem('hotel_sidebar_open');
      if (val === null) return true;
      return val === 'true';
    } catch (e) {
      return true;
    }
  });
  const [activeItem, setActiveItem] = useState(() => {
    try {
      return localStorage.getItem('hotel_sidebar_active') || '';
    } catch (e) {
      return '';
    }
  });

  useEffect(() => {
    const fetchStatus = async () => {
      setProfileStatus('LOADING');
      setPendingInquiriesCount(0);
      try {
        const resp = await api.get('/hotel/dashboard', { headers: { Authorization: `Bearer ${token}` } });
        if (resp.data?.success) {
          setProfileStatus('APPROVED');
        } else {
          const msg = resp.data?.message || '';
          if (msg.includes('not found')) setProfileStatus('NOT_REGISTERED');
          else if (msg.includes('pending')) setProfileStatus('PENDING_APPROVAL');
          else setProfileStatus('ERROR');
        }

        try {
          const inquiriesResponse = await hotelService.getDirectInquiries();
          if (inquiriesResponse.data?.success) {
            const inquiries = inquiriesResponse.data.data || [];
            const pendingCount = inquiries.filter(inq => inq.status === 'SENT').length;
            setPendingInquiriesCount(pendingCount);
          }
        } catch (e) {
          console.error('Failed to fetch inquiries count', e);
        }
      } catch (err) {
        console.error('Failed to fetch hotel dashboard status', err);
        setProfileStatus('ERROR');
      }
    };

    fetchStatus();
  }, [token]);

  return (
    <div className="flex h-screen bg-slate-50 font-inter">
      <HotelSidebar
        profileStatus={profileStatus}
        isSuperAdmin={isSuperAdmin()}
        isStaff={isStaff()}
        pendingInquiriesCount={pendingInquiriesCount}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HotelHeader profileStatus={profileStatus} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HotelLayout;
