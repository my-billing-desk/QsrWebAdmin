import React, { useState } from 'react';
import { ArrowRightLeft, Store, X, Plus, Trash2, Search, ChevronDown, Calendar } from 'lucide-react';
import { getTodayLocal } from '../../utils/dateUtils';

export function StockTransfer() {
    const [transfers, setTransfers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        date: getTodayLocal(),
        sourceOutlet: '',
        destinationOutlet: '',
        items: [{ itemId: '', quantity: '', unit: '' }]
    });

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { itemId: '', quantity: '', unit: '' }]
        });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 font-sans">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Stock Transfers</h1>
                    <div className="text-sm text-gray-500 mt-1">Manage stock movement between locations</div>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                    <ArrowRightLeft className="w-4 h-4" /> New Transfer
                </button>
            </div>

            {/* Empty State / List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Store className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">No Stock Transfers Yet</h3>
                <p className="text-gray-500 text-sm mt-2">Transfer stock between outlets or kitchen.</p>
            </div>

            {/* Add Transfer Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200 overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">New Stock Transfer</h2>
                                <p className="text-sm text-gray-500 mt-1">Move inventory items between locations</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50 custom-scrollbar">
                            <div className="max-w-4xl mx-auto space-y-6">
                                {/* Top Form */}
                                <div className="card-standard p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1.5 relative">
                                        <label className="form-label">Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="input-field" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="form-label">Source Location <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select className="input-field appearance-none">
                                                <option>Main Kitchen</option>
                                                <option>Outlet A</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="form-label">Destination Location <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select className="input-field appearance-none">
                                                <option>Outlet A</option>
                                                <option>Outlet B</option>
                                            </select>
                                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="card-standard p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-800">Transfer Items</h3>
                                        <button onClick={addItem} className="btn-secondary text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                            <Plus className="w-4 h-4" /> Add Item
                                        </button>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <table className="table-standard">
                                            <thead className="table-header">
                                                <tr>
                                                    <th className="table-th w-[40%]">Item / Raw Material</th>
                                                    <th className="table-th w-32">Transfer Qty</th>
                                                    <th className="table-th w-32">Unit</th>
                                                    <th className="table-th w-16 text-center"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {formData.items.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-3">
                                                            <div className="relative">
                                                                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                                                                <input className="input-field pl-9" placeholder="Search item..." />
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <input className="input-field text-center" placeholder="0" />
                                                        </td>
                                                        <td className="p-3">
                                                            <select className="input-field bg-transparent">
                                                                <option>Kg</option>
                                                                <option>Pcs</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4 mx-auto" /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="card-standard p-6 space-y-1.5">
                                    <label className="form-label">Notes / Remarks</label>
                                    <textarea rows="3" className="input-field resize-none" placeholder="Enter transfer details..."></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
                            <button onClick={() => setIsAddModalOpen(false)} className="btn-secondary">Cancel</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="btn-primary min-w-[140px]">Transfer Stock</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StockTransfer;
