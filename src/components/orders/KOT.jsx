import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, Eye, RotateCcw, Filter, Printer } from 'lucide-react';

export function KOT() {
    const [kots, setKots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '2025-12-13 01:30:00',
        endDate: '2025-12-14 01:30:00',
        kotId: '',
        customerName: '',
        customerPhone: '',
        tableNo: '',
        orderType: 'All',
        status: 'All'
    });

    useEffect(() => {
        // Mock data loading
        setKots([
            {
                id: 2,
                orderType: 'Dine In (1)',
                customerName: '-',
                customerPhone: '-',
                noOfItems: 4,
                items: ['Blue Curco Mojito', 'Lemon Mint Mojito', 'Oreo Shake', 'Spicy Paneer Wrap'],
                status: 'Used In Bill',
                billPrintDate: '13 Dec 2025 14:41:48',
                created: '13 Dec 2025 14:41:48'
            },
            {
                id: 1,
                orderType: 'Take Away',
                customerName: '-',
                customerPhone: '-',
                noOfItems: 1,
                items: ['Aloo Tikki Burger Combos'],
                status: 'Used In Bill',
                billPrintDate: '13 Dec 2025 14:30:49',
                created: '13 Dec 2025 14:30:49'
            }
        ]);
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        console.log("Searching with filters:", filters);
        setLoading(true);
        // Simulate fetch
        setTimeout(() => setLoading(false), 500);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 font-sans">
            {/* Header Actions */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <div className="flex gap-4">
                    <button className="relative pb-2 border-b-2 border-red-600 text-red-600 font-bold text-sm">
                        KOT
                    </button>
                    <button className="relative pb-2 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
                        Consolidated KOT
                    </button>
                    <button className="relative pb-2 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
                        Item Wise KOT
                    </button>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50 bg-white shadow-sm">
                        Action
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50 bg-white shadow-sm">
                        Export Excel
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Search className="w-4 h-4" /> Search
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Start Date</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                    </div>
                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">End Date</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                    </div>
                    {/* KOT ID */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">KOT ID</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors" />
                    </div>
                    {/* Order No. */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Order No.</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors" />
                    </div>
                    {/* Customer Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Customer Name</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Order Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Order Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors">
                            <option>All</option>
                        </select>
                    </div>
                    {/* KOT Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">KOT Status</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors">
                            <option>All</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={handleSearch} className="px-6 py-2 bg-red-700 text-white rounded font-medium shadow-sm hover:bg-red-800 transition-colors text-sm">Search</button>
                    <button className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors text-sm">Show All</button>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-blue-50 text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th className="p-3 w-10"><input type="checkbox" /></th>
                                <th className="p-3">KOT ID</th>
                                <th className="p-3">Order No.</th>
                                <th className="p-3">Order Type</th>
                                <th className="p-3">Customer Name</th>
                                <th className="p-3">Assign To</th>
                                <th className="p-3 w-1/3">Items</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Created</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="10" className="p-4 text-center">Loading KOTs...</td></tr>
                            ) : kots.length === 0 ? (
                                <tr><td colSpan="10" className="p-4 text-center text-gray-500">No active KOTs found.</td></tr>
                            ) : kots.map(kot => (
                                <tr key={kot.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 align-top"><input type="checkbox" /></td>
                                    <td className="p-3 align-top font-medium text-gray-900">{kot.id}</td>
                                    <td className="p-3 align-top font-medium text-blue-600">{kot.orderNumber}</td>
                                    <td className="p-3 align-top">
                                        <div className="font-semibold">{kot.type}</div>
                                        <div className="text-xs text-gray-500">({kot.subType || 'POS'})</div>
                                    </td>
                                    <td className="p-3 align-top">{kot.customerName || '-'}</td>
                                    <td className="p-3 align-top">{kot.assignTo || '-'}</td>
                                    <td className="p-3 align-top">
                                        <div className="text-sm font-medium text-gray-800 line-clamp-2">
                                            {kot.items && kot.items.map(i => i.itemName).join(', ')}
                                        </div>
                                    </td>
                                    <td className="p-3 align-top">
                                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                                            {kot.status}
                                        </span>
                                    </td>
                                    <td className="p-3 align-top text-xs text-gray-500">
                                        {new Date(kot.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-3 align-top">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"><Printer className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-500 px-2">
                    <span>Showing 1 to {kots.length} of {kots.length} records</span>
                </div>
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-900 transition-colors">
                    <span className="text-xl">💬</span>
                </button>
            </div>
        </div>
    );
}
