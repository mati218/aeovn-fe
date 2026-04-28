'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';

export default function RootPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      router.replace(isAdmin ? '/admin/dashboard' : '/user/dashboard');
    } else {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-sm text-gray-400">Loading AEOvn...</p>
      </div>
    </div>
  );
}
