import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Building2, Plane, Shield, Mail, Phone, Menu, X, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import RoleSelectionModal from '../components/RoleSelectionModal';

// Digital Luxury Animation Styles - Glassmorphism & Neo-Brutalism
const animationStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  
  * {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
    }
    50% {
      box-shadow: 0 0 40px rgba(14, 165, 233, 0.8);
    }
  }
  
  @keyframes splitText {
    from {
      opacity: 0;
      transform: translateY(20px) rotateX(-90deg);
    }
    to {
      opacity: 1;
      transform: translateY(0) rotateX(0deg);
    }
  }
  
  @keyframes infiniteScroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  
  @keyframes magneticHover {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }
  
  @keyframes lazyBlur {
    from {
      filter: blur(20px);
      opacity: 0;
    }
    to {
      filter: blur(0);
      opacity: 1;
    }
  }
  
  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-slideInLeft {
    animation: slideInLeft 0.7s ease-out forwards;
  }
  
  .animate-slideInRight {
    animation: slideInRight 0.7s ease-out forwards;
  }
  
  .animate-splitText {
    animation: splitText 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
  
  .shimmer-effect {
    position: relative;
    overflow: hidden;
  }
  
  .shimmer-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 5s infinite;
  }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .glass-dark {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .magnetic-button {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .magnetic-button:hover {
    animation: magneticHover 0.6s ease-in-out infinite;
  }
  
  .pulse-glow {
    animation: pulseGlow 2s ease-in-out infinite;
  }
  
  .infinite-scroll {
    animation: infiniteScroll 30s linear infinite;
  }
  
  .lazy-blur-image {
    animation: lazyBlur 1s ease-out forwards;
  }
  
  .neo-brutalism-card {
    border: 3px solid #0F172A;
    box-shadow: 8px 8px 0px rgba(14, 165, 233, 0.3);
  }
  
  .parallax-bg {
    transform: translateZ(0);
    will-change: transform;
  }
  
  .text-gradient-luxury {
    background: linear-gradient(135deg, #0EA5E9 0%, #FACC15 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .ambient-shadow {
    box-shadow: 0 20px 60px rgba(14, 165, 233, 0.15), 
                0 10px 30px rgba(30, 64, 175, 0.1);
  }
  
  .super-ellipse {
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [parallax, setParallax] = useState(0);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Clamp parallax offsets to avoid background gaps on scroll
  const parallaxHero = Math.max(-150, Math.min(150, parallax * -1));
  const parallaxFeatures = Math.max(-200, Math.min(200, parallax * -0.5));

  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Parallax background (moves ~0.2x of scroll)
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setParallax(window.scrollY * 0.2);
        rafId = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactSubmitted(false);
    }, 3000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Hotel Manager",
      text: "Respitch transformed how we connect with DMC partners. The platform is intuitive and reliable.",
      rating: 5
    },
    {
      name: "Marco Ferrari",
      role: "DMC Director",
      text: "Outstanding service! We've grown our business significantly through quality leads.",
      rating: 5
    },
    {
      name: "Amira Khan",
      role: "Travel Coordinator",
      text: "Best investment for our hotel. Professional, secure, and efficient partnerships.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-x-hidden">
      {/* Floating Glass Pill Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="rounded-full shadow-2xl bg-gradient-to-r from-slate-900/40 via-blue-900/40 to-slate-900/40 backdrop-blur-xl border border-white/10 max-w-[1600px] mx-auto">
          <div className="px-6 py-4 flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center transform rotate-45">
                <div className="w-4 h-4 bg-white rounded-sm transform -rotate-45"></div>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight" style={{letterSpacing: '-0.02em'}}>Respitch</h1>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-sky-300 transition text-sm font-semibold duration-300 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('features')} className="text-white hover:text-sky-300 transition text-sm font-semibold duration-300 relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('about')} className="text-white hover:text-sky-300 transition text-sm font-semibold duration-300 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => navigate('/faq')} className="text-white hover:text-sky-300 transition text-sm font-semibold duration-300 relative group">
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-sky-300 transition text-sm font-semibold duration-300 relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/login')} className="text-white border-white hover:bg-white hover:text-slate-900 magnetic-button">
                Login
              </Button>
              <Button variant="primary" onClick={() => setRoleModalOpen(true)} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shimmer-effect pulse-glow magnetic-button">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white bg-white/10 backdrop-blur-xl p-2 rounded-full border border-white/20"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Overlay Menu for Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-slate-900 bg-opacity-90 backdrop-blur-xl"></div>
          </div>
          <nav className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
            <button onClick={() => scrollToSection('home')} className="text-4xl font-bold text-white hover:text-sky-300 transition">Home</button>
            <button onClick={() => scrollToSection('features')} className="text-4xl font-bold text-white hover:text-sky-300 transition">Features</button>
            <button onClick={() => scrollToSection('about')} className="text-4xl font-bold text-white hover:text-sky-300 transition">About</button>
            <button onClick={() => navigate('/faq')} className="text-4xl font-bold text-white hover:text-sky-300 transition">FAQ</button>
            <button onClick={() => scrollToSection('contact')} className="text-4xl font-bold text-white hover:text-sky-300 transition">Contact</button>
            <div className="flex flex-col gap-4 pt-8 w-64">
              <Button variant="outline" onClick={() => navigate('/login')} className="w-full text-white border-white py-3 text-lg">Login</Button>
              <Button variant="primary" onClick={() => { setMobileMenuOpen(false); setRoleModalOpen(true); }} className="w-full bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-lg shimmer-effect">Get Started</Button>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section - Gateway to Paradise */}
      <section id="home" className="relative w-full min-h-screen flex items-center justify-center pt-24 px-4 overflow-hidden">
        {/* Parallax Drone Shot Background */}
        <div className="absolute inset-0 z-0 parallax-bg" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', top: '-120px', bottom: '-120px', transform: `translateY(${parallaxHero}px)`}}></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Split-Text Animation */}
            <div className="text-white space-y-8">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-tight" style={{letterSpacing: '-0.03em'}}>
                <span className="block animate-splitText" style={{animationDelay: '0s'}}>The Marketplace</span>
                <span className="block animate-splitText text-gradient-luxury" style={{animationDelay: '0.2s'}}>Where Luxury</span>
                <span className="block animate-splitText" style={{animationDelay: '0.4s'}}>Meets Logic</span>
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed animate-fadeInUp" style={{animationDelay: '0.6s', lineHeight: '1.8'}}>
                Respitch is a premium B2B bidding platform that enables hotels and destination management companies (DMCs) to discover, compare, and finalize partnerships effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-6 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
                <Button variant="primary" onClick={() => setRoleModalOpen(true)} className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 px-10 py-4 text-lg font-bold shadow-2xl magnetic-button shimmer-effect">
                  Get Started
                </Button>
                <Button variant="secondary" onClick={() => scrollToSection('features')} className="glass-morphism text-white border-2 border-white hover:bg-white hover:text-slate-900 px-10 py-4 text-lg font-bold magnetic-button">
                  Explore Features
                </Button>
              </div>
            </div>

            {/* Right: 3D Stacked Deck */}
            <div className="hidden md:block relative animate-fadeIn" style={{animationDelay: '1s'}}>
              <div className="relative" style={{perspective: '1000px'}}>
                {/* Top Card: Live Bid Ticker */}
                <div className="glass-dark rounded-3xl p-6 shadow-2xl absolute -top-12 -right-8 w-80 z-30 transform rotate-6 hover:rotate-0 transition-transform duration-500 neo-brutalism-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-white">LIVE BID</span>
                  </div>
                  <div className="text-3xl font-bold text-gradient-luxury mb-2">$12,450</div>
                  <div className="text-sm text-slate-300">Maldives Resort Package</div>
                  <div className="text-xs text-green-400 mt-2">↑ 3 new offers</div>
                </div>

                {/* Middle Card: Resort Profile */}
                <div className="glass-morphism rounded-3xl overflow-hidden shadow-2xl relative z-20 ambient-shadow lazy-blur-image">
                  <img 
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop" 
                    alt="Luxury Resort"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6 bg-gradient-to-t from-slate-900 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-400 text-xl">★★★★★</span>
                      <span className="text-sm text-slate-300">5.0 Rating</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">Ocean Paradise Resort</h3>
                    <p className="text-sm text-slate-400">Verified Premium Partner</p>
                  </div>
                </div>

                {/* Bottom Card: Map View */}
                <div className="glass-dark rounded-3xl p-6 shadow-2xl absolute -bottom-8 -left-8 w-72 z-10 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="text-sm font-bold text-white mb-3">🌍 Global Network</div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="glass-morphism p-3 rounded-xl">
                      <div className="text-sky-400 font-bold text-lg">150+</div>
                      <div className="text-slate-300">Countries</div>
                    </div>
                    <div className="glass-morphism p-3 rounded-xl">
                      <div className="text-sky-400 font-bold text-lg">5,000+</div>
                      <div className="text-slate-300">Partners</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Respitch - The Dark Mode Contrast with Before/After */}
      <section id="why" className="relative py-32 px-4 bg-gradient-to-b from-slate-900 via-slate-800 to-black text-white overflow-hidden">
        {/* Ambient Glow Effects */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-sky-500 rounded-full blur-3xl opacity-20"></div>

        <div className="w-full max-w-[1600px] mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Eye-catching Image */}
            <div className="relative animate-slideInLeft">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl neo-brutalism-card">
                <img 
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop" 
                  alt="Premium Hotel Partnership"
                  className="w-full h-[500px] object-cover lazy-blur-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                
                {/* Overlay Stats */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="grid grid-cols-3 gap-4 text-center glass-morphism rounded-2xl p-6 backdrop-blur-xl">
                    <div>
                      <div className="text-3xl font-bold text-gradient-luxury">85%</div>
                      <div className="text-xs text-white mt-1">Time Saved</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gradient-luxury">3x</div>
                      <div className="text-xs text-white mt-1">More Deals</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gradient-luxury">99%</div>
                      <div className="text-xs text-white mt-1">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="animate-slideInRight">
              <h2 className="text-6xl lg:text-7xl font-extrabold mb-8 leading-tight" style={{letterSpacing: '-0.03em'}}>
                Why Choose <span className="text-gradient-luxury">Respitch</span>
              </h2>
              <p className="text-xl text-slate-300 mb-10 leading-relaxed" style={{lineHeight: '1.8'}}>
                Transform manual chaos into automated excellence. From discovery to payment, every touchpoint is designed for premium hospitality partnerships.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-5 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                  <div className="text-yellow-400 text-3xl mt-1 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Smart Matching Algorithm</h4>
                    <p className="text-slate-400 leading-relaxed">Intelligent pairing based on capacity, preferences, and historical performance metrics</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <div className="text-yellow-400 text-3xl mt-1 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Real-time Notifications</h4>
                    <p className="text-slate-400 leading-relaxed">Never miss critical opportunities with instant multi-channel alerts and updates</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                  <div className="text-yellow-400 text-3xl mt-1 flex-shrink-0">✓</div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Secure Payment Processing</h4>
                    <p className="text-slate-400 leading-relaxed">Multi-currency support with escrow protection and instant settlement options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



{/* Features Section - The Grid of Power (Bento Box) */}
      <section id="features" className="relative py-32 px-4 overflow-hidden">
        {/* Background Image (corresponding to hero) */}
        <div
          className="absolute inset-0 z-0 parallax-bg"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1566438480900-0609be27a446?w=1920&h=1080&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            top: '-120px',
            bottom: '-120px',
            transform: `translateY(${parallaxFeatures}px)`
          }}
        ></div>
        
        <div className="w-full max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6" style={{letterSpacing: '-0.02em'}}>
              The <span className="text-gradient-luxury">Grid of Power</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{lineHeight: '1.8'}}>
              Industry-leading features engineered for premium partnerships
            </p>
          </div>

          {/* 2x2 Bento Box Layout */}
          <div className="grid md:grid-cols-2 gap-8 w-full">
            {/* Card 1: Smart Bidding with Mini Graph */}
            <div className="glass-dark rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 neo-brutalism-card group animate-fadeInUp" style={{animationDelay: '0s'}}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Smart Bidding</h3>
                  <p className="text-slate-300 leading-relaxed">AI-powered competitive pricing delivers optimal rates through transparent market dynamics.</p>
                </div>
                <div className="text-5xl">💰</div>
              </div>
              
              {/* Mini Price Graph */}
              <div className="mt-8 p-4 glass-morphism rounded-2xl">
                <div className="flex items-end justify-between h-24 gap-2">
                  <div className="w-full bg-gradient-to-t from-sky-500 to-blue-400 rounded-t-lg opacity-60" style={{height: '40%'}}></div>
                  <div className="w-full bg-gradient-to-t from-sky-500 to-blue-400 rounded-t-lg opacity-70" style={{height: '55%'}}></div>
                  <div className="w-full bg-gradient-to-t from-sky-500 to-blue-400 rounded-t-lg opacity-80" style={{height: '70%'}}></div>
                  <div className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg pulse-glow" style={{height: '90%'}}></div>
                </div>
                <div className="text-xs text-center text-green-400 mt-3 font-bold">↓ 25% Cost Savings</div>
              </div>
            </div>

            {/* Card 2: Vetted DMCs with Pulsing Badge */}
            <div className="glass-dark rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 neo-brutalism-card group animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Vetted Partners</h3>
                  <p className="text-slate-300 leading-relaxed">Every DMC verified through rigorous screening for complete peace of mind and trust.</p>
                </div>
                <div className="text-5xl">🔒</div>
              </div>
              
              {/* Verified Badge with Pulse */}
              <div className="mt-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-sky-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative glass-morphism rounded-full p-8 pulse-glow">
                    <div className="text-6xl text-center">✓</div>
                    <div className="text-sm font-bold text-white text-center mt-2">VERIFIED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Instant Matching */}
            <div className="glass-dark rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 neo-brutalism-card group animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Instant Matching</h3>
                  <p className="text-slate-300 leading-relaxed">Advanced AI algorithms connect ideal partners in milliseconds for seamless collaboration.</p>
                </div>
                <div className="text-5xl">⚡</div>
              </div>
              
              {/* Connection Animation */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="glass-morphism rounded-xl p-3 text-center animate-pulse" style={{animationDelay: '0s'}}>
                  <div className="text-2xl mb-1">🏨</div>
                  <div className="text-xs text-slate-300">Hotel</div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-3xl text-sky-400 animate-pulse">⚡</div>
                </div>
                <div className="glass-morphism rounded-xl p-3 text-center animate-pulse" style={{animationDelay: '0.3s'}}>
                  <div className="text-2xl mb-1">✈️</div>
                  <div className="text-xs text-slate-300">DMC</div>
                </div>
              </div>
              <div className="text-center text-sky-400 font-bold mt-4 text-sm">&lt; 200ms Response Time</div>
            </div>

            {/* Card 4: Global Network */}
            <div className="glass-dark rounded-3xl p-10 shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 neo-brutalism-card group animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-3">Global Reach</h3>
                  <p className="text-slate-300 leading-relaxed">Connect with premium partners across 150+ countries with 24/7 multilingual support.</p>
                </div>
                <div className="text-5xl">🌍</div>
              </div>
              
              {/* Stats Grid */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="glass-morphism rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gradient-luxury">150+</div>
                  <div className="text-xs text-slate-300 mt-1">Countries</div>
                </div>
                <div className="glass-morphism rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gradient-luxury">5K+</div>
                  <div className="text-xs text-slate-300 mt-1">Partners</div>
                </div>
                <div className="glass-morphism rounded-xl p-4 text-center col-span-2">
                  <div className="text-3xl font-bold text-gradient-luxury">24/7</div>
                  <div className="text-xs text-slate-300 mt-1">Premium Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/Success Section - Removed to streamline */}

      {/* Testimonials - The Social Proof Gallery (Vogue-Business Style) */}
      <section className="py-32 px-4 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6" style={{letterSpacing: '-0.02em'}}>
              Trusted by <span className="text-gradient-luxury">Industry Leaders</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{lineHeight: '1.8'}}>
              Premium partnerships that transform businesses
            </p>
          </div>

          {/* Infinite Logo Scroll */}
          <div className="mb-20 overflow-hidden">
            <div className="flex items-center gap-12 infinite-scroll whitespace-nowrap">
              {['Marriott', 'Hilton', 'Hyatt', 'Four Seasons', 'Ritz-Carlton', 'Shangri-La', 'Marriott', 'Hilton', 'Hyatt', 'Four Seasons'].map((brand, idx) => (
                <div key={idx} className="glass-morphism px-8 py-4 rounded-full">
                  <span className="text-2xl font-bold text-slate-700">{brand}</span>
                </div>
              ))}
            </div>
          </div>

          {/* High-End Magazine Style Testimonial */}
          <div className="w-full">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Large Portrait with Glass Effect */}
              <div className="relative animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative glass-morphism rounded-3xl p-4 shadow-2xl neo-brutalism-card">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=700&fit=crop" 
                    alt={testimonials[testimonialIndex].name}
                    className="w-full h-[500px] object-cover rounded-2xl lazy-blur-image"
                  />
                  <div className="absolute bottom-8 left-8 glass-dark px-6 py-3 rounded-full">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Quote in Serif Font (Vogue Style) */}
              <div className="space-y-8 animate-slideInRight">
                <div>
                  <div className="text-6xl text-sky-500 mb-4 font-serif">"</div>
                  <blockquote className="text-3xl md:text-4xl font-serif italic text-slate-800 leading-relaxed mb-8" style={{fontFamily: 'Georgia, serif', lineHeight: '1.5'}}>
                    {testimonials[testimonialIndex].text}
                  </blockquote>
                </div>
                
                <div className="border-t-2 border-slate-200 pt-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">{testimonials[testimonialIndex].name}</h3>
                  <p className="text-lg text-slate-600 mb-6">{testimonials[testimonialIndex].role}</p>
                  
                  {/* Elegant Carousel Controls */}
                  <div className="flex items-center gap-6">
                    <button 
                      onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                      className="glass-morphism p-4 rounded-full hover:scale-110 transition-transform magnetic-button"
                    >
                      <span className="text-xl font-bold text-slate-700">←</span>
                    </button>
                    <div className="flex gap-3">
                      {testimonials.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setTestimonialIndex(idx)}
                          className={`h-2 rounded-full transition-all ${idx === testimonialIndex ? 'bg-sky-500 w-12' : 'bg-slate-300 w-2'}`}
                        />
                      ))}
                    </div>
                    <button 
                      onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                      className="glass-morphism p-4 rounded-full hover:scale-110 transition-transform magnetic-button"
                    >
                      <span className="text-xl font-bold text-slate-700">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Luxury Touch */}
      <section id="contact" className="relative py-32 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Macro Shot Background with Blur */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=600&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(4px)'}}></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 w-full max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="animate-slideInLeft">
              <h3 className="text-5xl font-extrabold mb-10" style={{letterSpacing: '-0.02em'}}>Get In Touch</h3>
              
              <div className="space-y-8 mb-12">
                <div className="flex gap-5 items-start">
                  <div className="glass-morphism p-4 rounded-2xl flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Email</h4>
                    <a href="mailto:support@respitch.com" className="text-sky-300 hover:text-sky-200 transition">
                      support@respitch.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-5 items-start">
                  <div className="glass-morphism p-4 rounded-2xl flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Phone</h4>
                    <a href="tel:+1234567890" className="text-sky-300 hover:text-sky-200 transition">
                      +1 (234) 567-890
                    </a>
                    <p className="text-sm text-slate-400 mt-1">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>

              <div className="glass-dark p-6 rounded-2xl border border-sky-500 border-opacity-30">
                <p className="text-sm text-slate-300 flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span>Partnerships? Email <a href="mailto:partnerships@respitch.com" className="text-sky-300 hover:text-sky-200 transition font-semibold">partnerships@respitch.com</a></span>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slideInRight">
              <h3 className="text-3xl font-bold mb-8">Send us a Message</h3>
              
              {contactSubmitted ? (
                <div className="glass-morphism border-2 border-green-400 rounded-2xl p-8 text-center animate-fadeIn">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="font-semibold text-xl">Thank you! We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl glass-morphism border border-white border-opacity-20 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:border-opacity-50 transition"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl glass-morphism border border-white border-opacity-20 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:border-opacity-50 transition"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                    className="w-full px-6 py-4 rounded-2xl glass-morphism border border-white border-opacity-20 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:border-opacity-50 transition"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="5"
                    className="w-full px-6 py-4 rounded-2xl glass-morphism border border-white border-opacity-20 text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:border-opacity-50 resize-none transition"
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 font-bold py-4 text-lg shimmer-effect magnetic-button"
                  >
                    Get Started
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Respitch - Premium Overview */}
      <section id="about" className="relative py-32 px-4 bg-gradient-to-b from-white via-slate-50 to-white overflow-hidden">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left: About Copy */}
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900" style={{letterSpacing: '-0.02em'}}>
                About <span className="text-gradient-luxury">Respitch</span>
              </h2>
              <p className="text-xl text-slate-700 leading-relaxed">
                We are the fintech-powered B2B marketplace where luxury hospitality meets data-driven logic. Our mission is to streamline partnerships between hotels and destination management companies through transparent bidding, instant matching, and secure payments.
              </p>

              {/* Mission */}
              <div className="rounded-2xl p-8 bg-white/60 backdrop-blur-xl border border-slate-200">
                <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
                <p className="text-slate-700 leading-relaxed">Empower hotels and DMCs to form lasting, profitable partnerships through a unified platform that delivers clarity, speed, and trust at every step.</p>
              </div>

              {/* Vision */}
              <div className="rounded-2xl p-8 bg-white/60 backdrop-blur-xl border border-slate-200">
                <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
                <p className="text-slate-700 leading-relaxed">A world where premium hospitality collaborations are effortless, data-informed, and globally accessible.</p>
              </div>
            </div>

            {/* Right: Leadership */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Leadership</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur-xl border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=600&h=700&fit=crop" alt="Elena Vargas" className="w-full h-80 object-cover rounded-2xl" />
                  <div className="mt-4">
                    <h4 className="text-xl font-bold">Elena Vargas</h4>
                    <p className="text-slate-600">CEO & Co‑Founder</p>
                  </div>
                </div>
                <div className="rounded-3xl p-6 shadow-xl bg-white/70 backdrop-blur-xl border border-slate-200">
                  <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=600&h=700&fit=crop" alt="Noah Bennett" className="w-full h-80 object-cover rounded-2xl" />
                  <div className="mt-4">
                    <h4 className="text-xl font-bold">Noah Bennett</h4>
                    <p className="text-slate-600">CTO & Co‑Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Dark Footer */}
      <footer className="bg-gradient-to-b from-slate-950 to-black text-white py-20 border-t border-slate-800">
        <div className="w-full max-w-[1600px] mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <h3 className="text-3xl font-extrabold mb-6" style={{letterSpacing: '-0.02em'}}>Respitch</h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{lineHeight: '1.8'}}>
                The fintech-powered B2B platform connecting luxury hospitality with elite destination management companies worldwide.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Navigation</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-sky-400 transition">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-sky-400 transition">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-sky-400 transition">About</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-sky-400 transition">Contact</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Legal</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><a href="/privacy" className="hover:text-sky-400 transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-sky-400 transition">Terms & Conditions</a></li>
                <li><a href="/faq" className="hover:text-sky-400 transition">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-6 text-white text-lg">Contact</h4>
              <div className="space-y-3 text-slate-400 text-sm">
                <p>
                  <a href="mailto:support@respitch.com" className="hover:text-sky-400 transition block">
                    📧 support@respitch.com
                  </a>
                </p>
                <p>
                  <a href="tel:+1234567890" className="hover:text-sky-400 transition block">
                    📞 +1 (234) 567-890
                  </a>
                </p>
                <p className="text-xs text-slate-500 mt-3">Mon-Fri, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-slate-800 my-10" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
            <p>&copy; 2024 Respitch. All rights reserved.</p>
            <p className="mt-4 md:mt-0 text-slate-600">✨ Where Luxury Meets Logic</p>
          </div>
        </div>
      </footer>

      {/* Role Selection Modal */}
      <RoleSelectionModal 
        isOpen={roleModalOpen} 
        onClose={() => setRoleModalOpen(false)} 
      />
    </div>
  );
};

export default LandingPage;

