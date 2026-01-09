import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, FileText, Printer, Clock } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';
import { inventoryService } from '../../services/api';
import { getTodayLocal } from '../../utils/dateUtils';

export function StockSummary() {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([]);



    const [filters, setFilters] = useState({
        rawMaterial: '',
        category: 'All',
        unitType: 'Purchase Unit',
        fromDate: getTodayLocal(),
        toDate: getTodayLocal()
    });

    const categories = ['All', 'Dairy', 'Vegetable', 'Bakery', 'Frozen', 'Spices'];

    const handleSearch = async () => {
        setLoading(true);
        try {
            // Fetch real-time calculated report from backend
            const res = await inventoryService.getStockSummaryReport({
                fromDate: filters.fromDate,
                toDate: filters.toDate
            });

            let report = res.data;

            // Client-side filtering for Name and Category
            // Note: Backend currently returns all materials with calculated values
            if (filters.category !== 'All' || filters.rawMaterial) {
                report = report.filter(r => {
                    // Start matching
                    const matchesName = !filters.rawMaterial || r.name.toLowerCase().includes(filters.rawMaterial.toLowerCase());
                    // const matchesCategory = filters.category === 'All' || r.category === filters.category; // Category not yet in payload
                    return matchesName;
                });
            }

            setSummary(report);

        } catch (error) {
            console.error("Failed to fetch stock summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        const today = getTodayLocal();
        setFilters({
            rawMaterial: '',
            category: 'All',
            unitType: 'Purchase Unit',
            fromDate: today,
            toDate: today
        });
        setSummary([]);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);

    const columns = [
        {
            key: 'name',
            header: 'Item Details',
            render: (row) => (
                <div className="flex flex-col">
                    <span className="text-gray-700 dark:text-gray-200 font-bold">{row.name}</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{row.unit}</span>
                </div>
            )
        },
        { key: 'opening', header: 'Opening', align: 'center', render: (row) => <span className="text-gray-500 dark:text-gray-400">{(row.opening || 0).toFixed(2)}</span> },
        { key: 'purchase', header: 'Purchase', align: 'center', render: (row) => <span className="text-emerald-600 font-bold">{(row.purchase || 0).toFixed(2)}</span> },
        { key: 'totalInput', header: 'Total In', align: 'center', render: (row) => <span className="text-gray-500 dark:text-gray-400">{(row.totalInput || 0).toFixed(2)}</span> },
        {
            key: 'consumed',
            header: 'Consumed',
            align: 'center',
            render: (row) => (
                <span
                    className="text-red-600 font-bold cursor-pointer hover:bg-red-50 rounded-lg transition-colors underline decoration-dotted underline-offset-4 px-2 py-1"
                    onClick={() => setSelectedItemForDetails(row)}
                >
                    {(row.consumed || 0).toFixed(2)}
                </span>
            )
        },
        { key: 'wastage', header: 'Wastage', align: 'center', render: (row) => <span className="text-gray-500 dark:text-gray-400">{(row.wastage || 0).toFixed(2)}</span> },
        { key: 'totalOutput', header: 'Total Out', align: 'center', render: (row) => <span className="text-gray-500 dark:text-gray-400">{(row.totalOutput || 0).toFixed(2)}</span> },
        { key: 'closingStock', header: 'Closing', align: 'center', render: (row) => <span className="font-extrabold text-gray-800 dark:text-white">{(row.closingStock || 0).toFixed(2)}</span> },
        { key: 'closingSummary', header: 'Actual', align: 'center', render: (row) => <span className="text-gray-500 dark:text-gray-400">{(row.closingSummary || 0).toFixed(2)}</span> },
        {
            key: 'difference',
            header: 'Diff',
            align: 'center',
            render: (row) => (
                <span className={`font-bold ${(row.difference || 0) < 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {(row.difference || 0).toFixed(2)}
                </span>
            )
        }
    ];

    const actionButtons = (
        <div className="flex gap-2">
            <button onClick={handleSearch} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
                <Search className="w-4 h-4" /> Generate Report
            </button>
            <button onClick={handleClear} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Clear
            </button>
        </div>
    );

    // ... existing hook ...

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Consumption Summary</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Real-time consumption tracking and inventory valuation</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Schedule
                    </button>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 px-6 py-4 shadow-sm border-b border-gray-200 dark:border-gray-700 shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Raw Material</label>
                        <input
                            type="text"
                            value={filters.rawMaterial}
                            onChange={(e) => setFilters(prev => ({ ...prev, rawMaterial: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Search item..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {/* Simplified Filters for Modern Look */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Date Range</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Table Area */}
            <div className="flex-1 overflow-hidden p-6">
                <SmartTable
                    data={summary}
                    columns={columns}
                    title="Stock Inventory"
                    isLoading={loading}
                    emptyMessage="Specify filters to generate report"
                />
            </div>

            {/* Modal Re-implementation with new styles */}
            {selectedItemForDetails && (
                <div className="absolute inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px]" onClick={() => setSelectedItemForDetails(null)}></div>
                    <div className="relative w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Consumption Details</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Breakdown for <span className="text-indigo-600 font-bold">{selectedItemForDetails.name}</span></p>
                            </div>
                            <button onClick={() => setSelectedItemForDetails(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 transition-colors">
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <table className="table-standard">
                                    <thead className="table-header">
                                        <tr>
                                            <th className="table-th">Date</th>
                                            <th className="table-th">Item</th>
                                            <th className="table-th text-right">Qty</th>
                                            <th className="table-th">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {/* Simplified Mock Rows */}
                                        <tr className="table-row">
                                            <td className="table-td">
                                                <div className="font-bold text-gray-700 dark:text-gray-200">24 Dec, 2025</div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">15:06 PM</div>
                                            </td>
                                            <td className="table-td text-gray-700 dark:text-gray-300">Classic Veg Burger</td>
                                            <td className="table-td text-right font-bold text-red-600">1.00</td>
                                            <td className="table-td">
                                                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">#2644</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
