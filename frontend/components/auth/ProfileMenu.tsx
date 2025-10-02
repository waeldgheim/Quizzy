'use client';

import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import { User, signOut } from 'firebase/auth';
import { firebaseAuth } from '../../app/firebase/config';
import { motion } from 'framer-motion';

// Define the props the component will accept
interface ProfileMenuProps {
  user: User; // The user object from Firebase
}

export default function ProfileMenu({ user }: ProfileMenuProps) {

  const handleLogout = async () => {
    try {
      // 1. Sign out from the Firebase client
      await signOut(firebaseAuth);

      // 2. Call our backend to clear the httpOnly cookie
      // We use 'credentials: "include"' to ensure cookies are sent with the request
      await fetch('http://127.0.0.1:8000/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // The onAuthStateChanged listener in the homepage will automatically handle the UI update.
      // No redirect is needed here.

    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Menu as="div">
        <div>
          <Menu.Button className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <UserIcon className="w-5 h-5 text-gray-600" />
            )}
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
               <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-indigo-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors`}
                  >
                    <Settings className="mr-2 h-5 w-5" aria-hidden="true" />
                    Settings
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${
                      active ? 'bg-rose-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors`}
                  >
                    <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
