import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Building2, Plane, Shield } from 'lucide-react';
import React from 'react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-600">Hotel & DMC Bidding Platform</h1>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Connect Hotels with DMCs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The ultimate B2B marketplace for hotels to find destination management companies 
            and DMCs to showcase their services through competitive bidding.
          </p>
        </div>

        {/* Registration Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Hotel Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Building2 className="w-8 h-8 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              For Hotels
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Post your guest requirements and receive competitive bids from verified DMCs.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Direct inquiry to specific DMCs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Open bidding for best deals</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Compare proposals easily</span>
              </li>
            </ul>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => navigate('/register/hotel')}
            >
              Become a Hotel Partner
            </Button>
          </div>

          {/* DMC Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Plane className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              For DMCs
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Showcase your services and bid on hotel guest requirements.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Create comprehensive profiles</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Bid on relevant inquiries</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Grow your business network</span>
              </li>
            </ul>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => navigate('/register/dmc')}
            >
              Become a DMC Partner
            </Button>
          </div>

          {/* Admin Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Admin Access
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Manage the platform, users, and ensure quality standards.
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">User management</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Platform monitoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-700">Quality assurance</span>
              </li>
            </ul>
            <Button 
              variant="success" 
              className="w-full"
              onClick={() => navigate('/register/admin')}
            >
              Admin Registration
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-12">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">🔒</div>
              <h4 className="font-bold text-gray-900 mb-2">Secure</h4>
              <p className="text-sm text-gray-600">End-to-end encrypted transactions</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">⚡</div>
              <h4 className="font-bold text-gray-900 mb-2">Fast</h4>
              <p className="text-sm text-gray-600">Quick bidding and responses</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="font-bold text-gray-900 mb-2">Cost-Effective</h4>
              <p className="text-sm text-gray-600">Competitive pricing through bidding</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-4xl mb-3">🌍</div>
              <h4 className="font-bold text-gray-900 mb-2">Global</h4>
              <p className="text-sm text-gray-600">Connect with partners worldwide</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Hotel & DMC Bidding Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
