'use client';

const variants = {
  approved: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-100 text-amber-700 ring-amber-200',
  rejected: 'bg-red-100 text-red-700 ring-red-200',
  admin: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  user: 'bg-gray-100 text-gray-600 ring-gray-200',
  valid: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  used: 'bg-blue-100 text-blue-700 ring-blue-200',
  expired: 'bg-gray-100 text-gray-500 ring-gray-200',
  default: 'bg-gray-100 text-gray-600 ring-gray-200',
};

export default function Badge({ label, variant = 'default', size = 'sm' }) {
  const style = variants[variant] || variants.default;
  const sizeClass = size === 'xs' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ring-1 ring-inset capitalize ${style} ${sizeClass}`}
    >
      {label}
    </span>
  );
}

export function getStatusVariant(status) {
  const map = {
    approved: 'approved',
    pending: 'pending',
    rejected: 'rejected',
    admin: 'admin',
    user: 'user',
    valid: 'valid',
    used: 'used',
    expired: 'expired',
  };
  return map[status?.toLowerCase()] || 'default';
}
