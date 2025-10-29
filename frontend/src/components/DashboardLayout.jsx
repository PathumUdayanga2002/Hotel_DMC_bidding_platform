import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Sidebar from './Sidebar';
import StatButton from './StatButton';
import ApprovalCard from './ApprovalCard';

const DashboardLayout = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalDMCs: 0,
    pendingApprovals: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showPendingApprovals, setShowPendingApprovals] = useState(false);

  useEffect(() => {
    // Initial data fetch
    fetchDashboardStats();
    fetchPendingApprovals();

    // WebSocket connection for real-time updates
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/dashboard-updates', (message) => {
          const updatedStats = JSON.parse(message.body);
          setStats(updatedStats);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
      },
      onError: (error) => {
        console.error('WebSocket Error:', error);
      }
    });

    client.activate();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dashboard/pending-approvals');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatButton
              label="Hotels"
              count={stats.totalHotels}
              onClick={() => setShowPendingApprovals(false)}
            />
            <StatButton
              label="DMCs"
              count={stats.totalDMCs}
              onClick={() => setShowPendingApprovals(false)}
            />
            <StatButton
              label="Pending Approvals"
              count={stats.pendingApprovals}
              onClick={() => setShowPendingApprovals(true)}
            />
          </div>

          {/* Pending Approvals Section */}
          {showPendingApprovals && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <ApprovalCard 
                    key={request.id} 
                    approval={request}
                    onStatusUpdate={(updatedRequest) => {
                      // Handle status update
                      fetchDashboardStats();
                      fetchPendingApprovals();
                    }}
                  />
                ))}
                {pendingRequests.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No pending approvals at the moment
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Router Outlet for nested routes */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
