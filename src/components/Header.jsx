import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export function Header({ title }) {
    return (
        <header className="h-20 flex items-center justify-between px-8 shrink-0 z-10">
            <div>
                <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">{title}</h2>
                <p className="text-sm text-gray-500 font-medium">Tuesday, 10 Dec 2025</p>
            </div>

            <div className="flex items-center gap-6">
                {/* Search Pill */}
                <div className="relative group hidden md:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-gray-800 border border-transparent focus:border-primary-200 outline-none focus:ring-4 focus:ring-primary-500/10 w-64 text-sm shadow-sm transition-all"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button className="relative w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50 flex items-center justify-center hover:bg-gray-50 transition-all group">
                        <Bell className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
                        <span className="absolute top-2.5 right-3 w-2 h-2 bg-secondary-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-1"></div>

                    <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 leading-none">Admin User</p>
                            <p className="text-xs text-gray-500 font-medium mt-1">Manager</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-primary-900/40 dark:to-indigo-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-700/30 font-bold shadow-inner">
                            <User className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}
