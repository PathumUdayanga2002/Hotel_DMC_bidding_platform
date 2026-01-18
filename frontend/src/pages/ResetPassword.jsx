import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { authService } from '../services/authService';

const schema = yup.object({
  newPassword: yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useMemo(() => searchParams.get('token'), [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Reset token is missing or invalid.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword({ ...data, token });
      toast.success('Password updated successfully. Please log in.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to reset password right now.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 text-cyan-700 mb-6">
          <Link to="/login" className="flex items-center gap-2 text-sm font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="bg-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-gray-600">Choose a strong new password to secure your account.</p>
        </div>

        <Card>
          {!token ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-gray-700">This reset link is invalid or has already been used.</p>
              <Link to="/forgot-password" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline">
                Request a new password reset link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                register={register('newPassword')}
                error={errors.newPassword?.message}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter new password"
                register={register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Resetting...' : 'Reset password'}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
