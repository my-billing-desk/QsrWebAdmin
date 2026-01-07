import React, { useState, useEffect } from 'react';
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
                { label: 'Sales', path: '/inventory/reports' }, // Placeholder for Sales reports
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
                { label: 'Stock History', path: '/inventory/reports/stock-history' },
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
        <div className="flex h-screen font-sans overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Inventory Sidebar */}
            <div className="w-72 flex flex-col h-full overflow-y-auto shrink-0 z-30 shadow-sm transition-all border-r" style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}>
                {/* Header */}
                <div className="h-20 flex items-center px-6 border-b sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                            <Archive className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--text-main)' }}>Inventory</span>
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
                                        ? 'shadow-sm font-bold'
                                        : 'font-medium hover:bg-gray-50'
                                        }`}
                                    style={isActive(item.path) ? {
                                        backgroundColor: 'var(--sidebar-active)',
                                        color: 'var(--sidebar-active-text)',
                                        border: '1px solid var(--color-primary)'
                                    } : {
                                        color: 'var(--sidebar-text)'
                                    }}
                                >
                                    <item.icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110`}
                                        style={{ color: isActive(item.path) ? 'var(--sidebar-active-text)' : 'var(--sidebar-text)' }}
                                    />
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
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors hover:bg-gray-50`}
                                    style={{ color: isExpanded ? 'var(--text-main)' : 'var(--text-muted)' }}
                                >
                                    <div className="flex items-center">
                                        <GroupIcon className={`w-5 h-5 mr-3`} style={{ color: isExpanded ? 'var(--text-main)' : 'var(--text-light)' }} />
                                        <span className="text-sm font-bold tracking-wide">{section.group}</span>
                                    </div>
                                    <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-light)' }} />
                                    </div>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    <div className="ml-4 pl-4 border-l-2 space-y-1 py-1" style={{ borderColor: 'var(--border-color)' }}>
                                        {section.items.map(item => (
                                            <button
                                                key={item.path}
                                                onClick={() => navigate(item.path)}
                                                className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm transition-all relative hover:bg-gray-50`}
                                                style={isActive(item.path) ? {
                                                    color: 'var(--color-primary)',
                                                    fontWeight: 'bold',
                                                    backgroundColor: 'var(--sidebar-active)'
                                                } : {
                                                    color: 'var(--text-muted)'
                                                }}
                                            >
                                                {isActive(item.path) && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full -ml-[18px]" style={{ backgroundColor: 'var(--color-primary)' }}></div>
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
            <div className="flex-1 overflow-auto p-6 scroll-smooth" style={{ backgroundColor: 'var(--bg-main)' }}>
                <Outlet />
            </div>
        </div>
    );
}
