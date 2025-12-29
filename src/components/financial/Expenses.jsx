import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Eye, Edit, Trash2, X, Calendar } from 'lucide-react';

export function Expenses() {
    // Mock Data based on reference
    const [expenses] = useState([
        { id: 1, ref: 'EX849', category: 'Utilities', desc: '', date: '24 Dec 2024', amount: '$200', status: 'Approved' },
        { id: 2, ref: 'EX848', category: 'Office Supplies', desc: 'Office', date: '10 Dec 2024', amount: '$50', status: 'Pending' },
        { id: 3, ref: 'EX847', category: 'Repairs & Maintenance', desc: '', date: '27 Nov 2024', amount: '$800', status: 'Approved' },
        { id: 4, ref: 'EX846', category: 'Marketing', desc: 'Campaign', date: '18 Nov 2024', amount: '$100', status: 'Approved' },
        { id: 5, ref: 'EX845', category: 'Travel Expenses', desc: 'Meeting', date: '06 Nov 2024', amount: '$700', status: 'Approved' },
        { id: 6, ref: 'EX844', category: 'Employee Benefits', desc: 'Team Lunch', date: '25 Oct 2024', amount: '$1000', status: 'Pending' },
        { id: 7, ref: 'EX843', category: 'Business Flight Ticket', desc: 'Flight tickets for meetings', date: '14 Oct 2024', amount: '$1200', status: 'Approved' },
        { id: 8, ref: 'EX842', category: 'Chair Purchase', desc: 'Ergonomic chairs for staff', date: '03 Oct 2024', amount: '$750', status: 'Approved' },
        { id: 9, ref: 'EX841', category: 'Plumbing', desc: 'Plumbing repairs in office', date: '20 Sep 2024', amount: '$450', status: 'Approved' },
        { id: 10, ref: 'EX840', category: 'Internet Bill Payment', desc: 'Monthly internet subscription', date: '10 Sep 2024', amount: '$300', status: 'Pending' },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
                    <div className="text-sm text-gray-500">Manage Your Expenses</div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Action Icons */}
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>

                    {/* Main Action */}
                    <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2 ml-2">
                        <Plus className="w-4 h-4" /> Add Expense
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
                                Category <ChevronDown className="w-4 h-4 text-gray-400" />
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
                                <th className="p-4">Reference</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 text-gray-600">{exp.ref}</td>
                                    <td className="p-4 font-bold text-gray-800">{exp.category}</td>
                                    <td className="p-4 text-gray-500 truncate max-w-[200px]">{exp.desc}</td>
                                    <td className="p-4 text-gray-600">{exp.date}</td>
                                    <td className="p-4 text-gray-800">{exp.amount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${exp.status === 'Approved' ? 'bg-green-600' : 'bg-cyan-500'}`}>
                                            {exp.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-gray-500"><Eye className="w-3 h-3" /></button>
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

            {/* 3. Add Expense Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[600px] shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Add Expense</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Expense <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            </div>

                            <div className="col-span-2 space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea rows="3" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500 resize-none"></textarea>
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-sm font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                        <option>Select</option>
                                        <option>Utilities</option>
                                        <option>Office Supplies</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-sm font-semibold text-gray-700">Date <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="dd/mm/yyyy" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Amount <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-sm font-semibold text-gray-700">Status <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                        <option>Select</option>
                                        <option>Approved</option>
                                        <option>Pending</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t flex justify-end gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 bg-gray-800 text-white rounded font-bold hover:bg-gray-900">Cancel</button>
                            <button className="px-6 py-2.5 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 shadow-lg shadow-orange-200">Add Expense</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
