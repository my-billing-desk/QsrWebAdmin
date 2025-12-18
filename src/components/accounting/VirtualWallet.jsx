import React, { useState } from 'react';
import { Search, FileText, Calendar, RotateCcw } from 'lucide-react';

export function VirtualWallet() {
    const [filters, setFilters] = useState({
        mobile: '',
        startDate: '',
        endDate: ''
    });

    // Mock Data
    const [data, setData] = useState([
        { id: 1, mobile: '17,100.00', amount: '39,100.00', created: '9 Sep 2023 23:05:22' },
        { id: 2, mobile: '17,000.00', amount: '39,100.00', created: '9 Sep 2023 22:25:23' },
        { id: 3, mobile: '5,000.00', amount: '39,100.00', created: '1 Jan 2023 01:56:13' },
    ]);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Virtual Wallet</h1>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">Search</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Customer Mobile No.</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                            placeholder=""
                            value={filters.mobile}
                            onChange={(e) => setFilters({ ...filters, mobile: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 text-sm">
                            Search
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 text-sm dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                            Show All
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4">Mobile No.</th>
                            <th className="p-4">
                                <div>Remaining Amount (₹)</div>
                                <div className="text-xs text-gray-400">(39,100.00)</div>
                            </th>
                            <th className="p-4">Created</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-200">{row.mobile}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{row.amount}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{row.created}</td>
                                <td className="p-4 text-center">
                                    <button className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
                                        <FileText className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 text-xs text-gray-500 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    Showing 1 to {data.length} of {data.length} records
                </div>
            </div>

            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-900 transition-colors">
                    <RotateCcw className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
