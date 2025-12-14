import React, { useState, useRef, useEffect } from 'react';
import { Menu, Store, ChevronDown, Lightbulb, Bell, Link as LinkIcon, Settings, Grid, LogOut, User, FileText, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header({ onToggleSidebar }) {
    const { logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 shrink-0 z-30">
            {/* Left Section */}
            <div className="flex items-center gap-6">
                {/* Outlet Selector */}
                <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-300 rounded-full cursor-pointer hover:border-red-400 transition-colors shadow-sm">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">SUNBURST STACK</span>
                    {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-5">
                {/* Icons */}
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <button className="hover:text-red-600 transition-colors" title="Help">
                        <Lightbulb className="w-5 h-5" />
                    </button>
                    <button className="hover:text-red-600 transition-colors relative" title="Notifications">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border-2 border-white dark:border-gray-900 translate-x-1/3 -translate-y-1/3"></span>
                    </button>
                    <button className="hover:text-red-600 transition-colors" title="Integrations">
                        <LinkIcon className="w-5 h-5" />
                    </button>

                    {/* Settings Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className={`transition-colors ${showDropdown ? 'text-red-600' : 'hover:text-red-600'}`}
                            onClick={() => setShowDropdown(!showDropdown)}
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-50 text-sm font-medium animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-red-600">
                                    Edit Profile
                                </button>

                                <div className="px-4 py-2 text-gray-700 dark:text-gray-200">
                                    <p className="mb-0.5">Desktop Application</p>
                                    <p className="text-xs text-gray-400 font-normal">Version - 118.0.3</p>
                                </div>

                                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-red-600">
                                    Terms & Conditions
                                </button>

                                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-red-600">
                                    Privacy Policy
                                </button>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1 mx-2"></div>

                                <button
                                    onClick={() => {
                                        logout();
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
