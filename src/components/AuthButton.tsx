import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';

const AuthButton: React.FC = () => {
  const { user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Sign out error:', error);
      }
    }
  };

  if (!user) {
    return null;
  }

  if (user.isAnonymous) {
    return (
      <>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors font-medium"
        >
          Sign In
        </button>
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition-colors"
      >
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium">
          {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {user.email || 'User'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
            {user.displayName && (
              <p className="text-xs text-gray-500 truncate">{user.displayName}</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
