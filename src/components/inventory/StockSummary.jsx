import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, FileText, Printer, Clock } from 'lucide-react';
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
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            placeholder="Search item..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <span className="text-gray-400 dark:text-gray-500">-</span>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-1 col-span-2">
                        {/* Spacer or additional filter, simplified to button here */}
                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase opacity-0">Action</label>
                        <div className="flex gap-2">
                            <button onClick={handleSearch} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors font-medium flex items-center gap-2 w-full justify-center">
                                <Search className="w-4 h-4" /> Generate Report
                            </button>
                            <button onClick={handleClear} className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Table Area */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                            <tr>
                                <th className="p-4 sticky left-0 bg-gray-50 dark:bg-gray-700/50 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Item Details</th>
                                <th className="p-4 text-center">Opening</th>
                                <th className="p-4 text-center text-[var(--status-success)]">Purchase</th>
                                <th className="p-4 text-center">Total In</th>
                                <th className="p-4 text-center text-[var(--status-error)]">Consumed</th>
                                <th className="p-4 text-center">Wastage</th>
                                <th className="p-4 text-center">Total Out</th>
                                <th className="p-4 text-center font-extrabold text-gray-700 dark:text-gray-200">Closing</th>
                                <th className="p-4 text-center">Actual</th>
                                <th className="p-4 text-center">Diff</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="10" className="p-12 text-center text-gray-400 dark:text-gray-500">Loading inventory data...</td></tr>
                            ) : summary.length === 0 ? (
                                <tr><td colSpan="10" className="p-12 text-center text-gray-400 dark:text-gray-500">Specify filters to generate report</td></tr>
                            ) : (
                                summary.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 sticky left-0 bg-white dark:bg-gray-800 z-10 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 dark:text-gray-200 font-bold">{row.name}</span>
                                                <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{row.unit}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{(row.opening || 0).toFixed(2)}</td>
                                        <td className="p-4 text-center text-[var(--status-success)] font-bold">{(row.purchase || 0).toFixed(2)}</td>
                                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{(row.totalInput || 0).toFixed(2)}</td>

                                        <td
                                            className="p-4 text-center text-[var(--status-error)] font-bold cursor-pointer hover:bg-[var(--status-error)]/10 rounded-lg transition-colors underline decoration-dotted underline-offset-4"
                                            onClick={() => setSelectedItemForDetails(row)}
                                        >
                                            {(row.consumed || 0).toFixed(2)}
                                        </td>

                                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{(row.wastage || 0).toFixed(2)}</td>
                                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{(row.totalOutput || 0).toFixed(2)}</td>
                                        <td className="p-4 text-center font-extrabold text-gray-800 dark:text-white">{(row.closingStock || 0).toFixed(2)}</td>
                                        <td className="p-4 text-center text-gray-500 dark:text-gray-400">{(row.closingSummary || 0).toFixed(2)}</td>
                                        <td className={`p-4 text-center font-bold ${(row.difference || 0) < 0 ? 'text-[var(--status-error)]' : 'text-gray-400 dark:text-gray-500'}`}>
                                            {(row.difference || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Re-implementation with new styles */}
            {selectedItemForDetails && (
                <div className="absolute inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px]" onClick={() => setSelectedItemForDetails(null)}></div>
                    <div className="relative w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Consumption Details</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Breakdown for <span className="text-[var(--color-primary)] font-bold">{selectedItemForDetails.name}</span></p>
                            </div>
                            <button onClick={() => setSelectedItemForDetails(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-500 transition-colors">
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-gray-900/50">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Item</th>
                                            <th className="p-4 text-right">Qty</th>
                                            <th className="p-4">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {/* Simplified Mock Rows */}
                                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-gray-700 dark:text-gray-200">24 Dec, 2025</div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500">15:06 PM</div>
                                            </td>
                                            <td className="p-4 text-gray-700 dark:text-gray-300">Classic Veg Burger</td>
                                            <td className="p-4 text-right font-bold text-[var(--status-error)]">1.00</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded bg-[var(--status-success)]/10 text-[var(--status-success)] text-xs font-bold">#2644</span>
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
