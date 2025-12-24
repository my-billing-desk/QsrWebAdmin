import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    LayoutDashboard, Layers, UtensilsCrossed, FileText, Archive, Truck, Bell, Settings,
    Calculator, Users, Box, Landmark, Share2, BarChart3, MessageSquare, Zap, UserCircle,
    CreditCard, FileSpreadsheet
} from 'lucide-react';

const QuickLinksContext = createContext();

export const initialMenuGroups = [
    {
        id: 'group_dashboard',
        items: [
            { id: 'dashboard_home', path: '/', label: 'Dashboard', icon: LayoutDashboard },
            {
                id: 'daily_ops',
                label: 'Daily Operations',
                icon: Layers,
                forceExpanded: true,
                items: [
                    { id: 'running_orders', path: '/orders/running', label: 'Running Orders' },
                    { id: 'all_orders', path: '/orders', label: 'All Orders' },
                    { id: 'online_orders', path: '/orders/online', label: 'Online Orders' },
                    { id: 'kot', path: '/orders/kot', label: 'KOT' },
                    { id: 'due_payment', path: '/orders/due-payment', label: 'Due Payment Settlement' },
                    { id: 'profit_loss', path: '/reports/profit-loss', label: 'Profit & Loss' },
                ]
            }
        ]
    },
    {
        id: 'group_menu',
        title: 'Menu Management',
        items: [
            { id: 'menu_discounts', path: '/menu/on-off', label: 'Menu & Discounts', icon: UtensilsCrossed },
            { id: 'special_note', path: '/menu/special-note', label: 'Special Note', icon: FileText },
        ]
    },
    {
        id: 'group_inventory',
        items: [
            { id: 'inventory_main', path: '/inventory', label: 'Inventory', icon: Archive },
        ]
    },
    {
        id: 'group_reports',
        title: 'Reports',
        items: [
            { id: 'day_end', path: '/reports/day-end', label: 'Day End Summary', icon: FileText },
            { id: 'other_reports', path: '/reports/other', label: 'Other Reports', icon: FileText },
            { id: 'report_notif', path: '/reports/notifications', label: 'Report Notification', icon: Bell },
            { id: 'del_mgmt', path: '/reports/delivery', label: 'Delivery Management', icon: Truck },
        ]
    },
    {
        id: 'group_management',
        title: 'Management',
        items: [
            {
                id: 'configuration',
                label: 'Configuration',
                icon: Settings,
                items: [
                    { id: 'outlet_config', path: '/config/outlet', label: 'Outlet Configuration' },
                    { id: 'sub_order', path: '/config/sub-order', label: 'Sub Order Type' },
                    { id: 'del_dist', path: '/config/delivery', label: 'Delivery Distance' },
                    { id: 'area_del', path: '/config/area-delivery', label: 'Area/Locality Wise Delivery Charges' },
                    { id: 'mkt_setting', path: '/config/marketplace', label: 'Marketplace Setting' },
                    { id: 'floor_plan', path: '/config/floor-plan', label: 'Floor Plan' },
                    { id: 'email_temp', path: '/config/email-template', label: 'Email Template Settings' },
                ]
            },
            {
                id: 'accounting',
                label: 'Accounting',
                icon: Calculator,
                items: [
                    {
                        id: 'payments',
                        label: 'Payments',
                        items: [
                            { id: 'pmt_info', path: '/accounting/payments', label: 'Payment Information' },
                            { id: 'virt_wallet', path: '/accounting/virtual-wallet', label: 'Virtual Wallet' },
                        ]
                    },
                    { id: 'online_recon', path: '/accounting/reconciliation', label: 'Online Order Reconciliation' },
                    { id: 'gst_info', path: '/accounting/gst', label: 'GST Information' },
                    { id: 'bank_details', path: '/accounting/bank', label: 'Bank Details' },
                    { id: 'kyc_details', path: '/accounting/kyc', label: 'KYC Details' },
                    { id: 'utility_bills', path: '/accounting/utility', label: 'Utility Bills' },
                    { id: 'exp_withdrawal', path: '/accounting/expense', label: 'Expense & Withdrawal' },
                    { id: 'serv_hist', path: '/accounting/service-history', label: 'Service Payment History' },
                    { id: 'agree_info', path: '/accounting/agreement', label: 'Agreement Info' },
                    { id: 'loan_info', path: '/accounting/loan', label: 'Loan Information' },
                    { id: 'denom', path: '/accounting/denomination', label: 'Denomination' },
                ]
            },
            {
                id: 'user_mgmt',
                label: 'User Management',
                icon: Users,
                items: [
                    { id: 'biller_app', path: '/users/biller', label: 'Biller App' },
                    { id: 'biller_group', path: '/users/biller-group', label: 'Biller Group Management' },
                    { id: 'admin_group', path: '/users/admin-group', label: 'Admin Group Management' },
                    { id: 'admin_mgmt', path: '/users/admin', label: 'Admin Management' },
                ]
            },
            {
                id: 'user_logs',
                label: 'User Logs',
                icon: FileText,
                items: [
                    { id: 'log_store', path: '/logs/store', label: 'Online Store Logs' },
                    { id: 'log_item', path: '/logs/item-on-off', label: 'Online Item On/Off Logs' },
                    { id: 'log_auto', path: '/logs/auto-accept', label: 'Auto Accept Change Logs' },
                    { id: 'log_support', path: '/logs/support', label: 'Support Management' },
                    { id: 'log_notif', path: '/logs/notifications', label: 'Notification' },
                    { id: 'log_trigger', path: '/logs/menu-trigger', label: 'Menu Trigger Logs' },
                    { id: 'log_closing', path: '/logs/closing-hour', label: 'Closing Hour Logs' },
                ]
            },
            { id: 'other_apps', path: '/apps/other', label: 'Other APPs', icon: Box },
            { id: 'finance', path: '/finance', label: 'Finance', icon: Landmark },
            { id: 'marketplace', path: '/marketplace', label: 'Marketplace', icon: Share2 },
        ]
    },
    {
        id: 'group_crm',
        title: 'CRM',
        items: [
            { id: 'crm_mkt', path: '/crm/marketing', label: 'Marketing', icon: BarChart3 },
            { id: 'crm_camp', path: '/crm/campaign', label: 'Campaign', icon: MessageSquare },
            { id: 'crm_rep', path: '/crm/reputation', label: 'Reputation', icon: Users },
            { id: 'crm_beta', path: '/crm/beta', label: 'Beta', icon: Zap },
            { id: 'crm_auto', path: '/crm/automation', label: 'Marketing Automation', icon: Zap },
            { id: 'crm_cust', path: '/crm/customers', label: 'Customers', icon: UserCircle },
            { id: 'crm_feedback', path: '/crm/feedback', label: 'Feedback', icon: MessageSquare },
            { id: 'crm_gift', path: '/crm/gift-card', label: 'Gift Card', icon: CreditCard },
            { id: 'crm_loyalty', path: '/crm/loyalty', label: ' Loyalty', icon: UserCircle },
            { id: 'crm_dual', path: '/crm/dual-screen', label: 'Dual Screen Marketing', icon: Layers },
            { id: 'crm_ebill', path: '/crm/ebill', label: 'Ebill Templates', icon: FileSpreadsheet },
        ]
    },
    {
        id: 'group_aggregator',
        items: [
            { id: 'aggregator_center', path: '/aggregator-center', label: 'Aggregator Center', icon: Share2, badge: 'New' }
        ]
    }
];

export function QuickLinksProvider({ children }) {
    const [quickLinks, setQuickLinks] = useState([]);
    const [menuLayout, setMenuLayout] = useState(initialMenuGroups);

    const addQuickLink = (item) => {
        if (!quickLinks.find(link => link.id === item.id)) {
            setQuickLinks([...quickLinks, item]);
        }
    };

    const removeQuickLink = (itemId) => {
        setQuickLinks(quickLinks.filter(link => link.id !== itemId));
    };

    const toggleQuickLink = (item) => {
        if (quickLinks.find(link => link.id === item.id)) {
            removeQuickLink(item.id);
        } else {
            addQuickLink(item);
        }
    }

    const reorderMenu = (newItems) => {
        setMenuLayout(newItems);
    };

    return (
        <QuickLinksContext.Provider value={{
            quickLinks,
            addQuickLink,
            removeQuickLink,
            toggleQuickLink,
            menuLayout,
            reorderMenu,
            allMenuItems: initialMenuGroups
        }}>
            {children}
        </QuickLinksContext.Provider>
    );
}

export function useQuickLinks() {
    return useContext(QuickLinksContext);
}
