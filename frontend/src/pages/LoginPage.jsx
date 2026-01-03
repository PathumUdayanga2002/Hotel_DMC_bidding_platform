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
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to access your dashboard</p>
        </div>

        <Card>
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

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-cyan-700 font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
