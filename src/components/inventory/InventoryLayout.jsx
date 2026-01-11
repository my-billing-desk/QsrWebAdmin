import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Archive, FileText, ChevronRight, ChevronDown,
    Settings, BarChart3, Users, Factory, ArrowLeft
} from 'lucide-react';


import { Header } from '../Header';

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

    // Auto-expand group containing active link
    useEffect(() => {
        const currentGroup = navItems.find(group =>
            group.items?.some(item => location.pathname === item.path)
        );
        if (currentGroup) {
            setExpandedGroups(prev => ({ ...prev, [currentGroup.group]: true }));
        }
    }, [location.pathname]);

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
                { label: 'Purchase Order', path: '/inventory/purchase-order' },
                { label: 'Stock Purchase', path: '/inventory/purchase' },
                { label: 'Purchase Return', path: '/inventory/purchase-return' },
            ]
        },
        {
            group: 'Manage Stock',
            icon: Archive,
            items: [
                { label: 'Inventory', path: '/inventory/stock/available' },
                { label: 'Closing Stock', path: '/inventory/stock/closing' },
            ]
        },
        {
            group: 'Consumption',
            icon: BarChart3,
            items: [
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
                { label: 'Current Stock', path: '/inventory/reports/current-stock' },
                { label: 'Stock History', path: '/inventory/reports/stock-history' },
                { label: 'Consumption Summary', path: '/inventory/reports/consumption-summary' },
                { label: 'Orderwise Consumption', path: '/inventory/reports/order-consumption' },
                { label: 'Daily Consumption', path: '/inventory/reports/daily-consumption' },
                { label: 'Material Purchase', path: '/inventory/reports/material-purchase' },
                { label: 'Opening - Closing Stock', path: '/inventory/reports/opening-closing' },
                { label: 'Recipe Costing', path: '/inventory/reports/recipe-costing' },
                { label: 'Transfer Payment', path: '/inventory/reports/transfer-payment' },
                { label: 'Supplier Payment', path: '/inventory/reports/supplier-payment' },
                { label: 'Material Transfer', path: '/inventory/reports/material-transfer' },
                { label: 'PO Variance', path: '/inventory/reports/po-variance' },
                { label: 'Purchase-Sales Return', path: '/inventory/reports/purchase-sales-return' },
                { label: 'Sales/Transfer Variance', path: '/inventory/reports/sales-transfer-variance' },
                { label: 'PO Received', path: '/inventory/reports/po-received' },
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

    const getTitle = () => {
        const currentItem = navItems
            .flatMap(g => g.items)
            .find(i => i.path === location.pathname);
        return currentItem ? currentItem.label : 'Inventory';
    };

    const flattenedSearchItems = navItems.flatMap(group =>
        group.items.map(item => ({ label: item.label, path: item.path }))
    );

    return (
        <div className="flex h-screen font-sans overflow-hidden bg-gray-50">
            {/* Inventory Sidebar */}
            <div className="w-64 flex flex-col h-full overflow-y-auto shrink-0 z-30 shadow-sm transition-all border-r bg-white border-gray-200">
                {/* Header */}
                <div className="h-16 flex items-center px-4 border-b border-gray-200 sticky top-0 z-10 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg text-white bg-indigo-600">
                            <Archive className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-900">Inventory</span>
                    </div>
                </div>

                <nav className="sidebar-content">
                    {navItems.map((section, idx) => {
                        if (section.group === 'Main') {
                            return section.items.map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full ${isActive(item.path) ? 'sidebar-item-active' : 'sidebar-item'}`}
                                >
                                    <item.icon className="sidebar-icon" />
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
                                    className={`sidebar-item justify-between w-full group ${isExpanded ? 'bg-gray-50 text-gray-900' : ''}`}
                                >
                                    <div className="flex items-center w-full">
                                        <GroupIcon className="sidebar-icon" />
                                        <span className="text-sm font-medium">{section.group}</span>
                                    </div>
                                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    <div className="ml-6 pl-2 border-l-2 space-y-0.5 py-1 border-gray-100">
                                        {section.items.map(item => (
                                            <button
                                                key={item.path}
                                                onClick={() => navigate(item.path)}
                                                className={`w-full flex items-center rounded-lg text-sm transition-all relative py-2 pl-3 ${isActive(item.path) ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:bg-gray-50'}`}
                                            >
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

            {/* Main Content Area with Header */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-300">
                <Header
                    title={getTitle()}
                    onToggleSidebar={() => { }}
                    searchData={flattenedSearchItems}
                />
                <main className="flex-1 overflow-auto p-6 scroll-smooth bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
