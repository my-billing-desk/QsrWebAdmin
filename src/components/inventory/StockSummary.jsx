import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, FileText, Printer, Clock } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function StockSummary() {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState([]);
    const [filters, setFilters] = useState({
        rawMaterial: '',
        category: 'All',
        unitType: 'Purchase Unit',
        fromDate: new Date().toISOString().split('T')[0],
        toDate: new Date().toISOString().split('T')[0]
    });

    const categories = ['All', 'Dairy', 'Vegetable', 'Bakery', 'Frozen', 'Spices'];

    const handleSearch = async () => {
        setLoading(true);
        try {
            // In a real app, this would be an aggregation query on backend
            // For now, we fetch materials and mock the calculation or fetch a report endpoint if it existed
            // Let's assume we fetch raw materials and display 0s as per screenshot request unless we have real history
            const res = await inventoryService.getRawMaterials();

            // Map to summary structure
            const report = res.data.map(item => ({
                id: item.id,
                name: item.name,
                unit: filters.unitType === 'Purchase Unit' ? item.purchaseUnit : item.consumptionUnit,
                opening: 0,
                purchase: 0,
                excess: 0,
                totalInput: 0, // A+B+C
                consumed: 0,
                wastage: 0,
                normalLoss: 0,
                transfer: 0,
                shortage: 0,
                conversion: 0,
                totalOutput: 0,
                closingStock: 0,
                closingSummary: 0,
                difference: 0
            }));

            // Filter by category/search
            const filtered = report.filter(r => {
                const matchCat = filters.category === 'All' || true; // item category not in report obj yet, would need join
                const matchName = !filters.rawMaterial || r.name.toLowerCase().includes(filters.rawMaterial.toLowerCase());
                return matchCat && matchName;
            });

            setSummary(filtered);

        } catch (error) {
            console.error("Failed to fetch stock summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({
            rawMaterial: '',
            category: 'All',
            unitType: 'Purchase Unit',
            fromDate: new Date().toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0]
        });
        setSummary([]);
    };

    useEffect(() => {
        handleSearch();
    }, []);

    const [selectedItemForDetails, setSelectedItemForDetails] = useState(null);

    // ... existing hook ...

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Stock Summary</h1>
                    <p className="text-slate-500 text-sm mt-1">Real-time inventory tracking and valuation</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">
                        <Clock className="w-4 h-4" /> Schedule
                    </button>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 px-6 py-4 shadow-sm border-b border-slate-200 dark:border-slate-700 shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="form-label">Raw Material</label>
                        <input
                            type="text"
                            value={filters.rawMaterial}
                            onChange={(e) => setFilters(prev => ({ ...prev, rawMaterial: e.target.value }))}
                            className="input-field"
                            placeholder="Search item..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="form-label">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="input-field"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {/* Simplified Filters for Modern Look */}
                    <div className="space-y-1">
                        <label className="form-label">Date Range</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                                className="input-field"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="space-y-1 col-span-2">
                        {/* Spacer or additional filter, simplified to button here */}
                        <label className="form-label opacity-0">Action</label>
                        <div className="flex gap-2">
                            <button onClick={handleSearch} className="btn-primary w-full">
                                <Search className="w-4 h-4" /> Generate Report
                            </button>
                            <button onClick={handleClear} className="btn-secondary">
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Table Area */}
            <div className="flex-1 overflow-auto p-6">
                <div className="table-container bg-white dark:bg-slate-800">
                    <table className="table-modern">
                        <thead className="sticky top-0 z-10">
                            <tr>
                                <th className="sticky left-0 bg-slate-50 dark:bg-slate-800 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Item Details</th>
                                <th className="text-center">Opening</th>
                                <th className="text-center text-emerald-600">Purchase</th>
                                <th className="text-center">Total In</th>
                                <th className="text-center text-rose-600">Consumed</th>
                                <th className="text-center">Wastage</th>
                                <th className="text-center">Total Out</th>
                                <th className="text-center font-extrabold text-slate-700 dark:text-slate-200">Closing</th>
                                <th className="text-center">Actual</th>
                                <th className="text-center">Diff</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="10" className="p-12 text-center text-slate-400">Loading inventory data...</td></tr>
                            ) : summary.length === 0 ? (
                                <tr><td colSpan="10" className="p-12 text-center text-slate-400">Specify filters to generate report</td></tr>
                            ) : (
                                summary.map((row) => (
                                    <tr key={row.id}>
                                        <td className="sticky left-0 bg-white dark:bg-slate-800 z-10 font-medium group-hover:bg-slate-50 dark:group-hover:bg-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                            <div className="flex flex-col">
                                                <span className="text-slate-700 dark:text-slate-200 font-bold">{row.name}</span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{row.unit}</span>
                                            </div>
                                        </td>
                                        <td className="text-center text-slate-500">{row.opening.toFixed(2)}</td>
                                        <td className="text-center text-emerald-600 font-bold bg-emerald-50/50 dark:bg-emerald-900/10 rounded-lg">{row.purchase.toFixed(2)}</td>
                                        <td className="text-center text-slate-500">{row.totalInput.toFixed(2)}</td>

                                        <td
                                            className="text-center text-rose-600 font-bold cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors underline decoration-dotted underline-offset-4"
                                            onClick={() => setSelectedItemForDetails(row)}
                                        >
                                            {row.consumed.toFixed(2)}
                                        </td>

                                        <td className="text-center text-slate-500">{row.wastage.toFixed(2)}</td>
                                        <td className="text-center text-slate-500">{row.totalOutput.toFixed(2)}</td>
                                        <td className="text-center font-extrabold text-slate-800 dark:text-white bg-slate-50/50 dark:bg-slate-700/30">{row.closingStock.toFixed(2)}</td>
                                        <td className="text-center text-slate-500">{row.closingSummary.toFixed(2)}</td>
                                        <td className={`text-center font-bold ${row.difference < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                                            {row.difference.toFixed(2)}
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
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" onClick={() => setSelectedItemForDetails(null)}></div>
                    <div className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-800 shadow-2xl border-l border-slate-200 dark:border-slate-700 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Consumption Details</h2>
                                <p className="text-sm text-slate-500">Breakdown for <span className="text-primary-600 font-bold">{selectedItemForDetails.name}</span></p>
                            </div>
                            <button onClick={() => setSelectedItemForDetails(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
                            <div className="card p-0 overflow-hidden">
                                <table className="table-modern">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Item</th>
                                            <th className="text-right">Qty</th>
                                            <th>Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Simplified Mock Rows */}
                                        <tr>
                                            <td>
                                                <div className="font-bold text-slate-700 dark:text-slate-200">24 Dec, 2025</div>
                                                <div className="text-xs text-slate-400">15:06 PM</div>
                                            </td>
                                            <td>Classic Veg Burger</td>
                                            <td className="text-right font-bold text-rose-600">1.00</td>
                                            <td>
                                                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold">#2644</span>
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
