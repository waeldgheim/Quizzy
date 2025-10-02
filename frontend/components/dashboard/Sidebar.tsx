'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronsLeft, 
    ChevronsRight, 
    UploadCloud, 
    FileText, 
    ChevronDown, 
    Gem
} from 'lucide-react';

const sessions = [
    { id: 1, name: 'Quantum Physics Intro' },
    { id: 2, name: 'History of Ancient Rome' },
    { id: 3, name: 'Calculus II Review' },
];

export default function Sidebar({ onSessionSelect }: { onSessionSelect: (session: any) => void }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSessionsOpen, setIsSessionsOpen] = useState(true);
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleSessionClick = (session: any) => {
        setActiveSessionId(session.id);
        onSessionSelect(session);
    };

    const sidebarVariants = {
        collapsed: { width: '80px' },
        expanded: { width: '280px' },
    };

    const logoTextVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0, transition: { delay: 0.2 } },
    };
    
    const itemTextVariants = {
        hidden: { opacity: 0, width: 0, x: -10 },
        visible: { opacity: 1, width: 'auto', x: 0, transition: { delay: 0.1, duration: 0.2 } },
    }

    return (
        <motion.div
            variants={sidebarVariants}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white h-screen flex flex-col shadow-md relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col flex-grow p-4 overflow-y-auto">
                {/* Logo and Collapse/Expand control */}
                <div className="flex items-center justify-between h-16 mb-6 pl-2">
                    <div className="flex items-center">
                        {/* --- UPDATED HOVER INTERACTION (NO ANIMATION) --- */}
                        {isCollapsed && isHovered ? (
                           <ChevronsRight 
                                className="text-gray-600 h-8 w-8 cursor-pointer"
                                onClick={() => setIsCollapsed(false)}
                            />
                       ) : (
                            <FileText className="text-indigo-600 h-8 w-8" />
                       )}
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    variants={logoTextVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="font-display text-2xl font-bold text-gray-800 ml-2 overflow-hidden whitespace-nowrap"
                                >
                                    Quizzy
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    {!isCollapsed && (
                         <button 
                            onClick={() => setIsCollapsed(true)}
                            className="bg-white rounded-full p-1.5 hover:bg-gray-100"
                        >
                            <ChevronsLeft size={18} />
                        </button>
                    )}
                </div>

                {/* Upload Section */}
                <div className="mb-6">
                    <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                        <UploadCloud size={20} />
                        <AnimatePresence>
                            {!isCollapsed && <motion.span variants={itemTextVariants} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap">Upload Document</motion.span>}
                        </AnimatePresence>
                    </button>
                    {!isCollapsed && (
                         <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                            <p className="text-sm">Drag & drop here</p>
                        </div>
                    )}
                </div>

                {/* Sessions Section */}
                <div className="flex-grow">
                    {!isCollapsed && (
                         <div 
                            onClick={() => setIsSessionsOpen(!isSessionsOpen)}
                            className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                        >
                             <h3 className="font-semibold text-gray-700">My Sessions</h3>
                            <ChevronDown size={18} className={`transition-transform ${isSessionsOpen ? 'rotate-180' : ''}`} />
                        </div>
                    )}
                    <AnimatePresence>
                    {!isCollapsed && isSessionsOpen && (
                        <motion.ul 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-2 space-y-1 overflow-hidden">
                            {sessions.map((session) => (
                                <li key={session.id}>
                                    <a
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); handleSessionClick(session); }}
                                        className={`w-full flex items-center text-sm p-2 rounded-lg transition-colors ${
                                            activeSessionId === session.id 
                                            ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <FileText size={16} className="mr-3 flex-shrink-0" />
                                        <span className="truncate">{session.name}</span>
                                    </a>
                                </li>
                            ))}
                        </motion.ul>
                    )}
                    </AnimatePresence>
                </div>

                {/* Tier Info */}
                <div className="border-t border-gray-200 pt-4 mt-auto">
                    <div className={`p-2 rounded-lg flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                         <Gem size={20} className={`text-amber-500 flex-shrink-0 ${!isCollapsed ? 'mr-3' : ''}`} />
                         <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div variants={itemTextVariants} initial="hidden" animate="visible" exit="hidden" className="text-sm overflow-hidden whitespace-nowrap">
                                    <p className="font-semibold text-gray-700">Free Tier</p>
                                    <a href="#" className="text-indigo-600 hover:underline">Upgrade</a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

