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
    <div className="min-h-screen bg-[#f7f7f7] text-[#111]">
      {/* Modern Navbar */}
      <Navbar setShowRegistrationModal={setShowRegistrationModal} />

      {/* Registration Modal */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
          <div className="relative bg-white border border-black/10 rounded-2xl shadow-xl max-w-2xl w-full p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowRegistrationModal(false)}
              className="absolute top-6 right-6 text-gray-600 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#111] mb-3">
                Choose Your Registration Type
              </h2>
              <p className="text-gray-600 text-lg">
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
                className="group relative overflow-hidden rounded-xl p-8 bg-white border border-black/10 hover:bg-black/5 transition-colors"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#111] mb-3">
                    Hotel
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Register as a hotel to post your requirements and receive competitive bids from qualified DMCs
                  </p>
                </div>
                <div className="absolute inset-0"></div>
              </button>

              {/* DMC Registration Card */}
              <button
                onClick={() => {
                  setShowRegistrationModal(false);
                  navigate('/register/dmc');
                }}
                className="group relative overflow-hidden rounded-xl p-8 bg-white border border-black/10 hover:bg-black/5 transition-colors"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-black flex items-center justify-center">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#111] mb-3">
                    DMC
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Register as a DMC to browse hotel requirements and submit competitive bids for services
                  </p>
                </div>
                <div className="absolute inset-0"></div>
              </button>
            </div>

            {/* Helper Text */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Not sure which option? <span className="text-[#111] font-medium">Hotels</span> post requirements, <span className="text-[#111] font-medium">DMCs</span> bid on them.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section - Full Screen Banner */}
      <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-black/10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center',  backgroundRepeat: 'no-repeat'  }} >
           {/* Light overlay for readability */}
        <div 
          className="absolute inset-0 bg-white/30"
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-16 text-center">
          {/* Main Headline - Slides in from bottom */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#111] mb-8 tracking-tight">
            Connect Hotels with DMCs
          </h1>
          
          {/* Subheadline - Slides in with delay */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed tracking-wide">
            The ultimate B2B marketplace for hotels to find destination management companies 
            and DMCs to showcase their services through competitive bidding.
          </p>

          {/* CTA Buttons - Slide in with staggered delays */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <button
              onClick={() => setShowRegistrationModal(true)}
              className="px-10 py-4 text-base font-medium text-white bg-black rounded-md hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 text-base font-medium text-[#111] border border-black/20 rounded-md hover:bg-black/5 transition-colors"
            >
              Sign In
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border border-black/20 bg-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-black/50 rounded-full mt-2"></div>
            </div>
          </div>
        </section> 

      {/* Registration Cards Section - Full Width */}
      <section 
        className="relative py-16"
      >
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-8">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light tracking-wide mb-12">
              Join our platform as a hotel partner or destination management company
            </p>
          </div>

          {/* Registration Cards */}
          <div id="how-it-works" className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto scroll-mt-20 border-t border-black/10 pt-12">
          {/* Hotel Card */}
          <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Building2 className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-medium text-[#111] mb-4 text-center tracking-tight">
              For Hotels & Resorts
            </h3>
            <p className="text-gray-600 mb-6 text-center leading-relaxed text-sm">
              Streamline guest experiences by connecting with top-tier destination management companies worldwide.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Direct inquiries to verified DMCs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Competitive bidding for best rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Compare and select top proposals</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Real-time communication dashboard</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/register/hotel')}
              className="w-full px-5 py-2 font-medium text-white bg-black rounded-md hover:opacity-90 transition-opacity mt-4"
            >
              Become a Hotel Partner
            </button>
          </div>

          {/* DMC Card */}
          <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Plane className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-medium text-[#111] mb-4 text-center tracking-tight">
              For DMCs & Agencies
            </h3>
            <p className="text-gray-600 mb-6 text-center leading-relaxed text-sm">
              Expand your reach and win more business by connecting with premium hotels globally.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Build comprehensive service profiles</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Bid on high-value hotel inquiries</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Grow your partner network</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Increase bookings by 40%+</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/register/dmc')}
              className="w-full px-5 py-2 font-medium text-white bg-black rounded-md hover:opacity-90 transition-opacity mt-4"
            >
              Become a DMC Partner
            </button>
          </div>

          {/* Admin Card */}
          <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-medium text-[#111] mb-4 text-center tracking-tight">
              Platform Administration
            </h3>
            <p className="text-gray-600 mb-6 text-center leading-relaxed text-sm">
              Oversee operations, ensure quality standards, and maintain platform excellence.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Complete user management control</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Real-time platform monitoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Quality assurance & verification</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#111] mr-3 text-lg">✓</span>
                <span className="text-gray-600">Analytics & reporting dashboard</span>
              </li>
            </ul>
            <button
              onClick={() => navigate('/register/admin')}
              className="w-full px-5 py-2 font-medium text-white bg-black rounded-md hover:opacity-90 transition-opacity mt-4"
            >
              Admin Registration
            </button>
          </div>
        </div>
      </section>

      {/* Features Section - Full Width */}
      <section 
        id="features" 
        className="relative py-16"
      >
        <div className="container mx-auto px-6 lg:px-16">
          <h3 className="text-3xl font-semibold text-[#111] mb-12 text-center tracking-tight">
            Why Choose Our Platform?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 - Secure */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Bank-Level Security</h4>
              <p className="text-sm text-gray-600 leading-relaxed">End-to-end encrypted transactions with advanced fraud protection and secure payment processing</p>
            </div>

            {/* Feature 2 - Fast */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Lightning Fast</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Real-time bidding responses and instant notifications to keep your business moving forward</p>
            </div>

            {/* Feature 3 - Cost Effective */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Best Value</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Competitive pricing through transparent bidding saves you up to 30% on booking costs</p>
            </div>

            {/* Feature 4 - Global */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Global Network</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Connect with verified partners across 150+ countries and expand your reach worldwide</p>
            </div>

            {/* Feature 5 - 24/7 Support */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">24/7 Support</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Round-the-clock customer service to assist you whenever and wherever you need help</p>
            </div>

            {/* Feature 6 - Verified Partners */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Verified Partners</h4>
              <p className="text-sm text-gray-600 leading-relaxed">All partners undergo rigorous verification to ensure quality and reliability standards</p>
            </div>

            {/* Feature 7 - Easy Management */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Easy Management</h4>
              <p className="text-sm text-gray-600 leading-relaxed">Intuitive dashboard to manage all partnerships, bids, and communications in one place</p>
            </div>

            {/* Feature 8 - Smart Analytics */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group text-center">
              <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h4 className="font-medium text-[#111] text-lg mb-3">Smart Pricing</h4>
              <p className="text-sm text-gray-600 leading-relaxed">AI-powered insights help you make informed decisions and optimize your pricing strategy</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className="relative py-16"
      >
        <div className="container mx-auto px-6 lg:px-16">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-semibold text-[#111] mb-8 tracking-tight">
              About Our Platform
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed tracking-wide">
              We are revolutionizing the hospitality industry by creating a seamless connection 
              between hotels and destination management companies. Our B2B marketplace enables 
              efficient collaboration, competitive pricing, and superior guest experiences through 
              innovative technology and transparent bidding processes.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12 border-t border-black/10 pt-12">
              <div className="p-6">
                <div className="text-4xl font-semibold text-[#111] mb-2">500+</div>
                <p className="text-gray-600">Active Hotels</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-semibold text-[#111] mb-2">300+</div>
                <p className="text-gray-600">Verified DMCs</p>
              </div>
              <div className="p-6">
                <div className="text-4xl font-semibold text-[#111] mb-2">10k+</div>
                <p className="text-gray-600">Successful Deals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Full Width */}
      <section 
        className="relative py-16"
      >
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#111] tracking-tight mb-4">
              What Our Partners Say
            </h2>
            <div className="w-20 h-px bg-black/10 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group">
              <div className="mb-6">
                <div className="flex text-[#111] mb-4">
                  <span className="text-2xl">★★★★★</span>
                </div>
                <p className="text-[#111] text-lg leading-relaxed italic">
                  "HotelConnect has transformed how we source hotels for our clients. The bidding system ensures we always get competitive rates."
                </p>
              </div>
              <div className="border-t border-black/10 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">SJ</span>
                  </div>
                  <div>
                    <p className="text-[#111] font-medium">Sarah Johnson</p>
                    <p className="text-gray-600 text-sm">Global Travel Solutions DMC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group">
              <div className="mb-6">
                <div className="flex text-[#111] mb-4">
                  <span className="text-2xl">★★★★★</span>
                </div>
                <p className="text-[#111] text-lg leading-relaxed italic">
                  "As a hotel, we've seen a 40% increase in bookings since joining this platform. The real-time communication is a game changer."
                </p>
              </div>
              <div className="border-t border-black/10 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">MC</span>
                  </div>
                  <div>
                    <p className="text-[#111] font-medium">Michael Chen</p>
                    <p className="text-gray-600 text-sm">Grand Marina Resort</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white border border-black/10 rounded-xl p-8 hover:bg-black/5 transition-colors group">
              <div className="mb-6">
                <div className="flex text-[#111] mb-4">
                  <span className="text-2xl">★★★★★</span>
                </div>
                <p className="text-[#111] text-lg leading-relaxed italic">
                  "The platform is intuitive and easy to use. We can manage all our hotel partnerships in one place efficiently."
                </p>
              </div>
              <div className="border-t border-black/10 pt-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">EW</span>
                  </div>
                  <div>
                    <p className="text-[#111] font-medium">Emma Williams</p>
                    <p className="text-gray-600 text-sm">Destination Experts DMC</p>
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
              <h3 className="text-3xl font-semibold text-[#111] mb-8 tracking-tight">
              Get in Touch
            </h3>
            <p className="text-sm text-gray-600 mb-12 tracking-wide">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
            <div className="bg-white border border-black/10 rounded-xl p-8">
              <div className="space-y-6">
                <div className="text-left border-b border-black/10 pb-4">
                  <p className="text-gray-600 mb-2">📧 Email</p>
                  <p className="text-[#111]">contact@hotelbidding.com</p>
                </div>
                <div className="text-left border-b border-black/10 pb-4">
                  <p className="text-gray-600 mb-2">📞 Phone</p>
                  <p className="text-[#111]">+1 (555) 123-4567</p>
                </div>
                <div className="text-left pb-2">
                  <p className="text-gray-600 mb-2">📍 Address</p>
                  <p className="text-[#111]">123 Business Avenue, Suite 100, New York, NY 10001</p>
                </div>
              </div>
              <button
                className="w-full px-5 py-2.5 font-medium text-white bg-black rounded-md hover:opacity-90 transition-opacity mt-8"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 text-[#111]">
        <div className="container mx-auto px-6 lg:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">HOTEL BIDDING</h3>
                  <p className="text-[10px] text-gray-600 tracking-[0.15em] uppercase">Premium Platform</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Connecting hotels with destination management companies worldwide through innovative bidding technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white border border-black/10 hover:bg-black/5 rounded-lg flex items-center justify-center transition-colors">
                  <Facebook className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-black/10 hover:bg-black/5 rounded-lg flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-black/10 hover:bg-black/5 rounded-lg flex items-center justify-center transition-colors">
                  <Instagram className="w-5 h-5 text-gray-600" />
                </a>
                <a href="#" className="w-10 h-10 bg-white border border-black/10 hover:bg-black/5 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5 text-gray-600" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#111] font-medium text-lg mb-6 tracking-tight">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => scrollToSection('#home')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Browse Hotels
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#how-it-works')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    How It Works
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#features')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#about')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('#contact')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div>
              <h4 className="text-[#111] font-medium text-lg mb-6 tracking-tight">Legal & Policies</h4>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('/terms-of-service')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/privacy-policy')} className="text-gray-600 hover:text-[#111] transition-colors duration-300 text-sm flex items-center group">
                    <span className="w-0 h-px bg-black mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-[#111] font-medium text-lg mb-6 tracking-tight">Contact Support</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white border border-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#111]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Email Support</p>
                    <a href="mailto:contact@hotelbidding.com" className="text-[#111] hover:opacity-80 transition-colors text-sm">
                      contact@hotelbidding.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white border border-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#111]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Phone Support</p>
                    <a href="tel:+15551234567" className="text-[#111] hover:opacity-80 transition-colors text-sm">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-white border border-black/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#111]" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Address</p>
                    <p className="text-[#111] text-sm">
                      123 Business Avenue<br />
                      Suite 100, NY 10001
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-black/10 pt-8">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <p className="text-gray-600 text-sm">
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
