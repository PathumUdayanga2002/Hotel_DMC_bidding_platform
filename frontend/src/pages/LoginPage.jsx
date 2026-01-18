import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { LogIn, ArrowLeft, Building2, Plane } from 'lucide-react';
import RoleSelectionModal from '../components/RoleSelectionModal';
import React from 'react';

const loginSchema = yup.object({
  emailOrUsername: yup
    .string()
    .required('Email or username is required'),
  password: yup
    .string()
    .required('Password is required'),
}).required();

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [activeTab, setActiveTab] = useState('hotel');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await login(data);
      toast.success('Login successful!');
      
      // Redirect based on role
      const role = response.data.role;
      switch (role) {
        // New role system
        case 'HOTEL_SUPER_ADMIN':
        case 'HOTEL_STAFF_ADMIN':
          navigate('/hotel/dashboard');
          break;
        case 'DMC_SUPER_ADMIN':
        case 'DMC_STAFF_ADMIN':
          navigate('/dmc/dashboard');
          break;
        case 'PLATFORM_SUPER_ADMIN':
          navigate('/admin/dashboard');
          break;
        // Legacy role system (for backward compatibility during migration)
        case 'HOTEL_USER':
          navigate('/hotel/dashboard');
          break;
        case 'DMC_USER':
          navigate('/dmc/dashboard');
          break;
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <img src="/Rezpitch _logo.png" alt="Rezpitch" className="h-8" />
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Toggle Controls */}
      <div className="pt-8 flex justify-center">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-full px-2 py-2" role="tablist" aria-label="Login type selector">
          {[{ key: 'hotel', label: 'Hotel', Icon: Building2 }, { key: 'dmc', label: 'DMC', Icon: Plane }].map(({ key, label, Icon }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              tabIndex={activeTab === key ? 0 : -1}
              onClick={() => setActiveTab(key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTab(key);
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                activeTab === key ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Split Layout */}
      <div className="relative max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white">
          {/* Sliding accent background for desktop */}
          <div
            className={`hidden md:block absolute top-0 left-0 h-full w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 transition-transform duration-500 ease-out ${
              activeTab === 'hotel' ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden="true"
          ></div>

          <div className={`relative grid md:grid-cols-2 transition-[transform] duration-500 ease-out ${activeTab === 'hotel' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            {/* Form Panel */}
            <div className={`relative p-6 sm:p-8 md:p-12 bg-white/90 backdrop-blur md:bg-white transition-opacity duration-300 ${activeTab === 'hotel' ? 'md:order-2' : 'md:order-1'}`}>
              <div className="max-w-md mx-auto space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-teal-500 to-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg">
                    {activeTab === 'hotel' ? <Building2 className="w-6 h-6 text-white" /> : <Plane className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500" style={{fontFamily: 'Inter, sans-serif'}}>Welcome back</p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>
                      {activeTab === 'hotel' ? 'Hotel Login' : 'DMC Login'}
                    </h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Email or Username"
                    placeholder="Enter your email or username"
                    register={register('emailOrUsername')}
                    error={errors.emailOrUsername?.message}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter your password"
                    register={register('password')}
                    error={errors.password?.message}
                  />

                  <div className="flex justify-start text-sm">
                    <Link to="/forgot-password" className="text-teal-600 font-semibold hover:text-teal-700">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg py-3 rounded-lg font-semibold transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : `Login as ${activeTab === 'hotel' ? 'Hotel' : 'DMC'}`}
                  </Button>

                  <p className="text-center text-xs text-slate-600" style={{fontFamily: 'Inter, sans-serif'}}>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setShowRoleModal(true)}
                      className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                    >
                      Register here
                    </button>
                  </p>
                </form>
              </div>
            </div>

            {/* Accent Panel (desktop only) */}
            <div className={`hidden md:flex flex-col items-center justify-center ${activeTab === 'hotel' ? 'md:order-1' : 'md:order-2'} transition-opacity duration-300`}> 
              <div className="w-full h-full px-8 py-12 text-white flex flex-col justify-center items-center text-center">
                {/* Large Icon */}
                <div className="mb-8 p-6 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center">
                  {activeTab === 'hotel' ? (
                    <Building2 className="w-16 h-16" />
                  ) : (
                    <Plane className="w-16 h-16" />
                  )}
                </div>
                
                {/* Title */}
                <h3 className="text-4xl font-bold mb-6 leading-tight max-w-xs" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>
                  {activeTab === 'hotel' ? 'Welcome to Hotel Hub' : 'Welcome to DMC Connect'}
                </h3>
                
                {/* Description */}
                <p className="text-lg leading-relaxed text-white/90 max-w-sm mb-8" style={{fontFamily: 'Inter, sans-serif'}}>
                  {activeTab === 'hotel'
                    ? 'Streamline partnerships, manage bids, and grow your business with intelligent bid management and real-time collaboration.'
                    : 'Respond to opportunities, submit winning bids, and scale partnerships with advanced analytics and market insights.'}
                </p>

                {/* Benefits List */}
                <div className="space-y-3 max-w-sm">
                  {activeTab === 'hotel' ? (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-sm">✓</span>
                        </div>
                        <p className="text-sm text-white/85" style={{fontFamily: 'Inter, sans-serif'}}>Real-time bid notifications</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-sm">✓</span>
                        </div>
                        <p className="text-sm text-white/85" style={{fontFamily: 'Inter, sans-serif'}}>Manage contracts seamlessly</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-sm">✓</span>
                        </div>
                        <p className="text-sm text-white/85" style={{fontFamily: 'Inter, sans-serif'}}>Grow partner network</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-sm">✓</span>
                        </div>
                        <p className="text-sm text-white/85" style={{fontFamily: 'Inter, sans-serif'}}>Discover hotel opportunities</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-sm">✓</span>
                        </div>
                        <p className="text-sm text-white/85" style={{fontFamily: 'Inter, sans-serif'}}>Submit competitive bids</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-semibold text-sm">✓</span>
                        </div>
                        <p className="text-sm text-white/85" style={{fontFamily: 'Inter, sans-serif'}}>Access actionable insights</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <RoleSelectionModal
          isOpen={showRoleModal}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage;
