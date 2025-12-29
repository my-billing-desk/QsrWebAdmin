import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Eye, Edit, Trash2, X, Calendar, Download } from 'lucide-react';

export function Purchase() {
    // Mock Data
    const [purchases] = useState([
        { id: 1, supplier: 'Apex Computers', ref: 'PO-001', date: '24 Dec 2024', status: 'Received', grandTotal: '$5000', paid: '$5000', due: '$0', paymentStatus: 'Paid' },
        { id: 2, supplier: 'Dazzle Shoes', ref: 'PO-002', date: '20 Dec 2024', status: 'Pending', grandTotal: '$2000', paid: '$0', due: '$2000', paymentStatus: 'Unpaid' },
        { id: 3, supplier: 'Best Accessories', ref: 'PO-003', date: '15 Dec 2024', status: 'Ordered', grandTotal: '$1500', paid: '$500', due: '$1000', paymentStatus: 'Partial' },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Purchase</h1>
                    <div className="text-sm text-gray-500">Manage your purchases</div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded font-bold shadow-sm hover:bg-gray-900 flex items-center gap-2 ml-2">
                        <Download className="w-4 h-4" /> Import Purchase
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Purchase
                    </button>
                </div>
            </div>

            {/* 2. Main Content Card */}
            <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <input type="text" placeholder="Search" className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 min-w-[120px] justify-between">
                                Payment Status <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4">Supplier Name</th>
                                <th className="p-4">Reference</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Grand Total</th>
                                <th className="p-4">Paid</th>
                                <th className="p-4">Due</th>
                                <th className="p-4">Payment Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {purchases.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 font-bold text-gray-800">{p.supplier}</td>
                                    <td className="p-4 text-gray-600">{p.ref}</td>
                                    <td className="p-4 text-gray-600">{p.date}</td>
                                    <td className="p-4"><span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">{p.status}</span></td>
                                    <td className="p-4 text-gray-800">{p.grandTotal}</td>
                                    <td className="p-4 text-green-600">{p.paid}</td>
                                    <td className="p-4 text-red-500">{p.due}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold text-white ${p.paymentStatus === 'Paid' ? 'bg-green-500' : p.paymentStatus === 'Unpaid' ? 'bg-red-500' : 'bg-orange-400'}`}>{p.paymentStatus}</span></td>
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
            </div>

            {/* 3. Add Purchase Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-5xl shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Add Purchase</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1 relative">
                                    <label className="text-sm font-semibold text-gray-700">Supplier Name <span className="text-red-500">*</span></label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                                <option>Dazzle Shoes</option>
                                                <option>Apex Computers</option>
                                                <option>Best Accessories</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                        </div>
                                        <button className="bg-gray-800 text-white rounded w-10 flex items-center justify-center hover:bg-gray-900"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="space-y-1 relative">
                                    <label className="text-sm font-semibold text-gray-700">Date <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="dd/mm/yyyy" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                    <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Reference <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                <input type="text" placeholder="Scan/Search Product by code and select..." className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            </div>

                            <div className="bg-gray-50 border rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                                        <tr>
                                            <th className="p-3">Product</th>
                                            <th className="p-3">Qty</th>
                                            <th className="p-3">Purchase Price($)</th>
                                            <th className="p-3">Discount($)</th>
                                            <th className="p-3">Tax(%)</th>
                                            <th className="p-3">Tax Amount($)</th>
                                            <th className="p-3">Unit Cost($)</th>
                                            <th className="p-3">Total Cost(%)</th>
                                            <th className="p-3 w-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y text-gray-600 bg-white">
                                        <tr>
                                            <td colSpan="9" className="p-3 text-center py-8 text-gray-400">No products added yet</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Order Tax <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Discount <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700">Shipping <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                </div>
                                <div className="space-y-1 relative">
                                    <label className="text-sm font-semibold text-gray-700">Status <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                            <option>Select</option>
                                            <option>Received</option>
                                            <option>Pending</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                                <textarea rows="3" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500 resize-none"></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t flex justify-end gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 bg-gray-800 text-white rounded font-bold hover:bg-gray-900">Cancel</button>
                            <button className="px-6 py-2.5 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 shadow-lg shadow-orange-200">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
