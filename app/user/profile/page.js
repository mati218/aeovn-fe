'use client';

import { useAuth } from '@/store/AuthContext';
import Card from '@/components/ui/Card';
import Badge, { getStatusVariant } from '@/components/ui/Badge';
import { copyToClipboard } from '@/utils/helpers';
import toast from 'react-hot-toast';

function ProfileField({ label, value, mono, copyable }) {
  const handleCopy = () => {
    copyToClipboard(value);
    toast.success('Copied!');
  };

  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-50 last:border-0 gap-4">
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
        <p
          className={`text-sm text-gray-800 break-all ${
            mono ? 'font-mono bg-gray-50 px-2 py-1 rounded-lg inline-block' : 'font-medium'
          }`}
        >
          {value ?? '—'}
        </p>
      </div>
      {copyable && value && (
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0 mt-5"
          title="Copy"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your account information</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge label={user?.role} variant={getStatusVariant(user?.role)} />
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <Card title="Account Information">
        <ProfileField label="Username" value={user?.username} />
        <ProfileField label="User ID" value={user?.id} mono copyable />
        <ProfileField label="Role" value={user?.role} />
        <ProfileField label="Fixed IP Address" value={user?.fixedIP} mono copyable />
        <ProfileField label="Telegram ID" value={user?.telegramID} mono copyable />
      </Card>

      {/* Security info */}
      <Card title="Security">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">Two-Factor Authentication Active</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Your account uses OTP via Telegram as a second factor. OTPs are sent to your registered Telegram account.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-blue-800">IP Restriction Enabled</p>
            <p className="text-xs text-blue-600 mt-0.5">
              Access is restricted to your fixed IP address. Contact admin if your IP changes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
