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
import { Building2, CheckCircle2, XCircle } from 'lucide-react';
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

const HotelRegisterPage = () => {
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
      await registerUser(data, 'hotel');
      toast.success('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/hotel/dashboard');
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
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')`,
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
            <Building2 className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Hotel Registration
          </h1>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-3 shadow-lg shadow-amber-500/50"></div>
          <p className="text-gray-400 text-sm">Join as an exclusive hotel partner</p>
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
              {password && (
                <div className="mt-3 space-y-2 text-sm">
                  {Object.entries(passwordChecks).map(([key, valid]) => (
                    <div key={key} className="flex items-center">
                      {valid ? <CheckCircle2 className="w-4 h-4 text-amber-400 mr-2" /> : <XCircle className="w-4 h-4 text-gray-600 mr-2" />}
                      <span className={valid ? 'text-amber-400' : 'text-gray-500'}>
                        {{
                          length: 'At least 8 characters',
                          uppercase: 'One uppercase letter',
                          lowercase: 'One lowercase letter',
                          number: 'One number',
                          special: 'One special character',
                        }[key]}
                      </span>
                    </div>
                  ))}
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

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm">
            <p className="text-gray-400">
              Already have an account? <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200">Login here</Link>
            </p>
            <p className="mt-2 text-gray-400"><Link to="/" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200">← Back to home</Link></p>
          </div>
      </div>
    </div>
  );
};

export default HotelRegisterPage;
