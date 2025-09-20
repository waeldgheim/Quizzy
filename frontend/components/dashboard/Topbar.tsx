'use client';

import { Menu, Transition } from '@headlessui/react';
import { Search, Bell } from 'lucide-react';
import { Fragment } from 'react';

export default function Topbar() {
    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
            {/* Greeting */}
            <div className="flex items-center">
                 <h1 className="text-2xl font-semibold text-gray-700">Hello, Wael 👋</h1>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-lg mx-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search sessions or documents..."
                        className="w-full pl-12 pr-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Profile Menu */}
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-gray-100">
                    <Bell size={20} className="text-gray-600" />
                </button>
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2">
                        <img 
                            src="https://placehold.co/40x40/E0E7FF/4F46E5?text=W" 
                            alt="User avatar" 
                            className="h-10 w-10 rounded-full border-2 border-white shadow"
                        />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-1 py-1 ">
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={`${
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            Settings
                                        </a>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="#"
                                            className={`${
                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                        >
                                            Logout
                                        </a>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
}
