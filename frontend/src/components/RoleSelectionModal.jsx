import React from 'react';
import { X, Building2, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

const RoleSelectionModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRoleSelect = (role) => {
    onClose();
    if (role === 'hotel') {
      navigate('/register/hotel');
    } else {
      navigate('/register/dmc');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl my-8 animate-fadeInUp">
        <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100 rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="relative px-4 sm:px-8 py-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-white/20 transition"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight pr-12" style={{ letterSpacing: '-0.02em' }}>
              Welcome to Respitch
            </h2>
            <p className="text-base sm:text-lg text-sky-100 mt-2">Let's get you started with the right account</p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 md:p-12">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 text-center">
              Are you a <span className="text-sky-600">DMC</span> or <span className="text-blue-600">Hotel</span>?
            </h3>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Hotel Card */}
              <button
                onClick={() => handleRoleSelect('hotel')}
                className="group relative overflow-hidden rounded-2xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '8px 8px 0px rgba(14, 165, 233, 0.3)' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <Building2 size={36} className="sm:w-12 sm:h-12" />
                    </div>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">I'm a Hotel</h4>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                    Find verified DMC partners, receive competitive bids, and secure premium collaborations.
                  </p>

                  <div className="space-y-2 text-left text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Post inquiries to DMCs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Review & compare bids</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Manage contracts securely</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-center group-hover:from-blue-600 group-hover:to-blue-700 transition">
                    Register as Hotel →
                  </div>
                </div>
              </button>

              {/* DMC Card */}
              <button
                onClick={() => handleRoleSelect('dmc')}
                className="group relative overflow-hidden rounded-2xl bg-white border-3 border-slate-900 p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '8px 8px 0px rgba(250, 204, 21, 0.3)' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white">
                      <Plane size={36} className="sm:w-12 sm:h-12" />
                    </div>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">I'm a DMC</h4>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                    Discover hotel opportunities, submit competitive bids, and grow your business globally.
                  </p>

                  <div className="space-y-2 text-left text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Browse hotel inquiries</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Submit competitive bids</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Receive direct inquiries</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-center group-hover:from-sky-600 group-hover:to-sky-700 transition">
                    Register as DMC →
                  </div>
                </div>
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8">
              Already have an account? <button onClick={() => { onClose(); navigate('/login'); }} className="text-sky-600 font-semibold hover:underline">Sign in here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
