import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
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
    const [view, setView] = useState('list');
    const [activeTab, setActiveTab] = useState('Items');

    const topTabs = [
        'Availability', 'Items', 'Categories', 'Variations', 'Addons', 'Tables/Areas', 'Taxes', 'Discounts'
    ];

    if (view === 'dashboard') {
        return <MenuChannelDashboard onNavigate={(v) => setView(v || 'list')} />;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 font-sans text-sm">
            {/* Header Breadcrumb Area */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-500">
                    <span className="cursor-pointer hover:text-gray-700">Menu</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">Menu Management - {activeTab}</span>
                </div>
                <button className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 flex items-center gap-1 text-xs">
                    <ArrowLeft className="w-3 h-3" /> Back
                </button>
            </div>

            {/* Top Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex px-4 gap-8">
                    {topTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab
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
            <div className="flex-1 overflow-hidden relative overflow-y-auto">
                {activeTab === 'Availability' && <MenuChannelDashboard />}
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
