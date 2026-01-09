import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Store, ChevronDown, Lightbulb, Bell, Link as LinkIcon, Settings, Grid, LogOut, User, FileText, Monitor, Search, Maximize, MessageSquare, PlusCircle, Box, ShoppingBag, ShoppingCart, FileCheck, Truck, ArrowRightLeft, RotateCcw, Users, File, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { initialMenuGroups } from '../context/QuickLinksContext';

export function Header({ onToggleSidebar, title, searchData = [] }) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const profileDropdownRef = useRef(null);
    const addDropdownRef = useRef(null);
    const searchInputRef = useRef(null);
    const searchDropdownRef = useRef(null);

    // Flatten menu items for search
    const allNavItems = React.useMemo(() => {
        const items = [];
        const traverse = (groups) => {
            groups.forEach(group => {
                if (group.path && group.label) items.push({ label: group.label, path: group.path });
                if (group.items) traverse(group.items);
            });
        };
        traverse(initialMenuGroups);
        return items;
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        const handleClickOutside = (event) => {
            if (showDropdown === 'profile' && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowDropdown(null);
            }
            if (showDropdown === 'add_new' && addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
                setShowDropdown(null);
            }
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setSearchResults([]);
                setSearchQuery('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    // Handle Search
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        // Combine dynamically extracted routes with any passed searchData
        // Filter out duplicates based on path
        const allRoutes = [...searchData, ...allNavItems].reduce((acc, current) => {
            const x = acc.find(item => item.path === current.path);
            if (!x && current.path) { // Ensure path exists
                return acc.concat([current]);
            } else {
                return acc;
            }
        }, []);

        const results = allRoutes.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
    };

    const handleResultClick = (path) => {
        navigate(path);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <header
            className="h-16 flex items-center justify-between px-6 shrink-0 z-30 bg-white border-b border-gray-200"
        >
            {/* Left Section: Search */}
            <div className="flex items-center gap-4 flex-1 max-w-sm">
                <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-900 md:hidden">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="relative w-full hidden md:block" ref={searchDropdownRef}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-500" />
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors"
                        placeholder="Search..."
                    />

                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 max-h-64 overflow-y-auto">
                            {searchResults.map((result, idx) => (
                                <button
                                    key={idx}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 group"
                                    onClick={() => handleResultClick(result.path)}
                                >
                                    <span className="p-1 bg-gray-100 rounded text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <ArrowRightLeft className="w-3 h-3" />
                                    </span>
                                    {result.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Section: Icons & Profile */}
            <div className="flex items-center gap-3">
                {/* Add New Dropdown */}
                <div className="relative z-50" ref={addDropdownRef}>
                    <button
                        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all font-semibold text-sm shadow-sm active:scale-95"
                        onClick={() => setShowDropdown(showDropdown === 'add_new' ? null : 'add_new')}
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Add New</span>
                    </button>

                    {showDropdown === 'add_new' && (
                        <div
                            className="absolute right-0 mt-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
                        >
                            <div className="grid grid-cols-4 gap-4">
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
                                        <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-105 transition-all`}>
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
                    <button
                        onClick={() => {
                            if (!document.fullscreenElement) {
                                document.documentElement.requestFullscreen();
                            } else {
                                if (document.exitFullscreen) {
                                    document.exitFullscreen();
                                }
                            }
                        }}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Expand"
                    >
                        <Maximize className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate('/logs/support')}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors relative"
                        title="Messages"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button
                        onClick={() => setShowNotifications(true)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors relative"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </div>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                    <button
                        className="flex items-center gap-3 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                        onClick={() => setShowDropdown(showDropdown === 'profile' ? null : 'profile')}
                    >
                        <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 text-gray-600">
                            <User className="w-5 h-5" />
                        </div>
                    </button>

                    {showDropdown === 'profile' && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@qsr.com'}</p>
                            </div>
                            <button
                                onClick={() => { setShowDropdown(null); navigate('/users/admin'); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <User className="w-4 h-4" /> Profile
                            </button>
                            <button
                                onClick={() => { setShowDropdown(null); navigate('/settings'); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
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

            {/* Notification Sidebar */}
            {showNotifications && (
                <>
                    <div
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setShowNotifications(false)}
                    ></div>
                    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-200 flex flex-col border-l border-gray-200">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-900">Notifications</h3>
                                <p className="text-xs text-gray-500 mt-0.5">You have 3 unread messages</p>
                            </div>
                            <button
                                onClick={() => setShowNotifications(false)}
                                className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {[
                                {
                                    title: "New Order Received",
                                    desc: "Order #1234 from Table 5 requires attention.",
                                    time: "2 mins ago",
                                    type: "order",
                                    color: "bg-blue-50 text-blue-600"
                                },
                                {
                                    title: "Low Stock Alert",
                                    desc: "Tomato stock is running low (below 5kg).",
                                    time: "1 hour ago",
                                    type: "alert",
                                    color: "bg-red-50 text-red-600"
                                },
                                {
                                    title: "Daily Report Ready",
                                    desc: "Yesterday's sales report is ready for download.",
                                    time: "5 hours ago",
                                    type: "info",
                                    color: "bg-green-50 text-green-600"
                                },
                                {
                                    title: "System Update",
                                    desc: "New feature deployed: Advanced Analytics.",
                                    time: "1 day ago",
                                    type: "system",
                                    color: "bg-purple-50 text-purple-600"
                                }
                            ].map((note, idx) => (
                                <div key={idx} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 items-start cursor-pointer">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${note.color}`}>
                                        <Bell className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{note.title}</h4>
                                        <p className="text-sm text-gray-600 mt-0.5 leading-snug">{note.desc}</p>
                                        <span className="text-xs text-gray-400 mt-1.5 block">{note.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                            <button className="w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                                View all notifications
                            </button>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
