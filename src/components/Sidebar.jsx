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
    const basePadding = 0.75; // rem
    const depthPadding = depth * 1.0; // rem
    const totalPadding = isSidebarOpen ? basePadding + depthPadding : 0.75;

    if (!isSidebarOpen && depth > 0) return null;

    return (
        <div className="w-full">
            <button
                onClick={() => {
                    if (!isSidebarOpen) return;
                    if (item.forceExpanded) return;
                    hasSubItems ? toggleGroup(item.id) : onNavigate(item.path);
                }}
                className={`w-full flex items-center justify-between py-2 transition-all duration-200 group relative
                    ${active && !hasSubItems
                        ? 'sidebar-item-active' // Semantic Active Class
                        : 'sidebar-item' // Semantic Inactive Class
                    }
                    ${!isSidebarOpen ? 'justify-center px-2' : ''}
                    ${item.forceExpanded ? 'cursor-default' : 'cursor-pointer'}
                `}
                style={{
                    paddingLeft: isSidebarOpen ? `${totalPadding}rem` : '0.75rem',
                    paddingRight: isSidebarOpen ? '0.75rem' : '0.75rem'
                }}
                title={!isSidebarOpen ? item.label : ''}
            >
                <div className={`flex items-center gap-3 w-full overflow-hidden ${!isSidebarOpen ? 'justify-center' : ''}`}>
                    {Icon && (
                        <Icon className={`w-5 h-5 shrink-0 transition-colors sidebar-icon`} />
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
                    <div className="ml-2 shrink-0 sidebar-icon opacity-70">
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </div>
                )}
            </button>

            {hasSubItems && isExpanded && isSidebarOpen && (
                <div className="space-y-0.5 mt-0.5 relative">
                    {/* Optional: Add a subtle connector line design if depth > 0, but sticking to clean style for now */}
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
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { menuLayout, quickLinks } = useQuickLinks();

    const [expandedGroups, setExpandedGroups] = useState({
        'daily_ops': true,
        'configuration': false
    });

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
            className={`h-screen flex flex-col z-20 transition-all duration-300 bg-sidebar border-r shrink-0 ${isOpen ? 'w-64' : 'w-20'}`}
            style={{ borderColor: 'var(--border-color)' }}
        >

            {/* Header / Logo Area */}
            <div className={`h-16 shrink-0 flex items-center ${isOpen ? 'px-4' : 'justify-center'} border-b`} style={{ borderColor: 'var(--border-color)' }}>
                <div className={`flex items-center w-full ${isOpen ? 'gap-3' : 'justify-center'}`}>
                    {/* Logo - retained SmartHR style but adaptable */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md`} style={{ backgroundColor: 'var(--color-primary)' }}>
                        <Store className="w-5 h-5" />
                    </div>

                    {isOpen && (
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-gray-900 text-lg leading-tight truncate" style={{ color: 'var(--text-main)' }}>SmartQSR</span>
                            <span className="text-[10px] text-muted font-medium uppercase tracking-wider truncate">
                                {user?.tenantName || 'Admin Panel'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Nav */}
            <nav className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-hide">
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

                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={idx} className="space-y-1">
                            {/* Group Title */}
                            {group.title && isOpen && (
                                <h3 className="px-5 mb-2 text-[11px] font-bold text-muted uppercase tracking-widest font-sans">
                                    {group.title}
                                </h3>
                            )}

                            <div className="space-y-0.5">
                                {filteredItems.map((item, iIdx) => (
                                    <SidebarItem
                                        key={item.id || iIdx}
                                        item={item}
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
                    );
                })}

                {/* Quick Links Section */}
                <div className="space-y-1 pt-4 border-t mx-4" style={{ borderColor: 'var(--border-color)' }}>
                    {isOpen && (
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="text-[11px] font-bold text-muted uppercase tracking-widest font-sans">
                                Quick Links
                            </h3>
                            <button
                                onClick={() => handleNavigation('/quick-links')}
                                className="flex items-center gap-1 text-[10px] font-bold hover:text-orange-600 transition-colors"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                <Plus className="w-3 h-3" /> Add
                            </button>
                        </div>
                    )}

                    <div className="space-y-0.5">
                        {quickLinks.map((link, idx) => (
                            <SidebarItem
                                key={`ql_${link.id}`}
                                item={{ ...link, icon: Zap }} // Using Zap icon for all quick links as per snippet logic preference or fallback
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
            <div className="p-4 border-t bg-main-app" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-main)' }}>
                <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-muted shrink-0 border" style={{ borderColor: 'var(--border-color)' }}>
                        <UserCircle className="w-6 h-6" />
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>{user?.name || 'User'}</p>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }}
                                className="text-xs font-medium flex items-center gap-1 mt-0.5 hover:underline"
                                style={{ color: 'var(--status-error)' }}
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
