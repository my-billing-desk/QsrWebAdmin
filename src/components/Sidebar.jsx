import React, { useState, useEffect } from 'react';
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
const SidebarItem = ({ item, isActive, onNavigate, expandedGroups, toggleGroup, isSidebarOpen }) => {
    const Icon = item.icon;
    const active = item.path ? isActive(item.path) : false;
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = item.forceExpanded || expandedGroups[item.id];

    if (!isSidebarOpen) return null; // Simplified: Main sidebar items handle opacity/width in parent, but recursing hidden items is pointless

    return (
        <div className="w-full">
            <button
                onClick={() => {
                    if (!isSidebarOpen) return;
                    if (item.forceExpanded) return;
                    hasSubItems ? toggleGroup(item.id) : onNavigate(item.path);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group relative mb-0.5
                    ${active && !hasSubItems
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${item.forceExpanded ? 'cursor-default' : 'cursor-pointer'}
                `}
                title={!isSidebarOpen ? item.label : ''}
            >
                <div className="flex items-center min-w-0">
                    {Icon && (
                        <Icon className={`w-4.5 h-4.5 shrink-0 ${active && !hasSubItems ? 'text-blue-600' : 'text-gray-400 opacity-70 group-hover:opacity-100'}`} />
                    )}

                    {isSidebarOpen && (
                        <span className={`ml-3 truncate text-sm tracking-wide ${active ? 'font-bold' : 'font-medium'}`}>
                            {item.label}
                        </span>
                    )}
                </div>
                {hasSubItems && isSidebarOpen && !item.forceExpanded && (
                    <div className="ml-2 shrink-0">
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                )}
            </button>

            {hasSubItems && isExpanded && isSidebarOpen && (
                <div className="ml-6 pl-2 border-l-2 border-gray-100 dark:border-gray-800 space-y-0.5 py-1 mt-1 transition-all">
                    {item.items.map((subItem, idx) => (
                        <SidebarItem
                            key={subItem.id || idx}
                            item={subItem}
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
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { menuLayout, quickLinks } = useQuickLinks();

    const [expandedGroups, setExpandedGroups] = useState({});
    const [expandedMainGroups, setExpandedMainGroups] = useState({
        'group_dashboard': true,
        'group_management': true,
        'group_menu': true,
        'group_inventory': true,
        'group_crm': true,
        'group_reports_daily': true,
        'group_reports_stock': true,
        'group_promo': true,
        'group_financials': true,
        'group_purchases': true
    });

    // Auto-expand group containing active path
    useEffect(() => {
        const findAndExpand = (items, parentId = null) => {
            for (const item of items) {
                if (item.path && isActive(item.path)) {
                    if (parentId) return { parentId, isMain: false };
                    return { isMain: true };
                }
                if (item.items) {
                    const found = findAndExpand(item.items, item.id);
                    if (found) {
                        return { ...found, subId: item.id };
                    }
                }
            }
            return null;
        };

        const expandSubIds = [];
        const expandMainIds = [];

        // Special case: Always keep daily_ops expanded on dashboard
        if (location.pathname === '/') {
            expandSubIds.push('daily_ops');
            expandMainIds.push('group_dashboard');
        }

        menuLayout.forEach(group => {
            const found = findAndExpand(group.items);
            if (found) {
                if (group.id) expandMainIds.push(group.id);
                if (found.parentId) expandSubIds.push(found.parentId);
                if (found.subId) expandSubIds.push(found.subId);
            }
        });

        if (expandSubIds.length > 0) {
            setExpandedGroups(prev => {
                const next = { ...prev };
                expandSubIds.forEach(id => {
                    if (!next[id]) next[id] = true;
                });
                return next;
            });
        }
        if (expandMainIds.length > 0) {
            setExpandedMainGroups(prev => {
                const next = { ...prev };
                expandMainIds.forEach(id => {
                    if (!next[id]) next[id] = true;
                });
                return next;
            });
        }
    }, [location.pathname, menuLayout]);

    const toggleMainGroup = (groupId) => {
        setExpandedMainGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    const isActive = (path) => {
        if (!path) return false;
        return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
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

    return (
        <div
            className={`h-screen flex flex-col z-20 transition-all duration-300 bg-white border-r border-gray-200 shrink-0 ${isOpen ? 'w-64' : 'w-20'}`}
        >

            {/* Header / Logo Area */}
            <div className={`h-16 shrink-0 flex items-center ${isOpen ? 'px-4' : 'justify-center'} border-b border-gray-100`}>
                <div className={`flex items-center w-full ${isOpen ? 'gap-3' : 'justify-center'}`}>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm bg-blue-600`}>
                        <Store className="w-5.5 h-5.5" />
                    </div>

                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="font-extrabold text-gray-900 text-[15px] leading-tight truncate">Aksha POS</h1>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">
                                ADMIN PANEL
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto sidebar-content scrollbar-hide py-4 px-2">
                {menuLayout.map((group, idx) => {
                    // Filter items based on user role
                    const permissionMap = {
                        user_mgmt: 25,
                        roles_config: 25,
                        subscription_plan: 12,
                        menu_discounts: 2,
                        special_note: 28,
                        inventory_main: 14,
                        coupons: 11,
                        gift_cards: 11,
                        discount_plan: 11,
                        discount: 11,
                        crm_mkt: 1,
                        crm_cust: 6
                    };

                    const hasPermission = (itemId) => {
                        if (!user) return false;
                        if (user.role === 'super_admin') return true;

                        const permId = permissionMap[itemId];
                        if (!permId) return true; // Default allow if not restricted

                        return user.permissions?.some(p => p.id === permId && (p.read || p.write || p.value));
                    };

                    const filteredItems = group.items.filter(item => {
                        if (!hasPermission(item.id)) return false;

                        // Recursive check for sub-items
                        if (item.items) {
                            item.items = item.items.filter(sub => hasPermission(sub.id));
                            return item.items.length > 0;
                        }

                        return true;
                    });

                    const isMainExpanded = !group.id || expandedMainGroups[group.id];

                    return (
                        <div key={idx} className="space-y-1">
                            {/* Group Title */}
                            {group.title && isOpen && (
                                <button
                                    onClick={() => group.id && toggleMainGroup(group.id)}
                                    className="w-full flex items-center justify-between px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-lg group mb-1 transition-colors"
                                >
                                    <span className="text-[11px] font-black uppercase tracking-widest text-gray-900 group-hover:text-gray-900">
                                        {group.title}
                                    </span>
                                    {group.id && (
                                        <div className="text-gray-400">
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMainExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    )}
                                </button>
                            )}

                            <div className={`space-y-0.5 transition-all duration-300 overflow-hidden ${(!isOpen || !isMainExpanded) && group.id ? 'max-h-0' : 'max-h-[2000px]'}`}>
                                {filteredItems.map((item, iIdx) => (
                                    <SidebarItem
                                        key={item.id || iIdx}
                                        item={item}
                                        isActive={isActive}
                                        onNavigate={handleNavigation}
                                        expandedGroups={expandedGroups}
                                        toggleGroup={toggleGroup}
                                        isSidebarOpen={isOpen}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {/* Quick Links Section */}
                <div className="space-y-1 pt-6 border-t border-gray-100 mt-4 px-2">
                    {isOpen && (
                        <div className="flex items-center justify-between px-3 py-2 mb-1 cursor-default">
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                                Quick Links
                            </span>
                            <button
                                onClick={() => handleNavigation('/quick-links')}
                                className="flex items-center gap-1 text-[10px] font-bold hover:text-orange-600 transition-colors text-indigo-600"
                            >
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>
                    )}

                    <div className="space-y-0.5">
                        {quickLinks.map((link, idx) => (
                            <SidebarItem
                                key={`ql_${link.id}`}
                                item={{ ...link, icon: Zap }} // Using Zap icon for all quick links
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

        </div>
    );
}
