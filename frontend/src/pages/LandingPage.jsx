import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Navbar } from '../components';
import { Building2, Plane, Shield, Lock, Zap, DollarSign, Globe, Clock, Users, TrendingUp, Award, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, X } from 'lucide-react';
import React, { useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-green-50">
      {/* Modern Navbar */}
      <Navbar setShowRegistrationModal={setShowRegistrationModal} />

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in slide-in-from-bottom duration-500">
            {/* Close Button */}
            <button
              onClick={() => setShowRegistrationModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-3">
                Choose Your Registration Type
              </h2>
              <p className="text-gray-300 text-lg">
                Select the option that best describes your business
              </p>
            </div>

            {/* Registration Options */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Hotel Registration Card */}
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  navigate('/register/hotel');
                }}
                className="group relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Hotel
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Register as a hotel to post your requirements and receive competitive bids from qualified DMCs
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 transition-all duration-300"></div>
              </button>

              {/* DMC Registration Card */}
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  navigate('/register/dmc');
                }}
                className="group relative overflow-hidden rounded-xl p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg border border-white/20 hover:border-amber-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plane className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    DMC
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Register as a DMC to browse hotel requirements and submit competitive bids for services
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:to-yellow-500/10 transition-all duration-300"></div>
              </button>
            </div>

            {/* Helper Text */}
            <p className="text-center text-gray-400 text-sm mt-6">
              Not sure which option? <span className="text-amber-400">Hotels</span> post requirements, <span className="text-amber-400">DMCs</span> bid on them.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section - Full Screen Banner */}
      <section 
        id="home" 
        className="relative h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/70"
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center animate-in fade-in duration-700">
          {/* Main Headline - Slides in from bottom */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-in slide-in-from-bottom duration-700 delay-100 tracking-tight">
            Connect Hotels with DMCs
          </h1>
          
          {/* Subheadline - Slides in with delay */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed animate-in slide-in-from-bottom duration-700 delay-200 font-light tracking-wide">
            The ultimate B2B marketplace for hotels to find destination management companies 
            and DMCs to showcase their services through competitive bidding.
          </p>

          {/* CTA Buttons - Slide in with staggered delays */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in slide-in-from-bottom duration-700 delay-300">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="relative px-10 py-4 font-semibold text-base text-black tracking-wide overflow-hidden rounded-lg group shadow-2xl shadow-amber-900/30 hover:shadow-amber-900/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Get Started</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 text-base font-semibold text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-sm rounded-lg hover:bg-white/10 transition-all duration-300 tracking-wide"
            >
              Sign In
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Cards Section - Full Width */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.75) 0%, rgba(34,34,34,0.75) 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light tracking-wide mb-12">
              Join our platform as a hotel partner or destination management company
            </p>
          </div>

          {/* Registration Cards */}
          <div id="how-it-works" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto scroll-mt-20 border-t border-white/40 pt-12">
          {/* Hotel Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300 group-hover:scale-110">
              <Building2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center tracking-tight">
              For Hotels & Resorts
            </h3>
            <p className="text-gray-200 mb-6 text-center font-light leading-relaxed">
              Streamline guest experiences by connecting with top-tier destination management companies worldwide.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Direct inquiries to verified DMCs</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Competitive bidding for best rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Compare and select top proposals</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Real-time communication dashboard</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/register/hotel')}
              className="relative w-full px-7 py-3 font-semibold text-base text-black tracking-wide overflow-hidden rounded-lg group shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 transition-all duration-300 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Become a Hotel Partner</span>
            </button>
          </div>

          {/* DMC Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300 group-hover:scale-110">
              <Plane className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center tracking-tight">
              For DMCs & Agencies
            </h3>
            <p className="text-gray-200 mb-6 text-center font-light leading-relaxed">
              Expand your reach and win more business by connecting with premium hotels globally.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Build comprehensive service profiles</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Bid on high-value hotel inquiries</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Grow your partner network</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Increase bookings by 40%+</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/register/dmc')}
              className="relative w-full px-7 py-3 font-semibold text-base text-black tracking-wide overflow-hidden rounded-lg group shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 transition-all duration-300 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Become a DMC Partner</span>
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300 group-hover:scale-110">
              <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center tracking-tight">
              Platform Administration
            </h3>
            <p className="text-gray-200 mb-6 text-center font-light leading-relaxed">
              Oversee operations, ensure quality standards, and maintain platform excellence.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Complete user management control</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Real-time platform monitoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Quality assurance & verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-3 text-lg font-bold">✓</span>
                <span className="text-gray-300 font-light">Analytics & reporting dashboard</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/register/admin')}
              className="relative w-full px-7 py-3 font-semibold text-base text-black tracking-wide overflow-hidden rounded-lg group shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 transition-all duration-300 mt-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10">Admin Registration</span>
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* Features Section - Full Width */}
      <section 
        id="features" 
        className="relative py-20 scroll-mt-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.8) 100%), url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 - Secure */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <Lock className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Bank-Level Security</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">End-to-end encrypted transactions with advanced fraud protection and secure payment processing</p>
            </div>

            {/* Feature 2 - Fast */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Lightning Fast</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Real-time bidding responses and instant notifications to keep your business moving forward</p>
            </div>

            {/* Feature 3 - Cost Effective */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Best Value</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Competitive pricing through transparent bidding saves you up to 30% on booking costs</p>
            </div>

            {/* Feature 4 - Global */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <Globe className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Global Network</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Connect with verified partners across 150+ countries and expand your reach worldwide</p>
            </div>

            {/* Feature 5 - 24/7 Support */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">24/7 Support</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Round-the-clock customer service to assist you whenever and wherever you need help</p>
            </div>

            {/* Feature 6 - Verified Partners */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <Award className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Verified Partners</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">All partners undergo rigorous verification to ensure quality and reliability standards</p>
            </div>

            {/* Feature 7 - Easy Management */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <Users className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Easy Management</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">Intuitive dashboard to manage all partnerships, bids, and communications in one place</p>
            </div>

            {/* Feature 8 - Smart Analytics */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-amber-400/40 hover:bg-white/10 transition-all duration-300 group text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-900/30 group-hover:shadow-amber-900/50 transition-all duration-300">
                <DollarSign className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h4 className="font-bold text-white text-lg mb-3">Smart Pricing</h4>
              <p className="text-sm text-gray-300 leading-relaxed font-light">AI-powered insights help you make informed decisions and optimize your pricing strategy</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="relative py-20 scroll-mt-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.85) 0%, rgba(30,30,30,0.85) 100%), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
              About Our Platform
            </h3>
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed font-light tracking-wide">
              We are revolutionizing the hospitality industry by creating a seamless connection 
              between hotels and destination management companies. Our B2B marketplace enables 
              efficient collaboration, competitive pricing, and superior guest experiences through 
              innovative technology and transparent bidding processes.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12 border-t border-white/40 pt-12">
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">500+</div>
                <p className="text-gray-200 font-light">Active Hotels</p>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">300+</div>
                <p className="text-gray-200 font-light">Verified DMCs</p>
              </div>
              <div className="p-6">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">10k+</div>
                <p className="text-gray-200 font-light">Successful Deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Full Width */}
      <section 
        className="relative py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(0,0,0,0.85) 0%, rgba(20,20,20,0.85) 100%), url('https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
              What Our Partners Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
              <div className="mb-6">
                <div className="flex text-amber-400 mb-4">
                  <span className="text-2xl">★★★★★</span>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed font-light italic">
                  "HotelConnect has transformed how we source hotels for our clients. The bidding system ensures we always get competitive rates."
                </p>
              </div>
              <div className="border-t border-white/20 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SJ</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Sarah Johnson</p>
                    <p className="text-gray-400 text-sm font-light">Global Travel Solutions DMC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
              <div className="mb-6">
                <div className="flex text-amber-400 mb-4">
                  <span className="text-2xl">★★★★★</span>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed font-light italic">
                  "As a hotel, we've seen a 40% increase in bookings since joining this platform. The real-time communication is a game changer."
                </p>
              </div>
              <div className="border-t border-white/20 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">MC</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Michael Chen</p>
                    <p className="text-gray-400 text-sm font-light">Grand Marina Resort</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group">
              <div className="mb-6">
                <div className="flex text-amber-400 mb-4">
                  <span className="text-2xl">★★★★★</span>
                </div>
                <p className="text-gray-200 text-lg leading-relaxed font-light italic">
                  "The platform is intuitive and easy to use. We can manage all our hotel partnerships in one place efficiently."
                </p>
              </div>
              <div className="border-t border-white/20 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">EW</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Emma Williams</p>
                    <p className="text-gray-400 text-sm font-light">Destination Experts DMC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className="relative py-20 scroll-mt-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.8) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">
              Get in Touch
            </h3>
            <p className="text-lg md:text-xl text-gray-200 mb-12 font-light tracking-wide">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl p-8">
              <div className="space-y-6">
                <div className="text-left border-b border-white/20 pb-4">
                  <p className="text-gray-300 font-medium mb-2">📧 Email</p>
                  <p className="text-white">contact@hotelbidding.com</p>
                </div>
                <div className="text-left border-b border-white/20 pb-4">
                  <p className="text-gray-300 font-medium mb-2">📞 Phone</p>
                  <p className="text-white">+1 (555) 123-4567</p>
                </div>
                <div className="text-left pb-2">
                  <p className="text-gray-300 font-medium mb-2">📍 Address</p>
                  <p className="text-white">123 Business Avenue, Suite 100, New York, NY 10001</p>
                </div>
              </div>
              <button
                className="relative w-full px-7 py-3.5 font-semibold text-base text-black tracking-wide overflow-hidden rounded-lg group shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 transition-all duration-300 mt-8"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative z-10">Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 text-white">
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">HOTEL BIDDING</h3>
                  <p className="text-[10px] text-gray-400 tracking-[0.15em] uppercase">Premium Platform</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                Connecting hotels with destination management companies worldwide through innovative bidding technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 rounded-lg flex items-center justify-center transition-all duration-300 group">
                  <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-tight">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => scrollToSection('#home')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Browse Hotels
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#how-it-works')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#features')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#about')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#contact')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-tight">Legal & Policies</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/terms-of-service')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/privacy-policy')} className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm font-light flex items-center group">
                    <span className="w-0 h-px bg-amber-400 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-tight">Contact Support</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Email Support</p>
                    <a href="mailto:contact@hotelbidding.com" className="text-white hover:text-amber-400 transition-colors duration-300 text-sm font-light">
                      contact@hotelbidding.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Phone Support</p>
                    <a href="tel:+15551234567" className="text-white hover:text-amber-400 transition-colors duration-300 text-sm font-light">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Address</p>
                    <p className="text-white text-sm font-light">
                      123 Business Avenue<br />
                      Suite 100, NY 10001
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <p className="text-gray-400 text-sm font-light">
                &copy; 2024 Hotel & DMC Bidding Platform. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
