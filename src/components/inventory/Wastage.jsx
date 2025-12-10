import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Download, Search, Filter, Calendar } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function Wastage() {
    const [view, setView] = useState('list');
    const [wastages, setWastages] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [formData, setFormData] = useState(initialFormState());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [matRes, wastRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getWastages()
            ]);
            setRawMaterials(matRes.data || []);
            setWastages(wastRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { rawMaterialId: '', quantity: '', unit: '', avgPrice: 0, amount: 0, description: '' }]
        });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === 'rawMaterialId') {
            const mat = rawMaterials.find(m => m.id == value);
            if (mat) {
                newItems[index].unit = mat.consumptionUnit;
                newItems[index].avgPrice = mat.purchasePrice || 0; // Assuming purchasePrice as avg for now
            }
        }

        // Calculations
        if (field === 'quantity' || field === 'rawMaterialId') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].avgPrice) || 0;
            newItems[index].amount = (qty * price).toFixed(2);
        }

        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSave = async () => {
        try {
            const total = formData.items.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
            await inventoryService.createWastage({ ...formData, totalAmount: total });
            alert('Wastage record saved!');
            setView('list');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error saving wastage: ' + error.message);
        }
    };

    if (view === 'list') {
        return (
            <div className="flex flex-col h-full p-6 bg-gray-50 dark:bg-gray-900">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Wastage List</h1>
                    <div className="flex gap-2">
                        <button onClick={() => { setFormData(initialFormState()); setView('add'); }} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 font-medium">
                            <Plus className="w-4 h-4" /> Create New
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 font-medium">
                            <Download className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-600">Start Date</label>
                        <input type="date" className="p-2 border rounded text-sm bg-gray-50" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-600">End Date</label>
                        <input type="date" className="p-2 border rounded text-sm bg-gray-50" />
                    </div>
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className="text-xs font-bold text-gray-600">Status</label>
                        <select className="p-2 border rounded text-sm bg-gray-50"><option>All</option></select>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className="text-xs font-bold text-gray-600">Category</label>
                        <select className="p-2 border rounded text-sm bg-gray-50"><option>All</option></select>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[150px]">
                        <label className="text-xs font-bold text-gray-600">View</label>
                        <select className="p-2 border rounded text-sm bg-gray-50"><option>Date wise</option></select>
                    </div>

                    <button className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded font-medium hover:bg-red-50 mb-0.5">Search</button>
                    <button className="px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded font-medium hover:bg-gray-50 mb-0.5">Clear</button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-blue-50/50 border-b border-gray-200 text-xs font-bold uppercase text-gray-700">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Items</th>
                                <th className="p-4 text-right">Total Amount</th>
                                <th className="p-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {wastages.map(w => (
                                <tr key={w.id} className="hover:bg-gray-50">
                                    <td className="p-4">{new Date(w.date).toLocaleDateString()}</td>
                                    <td className="p-4">{w.type}</td>
                                    <td className="p-4 text-gray-500">{w.WastageItems?.length} items</td>
                                    <td className="p-4 text-right">₹ {w.totalAmount}</td>
                                    <td className="p-4 text-center"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">{w.status}</span></td>
                                </tr>
                            ))}
                            {wastages.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-red-50 p-4 rounded-full mb-3"><Search className="w-6 h-6 text-red-300" /></div>
                                            <span className="font-bold text-gray-400">No Record Found</span>
                                            <p className="text-xs mt-1">We could not find what you searched for. Try searching again.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
                <h1 className="text-xl font-bold text-gray-800">Add Wastage Details</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">Wastage for</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={formData.type === 'Raw Material'} onChange={() => setFormData({ ...formData, type: 'Raw Material', items: [] })} className="accent-green-600 w-4 h-4" />
                                    <span className="text-sm font-medium">Raw Material</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={formData.type === 'Item'} onChange={() => setFormData({ ...formData, type: 'Item', items: [] })} className="accent-green-600 w-4 h-4" />
                                    <span className="text-sm font-medium">Item</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 w-full max-w-xs">
                            <label className="text-xs font-bold text-red-500">Date *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="input-field border-gray-300"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Wastage Item Details</h3>
                        <div className="flex gap-2">
                            <button onClick={addItem} className="text-red-600 bg-white border border-red-200 px-4 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-red-50">
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                            <button className="text-gray-600 bg-white border border-gray-300 px-4 py-1.5 rounded text-sm font-bold hover:bg-gray-50">
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Header Row */}
                        <div className="flex gap-4 px-2 mb-2 text-xs font-bold text-gray-700">
                            <div className="flex-1">Raw Material <span className="text-red-500">*</span></div>
                            <div className="w-24">Quantity <span className="text-red-500">*</span></div>
                            <div className="w-24">Unit <span className="text-red-500">*</span></div>
                            <div className="w-32">Average Purchase Price</div>
                            <div className="w-32">Amount</div>
                            <div className="w-10"></div>
                            <div className="w-10"></div>
                        </div>

                        {formData.items.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <select
                                        value={item.rawMaterialId}
                                        onChange={e => updateItem(idx, 'rawMaterialId', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded outline-none text-sm"
                                    >
                                        <option value="">Select Raw Material</option>
                                        {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        placeholder="Quantity"
                                        value={item.quantity}
                                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded outline-none text-sm"
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        value={item.unit}
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded outline-none bg-gray-50 text-gray-500 text-sm"
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        value={item.avgPrice || ''}
                                        placeholder="Avg. Price"
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded outline-none bg-gray-50 text-gray-500 text-sm"
                                    />
                                </div>
                                <div className="w-32">
                                    <input
                                        value={item.amount || ''}
                                        placeholder="Amount"
                                        readOnly
                                        className="w-full p-2 border border-gray-300 rounded outline-none bg-gray-50 text-gray-500 text-sm"
                                    />
                                </div>
                                <div className="flex gap-2 w-20">
                                    <button className="p-2 border rounded hover:bg-gray-50"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                                    <button onClick={() => removeItem(idx)} className="p-2 border rounded hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-red-50 border-t border-red-100 p-4 flex justify-end items-center gap-4">
                <button onClick={() => setView('list')} className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2 bg-red-600 text-white rounded font-bold text-sm shadow hover:bg-red-700">Save Changes</button>
            </div>
        </div>
    );
}

function initialFormState() {
    return {
        date: new Date().toISOString().split('T')[0],
        type: 'Raw Material',
        items: [{ rawMaterialId: '', quantity: '', unit: '', avgPrice: 0, amount: 0, description: '' }]
    };
}
