'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '../firebase/config';
import ForgotPasswordModal from '@/components/auth/ForgotPasswordModal';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleBackendLogin = async (idToken: string) => {
    try {
        const res = await fetch('http://127.0.0.1:8000/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: idToken }),
        });

        const data: LoginApiResponse | { detail: string } = await res.json();

        if (!res.ok) {
            const errorMessage = (data as { detail: string }).detail || 'Backend login failed.';
            throw new Error(errorMessage);
        }
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 1000);

    } catch (error: any) {
        setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(firebaseAuth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        await handleBackendLogin(idToken);
    } catch (error: any) {
        let errorMessage = 'Google Sign-In failed. Please try again.';
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Sign-in process was cancelled.';
        }
        setError(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();
      await handleBackendLogin(idToken);
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
                
                <div className="text-right">
                    <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 transition-colors duration-300"
                >
                  <LogIn className="h-5 w-5" />
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative px-2 bg-white text-sm text-gray-500">OR</div>
              </div>

              <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-50"
              >
                  <svg className="h-5 w-5" viewBox="0 0 48 48" >
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.021,35.591,44,30.134,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Sign In with Google</span>
              </button>

            </motion.div>
          </div>
        </div>
      </div>
      
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </>
  );
}

