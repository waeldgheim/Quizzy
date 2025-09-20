'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '@/app/firebase/config';
import ProfileMenu from '@/components/auth/ProfileMenu';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [user, loading, error] = useAuthState(firebaseAuth);

  const AuthButtons = () => (
    <div className="flex items-center space-x-4">
      <Link href="/login">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Login
        </motion.button>
      </Link>
      <Link href="/signup">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 text-sm font-semibold text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          Sign Up
        </motion.button>
      </Link>
    </div>
  );

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg className="h-8 w-8 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span className="text-xl font-bold text-gray-800 font-display">Quizzy</span>
          </Link>

          {/* Auth State */}
          <div className="flex items-center">
            {loading && <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-600"></div>}
            {!loading && user && <ProfileMenu user={user} />}
            {!loading && !user && <AuthButtons />}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center p-8">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-extrabold text-gray-900 font-display"
            >
                Welcome to Quizzy
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 max-w-xl mx-auto text-lg text-gray-500"
            >
                The smartest way to study. Upload your documents and let AI create quizzes, flashcards, and summaries for you.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
            >
                <Link href="/dashboard">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                        Let's Study
                    </motion.button>
                </Link>
            </motion.div>
        </div>
      </div>
    </main>
  );
}

