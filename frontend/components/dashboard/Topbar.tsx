'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '@/app/firebase/config';
import { Search } from 'lucide-react';
import ProfileMenu from '@/components/auth/ProfileMenu';

// Define the shape of the user data we expect from our backend
interface UserProfile {
  username: string;
  email: string;
}

export default function Topbar() {
  const [user, loading] = useAuthState(firebaseAuth);

  const getGreeting = () => {
    if (loading) {
      return 'Loading...';
    }
    if (user) {
      return `Hello, ${user.displayName} 👋`;
    }
    return 'Welcome to Quizzy!';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* Greeting */}
      <h1 className="text-xl font-semibold text-gray-700">{getGreeting()}</h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search sessions or documents..."
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Auth Buttons / Profile Menu */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        ) : user ? (
          <ProfileMenu user={user} />
        ) : (
          <>
            <Link href="/login">
              <span className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
                Log In
              </span>
            </Link>
            <Link href="/signup">
              <span className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer">
                Sign Up
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
