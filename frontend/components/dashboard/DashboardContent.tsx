'use client';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardContent({ selectedSession }: { selectedSession: any | null }) {
    return (
        <main className="flex-grow p-8 bg-gray-50 overflow-y-auto">
            <AnimatePresence mode="wait">
                {selectedSession ? (
                    // Display content for the selected session
                    <motion.div
                        key={selectedSession.id} // Re-trigger animation on change
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-8 rounded-2xl shadow-md h-full"
                    >
                        <h2 className="text-2xl font-bold font-display text-gray-800 mb-4">
                            {selectedSession.name}
                        </h2>
                        <div className="bg-gray-100 h-full min-h-[500px] rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Document Preview Area</p>
                        </div>
                    </motion.div>
                ) : (
                    // Empty state when no session is selected
                    <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center h-full text-center bg-white p-8 rounded-2xl shadow-md"
                    >
                        <h2 className="text-2xl font-semibold text-gray-700 font-display">
                            Welcome to your Dashboard
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Upload your first document or select a session to get started.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
