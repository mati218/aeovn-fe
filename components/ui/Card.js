'use client';

export default function Card({ children, title, subtitle, action, className = '', padding = true }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
    </div>
  );
}

export function StatCard({ label, value, icon, trend, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
    </div>
  );
}
