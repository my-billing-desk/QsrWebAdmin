import React, { useState } from 'react';
import {
    LayoutDashboard, Receipt, UtensilsCrossed, Settings, LogOut,
    Users, FileText, Clock, ShoppingCart, BarChart3, BookOpen, UserCircle, Archive,
    ChevronDown, ChevronRight, Calculator, Briefcase, Share2, MessageSquare, Zap,
    CreditCard, Landmark, FileSpreadsheet, Truck, Bell, Shield, Smartphone, Box, Layers, Store, Menu,
    Plus, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuickLinks } from '../context/QuickLinksContext';

// Recursive Sidebar Item Component
const SidebarItem = ({ item, depth = 0, isActive, onNavigate, expandedGroups, toggleGroup, isSidebarOpen }) => {
    const Icon = item.icon;
    const active = item.path ? isActive(item.path) : false;
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = item.forceExpanded || expandedGroups[item.id];

    // Indentation logic
    // If sidebar is closed, we don't indent deeply or verify design - often collapsed sidebars show submenus on hover/popover.
    // For now, if collapsed, we hide text.
    const basePadding = 0.75; // rem
    const depthPadding = depth * 1.0; // rem
    const totalPadding = isSidebarOpen ? basePadding + depthPadding : 0.75; // constant padding if closed

    if (!isSidebarOpen && depth > 0) return null; // Simple approach: Hide subitems if sidebar closed for now or rely on hover popovers (complex).
    // Better approach for simplest MVP request "hide showing icons": show top level icons only.

    return (
        <div className="w-full">
            <button
                onClick={() => {
                    if (!isSidebarOpen) return; // or expand sidebar
                    if (item.forceExpanded) return; // Prevent collapse if forced
                    hasSubItems ? toggleGroup(item.id) : onNavigate(item.path);
                }}
                className={`w-full flex items-center justify-between py-1.5 px-3 rounded-lg transition-all duration-200 group relative
                    ${active && !hasSubItems
                        ? 'bg-red-50 text-red-600 shadow-sm shadow-red-100 dark:bg-red-900/20 dark:text-red-400 dark:shadow-none font-semibold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200 font-medium'
                    }
                    ${!isSidebarOpen ? 'justify-center' : ''}
                    ${item.forceExpanded ? 'cursor-default' : 'cursor-pointer'}
                `}
                style={{ paddingLeft: isSidebarOpen ? `${totalPadding}rem` : '0.75rem' }}
                title={!isSidebarOpen ? item.label : ''}
            >
                <div className={`flex items-center gap-2.5 w-full overflow-hidden ${!isSidebarOpen ? 'justify-center' : ''}`}>
                    {Icon && (
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${active && !hasSubItems ? 'text-red-600 dark:text-red-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
                    )}

                    {isSidebarOpen && (
                        <>
                            <span className="truncate text-xs flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span className="text-[9px] px-1.5 py-0 rounded bg-blue-100 text-blue-600 font-bold ml-2">
                                    {item.badge}
                                </span>
                            )}
                        </>
                    )}
                </div>
                {hasSubItems && isSidebarOpen && !item.forceExpanded && (
                    <div className="ml-2 shrink-0">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    </div>
                )}
            </button>

            {hasSubItems && isExpanded && isSidebarOpen && (
                <div className="space-y-0.5 mt-0.5">
                    {item.items.map((subItem, idx) => (
                        <SidebarItem
                            key={subItem.id || idx}
                            item={subItem}
                            depth={depth + 1}
                            isActive={isActive}
                            onNavigate={onNavigate}
                            expandedGroups={expandedGroups}
                            toggleGroup={toggleGroup}
                            isSidebarOpen={isSidebarOpen}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export function Sidebar({ activeTab, onTabChange, isOpen = true, onToggleSidebar }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedGroups, setExpandedGroups] = useState({
        'daily_ops': true, // Default open for convenience
        'configuration': false
    });

    const isActive = (path) => {
        if (!path) return false;
        return location.pathname === path;
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const handleNavigation = (path) => {
        if (path) {
            navigate(path);
            if (onTabChange) onTabChange(path);
        }
    };

    const { menuLayout, quickLinks } = useQuickLinks();

    // Combined menu for rendering: Main Menu + Quick Links Integration
    // The user wants a "Quick Links" section. 
    // Screenshot 1 shows "Quick Links" with "+ Add" button.
    // Screenshot 2 shows "Quick Links" below "Aggregator Center" (which is likely part of the main menu).
    // I will append a "Quick Links" group to the rendered list or render it separately.

    // Let's render Quick Links separately after the main groups loop or as a special group.
    // Since we map over groups, mapping over Quick Links separately is cleaner.
    return (
        <div className={`h-screen flex flex-col z-20 transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shrink-0 ${isOpen ? 'w-64' : 'w-20'}`}>

            {/* Header */}
            <div className={`h-16 shrink-0 flex items-center ${isOpen ? 'px-6' : 'justify-center'} border-b border-gray-100 dark:border-gray-800/50`}>
                <div className={`flex items-center ${isOpen ? 'gap-6' : 'flex-col gap-4'}`}>
                    <button
                        onClick={onToggleSidebar}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-red-600"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className={`flex items-center gap-3 ${!isOpen && 'hidden'}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-lg shadow-red-500/30 flex items-center justify-center text-white font-display font-bold text-xl shrink-0">
                            <Store className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-[10px] font-bold text-gray-400 tracking-wider">MY POSS</span>
                            <span className="font-display font-bold text-xl text-gray-800 dark:text-gray-100 tracking-tight">POSS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                {menuLayout.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        {/* Group Title */}
                        {group.title && isOpen && (
                            <h3 className="px-3 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider font-display">
                                {group.title}
                            </h3>
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item, iIdx) => (
                                <SidebarItem
                                    key={item.id || iIdx}
                                    item={item}
                                    depth={0} // Top level
                                    isActive={isActive}
                                    onNavigate={handleNavigation}
                                    expandedGroups={expandedGroups}
                                    toggleGroup={toggleGroup}
                                    isSidebarOpen={isOpen}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Quick Links Section */}
                <div className="space-y-1 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {isOpen && (
                        <div className="flex items-center justify-between px-3 mb-2">
                            <h3 className="text-xs font-bold text-gray-800 dark:text-gray-200 font-display">
                                Quick Links
                            </h3>
                            <button
                                onClick={() => handleNavigation('/quick-links')}
                                className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full transition-colors"
                            >
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>
                    )}

                    <div className="space-y-0.5">
                        {quickLinks.map((link, idx) => (
                            <SidebarItem
                                key={`ql_${link.id}`}
                                item={{ ...link, icon: Zap }} // Force Zap icon for quick links
                                depth={0}
                                isActive={isActive}
                                onNavigate={handleNavigation}
                                expandedGroups={expandedGroups}
                                toggleGroup={toggleGroup}
                                isSidebarOpen={isOpen}
                            />
                        ))}
                    </div>
                </div>
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
                <button
                    onClick={logout}
                    className="w-full flex items-center p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all group"
                >
                    <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {isOpen && <span className="ml-3 font-medium text-sm">Logout</span>}
                </button>
            </div>
        </div>
    );
}
