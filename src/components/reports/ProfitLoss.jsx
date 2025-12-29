import React, { useState } from 'react';
import { RotateCcw, Calendar, Settings } from 'lucide-react';

export function ProfitLoss() {
    // Mock Data based on reference
    const months = ['Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025'];

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Profit / Loss Report</h1>
                    <div className="text-sm text-gray-500">View Reports of Profit / Loss Report</div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><Settings className="w-4 h-4" /></button>
                </div>
            </div>

            {/* 2. Filter Row */}
            <div className="flex justify-end items-center gap-4">
                <div className="relative w-64">
                    <input type="text" defaultValue="12/24/2025 - 12/30/2025" className="w-full border rounded p-2 text-sm focus:outline-none focus:border-orange-500" />
                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <button className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600">
                    Generate Report
                </button>
            </div>

            {/* 3. Report Table */}
            <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b">
                        <tr>
                            <th className="p-4 border-r w-64 bg-gray-50 sticky left-0 z-10"></th>
                            {months.map(m => <th key={m} className="p-4 text-center min-w-[120px]">{m}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {/* Income Section */}
                        <tr className="bg-gray-50/50">
                            <td className="p-4 font-bold text-gray-800 border-r sticky left-0 bg-gray-50/50 z-10">Income</td>
                            <td colSpan={6}></td>
                        </tr>
                        <tr>
                            <td className="p-4 text-gray-600 border-r sticky left-0 bg-white z-10 pl-8">Sales</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-600">$50,000</td>)}
                        </tr>
                        <tr>
                            <td className="p-4 text-gray-600 border-r sticky left-0 bg-white z-10 pl-8">Service</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-600">$30,000</td>)}
                        </tr>
                        <tr>
                            <td className="p-4 text-gray-600 border-r sticky left-0 bg-white z-10 pl-8">Purchase Return</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-600">$7,000</td>)}
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                            <td className="p-4 text-gray-800 border-r sticky left-0 bg-gray-50 z-10">Gross Profit</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-800">$8,000</td>)}
                        </tr>

                        {/* Expenses Section */}
                        <tr className="bg-gray-50/50">
                            <td className="p-4 font-bold text-gray-800 border-r sticky left-0 bg-gray-50/50 z-10">Expenses</td>
                            <td colSpan={6}></td>
                        </tr>
                        <tr>
                            <td className="p-4 text-gray-600 border-r sticky left-0 bg-white z-10 pl-8">Sales</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-600">$50,000</td>)}
                        </tr>
                        <tr>
                            <td className="p-4 text-gray-600 border-r sticky left-0 bg-white z-10 pl-8">Purchase</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-600">$30,000</td>)}
                        </tr>
                        <tr>
                            <td className="p-4 text-gray-600 border-r sticky left-0 bg-white z-10 pl-8">Sales Return</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-600">$7,000</td>)}
                        </tr>
                        <tr className="bg-gray-50 font-bold">
                            <td className="p-4 text-gray-800 border-r sticky left-0 bg-gray-50 z-10">Total Expense</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-800">$8,000</td>)}
                        </tr>

                        {/* Net Profit Section */}
                        <tr className="bg-white font-bold border-t-2 border-gray-100">
                            <td className="p-4 text-gray-800 border-r sticky left-0 bg-white z-10 text-lg">Net Profit</td>
                            {months.map(m => <td key={m} className="p-4 text-center text-gray-800 text-lg">$8,000</td>)}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
