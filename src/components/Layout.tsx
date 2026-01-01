import React from 'react';
import Link from 'next/link';
import AuthButton from './AuthButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[500]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold text-primary">
              CivicPulse
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/feed" className="text-sm font-medium text-gray-600 hover:text-primary">
                Live Feed
              </Link>
              <Link href="/rankings" className="text-sm font-medium text-gray-600 hover:text-primary">
                Rankings
              </Link>
              <Link href="/report" className="text-sm font-medium text-gray-600 hover:text-primary">
                Report Issue
              </Link>
              <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-primary">
                Dashboard
              </Link>
            </div>
          </div>
          <AuthButton />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
