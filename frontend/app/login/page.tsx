'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from '@/app/firebase/config';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal'; // Import the modal

// Define the shape of our backend API response
interface LoginApiResponse {
  status: string;
  user_id?: number;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // --- NEW STATE FOR MODAL ---
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Sign in with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;

      // 2. Get the Firebase ID token
      const idToken = await user.getIdToken();

      // 3. Send the ID token to our FastAPI backend
      const res = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      const data: LoginApiResponse | { detail: string } = await res.json();

      if (!res.ok) {
        const errorMessage = (data as { detail: string }).detail || 'An unexpected error occurred during login.';
        throw new Error(errorMessage);
      }
      
      setSuccess('Login successful! Redirecting...');
      // Optionally, redirect the user
      // setTimeout(() => window.location.href = '/dashboard', 1000);

    } catch (error: any) {
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl mx-auto">
          
          {/* Left Side: Illustration Placeholder */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-indigo-50 rounded-l-2xl">
            <motion.img 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                src="https://placehold.co/600x600/4F46E5/FFFFFF?text=Quizzy&font=poppins" 
                alt="Abstract study illustration" 
                className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Right Side: Login Form */}
          <div className="flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
            >
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 font-display">Welcome Back!</h1>
                <p className="mt-2 text-sm text-gray-500">
                  Don't have an account?{' '}
                  <a href="/signup" className="font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                    Sign Up
                  </a>
                </p>
              </div>

              {/* Response Message Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg text-sm font-medium text-center bg-rose-50 text-rose-600"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg text-sm font-medium text-center bg-emerald-50 text-emerald-600"
                >
                  {success}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email and Password Fields... (no changes here) */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                
                {/* --- FORGOT PASSWORD LINK --- */}
                <div className="text-right">
                    <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors duration-300"
                >
                  <LogIn className="h-5 w-5" />
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* --- RENDER THE MODAL --- */}
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
}

