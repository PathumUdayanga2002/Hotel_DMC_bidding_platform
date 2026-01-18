import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Building2, Plane, Shield, Mail, Phone, Menu, X, Star, Rocket } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import RoleSelectionModal from '../components/RoleSelectionModal';

const animationStyles = `
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
  const [openFaq, setOpenFaq] = useState(null);
  const [parallax, setParallax] = useState(0);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const faqs = [
    { q: 'What is Rezpitch?', a: 'Rezpitch is a premium B2B bidding platform connecting hotels and DMCs through intelligent matching and secure transactions.' },
    { q: 'How does smart matching work?', a: 'Our AI algorithms analyze capacity, preferences, and performance metrics to pair hotels with ideal DMC partners instantly.' },
    { q: 'Is payment processing secure?', a: 'Yes, we provide multi-currency escrow protection with industry-leading security standards and instant settlement options.' },
    { q: 'How are partners verified?', a: 'Every DMC undergoes rigorous screening including background checks, certifications, and performance verification.' },
    { q: 'What countries do you operate in?', a: 'We operate in 150+ countries with 24/7 multilingual support for premium hospitality partnerships.' },
    { q: 'How much does it cost?', a: 'Contact our partnerships team for custom pricing based on your specific requirements and volume.' }
  ];

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
      {/* Clean Minimal Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex items-center">
              <img src="/Rezpitch _logo.png" alt="Rezpitch" className="h-8 lg:h-10" />
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-slate-700 hover:text-teal-600 transition text-sm font-medium duration-300 relative group" style={{fontFamily: 'Inter, sans-serif'}}>
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('features')} className="text-slate-700 hover:text-teal-600 transition text-sm font-medium duration-300 relative group" style={{fontFamily: 'Inter, sans-serif'}}>
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('about')} className="text-slate-700 hover:text-teal-600 transition text-sm font-medium duration-300 relative group" style={{fontFamily: 'Inter, sans-serif'}}>
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-700 hover:text-teal-600 transition text-sm font-medium duration-300 relative group" style={{fontFamily: 'Inter, sans-serif'}}>
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-slate-700 hover:text-teal-600 transition text-sm font-medium duration-300 relative group" style={{fontFamily: 'Inter, sans-serif'}}>
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/login')} className="text-slate-700 hover:text-teal-600 font-medium transition duration-300" style={{fontFamily: 'Inter, sans-serif'}}>
                Login
              </button>
              <button onClick={() => navigate('/get-started')} className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300" style={{fontFamily: 'Inter, sans-serif'}}>
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Overlay Menu for Mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="absolute inset-0 bg-teal-900 bg-opacity-90 backdrop-blur-xl"></div>
          </div>
          <nav className="relative z-10 flex flex-col items-center justify-center h-full space-y-8">
            <button onClick={() => { scrollToSection('home'); setMobileMenuOpen(false); }} className="text-4xl font-bold text-white hover:text-emerald-200 transition">Home</button>
            <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }} className="text-4xl font-bold text-white hover:text-emerald-200 transition">Features</button>
            <button onClick={() => { scrollToSection('about'); setMobileMenuOpen(false); }} className="text-4xl font-bold text-white hover:text-emerald-200 transition">About</button>
            <button onClick={() => { scrollToSection('faq'); setMobileMenuOpen(false); }} className="text-4xl font-bold text-white hover:text-emerald-200 transition">FAQ</button>
            <button onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }} className="text-4xl font-bold text-white hover:text-emerald-200 transition">Contact</button>
            <div className="flex flex-col gap-4 pt-8 w-64">
              <Button variant="outline" onClick={() => navigate('/login')} className="w-full text-white border-white py-3 text-lg hover:bg-white/10">Login</Button>
              <Button variant="primary" onClick={() => { setMobileMenuOpen(false); navigate('/get-started'); }} className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 py-3 text-lg">Get Started</Button>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section - Clean Minimal SaaS Design */}
      <section id="home" className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-20 px-4 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full">
                <span className="text-sm font-medium text-teal-700" style={{fontFamily: 'Inter, sans-serif'}}>The Marketplace</span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{letterSpacing: '-0.03em', fontFamily: 'Inter, sans-serif'}}>
                <span className="block text-slate-900">Where Luxury</span>
                <span className="block bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Meets Logic</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl" style={{fontFamily: 'Inter, sans-serif'}}>
                A premium B2B bidding platform that enables hotels and destination management companies (DMCs) to discover, compare, and finalize partnerships effortlessly.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button onClick={() => navigate('/get-started')} className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-4 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300" style={{fontFamily: 'Inter, sans-serif'}}>
                  Get Started
                </button>
                <button onClick={() => scrollToSection('features')} className="border-2 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-600 px-8 py-4 rounded-lg font-semibold transition-all duration-300" style={{fontFamily: 'Inter, sans-serif'}}>
                  Explore Features
                </button>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900" style={{fontFamily: 'Inter, sans-serif'}}>150+</div>
                  <div className="text-sm text-slate-600 mt-1" style={{fontFamily: 'Inter, sans-serif'}}>Countries</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900" style={{fontFamily: 'Inter, sans-serif'}}>5,000+</div>
                  <div className="text-sm text-slate-600 mt-1" style={{fontFamily: 'Inter, sans-serif'}}>Partners</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-slate-900" style={{fontFamily: 'Inter, sans-serif'}}>99%</div>
                  <div className="text-sm text-slate-600 mt-1" style={{fontFamily: 'Inter, sans-serif'}}>Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Column - Featured Bidding Card */}
            <div className="relative">
              {/* Floating Premium Tag */}
              <div className="absolute -top-4 -right-4 z-20 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl shadow-lg p-4 border border-teal-200">
                <div className="text-xs font-semibold text-white/90 mb-1" style={{fontFamily: 'Inter, sans-serif'}}>Premium Hotel Partnership</div>
                <div className="text-2xl font-bold text-white" style={{fontFamily: 'Inter, sans-serif'}}>85% Time Saved</div>
              </div>

              {/* Main Bidding Card */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                {/* Live Bid Badge */}
                <div className="bg-white px-6 py-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-red-500" style={{fontFamily: 'Inter, sans-serif'}}>LIVE BID</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="px-6 py-6 bg-gradient-to-b from-slate-50 to-white">
                  <div className="text-5xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>$12,450</div>
                  <div className="text-lg font-medium text-slate-600" style={{fontFamily: 'Inter, sans-serif'}}>Maldives Resort Package</div>
                </div>

                {/* Resort Image */}
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop" 
                    alt="Luxury Maldives Resort"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1" style={{fontFamily: 'Inter, sans-serif'}}>Ocean Paradise Resort</h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-xs font-medium text-teal-700" style={{fontFamily: 'Inter, sans-serif'}}>
                          ✓ Verified Premium Partner
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-1 text-sm font-semibold text-slate-900" style={{fontFamily: 'Inter, sans-serif'}}>5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Luxury SaaS Style */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600 overflow-hidden">
        {/* Subtle overlay pattern */}
        <div className="absolute inset-0 bg-white/5"></div>
        
        <div className="w-full max-w-[1600px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Global Network */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/80 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Global Network</div>
              <div className="text-5xl font-bold text-white mb-2" style={{fontFamily: 'Inter, sans-serif'}}>150+</div>
              <div className="text-sm text-white/70" style={{fontFamily: 'Inter, sans-serif'}}>Countries</div>
            </div>

            {/* Card 2: Trusted Network */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/80 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Trusted Network</div>
              <div className="text-5xl font-bold text-white mb-2" style={{fontFamily: 'Inter, sans-serif'}}>5,000+</div>
              <div className="text-sm text-white/70" style={{fontFamily: 'Inter, sans-serif'}}>Partners</div>
            </div>

            {/* Card 3: Growth Rate */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/80 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Growth Rate</div>
              <div className="text-5xl font-bold text-white mb-2" style={{fontFamily: 'Inter, sans-serif'}}>3x</div>
              <div className="text-sm text-white/70" style={{fontFamily: 'Inter, sans-serif'}}>More Deals</div>
            </div>

            {/* Card 4: Client Rating */}
            <div className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-white/80 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Client Rating</div>
              <div className="text-5xl font-bold text-white mb-2" style={{fontFamily: 'Inter, sans-serif'}}>99%</div>
              <div className="text-sm text-white/70" style={{fontFamily: 'Inter, sans-serif'}}>Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Rezpitch Section */}
      <section id="why" className="relative py-32 px-4 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              Why Choose <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Rezpitch</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{fontFamily: 'Inter, sans-serif', lineHeight: '1.8'}}>
              Transform manual chaos into automated excellence. From discovery to payment, every touchpoint is designed for premium hospitality partnerships.
            </p>
          </div>

          {/* Three Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Smart Matching */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center" style={{fontFamily: 'Inter, sans-serif'}}>Smart Matching Algorithm</h3>
              <p className="text-slate-600 text-center leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>Intelligent pairing based on capacity, preferences, and historical performance metrics</p>
            </div>

            {/* Card 2: Real-time Notifications */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center" style={{fontFamily: 'Inter, sans-serif'}}>Real-time Notifications</h3>
              <p className="text-slate-600 text-center leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>Never miss critical opportunities with instant multi-channel alerts and updates</p>
            </div>

            {/* Card 3: Secure Payment */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center" style={{fontFamily: 'Inter, sans-serif'}}>Secure Payment Processing</h3>
              <p className="text-slate-600 text-center leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>Multi-currency support with escrow protection and instant settlement options</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Grid of Power Section */}
      <section id="features" className="relative py-32 px-4 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              The Grid of Power
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto" style={{fontFamily: 'Inter, sans-serif', lineHeight: '1.8'}}>
              Industry-leading features engineered for premium partnerships
            </p>
          </div>

          {/* 2x2 Bento Box Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1: Smart Bidding */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-10 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Smart Bidding</h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>AI-powered pricing delivers optimal rates</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full">
                <span className="text-xs font-bold text-teal-700" style={{fontFamily: 'Inter, sans-serif'}}>↓ 25% Cost Savings</span>
              </div>
            </div>

            {/* Card 2: Vetted Partners */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-10 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Vetted Partners</h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>Every partner rigorously verified</p>
                </div>
                <div className="text-4xl">🔒</div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full">
                <span className="text-xs font-bold text-teal-700" style={{fontFamily: 'Inter, sans-serif'}}>✔ VERIFIED</span>
              </div>
            </div>

            {/* Card 3: Instant Matching */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-10 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Instant Matching</h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>Connect in milliseconds</p>
                </div>
                <div className="text-4xl">⚡</div>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full">
                <span className="text-xs font-bold text-teal-700" style={{fontFamily: 'Inter, sans-serif'}}>&lt; 200ms Response Time</span>
              </div>
            </div>

            {/* Card 4: Global Reach */}
            <div className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-10 border border-slate-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif'}}>Global Reach</h3>
                  <p className="text-slate-600 leading-relaxed" style={{fontFamily: 'Inter, sans-serif'}}>24/7 worldwide support</p>
                </div>
                <div className="text-4xl">🌍</div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600" style={{fontFamily: 'Inter, sans-serif'}}>150+</div>
                  <div className="text-xs text-slate-600" style={{fontFamily: 'Inter, sans-serif'}}>Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600" style={{fontFamily: 'Inter, sans-serif'}}>5K+</div>
                  <div className="text-xs text-slate-600" style={{fontFamily: 'Inter, sans-serif'}}>Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600" style={{fontFamily: 'Inter, sans-serif'}}>24/7</div>
                  <div className="text-xs text-slate-600" style={{fontFamily: 'Inter, sans-serif'}}>Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Industry Leaders Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              Trusted by Industry Leaders
            </h2>
          </div>

          {/* Logo Strip */}
          <div className="overflow-hidden">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {['Marriott', 'Hilton', 'Hyatt', 'Four Seasons', 'Ritz-Carlton', 'Shangri-La'].map((brand, idx) => (
                <div key={idx} className="grayscale hover:grayscale-0 transition-all duration-300">
                  <span className="text-xl font-bold text-slate-400" style={{fontFamily: 'Inter, sans-serif'}}>{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-4 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-2" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              Client <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Success Stories</span>
            </h2>
          </div>

          {/* Centered Testimonial Card */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border border-slate-200 shadow-md">
              <div className="text-center mb-8">
                <div className="text-6xl text-teal-500 mb-4 font-serif" style={{fontFamily: 'Georgia, serif'}}>"</div>
                <blockquote className="text-2xl md:text-3xl font-serif italic text-slate-800 leading-relaxed" style={{fontFamily: 'Georgia, serif', lineHeight: '1.6'}}>
                  {testimonials[testimonialIndex].text}
                </blockquote>
              </div>
              
              <div className="text-center border-t border-slate-200 pt-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold" style={{fontFamily: 'Inter, sans-serif'}}>
                  {testimonials[testimonialIndex].name.charAt(0)}{testimonials[testimonialIndex].name.split(' ')[1].charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1" style={{fontFamily: 'Inter, sans-serif'}}>{testimonials[testimonialIndex].name}</h3>
                <p className="text-sm text-slate-600 mb-6" style={{fontFamily: 'Inter, sans-serif'}}>{testimonials[testimonialIndex].role}</p>
                
                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Carousel Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="p-2 rounded-full bg-slate-100 hover:bg-teal-100 transition-colors"
                  >
                    <span className="text-xl text-slate-700">←</span>
                  </button>
                  <div className="flex gap-2">
                    {testimonials.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTestimonialIndex(idx)}
                        className={`h-2 rounded-full transition-all ${idx === testimonialIndex ? 'bg-teal-500 w-8' : 'bg-slate-300 w-2'}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                    className="p-2 rounded-full bg-slate-100 hover:bg-teal-100 transition-colors"
                  >
                    <span className="text-xl text-slate-700">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-4 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              Get In Touch
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              {/* Email Card */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1" style={{fontFamily: 'Inter, sans-serif'}}>Email</h4>
                    <a href="mailto:support@rezpitch.com" className="text-teal-600 hover:text-teal-700 transition font-medium" style={{fontFamily: 'Inter, sans-serif'}}>
                      support@rezpitch.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1" style={{fontFamily: 'Inter, sans-serif'}}>Phone</h4>
                    <a href="tel:+1234567890" className="text-teal-600 hover:text-teal-700 transition font-medium" style={{fontFamily: 'Inter, sans-serif'}}>
                      +1 (234) 567-890
                    </a>
                    <p className="text-sm text-slate-600 mt-1" style={{fontFamily: 'Inter, sans-serif'}}>Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>

              {/* Partnerships Card */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
                <p className="text-sm text-slate-700 flex items-center gap-2" style={{fontFamily: 'Inter, sans-serif'}}>
                  <span className="text-2xl text-emerald-600">🚀</span>
                  <span>Partnerships? Email <a href="mailto:partnerships@rezpitch.com" className="text-teal-600 hover:text-teal-700 font-semibold transition">partnerships@rezpitch.com</a></span>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6" style={{fontFamily: 'Inter, sans-serif'}}>Send us a Message</h3>
              
              {contactSubmitted ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <p className="font-semibold text-lg text-slate-900" style={{fontFamily: 'Inter, sans-serif'}}>Thank you! We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    required
                    className="w-full px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition" style={{fontFamily: 'Inter, sans-serif'}}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition" style={{fontFamily: 'Inter, sans-serif'}}
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                    className="w-full px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition" style={{fontFamily: 'Inter, sans-serif'}}
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="4"
                    className="w-full px-6 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-none transition" style={{fontFamily: 'Inter, sans-serif'}}
                  />
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all" style={{fontFamily: 'Inter, sans-serif'}}
                  >
                    Get Started
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* About Rezpitch */}
      <section id="about" className="relative py-32 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              About <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Rezpitch</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed" style={{fontFamily: 'Inter, sans-serif', lineHeight: '1.8'}}>
              The fintech-powered B2B marketplace where luxury hospitality meets data-driven logic. We streamline partnerships between hotels and destination management companies through transparent bidding, instant matching, and secure payments.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="relative py-32 px-4 bg-gradient-to-br from-teal-500 via-emerald-500 to-teal-600">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>Leadership Team</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            {/* Elena Vargas */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white flex items-center justify-center mb-6">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/40 to-white/20 flex items-center justify-center text-3xl font-bold text-white" style={{fontFamily: 'Inter, sans-serif'}}>EV</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1" style={{fontFamily: 'Inter, sans-serif'}}>Elena Vargas</h3>
              <p className="text-white/90" style={{fontFamily: 'Inter, sans-serif'}}>CEO & Co-Founder</p>
            </div>

            {/* Noah Bennett */}
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-white/20 border-4 border-white flex items-center justify-center mb-6">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/40 to-white/20 flex items-center justify-center text-3xl font-bold text-white" style={{fontFamily: 'Inter, sans-serif'}}>NB</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1" style={{fontFamily: 'Inter, sans-serif'}}>Noah Bennett</h3>
              <p className="text-white/90" style={{fontFamily: 'Inter, sans-serif'}}>CTO & Co-Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Accordion */}
      <section id="faq" className="relative py-32 px-4 bg-white">
        <div className="w-full max-w-[1600px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4" style={{letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif'}}>
              Frequently Asked <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-sm hover:shadow-md transition-all"
                >
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 px-6 py-5"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span className="text-left text-lg font-bold text-slate-900" style={{fontFamily: 'Inter, sans-serif'}}>
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                        isOpen
                          ? 'bg-teal-50 border-teal-200 text-teal-600 rotate-180'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                      aria-hidden
                    >
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600" style={{fontFamily: 'Inter, sans-serif'}}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-20 border-t border-slate-800">
        <div className="w-full max-w-[1600px] mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div>
              <img src="/Rezpitch _logo.png" alt="Rezpitch" className="h-8 mb-4" />
              <p className="text-slate-400 text-sm leading-relaxed" style={{fontFamily: 'Inter, sans-serif', lineHeight: '1.8'}}>
                Premium B2B marketplace connecting luxury hospitality with destination management worldwide.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold mb-6 text-white" style={{fontFamily: 'Inter, sans-serif'}}>Navigation</h4>
              <ul className="space-y-3 text-slate-400 text-sm" style={{fontFamily: 'Inter, sans-serif'}}>
                <li><button onClick={() => scrollToSection('home')} className="hover:text-teal-400 transition">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-teal-400 transition">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-teal-400 transition">About</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-teal-400 transition">Contact</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-6 text-white" style={{fontFamily: 'Inter, sans-serif'}}>Legal</h4>
              <ul className="space-y-3 text-slate-400 text-sm" style={{fontFamily: 'Inter, sans-serif'}}>
                <li><a href="/privacy" className="hover:text-teal-400 transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-teal-400 transition">Terms & Conditions</a></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-teal-400 transition">FAQ</button></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-6 text-white" style={{fontFamily: 'Inter, sans-serif'}}>Contact</h4>
              <div className="space-y-3 text-slate-400 text-sm" style={{fontFamily: 'Inter, sans-serif'}}>
                <p>
                  <a href="mailto:support@rezpitch.com" className="hover:text-teal-400 transition block">
                    📧 support@rezpitch.com
                  </a>
                </p>
                <p>
                  <a href="tel:+1234567890" className="hover:text-teal-400 transition block">
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
          <div className="flex flex-col md:flex-row justify-center items-center text-sm text-slate-500" style={{fontFamily: 'Inter, sans-serif'}}>
            <p>&copy; 2024 Rezpitch. All rights reserved.</p>
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

