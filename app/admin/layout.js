'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!isAdmin) {
      router.replace('/user/dashboard');
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
