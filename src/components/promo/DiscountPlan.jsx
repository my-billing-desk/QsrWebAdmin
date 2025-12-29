import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Edit, Trash2, Percent } from 'lucide-react';

export function DiscountPlan() {
    // Mock Data based on reference
    const [plans] = useState([
        { id: 1, name: 'Standard Plan', customers: 'All Customers', status: 'Active' },
        { id: 2, name: 'Membership Plan', customers: 'Members Only', status: 'Active' },
        { id: 3, name: 'Premium Plan', customers: 'High-Spending Customers', status: 'Active' },
        { id: 4, name: 'Seasonal Plan', customers: 'All Customers', status: 'Active' },
        { id: 5, name: 'Student Plan', customers: 'Students', status: 'Active' },
        { id: 6, name: 'Free Shipping Plan', customers: 'Online Customers', status: 'Active' },
        { id: 7, name: 'Celebration Plan', customers: 'All Customers', status: 'Active' },
    ]);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Discount Plan</h1>
                    <div className="text-sm text-gray-500">Manage your discount plans</div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Action Icons */}
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>

                    {/* Main Action */}
                    <button className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2 ml-2">
                        <Plus className="w-4 h-4" /> Add Discount Plan
                    </button>
                </div>
            </div>

            {/* 2. Main Content Card */}
            <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* 2a. Filter Row */}
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 min-w-[100px] justify-between">
                                Customer <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 min-w-[90px] justify-between">
                                Status <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2b. Data Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4">Plan Name</th>
                                <th className="p-4">Customers</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {plans.map((plan) => (
                                <tr key={plan.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 font-bold text-gray-800">{plan.name}</td>
                                    <td className="p-4 text-gray-600">{plan.customers}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded text-xs font-bold text-white bg-green-500">
                                            {plan.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-green-600"><Edit className="w-3 h-3" /></button>
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-red-500"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 2c. Pagination */}
                <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        Row Per Page
                        <select className="border rounded px-2 py-1 bg-white">
                            <option>10</option>
                        </select>
                        Entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">&lt;</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-200">1</button>
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
