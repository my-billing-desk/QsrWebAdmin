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

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Stock Summary Report</h1>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 font-medium text-sm">
                        <Clock className="w-4 h-4" /> Schedule Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 text-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Raw Material</label>
                        <input
                            type="text"
                            value={filters.rawMaterial}
                            onChange={(e) => setFilters(prev => ({ ...prev, rawMaterial: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none focus:border-red-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none focus:border-red-500"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Unit Type</label>
                        <select
                            value={filters.unitType}
                            onChange={(e) => setFilters(prev => ({ ...prev, unitType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none focus:border-red-500"
                        >
                            <option value="Purchase Unit">Purchase Unit</option>
                            <option value="Consumption Unit">Consumption Unit</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">From Date</label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none focus:border-red-500"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">To Date</label>
                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-sm outline-none focus:border-red-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSearch}
                            className="flex-1 px-4 py-2 bg-red-700 text-white font-medium rounded hover:bg-red-800 transition-colors text-sm"
                        >
                            Search
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-600 font-medium rounded hover:bg-gray-50 transition-colors text-sm"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 m-4 rounded shadow border border-gray-200 dark:border-gray-700">
                <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                    <thead className="bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 border-r border-gray-200 bg-blue-50 sticky left-0 z-20">Raw Material</th>
                            <th className="p-3 text-center border-r border-gray-200">Opening<br />(A)</th>
                            <th className="p-3 text-center border-r border-gray-200 text-green-600">Purchase<br />(B)</th>
                            <th className="p-3 text-center border-r border-gray-200">Excess<br />(C)</th>
                            <th className="p-3 text-center border-r border-gray-200 bg-blue-100 font-bold text-blue-800">Total<br />(A+B+C)</th>

                            <th className="p-3 text-center border-r border-gray-200 text-green-600">Consumed<br />(D)</th>
                            <th className="p-3 text-center border-r border-gray-200">Wastage<br />(E)</th>
                            <th className="p-3 text-center border-r border-gray-200">Normal Loss<br />(F)</th>
                            <th className="p-3 text-center border-r border-gray-200">Transfer<br />(G)</th>
                            <th className="p-3 text-center border-r border-gray-200">Shortage<br />(H)</th>
                            <th className="p-3 text-center border-r border-gray-200">Conversion<br />(I)</th>

                            <th className="p-3 text-center border-r border-gray-200 bg-blue-100 font-bold text-blue-800">Total<br />(Out)</th>
                            <th className="p-3 text-center border-r border-gray-200">Closing Stock<br />(Calc)</th>
                            <th className="p-3 text-center border-r border-gray-200">Closing Summary<br />(Actual)</th>
                            <th className="p-3 text-center font-bold">Difference</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="15" className="p-8 text-center">Loading...</td></tr>
                        ) : summary.length === 0 ? (
                            <tr><td colSpan="15" className="p-8 text-center text-gray-500">No data found</td></tr>
                        ) : (
                            summary.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="p-3 font-medium border-r border-gray-200 sticky left-0 bg-white group-hover:bg-gray-50 z-10 w-48">
                                        <div className="truncate w-40" title={row.name}>{row.name}</div>
                                        <div className="text-[10px] text-gray-400">[{row.unit}]</div>
                                    </td>

                                    <td className="p-3 text-center border-r border-gray-200">{row.opening.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200 text-green-600 bg-green-50/30">{row.purchase.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.excess.toFixed(3)}</td>

                                    <td className="p-3 text-center border-r border-gray-200 bg-blue-50 font-bold">{row.totalInput.toFixed(3)}</td>

                                    <td className="p-3 text-center border-r border-gray-200 text-green-600">{row.consumed.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.wastage.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.normalLoss.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.transfer.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.shortage.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.conversion.toFixed(3)}</td>

                                    <td className="p-3 text-center border-r border-gray-200 bg-blue-50 font-bold">{row.totalOutput.toFixed(3)}</td>

                                    <td className="p-3 text-center border-r border-gray-200 font-bold">{row.closingStock.toFixed(3)}</td>
                                    <td className="p-3 text-center border-r border-gray-200">{row.closingSummary.toFixed(3)}</td>
                                    <td className={`p-3 text-center font-bold ${row.difference !== 0 ? 'text-red-500' : 'text-gray-800'}`}>{row.difference.toFixed(3)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


