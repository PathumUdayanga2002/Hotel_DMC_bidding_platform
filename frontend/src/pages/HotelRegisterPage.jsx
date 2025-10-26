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
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hotel Registration</h1>
          <p className="text-gray-600">Join as a hotel partner</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Username"
              placeholder="Choose a username"
              register={register('username')}
              error={errors.username?.message}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              register={register('email')}
              error={errors.email?.message}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Create a password"
                register={register('password')}
                error={errors.password?.message}
              />
              
              {/* Password Strength Indicators */}
              {password && (
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center">
                    {passwordChecks.length ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={passwordChecks.length ? 'text-green-600' : 'text-gray-600'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.uppercase ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={passwordChecks.uppercase ? 'text-green-600' : 'text-gray-600'}>
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.lowercase ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={passwordChecks.lowercase ? 'text-green-600' : 'text-gray-600'}>
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.number ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={passwordChecks.number ? 'text-green-600' : 'text-gray-600'}>
                      One number
                    </span>
                  </div>
                  <div className="flex items-center">
                    {passwordChecks.special ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className={passwordChecks.special ? 'text-green-600' : 'text-gray-600'}>
                      One special character
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              register={register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                Login here
              </Link>
            </p>
            <p className="text-center text-gray-600 text-sm mt-2">
              <Link to="/" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                ← Back to home
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HotelRegisterPage;
