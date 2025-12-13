import React, { useState, useEffect } from 'react';
import { Store, Map, ChefHat, X, Save } from 'lucide-react';
import { settingsService } from '../../services/api';

export function Preferences() {
    const [settings, setSettings] = useState({});
    const [activeView, setActiveView] = useState('Outlet View');

    const modules = [
        { key: 'enableRawMaterials', label: 'Raw Materials', desc: 'Ingredients that are used to prepare dishes on the menu.', default: true },
        { key: 'enableRecipe', label: 'Recipe', desc: 'Use recipes to calculate ingredient requirements and manage inventory levels effectively.', default: true },
        { key: 'enableClosingStock', label: 'Closing Stock', desc: 'Restaurant staff follow to update the quantity of remaining stock at the end of a specific time period like week, or month.', default: true },
        { key: 'enablePurchase', label: 'Purchase', desc: 'Its also known as procurement management, is the systematic process of purchasing ingredients.', default: true },
        { key: 'enablePurchaseOrder', label: 'Purchase Order', desc: 'Process that restaurant is intent to purchase from supplier.', default: true },
        { key: 'enablePurchaseReturn', label: 'Purchase Return', desc: 'Process that restaurant intends to do Purchase return if goods are not as expected.', default: false },
        { key: 'enableSupplier', label: 'Supplier', desc: 'Third party that Supplies numerous items. These vendors are essential to the restaurant supply chain.', default: true },
        { key: 'enableSales', label: 'Sales', desc: 'Ingredients are sold to other restaurants or third parties from one entity to the next.', default: false },
        { key: 'enableTransfer', label: 'Transfer', desc: 'Ingredients are sold to other restaurants or third parties internally.', default: false },
        { key: 'enableSalesReturn', label: 'Sales Return', desc: 'Process that if you received back your goods which you sold earlier.', default: false },
        { key: 'enableWastage', label: 'Wastage', desc: 'Effective wastage management reduces operating costs and effective way to track ingredient usage.', default: true },
        { key: 'enableExpired', label: 'Expired Material', desc: 'If any raw materials are nearer to expiration then its easy to track from here.', default: false },
        { key: 'enableReports', label: 'Reports', desc: 'More than ten different reports to track and manage your inventory management property.', default: true },
        { key: 'enableUOM', label: 'Unit Of Measurement', desc: 'You can input the measurements of units such as kilograms, parts, grams, bottles, and so forth.', default: true },
        { key: 'enableInvoice', label: 'Invoice Templates', desc: 'Providing different option of pdf for sales, purchase and purchase order.', default: true },
        { key: 'enableProduction', label: 'Production', desc: 'As a user you can able to convert semi finished raw material.Like pizza gravy,pasta gravy etc.', default: false },
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await settingsService.getAll();
            // Convert array of {key, value} to object
            const loaded = res.data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value === 'true' }), {});
            setSettings(loaded);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleSetting = async (key, currentValue) => {
        const newValue = !currentValue;
        setSettings(prev => ({ ...prev, [key]: newValue }));
        try {
            await settingsService.update({ [key]: newValue });
        } catch (error) {
            console.error(error);
            setSettings(prev => ({ ...prev, [key]: currentValue })); // Revert on error
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-14 flex items-center px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 justify-between">
                <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">Set Preferences</h1>
                <button className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col py-4">
                    <SidebarItem icon={Store} label="Outlet View" active={activeView === 'Outlet View'} onClick={() => setActiveView('Outlet View')} />
                    <SidebarItem icon={Map} label="Multi Location View" active={activeView === 'Multi Location View'} onClick={() => setActiveView('Multi Location View')} />
                    <SidebarItem icon={ChefHat} label="Central Kitchen View" active={activeView === 'Central Kitchen View'} onClick={() => setActiveView('Central Kitchen View')} />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Set preference for your Inventory by selecting the restaurant type that best fits your needs. We've automatically selected relevant modules for you.
                    </p>

                    <div className="space-y-4 max-w-4xl">
                        {modules.map((mod) => {
                            const isEnabled = settings[mod.key] ?? mod.default;
                            return (
                                <div key={mod.key} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
                                    <div className="pr-4">
                                        <div className="text-xs text-gray-400 font-medium mb-1">
                                            {isEnabled ? 'Update your' : 'Enable'}
                                        </div>
                                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-1">{mod.label}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{mod.desc}</p>
                                    </div>
                                    <div
                                        onClick={() => toggleSetting(mod.key, isEnabled)}
                                        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${isEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-orange-50 dark:bg-orange-900/10 border-t border-orange-100 dark:border-orange-800/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-orange-800 dark:text-orange-200">
                    <span className="text-lg">💡</span>
                    <span>Feel free to add or remove modules at any time to customize your setup.</span>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium text-sm">Cancel</button>
                    <button className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 font-medium text-sm shadow-sm">Save Changes</button>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-6 py-3 w-full text-left transition-colors relative ${active
                ? 'bg-rose-50 dark:bg-rose-900/20 text-red-600 dark:text-red-400 font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
        >
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>}
            <Icon className={`w-5 h-5 ${active ? 'text-red-600' : 'text-gray-400'}`} />
            <span className="text-sm">{label}</span>
        </button>
    );
}
