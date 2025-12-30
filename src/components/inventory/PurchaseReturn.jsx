import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Eye, Edit, Trash2, X, Calendar, Download } from 'lucide-react';

import { inventoryService } from '../../services/api';

export function PurchaseReturn() {
    const [returns, setReturns] = useState([]);

    useEffect(() => {
        loadReturns();
    }, []);

    const loadReturns = async () => {
        try {
            const res = await inventoryService.getPurchaseReturns();
            setReturns(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Purchase Return</h1>
                    <div className="text-sm text-gray-500">Manage your purchase returns</div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2 ml-2">
                        <Plus className="w-4 h-4" /> Add Purchase Return
                    </button>
                    <button className="px-4 py-2 bg-gray-800 text-white rounded font-bold shadow-sm hover:bg-gray-900 flex items-center gap-2">
                        Sales Return
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
                                <th className="p-4">Image</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Reference</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Total ($)</th>
                                <th className="p-4">Paid ($)</th>
                                <th className="p-4">Due ($)</th>
                                <th className="p-4">Payment Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {returns.map((r) => {
                                const paid = parseFloat(r.paidAmount || 0);
                                const total = parseFloat(r.totalAmount || 0);
                                const due = total - paid;
                                return (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                        <td className="p-4">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center border text-xs text-gray-400">img</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-600">{r.Supplier?.name}</td>
                                        <td className="p-4 text-gray-600">{r.referenceNo || r.id}</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">{r.status || 'Active'}</span></td>
                                        <td className="p-4 text-gray-800">₹{total.toLocaleString()}</td>
                                        <td className="p-4 text-gray-600">₹{paid.toLocaleString()}</td>
                                        <td className="p-4 text-gray-600">₹{due.toLocaleString()}</td>
                                        <td className="p-4"><span className="px-2 py-1 rounded text-xs font-bold text-green-600 bg-green-100">{r.paymentStatus || 'Paid'}</span></td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-1.5 border rounded hover:bg-gray-50 text-gray-500"><Eye className="w-3 h-3" /></button>
                                                <button onClick={() => setIsEditModalOpen(true)} className="p-1.5 border rounded hover:bg-gray-50 text-green-600"><Edit className="w-3 h-3" /></button>
                                                <button className="p-1.5 border rounded hover:bg-gray-50 text-red-500"><Trash2 className="w-3 h-3" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Edit Return Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
                    <div className="bg-white rounded-lg w-full max-w-6xl shadow-2xl animate-in fade-in zoom-in duration-200 h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Add Purchase Return</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <span className="bg-white rounded-full p-1 border border-transparent hover:border-red-500 flex items-center justify-center">
                                    <div className="bg-red-500 text-white rounded-full p-0.5">
                                        <X className="w-4 h-4" />
                                    </div>
                                </span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="space-y-8">
                                {/* Top Form Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Supplier Name <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-600">
                                                    <option>Electro Mart</option>
                                                    <option>Apex Computers</option>
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                            <button className="bg-orange-500 text-white rounded-md w-10 flex items-center justify-center hover:bg-orange-600 transition-colors"><Plus className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <label className="text-sm font-semibold text-gray-700">Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input type="text" defaultValue="24 Dec 2024" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-600" />
                                            <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Reference No.</label>
                                        <input type="text" placeholder="REF-001" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-600" />
                                    </div>
                                </div>

                                {/* Product Search */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Product Name</label>
                                    <div className="relative">
                                        <input type="text" placeholder="Please type product code and select..." className="w-full border border-gray-300 rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 bg-gray-50" />
                                        <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                                            <tr>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Product</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider text-center">Batch No</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider text-center">Qty</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Return Price($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Discount($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Tax(%)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Tax Amount($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Total($)</th>
                                                <th className="p-3 w-10 text-center"><Trash2 className="w-4 h-4 mx-auto text-gray-500" /></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-gray-600 bg-white">
                                            <tr className="hover:bg-gray-50/50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-500">Img</div>
                                                        <span className="font-medium text-gray-800">Macbook Pro</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">Batch-001</td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-center border rounded-md w-24 mx-auto">
                                                        <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-orange-500 font-bold">-</button>
                                                        <input type="text" value="1" className="w-full text-center text-sm focus:outline-none font-medium" readOnly />
                                                        <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-orange-500 font-bold">+</button>
                                                    </div>
                                                </td>
                                                <td className="p-3">1200.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3 font-semibold text-gray-800">1200.00</td>
                                                <td className="p-3 text-center">
                                                    <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Summary Section */}
                                <div className="flex justify-end">
                                    <div className="w-full md:w-1/3">
                                        <div className="border rounded-md divide-y text-sm">
                                            <div className="flex justify-between p-3">
                                                <span className="text-gray-600">Order Tax</span>
                                                <span className="font-medium text-gray-800">$ 0.00</span>
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <span className="text-gray-600">Discount</span>
                                                <span className="font-medium text-gray-800">$ 0.00</span>
                                            </div>
                                            <div className="flex justify-between p-3">
                                                <span className="text-gray-600">Shipping</span>
                                                <span className="font-medium text-gray-800">$ 0.00</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-gray-50 font-bold">
                                                <span className="text-orange-600">Grand Total</span>
                                                <span className="text-gray-900">$ 1200.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Form Section */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Order Tax</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Discount</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Shipping</label>
                                        <input type="text" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Status</label>
                                        <div className="relative">
                                            <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-600">
                                                <option>Received</option>
                                                <option>Pending</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <textarea rows="3" className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none" placeholder="Enter notes..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t shrink-0 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                            <button className="px-6 py-2 bg-orange-500 text-white rounded-md font-bold hover:bg-orange-600 shadow-md transition-colors">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
