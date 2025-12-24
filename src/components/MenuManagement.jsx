
import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, FileText, Utensils, Globe, Layers, List, PlusCircle, Percent, DollarSign, LayoutGrid, ShoppingBag, Truck } from 'lucide-react';
import { MenuChannelDashboard } from './MenuChannelDashboard';
import { AddItem } from './AddItem';
import { ItemsView } from './menu/ItemsView';
import { CategoriesView } from './menu/CategoriesView';
import { VariationsView } from './menu/VariationsView';
import { AddonsView } from './menu/AddonsView';
import { TablesView } from './menu/TablesView';
import { TaxesView } from './menu/TaxesView';
import { DiscountsView } from './menu/DiscountsView';

export function MenuManagement() {
    const [view, setView] = useState('detail'); // Default to detail view
    const [activeTab, setActiveTab] = useState('Availability'); // Default to Availability tab
    const [dashboardProps, setDashboardProps] = useState({ initialTab: 'online', initialChannel: 'all' });

    const handleNavigate = (tab, props = {}) => {
        setActiveTab(tab);
        setDashboardProps(props);
        setView('detail');
    };

    const topTabs = [
        'Availability', 'Items', 'Categories', 'Variations', 'Addons', 'Tables/Areas', 'Taxes', 'Discounts'
    ];

    if (view === 'hub') {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Menu Management</h1>
                    <p className="text-gray-500 text-sm">Manage your menu items, pricing, and availability across channels.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Base Menu */}
                    <HubCard
                        title="Base Menu"
                        description="Manage all items and prices"
                        icon={<FileText className="w-6 h-6 text-blue-600" />}
                        onClick={() => handleNavigate('Items')}
                    />

                    {/* Dine In */}
                    <HubCard
                        title="Dine In"
                        description="Manage dine-in availability"
                        icon={<Utensils className="w-6 h-6 text-orange-600" />}
                        onClick={() => handleNavigate('Availability', { initialTab: 'offline' })}
                    />

                    {/* Online Channels */}
                    <HubCard
                        title="Online Orders"
                        description="Manage all online channels"
                        icon={<Globe className="w-6 h-6 text-green-600" />}
                        onClick={() => handleNavigate('Availability', { initialTab: 'online', initialChannel: 'all' })}
                    />

                    <HubCard
                        title="Swiggy"
                        description="Manage Swiggy exclusive menu"
                        icon={<img src="https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg" className="w-6 h-6" alt="Swiggy" />}
                        onClick={() => handleNavigate('Availability', { initialTab: 'online', initialChannel: 'swiggy' })}
                    />

                    <HubCard
                        title="Zomato"
                        description="Manage Zomato exclusive menu"
                        icon={<img src="https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg" className="w-12 h-6 object-contain -ml-3" alt="Zomato" />}
                        onClick={() => handleNavigate('Availability', { initialTab: 'online', initialChannel: 'zomato' })}
                    />

                    {/* Structure */}
                    <HubCard
                        title="Categories"
                        description="Organize items into categories"
                        icon={<Layers className="w-6 h-6 text-purple-600" />}
                        onClick={() => handleNavigate('Categories')}
                    />

                    <HubCard
                        title="Variations"
                        description="Sizes, crusts, and variants"
                        icon={<List className="w-6 h-6 text-indigo-600" />}
                        onClick={() => handleNavigate('Variations')}
                    />

                    <HubCard
                        title="Addons"
                        description="Extra toppings and sides"
                        icon={<PlusCircle className="w-6 h-6 text-pink-600" />}
                        onClick={() => handleNavigate('Addons')}
                    />

                    {/* Settings */}
                    <HubCard
                        title="Tables & Areas"
                        description="Manage floor plan"
                        icon={<LayoutGrid className="w-6 h-6 text-gray-600" />}
                        onClick={() => handleNavigate('Tables/Areas')}
                    />

                    <HubCard
                        title="Taxes"
                        description="GST and other charges"
                        icon={<Percent className="w-6 h-6 text-red-600" />}
                        onClick={() => handleNavigate('Taxes')}
                    />

                    <HubCard
                        title="Discounts"
                        description="Offers and coupons"
                        icon={<DollarSign className="w-6 h-6 text-green-600" />}
                        onClick={() => handleNavigate('Discounts')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 font-sans text-sm min-h-screen">
            {/* Header Breadcrumb Area */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="cursor-pointer hover:text-gray-700" onClick={() => setView('hub')}>Menu</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{activeTab}</span>
                </div>
                <button
                    onClick={() => setView('hub')}
                    className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center gap-1 text-xs"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Hub
                </button>
            </div>

            {/* Top Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <div className="flex px-4 gap-8 min-w-max">
                    {topTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab);
                                // Reset dashboard props if switching manually to Availability
                                if (tab === 'Availability') {
                                    setDashboardProps({ initialTab: 'online', initialChannel: 'all' });
                                }
                            }}
                            className={`py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative overflow-y-auto w-full">
                {activeTab === 'Availability' && (
                    <MenuChannelDashboard
                        key={`${dashboardProps.initialTab}-${dashboardProps.initialChannel}`}
                        initialTab={dashboardProps.initialTab}
                        initialChannel={dashboardProps.initialChannel}
                    />
                )}
                {activeTab === 'Items' && <ItemsView />}
                {activeTab === 'Categories' && <CategoriesView />}
                {activeTab === 'Variations' && <VariationsView />}
                {activeTab === 'Addons' && <AddonsView />}
                {activeTab === 'Tables/Areas' && <TablesView />}
                {activeTab === 'Taxes' && <TaxesView />}
                {activeTab === 'Discounts' && <DiscountsView />}
            </div>
        </div>
    );
}

function HubCard({ title, description, icon, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-start gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left group"
        >
            <div className="w-12 h-12 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg mb-1">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">{description}</p>
            </div>
        </button>
    );
}
