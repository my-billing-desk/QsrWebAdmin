import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, Printer, RotateCcw, Filter, Settings } from 'lucide-react';

export function Coupons() {
    // Mock Data based on reference
    const [coupons] = useState([
        { id: 1, name: 'New Year Blast', code: 'NEWYEAR30', desc: '30% off on New Year', type: 'Percentage', discount: '30%', limit: '01', valid: '04 Jan 2025', status: 'Active' },
        { id: 2, name: 'Christmas Cheer', code: 'CHRISTMAS100', desc: '$100 off holiday packages', type: 'Fixed Amount', discount: '$100', limit: '01', valid: '27 Dec 2024', status: 'Active' },
        { id: 3, name: 'Spooky Savings', code: 'HALLOWEEN20', desc: '20% off on Halloween items', type: 'Percentage', discount: '20%', limit: '02', valid: '28 Nov 2024', status: 'Active' },
        { id: 4, name: 'Black Friday', code: 'BLACKFRIDAY50', desc: '50% off electronics', type: 'Percentage', discount: '50%', limit: '04', valid: '18 Nov 2024', status: 'Inactive' },
        { id: 5, name: 'Golden Years Deal', code: 'SENIOR20', desc: '20% off for senior citizens', type: 'Percentage', discount: '20%', limit: '03', valid: '06 Nov 2024', status: 'Active' },
        { id: 6, name: 'Thanksgiving Special', code: 'THANKS10', desc: '10% off for Thanksgiving', type: 'Percentage', discount: '10%', limit: '01', valid: '31 Oct 2024', status: 'Active' },
        { id: 7, name: 'New Year Blast', code: 'STUDENT10', desc: '10% off for students', type: 'Percentage', discount: '10%', limit: '02', valid: '14 Oct 2024', status: 'Active' },
        { id: 8, name: 'Big Saver Deal', code: 'SAVE50', desc: '$50 off orders over $300', type: 'Fixed Amount', discount: '$50', limit: '03', valid: '03 Oct 2024', status: 'Inactive' },
    ]);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
                    <div className="text-sm text-gray-500">Manage Your Coupons</div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Action Icons */}
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>

                    {/* Main Action */}
                    <button className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2 ml-2">
                        <Plus className="w-4 h-4" /> Add Coupons
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
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 min-w-[80px] justify-between">
                                Type <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 min-w-[90px] justify-between">
                                Status <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 w-48 justify-between">
                                Sort By : Last 7 Days <ChevronDown className="w-4 h-4 text-gray-400" />
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
                                <th className="p-4">Name</th>
                                <th className="p-4">Code</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Discount</th>
                                <th className="p-4">Limit</th>
                                <th className="p-4">Valid</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 font-bold text-gray-800">{coupon.name}</td>
                                    <td className="p-4">
                                        <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded text-xs font-bold uppercase border border-purple-100">
                                            {coupon.code}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{coupon.desc}</td>
                                    <td className="p-4 text-gray-600">{coupon.type}</td>
                                    <td className="p-4 text-gray-600">{coupon.discount}</td>
                                    <td className="p-4 text-gray-600">{coupon.limit}</td>
                                    <td className="p-4 text-gray-600">{coupon.valid}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${coupon.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {coupon.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="w-8 h-8 inline-flex items-center justify-center bg-orange-50 text-orange-500 rounded hover:bg-orange-100 transition-colors">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 2c. Pagination (Reusing style from SmartTable/Reference) */}
                <div className="p-4 border-t flex justify-end gap-2">
                    <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm">Previous</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded text-sm font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border hover:bg-gray-50 rounded text-sm">2</button>
                    <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm">Next</button>
                </div>
            </div>
        </div>
    );
}
