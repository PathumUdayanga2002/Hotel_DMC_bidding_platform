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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-teal-900/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl my-auto animate-fadeInUp">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] md:max-h-[calc(100vh-4rem)] flex flex-col">
          {/* Header */}
          <div className="relative px-4 sm:px-8 py-6 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 text-white flex-shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight pr-12" style={{ letterSpacing: '-0.02em', fontFamily: 'Inter, sans-serif' }}>
              Welcome to Rezpitch
            </h2>
            <p className="text-base sm:text-lg text-teal-50 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>Let's get you started with the right account</p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 md:p-12 bg-gradient-to-b from-slate-50 to-white overflow-y-auto flex-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Are you a <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">DMC</span> or <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Hotel</span>?
            </h3>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {/* Hotel Card */}
              <button
                onClick={() => handleRoleSelect('hotel')}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-teal-300 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                      <Building2 size={36} className="sm:w-12 sm:h-12" />
                    </div>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>I'm a Hotel</h4>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Find verified DMC partners, receive competitive bids, and secure premium collaborations.
                  </p>

                 

                  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-center group-hover:from-teal-600 group-hover:to-emerald-700 transition-all duration-300">
                    Register as Hotel →
                  </div>
                </div>
              </button>

              {/* DMC Card */}
              <button
                onClick={() => handleRoleSelect('dmc')}
                className="group relative overflow-hidden rounded-2xl bg-white border-2 border-slate-200 p-6 sm:p-8 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                      <Plane size={36} className="sm:w-12 sm:h-12" />
                    </div>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>I'm a DMC</h4>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Discover hotel opportunities, submit competitive bids, and grow your business globally.
                  </p>

              
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base text-center group-hover:from-emerald-600 group-hover:to-teal-700 transition-all duration-300">
                    Register as DMC →
                  </div>
                </div>
              </button>
            </div>

            <p className="text-center text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8" style={{ fontFamily: 'Inter, sans-serif' }}>
              Already have an account? <button onClick={() => { onClose(); navigate('/login'); }} className="text-teal-600 font-semibold hover:text-teal-700">Sign in here</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;
