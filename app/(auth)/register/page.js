'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Suspense } from 'react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get('code') || '';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { inviteCode } });

  useEffect(() => {
    if (inviteCode) setValue('inviteCode', inviteCode);
  }, [inviteCode, setValue]);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Registration submitted!');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Registration failed. Check your invite code.'
      );
    },
  });

  const onSubmit = ({ username, password, fixedIP, telegramID, inviteCode }) =>
    mutate({ username, password, fixedIP, telegramID, inviteCode });

  if (isSuccess) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Registration Submitted</h2>
        <p className="text-slate-400 text-sm mb-6">
          Your account is pending admin approval. You will be notified via Telegram once approved.
        </p>
        <Button onClick={() => router.push('/login')} variant="secondary" fullWidth>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Create Account</h2>
        <p className="text-slate-400 text-sm mt-1">
          Fill in the details below to register.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="[&_label]:text-slate-300 [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input::placeholder]:text-slate-500 [&_input]:focus:ring-indigo-400 space-y-4">
          <Input
            label="Username"
            placeholder="Choose a username"
            error={errors.username?.message}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
            })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Choose a password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
            })}
          />

          <Input
            label="Fixed IP Address"
            placeholder="e.g. 192.168.1.1"
            error={errors.fixedIP?.message}
            {...register('fixedIP', {
              required: 'Fixed IP is required',
              pattern: {
                value: /^(\d{1,3}\.){3}\d{1,3}$|^::1$|^[a-fA-F0-9:]+$/,
                message: 'Enter a valid IP address',
              },
            })}
          />

          <Input
            label="Telegram ID"
            placeholder="Your Telegram numeric ID"
            error={errors.telegramID?.message}
            {...register('telegramID', {
              required: 'Telegram ID is required',
            })}
          />

          <Input
            label="Invite Code"
            placeholder="Paste your invite code"
            error={errors.inviteCode?.message}
            {...register('inviteCode', { required: 'Invite code is required' })}
          />
        </div>

        <Button type="submit" fullWidth loading={isPending} className="mt-2">
          {isPending ? 'Submitting...' : 'Register'}
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

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
