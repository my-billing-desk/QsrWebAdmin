import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Store, ChevronDown, Lightbulb, Bell, Link as LinkIcon, Settings, Grid, LogOut, User, FileText, Monitor, Search, Maximize, MessageSquare, PlusCircle, Box, ShoppingBag, ShoppingCart, FileCheck, Truck, ArrowRightLeft, RotateCcw, Users, File } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header({ onToggleSidebar }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(null);
    const profileDropdownRef = useRef(null);
    const addDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (showDropdown === 'profile' && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowDropdown(null);
            }
            if (showDropdown === 'add_new' && addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
                setShowDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

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
                        <span className="bg-blue-50/80 text-blue-400 text-[10px] font-black border border-blue-100 rounded-md px-1.5 py-0.5 tracking-tight">CTRL + /</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Icons & Profile */}
            <div className="flex items-center gap-3">
                {/* Add New Dropdown */}
                <div className="relative z-50" ref={addDropdownRef}>
                    <button
                        className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-[#f9a01b] hover:bg-[#e89112] text-white rounded-xl transition-all font-black text-sm shadow-lg shadow-orange-500/20 active:scale-95 border-2 border-transparent hover:border-orange-300/30"
                        onClick={() => setShowDropdown(showDropdown === 'add_new' ? null : 'add_new')}
                    >
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white/50">
                            <PlusCircle className="w-3 h-3 fill-white" />
                        </div>
                        <span className="tracking-tight">Add New</span>
                    </button>

                    {showDropdown === 'add_new' && (
                        <div
                            className="absolute right-0 mt-4 w-[680px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300"
                        >
                            <div className="grid grid-cols-6 gap-y-10 gap-x-2">
                                {[
                                    { label: 'Category', icon: Grid, color: 'text-blue-500', bg: 'bg-blue-50', path: '/menu' },
                                    { label: 'Product', icon: Box, color: 'text-orange-500', bg: 'bg-orange-50', path: '/menu' },
                                    { label: 'Purchase', icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-50', path: '/inventory/purchase' },
                                    { label: 'Sale', icon: ShoppingCart, color: 'text-violet-500', bg: 'bg-violet-100', path: '/orders' },
                                    { label: 'Expense', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-50', path: '/financial/expenses' },
                                    { label: 'Quotation', icon: File, color: 'text-teal-500', bg: 'bg-teal-50', path: '/inventory/purchase-order' },
                                    { label: 'Return', icon: RotateCcw, color: 'text-indigo-500', bg: 'bg-indigo-50', path: '/inventory/purchase-return' },
                                    { label: 'User', icon: User, color: 'text-pink-500', bg: 'bg-pink-50', path: '/users' },
                                    { label: 'Customer', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50', path: '/crm/customers' },
                                    { label: 'Biller', icon: FileCheck, color: 'text-cyan-500', bg: 'bg-cyan-50', path: '/users/biller' },
                                    { label: 'Supplier', icon: Truck, color: 'text-slate-400', bg: 'bg-slate-50', path: '/config/outlet' },
                                    { label: 'Transfer', icon: ArrowRightLeft, color: 'text-green-500', bg: 'bg-green-50', path: '/inventory/transfer' },
                                ].map((item, index) => (
                                    <button
                                        key={index}
                                        className="flex flex-col items-center gap-3 transition-all group"
                                        onClick={() => {
                                            navigate(item.path);
                                            setShowDropdown(null);
                                        }}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:shadow-lg transition-all shadow-sm border border-transparent`}>
                                            <item.icon className="w-6 h-6 stroke-[2.5]" />
                                        </div>
                                        <span className="text-[13px] font-black text-gray-500 tracking-tight">{item.label}</span>
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
                <div className="relative" ref={profileDropdownRef}>
                    <button
                        className="flex items-center gap-3 hover:bg-main-app p-1.5 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(showDropdown === 'profile' ? null : 'profile')}
                    >
                        <div className="w-9 h-9 rounded bg-orange-100 flex items-center justify-center overflow-hidden border border-orange-200 text-orange-600">
                            <User className="w-5 h-5" />
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
