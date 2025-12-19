import React, { useState } from 'react';
import { ArrowLeft, Save, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConfigureProfitLoss = () => {
    const navigate = useNavigate();

    // Initial Configuration State
    const [config, setConfig] = useState([
        {
            id: 'revenue',
            label: 'Revenue',
            enabled: true,
            expanded: true,
            children: [
                { id: 'food_sales', label: 'Food Sales', enabled: true },
                { id: 'beverage_sales', label: 'Beverage Sales', enabled: true },
                { id: 'online_sales', label: 'Online Orders', enabled: true },
                { id: 'dine_in', label: 'Dine-in Sales', enabled: true },
                { id: 'takeaway', label: 'Takeaway Sales', enabled: true },
                { id: 'other_income', label: 'Other Income', enabled: false }
            ]
        },
        {
            id: 'commissions',
            label: 'Commissions & Deductions',
            enabled: true,
            expanded: true,
            children: [
                { id: 'aggregator_comm', label: 'Aggregator Commissions (Zomato/Swiggy)', enabled: true },
                { id: 'discounts', label: 'Promo & Discounts', enabled: true },
                { id: 'cancellations', label: 'Cancellations', enabled: true }
            ]
        },
        {
            id: 'cogs',
            label: 'Cost of Goods Sold (COGS)',
            enabled: true,
            expanded: false,
            children: [
                { id: 'opening_stock', label: 'Opening Stock', enabled: true },
                { id: 'purchases', label: 'Purchases', enabled: true },
                { id: 'closing_stock', label: 'Closing Stock', enabled: true },
                { id: 'wastage', label: 'Wastage', enabled: true }
            ]
        },
        {
            id: 'operating_cost',
            label: 'Operating Expenses',
            enabled: true,
            expanded: true,
            children: [
                { id: 'rent', label: 'Rent', enabled: true },
                { id: 'salaries', label: 'Salaries & Wages', enabled: true },
                { id: 'utilities', label: 'Utilities (Electricity, Water)', enabled: true },
                { id: 'packaging', label: 'Packaging Material', enabled: true },
                { id: 'marketing', label: 'Marketing & Ads', enabled: true },
                { id: 'maintenance', label: 'Repairs & Maintenance', enabled: false },
                { id: 'software', label: 'Software Subscriptions', enabled: true }
            ]
        },
        {
            id: 'taxes',
            label: 'Taxes',
            enabled: true,
            expanded: false,
            children: [
                { id: 'gst_output', label: 'GST Collected (Output)', enabled: true },
                { id: 'gst_input', label: 'GST Paid (Input)', enabled: true }
            ]
        }
    ]);

    const toggleSection = (index) => {
        const newConfig = [...config];
        newConfig[index].expanded = !newConfig[index].expanded;
        setConfig(newConfig);
    };

    const toggleItem = (parentId, childId) => {
        const newConfig = config.map(section => {
            if (section.id === parentId) {
                if (childId) {
                    // Toggle Child
                    return {
                        ...section,
                        children: section.children.map(child =>
                            child.id === childId ? { ...child, enabled: !child.enabled } : child
                        )
                    };
                } else {
                    // Toggle Parent (and maybe all children?) - For now just parent header
                    return { ...section, enabled: !section.enabled };
                }
            }
            return section;
        });
        setConfig(newConfig);
    };

    const handleSave = () => {
        // Here you would save to backend/localstorage
        console.log('Saving config:', config);
        navigate('/reports/profit-loss');
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/reports/profit-loss')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configure P&L Report</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Customize which line items appear in your Profit & Loss statement</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg shadow-red-600/20 transition-all font-medium"
                >
                    <Save size={18} /> Save Configuration
                </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex gap-3">
                <Info size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Disabling a category or item will hide it from the visual report and exclude it from the final Net Profit calculation in the P&L view.
                    Ensure essential costs are enabled for accurate reporting.
                </p>
            </div>

            {/* Configuration List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                {config.map((section, index) => (
                    <div key={section.id} className="group">
                        {/* Section Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-750 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer select-none"
                            onClick={() => toggleSection(index)}>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                    {section.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </span>
                                <span className={`font-bold text-base ${section.enabled ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {section.label}
                                </span>
                            </div>

                            <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={section.enabled}
                                        onChange={() => toggleItem(section.id)}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Children Items */}
                        {section.expanded && (
                            <div className="bg-white dark:bg-gray-800 animate-in slide-in-from-top-2 duration-200">
                                {section.children.map(child => (
                                    <div key={child.id} className="flex items-center justify-between py-3 px-4 pl-14 border-t border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <span className={`text-sm font-medium ${child.enabled ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500 line-through decoration-gray-400'}`}>
                                            {child.label}
                                        </span>

                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={child.enabled}
                                                onChange={() => toggleItem(section.id, child.id)}
                                                disabled={!section.enabled}
                                            />
                                            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-red-500 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Save (Sticky optional, here just standard) */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xl shadow-red-600/20 transition-all font-bold text-lg"
                >
                    Apply Changes
                </button>
            </div>
        </div>
    );
};
