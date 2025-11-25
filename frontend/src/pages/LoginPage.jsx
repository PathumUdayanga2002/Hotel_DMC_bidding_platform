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
import { LogIn } from 'lucide-react';
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
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop')`,
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
            <LogIn className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Welcome Back
          </h1>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-3 shadow-lg shadow-amber-500/50"></div>
          <p className="text-gray-400 text-sm">Login to access your exclusive dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email or Username</label>
              <input
                {...register('emailOrUsername')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email or username"
              />
              {errors.emailOrUsername && (
                <p className="mt-2 text-sm text-red-400">{errors.emailOrUsername.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                {...register('password')}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-xl py-3 hover:from-amber-500 hover:to-yellow-600 hover:shadow-xl hover:shadow-amber-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200">
                Register here
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;
