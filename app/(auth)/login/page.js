'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';

function TelegramBotAlert({ botStartLink, onDismiss }) {
  return (
    <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-amber-300 text-sm font-semibold">Telegram Bot Not Started</p>
          <p className="text-amber-400/80 text-xs mt-1 leading-relaxed">
            OTP could not be delivered. You need to start the Telegram bot first so it can send you the verification code.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={botStartLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#229ED9] hover:bg-[#1a8cbd] text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.947l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.612z" />
          </svg>
          Start Telegram Bot
        </a>
        <button
          onClick={onDismiss}
          className="px-4 py-2.5 rounded-lg border border-white/20 text-slate-300 hover:text-white hover:border-white/40 text-sm font-medium transition-colors"
        >
          Try Again
        </button>
      </div>

      <p className="text-amber-400/60 text-xs text-center">
        After starting the bot, come back and log in again.
      </p>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [botAlert, setBotAlert] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (data, variables) => {
      if (data.success) {
        sessionStorage.setItem('otp_username', variables.username);
        toast.success(data.message || 'OTP sent to your Telegram!');
        router.push('/verify-otp');
      } else if (data.botStartLink) {
        setBotAlert(data.botStartLink);
      } else {
        toast.error(data.message || 'Login failed');
      }
    },
    onError: (error) => {
      const errData = error.response?.data;
      if (errData?.botStartLink) {
        setBotAlert(errData.botStartLink);
      } else {
        toast.error(errData?.message || 'Invalid credentials. Please try again.');
      }
    },
  });

  const onSubmit = (data) => {
    setBotAlert(null);
    mutate(data);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Sign in</h2>
        <p className="text-slate-400 text-sm mt-1">
          Enter your credentials. An OTP will be sent to your Telegram.
        </p>
      </div>

      {botAlert ? (
        <TelegramBotAlert
          botStartLink={botAlert}
          onDismiss={() => setBotAlert(null)}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="[&_label]:text-slate-300 [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input::placeholder]:text-slate-500 [&_input]:focus:ring-indigo-400">
            <Input
              label="Username"
              placeholder="Enter your username"
              error={errors.username?.message}
              {...register('username', { required: 'Username is required' })}
            />
          </div>

          <div className="[&_label]:text-slate-300 [&_input]:bg-white/10 [&_input]:border-white/20 [&_input]:text-white [&_input::placeholder]:text-slate-500 [&_input]:focus:ring-indigo-400 [&_button]:text-slate-400 [&_button:hover]:text-slate-200">
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
            />
          </div>

          <Button type="submit" fullWidth loading={isPending} className="mt-2">
            {isPending ? 'Sending OTP...' : 'Continue'}
          </Button>
        </form>
      )}

      {/* <div className="mt-6 pt-5 border-t border-white/10 text-center">
        <p className="text-slate-400 text-sm">
          Have an invite code?{' '}
          <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Register here
          </a>
        </p>
      </div> */}
    </div>
  );
}
