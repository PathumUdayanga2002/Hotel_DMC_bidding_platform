import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Building2, Plane, Shield, Mail, Phone, Menu, X, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Add animation styles
const animationStyles = `
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

  // Inject animation styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Transparent Navigation Over Hero */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black via-black to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 lg:py-5">
          <div className="flex justify-between items-center">
            {/* Left: Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-wider">Respitch</h1>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('home')} className="text-white hover:text-sky-300 transition text-sm font-medium duration-300 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('features')} className="text-white hover:text-sky-300 transition text-sm font-medium duration-300 relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-white hover:text-sky-300 transition text-sm font-medium duration-300 relative group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            </nav>

            {/* Right: Actions */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/login')} className="text-white border-white hover:bg-white hover:text-blue-900">
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/register/hotel')} className="bg-sky-500 hover:bg-sky-600">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3">
              <button onClick={() => scrollToSection('home')} className="block w-full text-left text-white hover:text-sky-300 py-2 text-sm">Home</button>
              <button onClick={() => scrollToSection('features')} className="block w-full text-left text-white hover:text-sky-300 py-2 text-sm">Features</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-white hover:text-sky-300 py-2 text-sm">Contact</button>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => navigate('/login')} className="flex-1 text-white border-white">Login</Button>
                <Button variant="primary" onClick={() => navigate('/register/hotel')} className="flex-1">Start</Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section with Tropical/Resort Aesthetic */}
      <section id="home" className="relative w-full h-screen flex items-center justify-center pt-24 overflow-hidden">
        {/* Full-width Aerial Tropical Resort Background */}
        <div className="absolute inset-0 z-0 bg-cover bg-center bg-fixed" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)'}}>
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black to-black opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-30"></div>
        </div>

        {/* Hero Content with Card Overlay */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
            {/* Left Text Content */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Connect Hotels with <span className="text-sky-300">DMCs</span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                The premium B2B platform for seamless partnerships between luxury hospitality and destination management companies worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="primary" onClick={() => navigate('/register/hotel')} className="bg-sky-500 hover:bg-sky-600 px-8 py-3 text-lg font-semibold">
                  For Hotels
                </Button>
                <Button variant="secondary" onClick={() => navigate('/register/dmc')} className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  For DMCs
                </Button>
              </div>
            </div>

            {/* Right: Floating Resort Card with Image */}
            <div className="hidden md:block">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop" 
                  alt="Tropical Resort Paradise"
                  className="w-full h-full aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Prices & Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-cover bg-center bg-fixed relative" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop)'}}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Competitive Prices & Quality</h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">Industry-leading features for superior partnerships</p>
          </div>

          {/* Feature Cards - Horizontal Layout */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white animate-fadeInUp" style={{animationDelay: '0s'}}>
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Competitive Prices</h3>
              <p className="text-gray-700 leading-relaxed">Get the best rates through transparent bidding and market competition from verified DMC partners.</p>
            </div>

            <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white lg:scale-105 lg:z-10 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Matching</h3>
              <p className="text-gray-700 leading-relaxed">AI-powered matching connects you with ideal partners instantly for seamless collaboration.</p>
            </div>

            <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Platform</h3>
              <p className="text-gray-700 leading-relaxed">Bank-level encryption and verified partners for complete peace of mind.</p>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-700 text-sm">Connect with premium partners across 150+ countries worldwide.</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white animate-fadeInUp" style={{animationDelay: '0.8s'}}>
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-gray-700 text-sm">Track performance with detailed insights and comprehensive reporting.</p>
            </div>

            <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white animate-fadeInUp" style={{animationDelay: '1s'}}>
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-700 text-sm">Professional support team available round the clock for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Platform - Dark Section with Hero */}
      <section className="relative py-20 lg:py-32 bg-cover bg-center text-white overflow-hidden" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1466457644872-f6305f857ecf?w=1920&h=600&fit=crop)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 opacity-75"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(56, 189, 248, 0.15) 0%, transparent 50%)'
        }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Heading & Description */}
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Why Choose <span className="text-sky-400">Our Platform</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                From seamless booking to payment processing, every feature is crafted to make your business thrive in the luxury hospitality sector.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4 animate-slideInLeft" style={{animationDelay: '0s'}}>
                  <div className="text-sky-400 text-2xl mt-1">✓</div>
                  <div>
                    <h4 className="font-bold mb-1">Smart Matching Algorithm</h4>
                    <p className="text-gray-400">Intelligent pairing based on preferences and capacity</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 animate-slideInLeft" style={{animationDelay: '0.2s'}}>
                  <div className="text-sky-400 text-2xl mt-1">✓</div>
                  <div>
                    <h4 className="font-bold mb-1">Real-time Notifications</h4>
                    <p className="text-gray-400">Never miss an opportunity with instant alerts</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 animate-slideInLeft" style={{animationDelay: '0.4s'}}>
                  <div className="text-sky-400 text-2xl mt-1">✓</div>
                  <div>
                    <h4 className="font-bold mb-1">Secure Payment Processing</h4>
                    <p className="text-gray-400">Multi-currency support with escrow protection</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Image Cards */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-0 shadow-lg hover:scale-105 transition-transform duration-500 overflow-hidden animate-slideInRight" style={{animationDelay: '0s'}}>
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop" 
                  alt="Hotel Solutions"
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 bg-blue-50 text-center">
                  <p className="font-semibold text-gray-900">Hotel Solutions</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-0 shadow-lg hover:scale-105 transition-transform duration-500 overflow-hidden animate-slideInRight" style={{animationDelay: '0.2s'}}>
                <img 
                  src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop" 
                  alt="DMC Services"
                  className="w-full h-80 object-cover"
                />
                <div className="p-4 bg-cyan-50 text-center">
                  <p className="font-semibold text-gray-900">DMC Services</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-0 shadow-lg hover:scale-105 transition-transform duration-500 overflow-hidden col-span-2 animate-slideInRight" style={{animationDelay: '0.4s'}}>
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=300&fit=crop" 
                  alt="Verified & Secure"
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 bg-sky-50 text-center">
                  <p className="font-semibold text-gray-900">Verified & Secure Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/News Cards Section - "Designed for Your Success" */}
      <section className="py-20 lg:py-32 bg-cover bg-center relative" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1499750148076-e56ceb16588f?w=1200&h=400&fit=crop)'}}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-blue-900 opacity-70"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Designed for Your Success</h2>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto">Industry insights and platform updates</p>
          </div>

          {/* Card-based Blog Layout */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                emoji: '📈',
                title: 'Industry Trends',
                desc: 'Stay ahead with insights on emerging trends in hospitality and partnership strategies.',
                image: 'https://images.unsplash.com/photo-1460925895917-aaf4e3c3b6b1?w=600&h=400&fit=crop'
              },
              { 
                emoji: '⭐',
                title: 'Success Stories',
                desc: 'Learn how hotels and DMCs are thriving together on our platform with real results.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
              },
              { 
                emoji: '💡',
                title: 'Best Practices',
                desc: 'Expert tips for maximizing revenue and building lasting business relationships.',
                image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group border border-gray-100 animate-fadeInUp" style={{animationDelay: `${idx * 0.2}s`}}>
                <div className="h-48 bg-gray-200 group-hover:scale-110 transition-transform duration-500 overflow-hidden relative">
                  <img 
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{card.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{card.desc}</p>
                  <a href="#" className="text-sky-600 font-semibold hover:text-sky-700 transition inline-flex items-center">
                    Learn More <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-cover bg-center relative overflow-hidden" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1566438480900-0609be27a446?w=1920&h=600&fit=crop)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-900 opacity-85"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 80%, rgba(30, 144, 255, 0.2) 0%, transparent 50%)'
        }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">What our users say about us</p>
          </div>

          {/* Testimonial Carousel */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-10 border border-white hover:shadow-3xl transition-all duration-500 hover:-translate-y-3">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                  {testimonials[testimonialIndex].name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{testimonials[testimonialIndex].name}</h3>
                  <p className="text-gray-600 text-sm">{testimonials[testimonialIndex].role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8 italic">
                "{testimonials[testimonialIndex].text}"
              </p>

              {/* Carousel Controls */}
              <div className="flex justify-center items-center gap-6">
                <button 
                  onClick={() => setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition font-semibold"
                >
                  ← Prev
                </button>
                <div className="flex gap-3">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTestimonialIndex(idx)}
                      className={`w-3 h-3 rounded-full transition ${idx === testimonialIndex ? 'bg-sky-500 w-8' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => setTestimonialIndex((prev) => (prev + 1) % testimonials.length)}
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-full transition font-semibold"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20 lg:py-32 bg-cover bg-center text-white overflow-hidden" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=600&fit=crop)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-600 to-blue-700 opacity-85"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div>
              <h3 className="text-3xl font-bold mb-8">Get In Touch</h3>
              
              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <a href="mailto:support@respitch.com" className="hover:text-blue-100 transition">
                      support@respitch.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0">
                    <Phone className="w-6 h-6 mt-1" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <a href="tel:+1234567890" className="hover:text-blue-100 transition">
                      +1 (234) 567-890
                    </a>
                    <p className="text-sm text-blue-100 mt-1">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 p-4 rounded-lg">
                <p className="text-sm text-blue-100">
                  🚀 Partnerships? Email <a href="mailto:partnerships@respitch.com" className="hover:text-blue-100 transition">partnerships@respitch.com</a>
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-3xl font-bold mb-8">Send us a Message</h3>
              
              {contactSubmitted ? (
                <div className="bg-white bg-opacity-20 border-2 border-white rounded-lg p-6 text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-semibold">Thank you! We'll get back to you within 24 hours.</p>
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
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-blue-100 focus:outline-none focus:bg-opacity-20 focus:border-opacity-50"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-blue-100 focus:outline-none focus:bg-opacity-20 focus:border-opacity-50"
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-blue-100 focus:outline-none focus:bg-opacity-20 focus:border-opacity-50"
                  />
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-blue-100 focus:outline-none focus:bg-opacity-20 focus:border-opacity-50 resize-none"
                  />
                  <Button 
                    variant="primary" 
                    type="submit"
                    className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Dark Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Respitch</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Premium B2B platform connecting luxury hospitality with trusted destination management companies worldwide.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Navigation</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-sky-400 transition">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="hover:text-sky-400 transition">Features</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-sky-400 transition">Contact</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="/privacy" className="hover:text-sky-400 transition">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-sky-400 transition">Terms & Conditions</a></li>
                <li><a href="/faq" className="hover:text-sky-400 transition">FAQ</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <div className="space-y-2 text-gray-400 text-sm">
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
                <p className="text-xs text-gray-500 mt-2">Mon-Fri, 9 AM - 6 PM EST</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-800 my-8" />

          {/* Bottom */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 Respitch. All rights reserved.</p>
            <p className="mt-4 md:mt-0">✨ Premium travel partnerships platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
