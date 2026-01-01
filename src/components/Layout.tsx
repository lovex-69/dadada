import React from 'react';
import AuthButton from './AuthButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary">CivicPulse</h1>
          </div>
          <AuthButton />
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
