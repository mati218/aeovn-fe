'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import { useAuth } from '@/store/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function VerifyOTPPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const stored = sessionStorage.getItem('otp_username');
    if (!stored) {
      router.replace('/login');
    } else {
      setUsername(stored);
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authService.verifyOTP,
    onSuccess: (data) => {
      if (data.success && data.token) {
        sessionStorage.removeItem('otp_username');
        toast.success(data.message || 'Login successful!');
        login(data.token, data.user);
      } else {
        toast.error(data.message || 'OTP verification failed');
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Invalid OTP. Please try again.'
      );
    },
  });

  const onSubmit = ({ otp }) => mutate({ username, otp });

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
      <div className="mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Verify OTP</h2>
        <p className="text-slate-400 text-sm mt-1">
          Check your Telegram for the OTP sent to{' '}
          {username && <span className="text-indigo-400 font-medium">@{username}</span>}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="[&_label]:text-slate-300 [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input::placeholder]:text-slate-500 [&_input]:focus:ring-indigo-400 [&_input]:tracking-widest [&_input]:text-center [&_input]:text-lg [&_input]:font-mono">
          <Input
            label="One-Time Password"
            placeholder="000000"
            maxLength={6}
            error={errors.otp?.message}
            {...register('otp', {
              required: 'OTP is required',
              minLength: { value: 4, message: 'OTP must be at least 4 digits' },
              maxLength: { value: 8, message: 'OTP is too long' },
            })}
          />
        </div>

        <Button type="submit" fullWidth loading={isPending}>
          {isPending ? 'Verifying...' : 'Verify & Sign In'}
        </Button>
      </form>

      <div className="mt-5 text-center">
        <button
          onClick={() => router.push('/login')}
          className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
        >
          ← Back to login
        </button>
      </div>
    </div>
  );
}
