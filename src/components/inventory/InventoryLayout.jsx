import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Archive, FileText, ChevronRight, ChevronDown,
    Settings, BarChart3, Users, Factory, ArrowLeft
} from 'lucide-react';
import { GeminiSupport } from '../GeminiSupport';

export function InventoryLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // State for expanded menu groups
    const [expandedGroups, setExpandedGroups] = useState({
        'Purchase': true,
        'Manage Stock': false,
        'Consumption': false,
        'Production': false,
        'Reports': false,
        'Masters': true
    });

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            group: 'Main',
            items: [
                { label: 'Back To Billing', icon: ArrowLeft, path: '/' },
                { label: 'Dashboard', icon: LayoutDashboard, path: '/inventory/dashboard' },
            ]
        },
        {
            group: 'Purchase',
            icon: ShoppingCart,
            items: [
                { label: 'Stock Purchase', path: '/inventory/purchase' },
                { label: 'Purchase Order', path: '/inventory/purchase-order' },
            ]
        },
        {
            group: 'Manage Stock',
            icon: Archive,
            items: [
                { label: 'Available Stock', path: '/inventory/stock/available' },
                { label: 'Closing Stock', path: '/inventory/stock/closing' },
            ]
        },
        {
            group: 'Consumption',
            icon: BarChart3,
            items: [
                // { label: 'Sales', path: '/inventory/consumption/sales' },
                { label: 'Transfer', path: '/inventory/transfer' },
                { label: 'Wastage', path: '/inventory/wastage' },
            ]
        },
        {
            group: 'Production',
            icon: Factory,
            items: [
                { label: 'Production Entry', path: '/inventory/production' },
            ]
        },
        {
            group: 'Reports',
            icon: FileText,
            items: [
                { label: 'Inventory Reports', path: '/inventory/reports' },
                { label: 'Stock Summary', path: '/inventory/reports/stock-summary' },
            ]
        },
        {
            group: 'Masters',
            icon: Settings,
            items: [
                { label: 'Raw Materials', path: '/inventory/raw-materials' },
                { label: 'Recipes', path: '/inventory/recipes' },
                { label: 'Preferences', path: '/inventory/preferences' },
                { label: 'Settings', path: '/inventory/settings' },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FC] dark:bg-gray-900 overflow-hidden font-sans">
            {/* Inventory Sidebar */}
            <div className="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-y-auto shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
                {/* Header */}
                <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-700 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white">
                            <Archive className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg text-gray-800 dark:text-white tracking-tight">Inventory</span>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((section, idx) => {
                        if (section.group === 'Main') {
                            return section.items.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl mb-1 transition-all duration-200 group ${isActive(item.path)
                                        ? 'bg-gradient-to-r from-rose-50 to-white border border-rose-100 dark:from-rose-900/20 dark:to-transparent dark:border-rose-800 shadow-sm text-rose-600 dark:text-rose-400 font-bold'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white font-medium'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive(item.path) ? 'text-rose-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ));
                        }

                        // Collapsible Groups
                        const isExpanded = expandedGroups[section.group];
                        const GroupIcon = section.icon;

                        return (
                            <div key={section.group} className="mb-2">
                                <button
                                    onClick={() => toggleGroup(section.group)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isExpanded ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <GroupIcon className={`w-5 h-5 mr-3 ${isExpanded ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`} />
                                        <span className="text-sm font-bold tracking-wide">{section.group}</span>
                                    </div>
                                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    <div className="ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700 space-y-1 py-1">
                                        {section.items.map(item => (
                                            <button
                                                key={item.path}
                                                onClick={() => navigate(item.path)}
                                                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm transition-all relative ${isActive(item.path)
                                                    ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/50 dark:bg-rose-900/10'
                                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                                    }`}
                                            >
                                                {isActive(item.path) && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-rose-500 rounded-full -ml-[18px]"></div>
                                                )}
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area for Inventory Sub-routes */}
            <div className="flex-1 overflow-auto p-6 scroll-smooth">
                {/* Soft background gradient for main area */}
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/30 via-white to-rose-50/30 dark:from-gray-900 dark:to-gray-800 -z-10 pointer-events-none"></div>
                <Outlet />
            </div>

            <GeminiSupport />
        </div>
    );
}
