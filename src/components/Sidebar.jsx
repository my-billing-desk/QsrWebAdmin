import React from 'react';
import {
    LayoutDashboard, Receipt, UtensilsCrossed, Settings, LogOut,
    Users, FileText, Clock, ShoppingCart, BarChart3, BookOpen, UserCircle, Archive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function Sidebar({ activeTab, onTabChange }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

    const menuGroups = [
        {
            title: 'Dashboard',
            items: [
                { id: 'dashboard', path: '/', label: 'Overview', icon: LayoutDashboard },
            ]
        },
        {
            title: 'Modules',
            items: [
                { id: 'inventory', path: '/inventory', label: 'Inventory Management', icon: Archive },
            ]
        },
        {
            title: 'Daily Operations',
            items: [
                { id: 'running_orders', path: '/orders/running', label: 'Running Orders', icon: Clock },
                { id: 'all_orders', path: '/orders', label: 'All Orders', icon: FileText },
                { id: 'online_orders', path: '/orders/online', label: 'Online Orders', icon: ShoppingCart },
            ]
        },
        {
            title: 'Master',
            items: [
                { id: 'menu', path: '/menu', label: 'Menu Management', icon: UtensilsCrossed },
                { id: 'manage_customer', path: '/manage-customer', label: 'Manage Customer', icon: Users },
                { id: 'employee', path: '/employees', label: 'Employee', icon: UserCircle },
            ]
        },
        {
            title: 'Consumption',
            items: [
                { id: 'sales_consumption', path: '/consumption/sales', label: 'Sales', icon: BarChart3 },
            ]
        },
        {
            title: 'Accounting',
            items: [
                { id: 'ledger', path: '/accounting/ledger', label: 'Ledger', icon: BookOpen },
            ]
        },
        {
            title: 'Management',
            items: [
                { id: 'user_master', path: '/users', label: 'User Management', icon: Users },
                { id: 'settings', path: '/settings', label: 'Store Settings', icon: Settings },
            ]
        }
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (onTabChange) onTabChange(path);
    };

    return (
        <div className="h-screen py-4 pl-4 shrink-0 flex flex-col z-20">
            {/* Floating Container */}
            <div className="w-64 h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-3xl flex flex-col shadow-2xl transition-all duration-300">

                {/* Header */}
                <div className="h-20 shrink-0 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center text-white font-display font-bold text-xl">
                            Q
                        </div>
                        <span className="font-display font-bold text-xl text-gray-800 dark:text-gray-100 tracking-tight">QSR Admin</span>
                    </div>
                </div>

                {/* Scrollable Nav */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                    {menuGroups.map((group, idx) => (
                        <div key={idx} className="space-y-1">
                            <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider font-display">
                                {group.title}
                            </h3>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => handleNavigation(item.path)}
                                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative
                                                ${active
                                                    ? 'bg-primary-50 text-primary-600 shadow-sm shadow-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:shadow-none font-semibold'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200 font-medium'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 shrink-0 transition-colors ${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
                                            <span className="truncate text-sm">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
                    <button
                        onClick={logout}
                        className="w-full flex items-center p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="ml-3 font-medium text-sm">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
