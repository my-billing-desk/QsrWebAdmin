import React, { useState, useEffect } from 'react';
import { Search, Save, MoreHorizontal, MessageCircle } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function ClosingStock() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    // Store closing stock inputs: { [itemId_unit]: value }
    const [inputs, setInputs] = useState({});

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await inventoryService.getRawMaterials();
            setMaterials(res.data);
        } catch (error) {
            console.error("Failed to fetch materials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (id, field, value) => {
        setInputs(prev => ({
            ...prev,
            [`${id}_${field}`]: value
        }));
    };

    return (
        <div className="flex h-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {/* Sidebar / Filter placeholder from screenshot Left Side */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-200">
                    Manage Stock
                </div>
                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                    {/* Categories List (Mock) */}
                    <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Categories</div>
                        {['Dairy', 'Vegetable', 'Bakery', 'Frozen', 'Spices', 'Beverage'].map(cat => (
                            <div key={cat} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-sm text-gray-600 dark:text-gray-300">
                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                {cat}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center shrink-0">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search Items..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border-transparent rounded focus:bg-white focus:ring-2 focus:ring-red-500 transition-colors text-sm outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex bg-gray-100 dark:bg-gray-700 rounded p-1">
                            {[1, 2, 3].map(p => (
                                <button key={p} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-medium ${p === 1 ? 'bg-white shadow text-black' : 'text-gray-500 hover:bg-gray-200'}`}>
                                    {p}
                                </button>
                            ))}
                            <button className="w-8 h-8 flex items-center justify-center rounded text-xs font-medium text-gray-500 hover:bg-gray-200">Next</button>
                        </div>
                        <button className="w-8 h-8 bg-red-800 text-white rounded flex items-center justify-center hover:bg-red-900">
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="p-4 text-left border-b border-gray-200 dark:border-gray-700 w-1/4">Item Name</th>
                                <th className="p-4 text-left border-b border-gray-200 dark:border-gray-700 w-1/4">Available Stock</th>
                                <th className="p-4 text-left border-b border-gray-200 dark:border-gray-700 w-1/3">Closing Stock</th>
                                <th className="p-4 text-left border-b border-gray-200 dark:border-gray-700">Comments</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {materials.map((item, idx) => (
                                <tr key={item.id} className={`${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-purple-50/30 dark:bg-gray-800/30'} hover:bg-gray-50 transition-colors`}>
                                    <td className="p-4 align-top">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                            <div>
                                                <div className="font-bold text-gray-700 dark:text-gray-200 text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5 uppercase tracking-wide">{item.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500 w-20">Current:</span>
                                                <span className="font-medium bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">
                                                    {item.currentStock} {item.consumptionUnit}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            {/* Purchase Unit Input */}
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Closing Stock</span>
                                                    <input
                                                        type="number"
                                                        className="w-full pl-24 pr-12 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-200 outline-none"
                                                        placeholder="0"
                                                        value={inputs[`${item.id}_purchase`] || ''}
                                                        onChange={e => handleInputChange(item.id, 'purchase', e.target.value)}
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">/{item.purchaseUnit}</span>
                                                </div>
                                            </div>

                                            {/* Consumption Unit Input (if different) */}
                                            {item.purchaseUnit !== item.consumptionUnit && (
                                                <div className="flex items-center gap-2">
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Closing Stock</span>
                                                        <input
                                                            type="number"
                                                            className="w-full pl-24 pr-12 py-1.5 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 focus:border-red-500 focus:ring-1 focus:ring-red-200 outline-none"
                                                            placeholder="0"
                                                            value={inputs[`${item.id}_consumption`] || ''}
                                                            onChange={e => handleInputChange(item.id, 'consumption', e.target.value)}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">/{item.consumptionUnit}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <input
                                            type="text"
                                            placeholder="Comments"
                                            className="w-full border border-gray-200 dark:border-gray-700 rounded px-3 py-1.5 text-sm bg-transparent focus:bg-white transition-colors outline-none focus:border-gray-400"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAB for Comments/Support */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-900 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
