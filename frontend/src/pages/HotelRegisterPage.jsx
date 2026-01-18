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
import { Building2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>Hotel Registration</h2>
            <p className="text-slate-600 text-lg" style={{fontFamily: 'Inter, sans-serif'}}>Join as a hotel partner</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input label="Username" placeholder="Choose a username" register={register('username')} error={errors.username?.message} />
            <Input label="Email" type="email" placeholder="Enter your email" register={register('email')} error={errors.email?.message} />

            <div>
              <Input label="Password" type="password" placeholder="Create a password" register={register('password')} error={errors.password?.message} />
              {password && (
                <div className="mt-3 space-y-2 text-sm">
                  {Object.entries(passwordChecks).map(([key, valid]) => (
                    <div key={key} className="flex items-center">
                      {valid ? <CheckCircle2 className="w-4 h-4 text-teal-600 mr-2" /> : <XCircle className="w-4 h-4 text-slate-400 mr-2" />}
                      <span className={valid ? 'text-teal-600' : 'text-slate-600'}>
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

            <Input label="Confirm Password" type="password" placeholder="Confirm your password" register={register('confirmPassword')} error={errors.confirmPassword?.message} />

            <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md hover:shadow-lg py-3 rounded-lg font-semibold transition-all duration-200" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600 text-sm" style={{fontFamily: 'Inter, sans-serif'}}>
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">Login here</Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HotelRegisterPage;
