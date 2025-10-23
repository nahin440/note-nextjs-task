// src/components/Navigation.tsx
'use client';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaStickyNote, 
  FaPlus, 
  FaSignOutAlt, 
  FaUser, 
  FaHome,
  FaSearch 
} from 'react-icons/fa';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/notes', icon: FaStickyNote, label: 'All Notes' },
    { href: '/notes/create', icon: FaPlus, label: 'Create Note' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <FaStickyNote className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">NoteApp</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 hidden sm:block">
              Hello, {session?.user?.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}