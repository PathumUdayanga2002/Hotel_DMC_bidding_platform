import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import StatButton from '../components/StatButton';
import ApprovalCard from '../components/ApprovalCard';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalDMCs: 0,
    pendingApprovals: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Initial data fetch
    fetchDashboardStats();
    fetchPendingApprovals();

    // WebSocket connection for real-time updates
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {},
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        client.subscribe('/topic/dashboard-updates', (message) => {
          const updatedStats = JSON.parse(message.body);
          setStats(updatedStats);
        });
      }
    });

    client.activate();

    return () => {
      client.deactivate();
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
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-grow p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatButton
            label="Hotels"
            count={stats.totalHotels}
            onClick={() => setActiveTab('hotels')}
          />
          <StatButton
            label="DMCs"
            count={stats.totalDMCs}
            onClick={() => setActiveTab('dmcs')}
          />
          <StatButton
            label="Pending Approvals"
            count={stats.pendingApprovals}
            onClick={() => setActiveTab('pending')}
          />
        </div>

        {activeTab === 'pending' && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Pending Approvals</h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <ApprovalCard key={request.id} approval={request} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;