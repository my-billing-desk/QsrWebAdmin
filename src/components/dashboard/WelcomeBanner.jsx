import React from 'react';
import { Plus, Rocket, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function WelcomeBanner() {
    const { user } = useAuth();

    return (
        <div className="bg-surface rounded-xl p-6 shadow-sm border flex items-center justify-between mb-6" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 shrink-0" style={{ backgroundColor: 'var(--sidebar-active)', borderColor: 'var(--bg-main)' }}>
                    <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0) || 'A'}</span>
                    {/* Placeholder for actual image if available */}
                    {/* <img src="..." className="w-full h-full rounded-full object-cover" /> */}
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">Welcome Back, {user?.name || 'Admin'}</h2>
                        <button className="text-muted hover:text-gray-900">
                            {/* Simple edit icon placeholder */}
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </div>
                    <p className="text-muted font-medium">
                        You have <span className="text-red-500 underline decoration-red-200 decoration-2 underline-offset-2 cursor-pointer">{user?.pendingApprovals || 21} Pending Approvals</span> & <span className="text-red-500 underline decoration-red-200 decoration-2 underline-offset-2 cursor-pointer">{user?.leaveRequests || 14} Leave Requests</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-lg"
                    style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-surface)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                    <Plus className="w-4 h-4" /> Add Project
                </button>
                <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-semibold shadow-lg hover-bg-primary"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'white', boxShadow: '0 10px 15px -3px rgba(249, 115, 22, 0.3)' }}
                >
                    <Rocket className="w-4 h-4" /> Add Requests
                </button>
            </div>
        </div>
    );
}
