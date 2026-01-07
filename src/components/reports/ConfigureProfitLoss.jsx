import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, ChevronDown, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { financialService } from '../../services/api';
import toast from 'react-hot-toast';

export const ConfigureProfitLoss = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const [expenseRes, withdrawalRes, topupRes] = await Promise.all([
                financialService.getExpenseCategories(),
                financialService.getWithdrawalCategories(),
                financialService.getCashTopUpCategories()
            ]);

            const newConfig = [
                {
                    id: 'revenue',
                    label: 'Revenue',
                    enabled: true,
                    expanded: true,
                    children: [
                        { id: 'sales', label: 'Sales (Orders)', enabled: true },
                        ...topupRes.data.data.map(cat => ({
                            id: `topup_${cat.id}`,
                            label: cat.title,
                            enabled: true
                        }))
                    ]
                },
                {
                    id: 'operating_cost',
                    label: 'Operating Expenses',
                    enabled: true,
                    expanded: true,
                    children: expenseRes.data.data.map(cat => ({
                        id: `expense_${cat.id}`,
                        label: cat.title,
                        enabled: true
                    }))
                },
                {
                    id: 'withdrawals',
                    label: 'Withdrawals',
                    enabled: true,
                    expanded: false,
                    children: withdrawalRes.data.data.map(cat => ({
                        id: `withdrawal_${cat.id}`,
                        label: cat.title,
                        enabled: true
                    }))
                },
                {
                    id: 'cogs',
                    label: 'Cost of Goods Sold (COGS)',
                    enabled: true,
                    expanded: false,
                    children: [
                        { id: 'purchases', label: 'Inventory Purchases', enabled: true },
                        { id: 'purchase_returns', label: 'Purchase Returns', enabled: true }
                    ]
                }
            ];

            setConfig(newConfig);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (index) => {
        const newConfig = [...config];
        newConfig[index].expanded = !newConfig[index].expanded;
        setConfig(newConfig);
    };

    const toggleItem = (parentId, childId) => {
        const newConfig = config.map(section => {
            if (section.id === parentId) {
                if (childId) {
                    return {
                        ...section,
                        children: section.children.map(child =>
                            child.id === childId ? { ...child, enabled: !child.enabled } : child
                        )
                    };
                } else {
                    return { ...section, enabled: !section.enabled };
                }
            }
            return section;
        });
        setConfig(newConfig);
    };

    const handleSave = () => {
        // In a real app, we would save this to the backend
        toast.success('Configuration saved successfully');
        navigate('/reports/profit-loss');
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/reports/profit-loss')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Configure P&L Report</h1>
                        <p className="text-sm text-gray-500">Customize which line items appear in your Profit & Loss statement</p>
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
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                    Disabling a category or item will hide it from the visual report and exclude it from the final Net Profit calculation in the P&L view.
                </p>
            </div>

            {/* Configuration List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {config.map((section, index) => (
                    <div key={section.id} className="group">
                        {/* Section Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer select-none"
                            onClick={() => toggleSection(index)}>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                    {section.expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </span>
                                <span className={`font-bold text-base ${section.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
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
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>
                        </div>

                        {/* Children Items */}
                        {section.expanded && (
                            <div className="bg-white">
                                {section.children.map(child => (
                                    <div key={child.id} className="flex items-center justify-between py-3 px-4 pl-14 border-t border-gray-50 hover:bg-gray-50 transition-colors">
                                        <span className={`text-sm font-medium ${child.enabled ? 'text-gray-700' : 'text-gray-400 line-through decoration-gray-400'}`}>
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
                                            <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 peer-disabled:opacity-50"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
