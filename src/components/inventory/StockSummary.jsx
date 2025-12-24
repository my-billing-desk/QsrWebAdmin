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
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            {/* ... Header and Filters ... */}

            {/* Table */}
            <div className="flex-1 overflow-auto bg-white dark:bg-gray-900 m-4 rounded shadow border border-gray-200 dark:border-gray-700">
                <table className="w-full text-xs text-left border-collapse min-w-[1200px]">
                    <thead className="bg-blue-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10">
                        {/* ... Existing Headers ... */}
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

                                    <td
                                        className="p-3 text-center border-r border-gray-200 text-green-600 cursor-pointer hover:bg-green-50 hover:underline"
                                        onClick={() => setSelectedItemForDetails(row)}
                                    >
                                        {row.consumed.toFixed(3)}
                                    </td>
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

            {/* Side Modal for Consumption Details */}
            {selectedItemForDetails && (
                <div className="absolute inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={() => setSelectedItemForDetails(null)}></div>

                    {/* Modal Panel */}
                    <div className="relative w-full max-w-2xl h-full bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 animate-in slide-in-from-right">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                                Stock Consumed Details Of {selectedItemForDetails.name}
                            </h2>
                            <button onClick={() => setSelectedItemForDetails(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            {/* Details Table */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-xs font-bold text-gray-700 uppercase">
                                        <tr>
                                            <th className="px-4 py-3">Invoice Date</th>
                                            <th className="px-4 py-3">Item Name</th>
                                            <th className="px-4 py-3 text-right">Qty</th>
                                            <th className="px-4 py-3 text-right">Price (₹)</th>
                                            <th className="px-4 py-3 text-right">Amount (₹)</th>
                                            <th className="px-4 py-3">Invoice No.</th>
                                            <th className="px-4 py-3">Consumed At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-600">
                                        {/* Mocking data rows for UI structure as per screenshot */}
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3">24-Dec-2025</td>
                                            <td className="px-4 py-3">Classic Veg Burger</td>
                                            <td className="px-4 py-3 text-right">1.000 pcs</td>
                                            <td className="px-4 py-3 text-right">0</td>
                                            <td className="px-4 py-3 text-right">0</td>
                                            <td className="px-4 py-3">
                                                <div className="font-bold text-gray-800">2644</div>
                                                <div className="text-green-600 text-xs">Success</div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">24-Dec-2025 15:06:35</td>
                                        </tr>
                                        {/* Total Row */}
                                        <tr className="bg-gray-100 font-bold text-gray-800">
                                            <td colSpan="2" className="px-4 py-3">Total consumption</td>
                                            <td className="px-4 py-3 text-right">1.000 pcs</td>
                                            <td colSpan="1" className="px-4 py-3 text-right">0</td>
                                            <td colSpan="3"></td>
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


