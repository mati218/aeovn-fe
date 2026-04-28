'use client';

import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/services/users';
import { invitesService } from '@/services/invites';
import { queryKeys } from '@/utils/queryKeys';
import { formatDate } from '@/utils/helpers';
import { StatCard } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import { useAuth } from '@/store/AuthContext';

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: usersService.getAllUsers,
  });

  const { data: invitesData, isLoading: invitesLoading } = useQuery({
    queryKey: queryKeys.invites.list(),
    queryFn: invitesService.listInvites,
  });

  const users = usersData?.data || [];
  const invites = invitesData?.data || [];

  const stats = {
    total: users.length,
    approved: users.filter((u) => u.status === 'approved').length,
    pending: users.filter((u) => u.status === 'pending').length,
    invites: invites.length,
  };

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, <span className="text-indigo-600">{user?.username}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's an overview of your platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {usersLoading || invitesLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Users" value={stats.total} icon={<UserIcon />} color="indigo" />
            <StatCard label="Approved Users" value={stats.approved} icon={<CheckIcon />} color="emerald" />
            <StatCard label="Pending Approval" value={stats.pending} icon={<ClockIcon />} color="amber" trend="Awaiting review" />
            <StatCard label="Total Invites" value={stats.invites} icon={<MailIcon />} color="blue" />
          </>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Recent Users</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest registered accounts</p>
          </div>
          <a
            href="/admin/users"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </a>
        </div>
        <div className="divide-y divide-gray-50">
          {usersLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-gray-200 rounded animate-pulse w-24" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
                </div>
              </div>
            ))
          ) : recentUsers.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400 text-sm">No users yet</p>
          ) : (
            recentUsers.map((u) => (
              <div key={u._id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm shrink-0">
                  {u.username?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{u.username}</p>
                  <p className="text-xs text-gray-400">{u.fixedIP}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={u.role} variant={getStatusVariant(u.role)} />
                  <Badge label={u.status} variant={getStatusVariant(u.status)} />
                </div>
                <p className="text-xs text-gray-400 hidden md:block">{formatDate(u.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
