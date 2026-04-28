'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/store/AuthContext';

function buildBreadcrumbs(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts.map((part, i) => {
    const label =
      part.length === 24 || part.length > 20
        ? 'Detail'
        : part.charAt(0).toUpperCase() + part.slice(1);
    return { label, href: '/' + parts.slice(0, i + 1).join('/') };
  });
}

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">/</span>}
            <span
              className={
                i === crumbs.length - 1
                  ? 'font-medium text-gray-800'
                  : 'text-gray-400'
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
