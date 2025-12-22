import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Archive, FileText, ChevronRight, ChevronDown,
    Settings, BarChart3, Users, Factory, ArrowLeft
} from 'lucide-react';

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
                { label: 'Purchase Return', path: '/inventory/purchase-return' },
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
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Inventory Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full overflow-y-auto shrink-0 z-20 shadow-xl">
                <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 bg-red-600 text-white">
                    <span className="font-bold text-lg">Inventory</span>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((section, idx) => {
                        if (section.group === 'Main') {
                            return section.items.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center p-2 rounded-lg mb-1 transition-colors ${isActive(item.path) ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
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
                                    className="w-full flex items-center justify-between p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <GroupIcon className="w-5 h-5 mr-3" />
                                        <span className="text-sm font-medium">{section.group}</span>
                                    </div>
                                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>

                                {isExpanded && (
                                    <div className="ml-4 pl-4 border-l border-gray-200 mt-1 space-y-1">
                                        {section.items.map(item => (
                                            <button
                                                key={item.path}
                                                onClick={() => navigate(item.path)}
                                                className={`w-full flex items-center p-2 rounded-lg text-sm transition-colors ${isActive(item.path) ? 'text-red-600 bg-red-50 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content Area for Inventory Sub-routes */}
            <div className="flex-1 overflow-auto p-6">
                <Outlet />
            </div>
        </div>
    );
}
