import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Gavel,
  Search,
  TrendingUp,
  Users
} from 'lucide-react';

const DMCHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profileStatus } = useOutletContext();

  return (
    <>
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
        </h2>
        <p className="text-gray-600">
          Manage your DMC operations and respond to hotel inquiries
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Bids</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-teal-100 rounded-full p-3">
              <Gavel className="w-8 h-8 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Direct Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!profileStatus?.isApproved && (
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg shadow-lg p-8 text-white text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl font-bold mb-2">Complete Your DMC Profile</h3>
          <p className="mb-6 opacity-90">
            Register your company details to access all platform features and start bidding on hotel inquiries.
          </p>
          <button
            onClick={() => navigate('/dmc/profile/register')}
            className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Complete Profile Registration
          </button>
        </div>
      )}
    </>
  );
};

export default DMCHome;
