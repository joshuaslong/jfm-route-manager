'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getTodayDate } from '@/lib/utils/dateHelpers';
import { useAuth } from '@/lib/auth/AuthContext';

function getNavItems(isAdmin: boolean) {
  const today = getTodayDate();

  const items = [
    {
      label: 'Transportation',
      href: `/transportation/day/${today}`,
      children: [
        { label: 'Today', href: `/transportation/day/${today}` },
        { label: 'Templates', href: '/transportation/templates' },
        { label: 'Planning', href: '/transportation/planning' },
      ],
    },
    {
      label: 'Shipping',
      href: '/shipping',
      children: [
        { label: 'Loading', href: '/shipping' },
        { label: 'Dock View', href: '/shipping/doors' },
        { label: 'History', href: '/shipping/history' },
      ],
    },
  ];

  // Only show Admin link to admin users
  if (isAdmin) {
    items.push({
      label: 'Admin',
      href: '/admin',
      children: undefined as any,
    });
  }

  return items;
}

export function Navigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.is_admin || false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    // For transportation day pages, check if we're on any transportation page
    if (href.startsWith('/transportation/day/')) {
      return pathname.startsWith('/transportation');
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                Route Manager
              </Link>
            </div>
            <div className="hidden sm:flex sm:space-x-4">
              {navItems.map((item) => (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="absolute left-0 pt-1 w-48 z-10 hidden group-hover:block">
                      <div className="bg-white rounded-md shadow-lg py-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2 text-sm ${
                            pathname === child.href
                              ? 'text-blue-600 bg-blue-50'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* User info and logout */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.full_name}</span>
                <span className="text-gray-400 ml-2 capitalize">({user.department})</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
