import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Plane, CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

const registerSchema = yup.object({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
}).required();

const DMCRegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password', '');

  // Password validation checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data, 'dmc');
      toast.success('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dmc/dashboard');
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 py-20 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Luxury Glass Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-2xl p-10 shadow-2xl border border-white/10 mt-12">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-900/30">
            <Plane className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            DMC Registration
          </h1>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-3 shadow-lg shadow-amber-500/50"></div>
          <p className="text-gray-400 text-sm">Join as an exclusive DMC partner</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                {...register('username')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              )}
              
              {/* Password Strength Indicators */}
              {password && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center">
                    {passwordChecks.length ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600 mr-2" />
                    )}
                    <span className={passwordChecks.length ? 'text-amber-400' : 'text-gray-500'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.uppercase ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600 mr-2" />
                    )}
                    <span className={passwordChecks.uppercase ? 'text-amber-400' : 'text-gray-500'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.lowercase ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600 mr-2" />
                    )}
                    <span className={passwordChecks.lowercase ? 'text-amber-400' : 'text-gray-500'}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.number ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600 mr-2" />
                    )}
                    <span className={passwordChecks.number ? 'text-amber-400' : 'text-gray-500'}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.special ? (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-600 mr-2" />
                    )}
                    <span className={passwordChecks.special ? 'text-amber-400' : 'text-gray-500'}>
                      One special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl py-3 hover:from-amber-500 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200">
                Login here
              </Link>
            </p>
            <p className="text-center text-gray-400 text-sm mt-2">
              <Link to="/" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200">
                ← Back to home
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
};

export default DMCRegisterPage;
