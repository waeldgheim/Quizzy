'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Topbar from '@/components/dashboard/Topbar';
import DashboardContent from '@/components/dashboard/DashboardContent';

export default function DashboardPage() {
    // State to manage which session is currently selected
    const [selectedSession, setSelectedSession] = useState<any | null>(null);

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <Sidebar onSessionSelect={setSelectedSession} />
            <div className="flex-1 flex flex-col h-screen overflow-y-hidden">
                <Topbar />
                <DashboardContent selectedSession={selectedSession} />
            </div>
        </div>
    );
}
