import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Building2, LogOut, User, Mail } from 'lucide-react';
import React from 'react';

const HotelDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-cyan-600 w-10 h-10 rounded-full flex items-center justify-center mr-3">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-cyan-600">Hotel Dashboard</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2 inline" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <Card className="mb-8">
            <div className="text-center">
              <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-cyan-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Hotel Dashboard
              </h2>
              <p className="text-gray-600">
                Manage your guest requirements and connect with DMCs
              </p>
            </div>
          </Card>

          {/* User Info Card */}
          <Card className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Information</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-cyan-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Username</p>
                  <p className="font-semibold text-gray-900">{user?.username || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-cyan-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Building2 className="w-5 h-5 text-cyan-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold text-cyan-600">{user?.role || 'HOTEL_USER'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">Create Inquiry</p>
                <p className="text-sm text-gray-400 mt-2">Coming soon in Phase 2</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">View DMCs</p>
                <p className="text-sm text-gray-400 mt-2">Coming soon in Phase 2</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">My Inquiries</p>
                <p className="text-sm text-gray-400 mt-2">Coming soon in Phase 2</p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">Received Proposals</p>
                <p className="text-sm text-gray-400 mt-2">Coming soon in Phase 2</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HotelDashboard;
