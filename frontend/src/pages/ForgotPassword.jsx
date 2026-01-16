import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { authService } from '../services/authService';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(data);
      toast.success('If an account exists for this email, a reset link has been sent.');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to process request right now.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">Rezpitch</span>
          </h1>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2" style={{fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em'}}>Forgot Password?</h2>
            <p className="text-slate-600 text-lg" style={{fontFamily: 'Inter, sans-serif'}}>We'll email you a secure reset link.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email"
              placeholder="you@example.com"
              register={register('email')}
              error={errors.email?.message}
              type="email"
            />

            <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending link...' : 'Send reset link'}
            </Button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600 text-sm" style={{fontFamily: 'Inter, sans-serif'}}>
              Remember your password?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
