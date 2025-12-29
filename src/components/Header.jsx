import React, { useState, useRef, useEffect } from 'react';
import { Menu, Store, ChevronDown, Lightbulb, Bell, Link as LinkIcon, Settings, Grid, LogOut, User, FileText, Monitor, Search, Maximize, MessageSquare, PlusCircle, Box, ShoppingBag, ShoppingCart, FileCheck, Truck, ArrowRightLeft, RotateCcw, Users, File } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header({ onToggleSidebar }) {
    const { logout, user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header
            className="h-16 flex items-center justify-between px-6 shrink-0 z-30 bg-header border-b"
            style={{ borderColor: 'var(--border-color)' }}
        >
            {/* Left Section: Search */}
            <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button onClick={onToggleSidebar} className="text-muted hover:text-gray-900 md:hidden">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative w-full max-w-md hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border rounded-lg leading-5 bg-main-app text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                        style={{ borderColor: 'var(--border-color)' }}
                        placeholder="Search in QSR..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-muted text-xs border rounded px-1.5 py-0.5" style={{ borderColor: 'var(--border-color)' }}>CTRL + /</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Icons & Profile */}
            <div className="flex items-center gap-3">
                {/* Add New Dropdown */}
                <div className="relative z-50">
                    <button
                        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm shadow-sm"
                        onClick={() => setShowDropdown(showDropdown === 'add_new' ? null : 'add_new')}
                    >
                        <PlusCircle className="w-4 h-4" /> Add New
                    </button>

                    {showDropdown === 'add_new' && (
                        <div
                            className="absolute right-0 mt-2 w-[550px] bg-white rounded-xl shadow-2xl border p-4 z-50 animate-in fade-in zoom-in-95 duration-100"
                        >
                            <div className="grid grid-cols-6 gap-4">
                                {[
                                    { label: 'Category', icon: Grid, color: 'text-blue-500', bg: 'bg-blue-50' },
                                    { label: 'Product', icon: Box, color: 'text-orange-500', bg: 'bg-orange-50' },
                                    { label: 'Purchase', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-50' },
                                    { label: 'Sale', icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50' },
                                    { label: 'Expense', icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
                                    { label: 'Quotation', icon: File, color: 'text-teal-500', bg: 'bg-teal-50' },
                                    { label: 'Return', icon: RotateCcw, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                                    { label: 'User', icon: User, color: 'text-pink-500', bg: 'bg-pink-50' },
                                    { label: 'Customer', icon: Users, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                                    { label: 'Biller', icon: FileCheck, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                                    { label: 'Supplier', icon: Truck, color: 'text-gray-500', bg: 'bg-gray-50' },
                                    { label: 'Transfer', icon: ArrowRightLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                                ].map((item, index) => (
                                    <button key={index} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                                        <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Trial Status Badge (Compact) */}
                {user?.daysLeft !== undefined && user?.tenantStatus === 'trial' && (
                    <div className="hidden lg:flex items-center gap-1.5 badge-trial px-3 py-1 rounded-full text-xs font-semibold">
                        <Lightbulb className="w-3 h-3" />
                        <span>{user.daysLeft} Days Left</span>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <button className="p-2 text-muted hover:bg-main-app rounded-lg transition-colors" title="Expand">
                        <Maximize className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-muted hover:bg-main-app rounded-lg transition-colors relative" title="Messages">
                        <MessageSquare className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 text-muted hover:bg-main-app rounded-lg transition-colors relative" title="Notifications">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button className="p-2 text-muted hover:bg-main-app rounded-lg transition-colors" title="Settings">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center gap-3 hover:bg-main-app p-1.5 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(showDropdown === 'profile' ? null : 'profile')}
                    >
                        <div className="w-9 h-9 rounded bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200">
                            <img src="https://dreamspos.com/img/user-01.jpg" alt="user" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = '' }} />
                            {!user?.name && <span className="text-orange-500 font-bold">A</span>}
                        </div>
                    </button>

                    {showDropdown === 'profile' && (
                        <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl border py-1 z-50 animate-in fade-in zoom-in-95 duration-100" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="px-4 py-3 border-b bg-main-app" style={{ borderColor: 'var(--border-color)' }}>
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-muted truncate">{user?.email || 'admin@qsr.com'}</p>
                            </div>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-main-app flex items-center gap-2">
                                <User className="w-4 h-4" /> Profile
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-main-app flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Settings
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                                onClick={() => {
                                    logout();
                                    setShowDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
