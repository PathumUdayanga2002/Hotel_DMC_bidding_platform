import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = ({ setShowRegistrationModal }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Features', href: '#features' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/60 backdrop-blur-xl border-b border-white/10'
          : 'bg-black/40 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Premium Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection('#home')}
              className="flex items-center space-x-3 group transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl lg:text-2xl font-bold tracking-tight text-white">
                  HOTEL BIDDING
                </div>
                <div className="text-[10px] font-medium text-gray-300 tracking-[0.2em] uppercase -mt-0.5">
                  Premium Platform
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links - Cinematic Style */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="relative text-white/90 font-medium text-[15px] tracking-wide transition-all duration-300 hover:text-white group"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Premium CTA Buttons - Gold Accent */}
          <div className="hidden lg:flex items-center space-x-6">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-200 font-medium text-[15px] tracking-wide hover:text-white transition-all duration-300 relative group"
            >
              <span>Sign In</span>
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gray-300 transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <button
              onClick={() => setShowRegistrationModal?.(true)}
              className="relative px-7 py-3 font-semibold text-[15px] text-black tracking-wide overflow-hidden rounded-lg group shadow-lg shadow-amber-900/20 hover:shadow-xl hover:shadow-amber-900/30 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-[length:200%_100%] group-hover:bg-[position:100%_0] transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>Get Started</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Mobile Menu Button - Premium Style */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Cinematic Design */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-4 pb-6 space-y-2 bg-black/70 backdrop-blur-xl border-t border-white/10">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left px-5 py-3.5 text-white/90 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium tracking-wide"
            >
              {link.name}
            </button>
          ))}
          <div className="pt-4 space-y-3 border-t border-white/10 mt-4">
            <button
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-5 py-3.5 text-white font-medium border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/30 transition-all duration-300 tracking-wide"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setShowRegistrationModal?.(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-5 py-3.5 text-black font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg hover:from-amber-500 hover:to-yellow-600 transition-all duration-300 tracking-wide shadow-lg shadow-amber-900/30"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
