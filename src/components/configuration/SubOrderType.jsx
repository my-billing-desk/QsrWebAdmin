import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

export function SubOrderType() {
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data based on screenshot
    const [data] = useState([
        { id: 1, name: 'Delivery', type: 'Default Order Type', orderType: 'Delivery', status: 'Active', created: '20 Feb 2025' },
        { id: 2, name: 'Take Away', type: 'Default Order Type', orderType: 'Take Away', status: 'Active', created: '20 Feb 2025' },
        { id: 3, name: 'Dine In', type: 'Default Order Type', orderType: 'Dine In', status: 'Active', created: '20 Feb 2025' },
        { id: 4, name: 'Dine in', type: 'Area', orderType: 'Dine In', status: 'Active', created: '27 Feb 2025' },
        { id: 5, name: 'Zomato', type: 'Third Party Integration', orderType: 'Delivery, Take Away', status: 'Active', created: '15 Mar 2025' },
        { id: 6, name: 'Menu QR Code', type: 'Third Party Integration', orderType: 'Delivery, Take Away', status: 'Active', created: '5 Apr 2025' },
        { id: 7, name: 'SUNBURST STACK - Eksecond', type: 'Third Party Integration', orderType: 'Delivery, Take Away, Dine In', status: 'Active', created: '7 Apr 2025' },
        { id: 8, name: 'SUNBURST STACK - Uengage (ONDC)', type: 'Third Party Integration', orderType: 'Delivery, Take Away, Dine In', status: 'Inactive', created: '7 Apr 2025' },
    ]);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Sub Order Type</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2 hover:bg-red-700 font-medium text-sm">
                        <Plus className="w-4 h-4" /> Add Sub Order Type
                    </button>
                    <button className="px-4 py-2 border border-gray-300 bg-white rounded-md text-gray-700 hover:bg-gray-50 font-medium text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                        Action
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Sub Order Type Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                            placeholder=""
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 text-sm">
                            Search
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-md hover:bg-gray-50 text-sm dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                            Show All
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-blue-50/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 font-semibold border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-4 w-10"><input type="checkbox" className="rounded" /></th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Order Type</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Created</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {data.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="p-4"><input type="checkbox" className="rounded" /></td>
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-200">{row.name}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{row.type}</td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{row.orderType}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${row.status === 'Active'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 dark:text-gray-400">{row.created}</td>
                                <td className="p-4 flex gap-2">
                                    {/* Actions placeholder */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
