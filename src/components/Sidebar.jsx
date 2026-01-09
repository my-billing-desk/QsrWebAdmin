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
                className={`w-full justify-between group relative
                    ${active && !hasSubItems
                        ? 'sidebar-item-active'
                        : 'sidebar-item'
                    }
                    ${item.forceExpanded ? 'cursor-default' : 'cursor-pointer'}
                `}
                title={!isSidebarOpen ? item.label : ''}
            >
                <div className={`flex items-center w-full overflow-hidden`}>
                    {Icon && (
                        <Icon className={`sidebar-icon`} />
                    )}

                    {isSidebarOpen && (
                        <>
                            <span className={`truncate text-sm flex-1 text-left tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
                                {item.label}
                            </span>
                            {item.badge && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded badge-primary font-bold ml-2 shadow-sm">
                                    {item.badge}
                                </span>
                            )}
                        </>
                    )}
                </div>
                {hasSubItems && isSidebarOpen && !item.forceExpanded && (
                    <div className="ml-2 shrink-0 transition-transform duration-200">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
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
            <div className={`h-16 shrink-0 flex items-center ${isOpen ? 'px-4' : 'justify-center'} border-b border-gray-200`}>
                <div className={`flex items-center w-full ${isOpen ? 'gap-3' : 'justify-center'}`}>
                    {/* Logo - retained SmartHR style but adaptable */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md bg-indigo-600`}>
                        <Store className="w-5 h-5" />
                    </div>

                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-gray-900 text-lg leading-tight truncate">SmartQSR</span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider truncate">
                                {user?.tenantName || 'Admin Panel'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto sidebar-content scrollbar-hide">
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
                                    className={`sidebar-item justify-between w-full group mb-1 ${isMainExpanded ? 'bg-gray-50 text-gray-900' : 'text-gray-600'}`}
                                >
                                    <span className="text-sm font-medium">
                                        {group.title}
                                    </span>
                                    {group.id && (
                                        <div className="text-gray-400">
                                            {isMainExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
                <div className="space-y-1 pt-4 border-t border-gray-200 mt-2">
                    {isOpen && (
                        <div className="sidebar-item justify-between w-full mb-1 cursor-default">
                            <span className="text-sm font-medium text-gray-900">
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

            {/* Footer Actions */}
            <div className="p-4 border-t bg-gray-50 border-gray-200">
                <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shrink-0 border border-gray-200">
                        <UserCircle className="w-6 h-6" />
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-gray-900">{user?.name || 'User'}</p>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }}
                                className="text-xs font-medium flex items-center gap-1 mt-0.5 hover:underline text-status-error"
                            >
                                <LogOut className="w-3 h-3" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
