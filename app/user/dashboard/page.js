'use client';

import { useAuth } from '@/store/AuthContext';
import { formatDate } from '@/utils/helpers';
import Card from '@/components/ui/Card';
import Badge, { getStatusVariant } from '@/components/ui/Badge';

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();

  const steps = [
    {
      title: 'Account Registered',
      description: 'Your account was submitted via invite link.',
      done: true,
    },
    {
      title: 'Admin Approval',
      description:
        user?.status === 'approved'
          ? 'Your account has been approved by the admin.'
          : user?.status === 'rejected'
          ? 'Your account was rejected. Contact the admin.'
          : 'Waiting for admin to review your account.',
      done: user?.status === 'approved',
      failed: user?.status === 'rejected',
    },
    {
      title: 'Account Active',
      description: 'You can now use the platform with your approved account.',
      done: user?.status === 'approved',
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1">Welcome back</p>
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p className="text-indigo-200 text-sm mt-1">
              Logged in as <span className="capitalize font-medium text-white">{user?.role}</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Account details */}
      <Card title="Account Details">
        <div className="divide-y divide-gray-50">
          <InfoRow label="Username" value={user?.username} />
          <InfoRow label="User ID" value={user?.id} mono />
          <InfoRow label="Role" value={
            <Badge label={user?.role} variant={getStatusVariant(user?.role)} />
          } />
          <InfoRow label="Fixed IP" value={user?.fixedIP} mono />
          <InfoRow label="Telegram ID" value={user?.telegramID} mono />
        </div>
      </Card>

      {/* Account status */}
      {/* <Card title="Account Status" subtitle="Your onboarding progress">
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  step.failed
                    ? 'bg-red-100 text-red-600'
                    : step.done
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.failed ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : step.done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    step.failed
                      ? 'text-red-700'
                      : step.done
                      ? 'text-gray-800'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  );
}
