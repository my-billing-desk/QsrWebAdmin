import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Eye, Edit, Trash2, X, Calendar, Download, List } from 'lucide-react';

import { inventoryService } from '../../services/api';

export function Purchase() {
    const [purchases, setPurchases] = useState([]);

    useEffect(() => {
        loadPurchases();
    }, []);

    const loadPurchases = async () => {
        try {
            const res = await inventoryService.getPurchases();
            setPurchases(res.data);
        } catch (error) {
            console.error(error);
        }
    };


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
                            {purchases.map((p) => {
                                const paid = p.paidAmount || 0;
                                const due = parseFloat(p.totalAmount || 0) - parseFloat(paid);
                                const payStatus = due <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Unpaid';

                                return (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                        <td className="p-4 font-bold text-gray-800">{p.Supplier?.name || 'Unknown'}</td>
                                        <td className="p-4 text-gray-600">{p.invoiceNumber}</td>
                                        <td className="p-4 text-gray-600">{new Date(p.invoiceDate).toLocaleDateString()}</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">{p.status}</span></td>
                                        <td className="p-4 text-gray-800">₹{parseFloat(p.totalAmount || 0).toLocaleString()}</td>
                                        <td className="p-4 text-green-600">₹{parseFloat(paid).toLocaleString()}</td>
                                        <td className="p-4 text-red-500">₹{due.toLocaleString()}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold text-white ${payStatus === 'Paid' ? 'bg-green-500' : payStatus === 'Unpaid' ? 'bg-red-500' : 'bg-orange-400'}`}>{payStatus}</span></td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-1.5 border rounded hover:bg-gray-50 text-gray-500"><Eye className="w-3 h-3" /></button>
                                                <button className="p-1.5 border rounded hover:bg-gray-50 text-green-600"><Edit className="w-3 h-3" /></button>
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

            {/* 3. Add Purchase Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans">
                    <div className="bg-white rounded-lg w-full max-w-6xl shadow-2xl animate-in fade-in zoom-in duration-200 h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Add Purchase</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <span className="bg-white rounded-full p-1 border border-transparent hover:border-red-500 flex items-center justify-center">
                                    <div className="bg-red-500 text-white rounded-full p-0.5">
                                        <X className="w-4 h-4" />
                                    </div>
                                </span>
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                            <div className="space-y-8">
                                {/* Top Form Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Supplier Name <span className="text-red-500">*</span></label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <select className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-600">
                                                    <option>Select</option>
                                                    <option>Apex Computers</option>
                                                </select>
                                                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                            <button className="bg-orange-500 text-white rounded-md w-10 flex items-center justify-center hover:bg-orange-600 transition-colors"><Plus className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 relative">
                                        <label className="text-sm font-semibold text-gray-700">Purchase Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input type="text" placeholder="19 Jan 2025" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-600" />
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
                                        <svg className="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
                                    </div>
                                </div>

                                {/* Product Table */}
                                <div className="border rounded-md overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 text-gray-700 font-bold border-b">
                                            <tr>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Product</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider text-center">Qty</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Purchase Price($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Discount($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Tax(%)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Tax Amount($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Unit Cost($)</th>
                                                <th className="p-3 font-semibold text-xs uppercase tracking-wider">Total Cost($)</th>
                                                <th className="p-3 w-10 text-center"><Trash2 className="w-4 h-4 mx-auto text-gray-500" /></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y text-gray-600 bg-white">
                                            {/* Example Row 1 */}
                                            <tr className="hover:bg-gray-50/50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-500">Img</div>
                                                        <span className="font-medium text-gray-800">Nike Jordan</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-center border rounded-md w-24 mx-auto">
                                                        <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-orange-500 font-bold">-</button>
                                                        <input type="text" value="2" className="w-full text-center text-sm focus:outline-none font-medium" readOnly />
                                                        <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-orange-500 font-bold">+</button>
                                                    </div>
                                                </td>
                                                <td className="p-3">2000.00</td>
                                                <td className="p-3">500.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3 text-gray-800 font-semibold">1500.00</td>
                                                <td className="p-3 text-center">
                                                    <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </td>
                                            </tr>
                                            {/* Example Row 2 */}
                                            <tr className="hover:bg-gray-50/50">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-gray-100 border flex items-center justify-center text-xs text-gray-500">Img</div>
                                                        <span className="font-medium text-gray-800">Apple Series 5 Watch</span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center justify-center border rounded-md w-24 mx-auto">
                                                        <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-orange-500 font-bold">-</button>
                                                        <input type="text" value="2" className="w-full text-center text-sm focus:outline-none font-medium" readOnly />
                                                        <button className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-orange-500 font-bold">+</button>
                                                    </div>
                                                </td>
                                                <td className="p-3">3000.00</td>
                                                <td className="p-3">400.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3">0.00</td>
                                                <td className="p-3 text-gray-800 font-semibold">1700.00</td>
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
                                                <span className="text-gray-900">$ 3200.00</span>
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
                                                <option>Ordered</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Description with Toolbar */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <div className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-orange-500">
                                        <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-3 text-gray-500 text-sm">
                                            <button className="hover:text-gray-800 font-bold">B</button>
                                            <button className="hover:text-gray-800 italic">I</button>
                                            <button className="hover:text-gray-800 underline">U</button>
                                            <div className="w-px bg-gray-300 h-4 my-auto"></div>
                                            <button className="hover:text-gray-800"><List className="w-4 h-4" /></button>
                                        </div>
                                        <textarea rows="3" className="w-full p-3 text-sm focus:outline-none resize-none" placeholder="Enter notes..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t shrink-0 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                            <button className="px-6 py-2 bg-orange-500 text-white rounded-md font-bold hover:bg-orange-600 shadow-md transition-colors">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
