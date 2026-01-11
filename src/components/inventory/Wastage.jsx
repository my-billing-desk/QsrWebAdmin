import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Download, Search, Filter, Calendar, X, ChevronDown, List, Upload } from 'lucide-react';
import { createPortal } from 'react-dom';
import { inventoryService } from '../../services/api';
import { getTodayLocal } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export function Wastage() {
    const [view, setView] = useState('list');
    const [wastages, setWastages] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [formData, setFormData] = useState(initialFormState());
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [matRes, wastRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getWastages()
            ]);
            setRawMaterials(matRes.data || []);
            setWastages(wastRes.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
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
                newItems[index].name = mat.name;
                newItems[index].unit = mat.consumptionUnit;
                newItems[index].avgPrice = mat.purchasePrice || 0;
                newItems[index].tax1 = mat.tax1 || 0;
                newItems[index].tax2 = mat.tax2 || 0;
            }
        }

        // Calculations
        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].avgPrice) || 0;
        const tax1 = parseFloat(newItems[index].tax1) || 0;
        const tax2 = parseFloat(newItems[index].tax2) || 0;

        const baseAmount = qty * price;
        const taxAmount = baseAmount * ((tax1 + tax2) / 100);
        newItems[index].amount = (baseAmount + taxAmount).toFixed(2);

        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSave = async () => {
        try {
            // Create new raw materials if any
            const updatedItems = [...formData.items];
            for (let i = 0; i < updatedItems.length; i++) {
                const item = updatedItems[i];
                if (!item.rawMaterialId && item.name?.trim()) {
                    const existingMat = rawMaterials.find(rm => rm.name.toLowerCase() === item.name.toLowerCase());
                    if (existingMat) {
                        updatedItems[i].rawMaterialId = existingMat.id;
                        updatedItems[i].name = existingMat.name;
                        updatedItems[i].unit = existingMat.consumptionUnit;
                    } else {
                        const res = await inventoryService.createRawMaterial({
                            name: item.name,
                            consumptionUnit: 'Piece',
                            purchaseUnit: 'Piece',
                            category: 'Uncategorized'
                        });
                        updatedItems[i].rawMaterialId = res.data.id;
                        updatedItems[i].name = res.data.name;
                        updatedItems[i].unit = res.data.consumptionUnit;
                    }
                }
            }

            const total = updatedItems.reduce((acc, item) => acc + (parseFloat(item.amount) || 0), 0);
            await inventoryService.createWastage({ ...formData, items: updatedItems, totalAmount: total });
            toast.success('Wastage record saved!');
            setView('list');
            loadData();
        } catch (error) {
            console.error(error);
            toast.error('Error saving wastage: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6">
            {/* List View */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Wastage List</h1>
                    <div className="text-sm text-gray-500 mt-1">Track and manage inventory wastage</div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => { setFormData(initialFormState()); setView('add'); }} className="btn-primary">
                        <Plus className="w-4 h-4" /> Record Wastage
                    </button>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
                <div className="space-y-1">
                    <label className="form-label">Wastage Type</label>
                    <select className="input-field">
                        <option>All Types</option>
                        <option>Raw Material</option>
                        <option>Item</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="form-label">Date Range</label>
                    <div className="flex items-center gap-2">
                        <input type="date" className="input-field" />
                        <span className="text-gray-400 font-medium">to</span>
                        <input type="date" className="input-field" />
                    </div>
                </div>
                <button className="btn-secondary self-end"><Filter className="w-4 h-4" /> Filter</button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                <table className="table-standard">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th">Date</th>
                            <th className="table-th">Type</th>
                            <th className="table-th">Items</th>
                            <th className="table-th text-right">Total Amount</th>
                            <th className="table-th text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : wastages.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-3 bg-gray-50 rounded-full text-gray-400"><Search className="w-6 h-6" /></div>
                                        <span className="font-bold text-gray-400">No Wastage Records Found</span>
                                        <p className="text-xs text-gray-400">Add a new record to get started.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            wastages.map(w => (
                                <tr key={w.id} className="table-row">
                                    <td className="table-td text-gray-600 font-medium whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(w.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="table-td">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-bold border border-blue-100">{w.type}</span>
                                    </td>
                                    <td className="table-td text-gray-500">{w.WastageItems?.length || 0} items</td>
                                    <td className="table-td text-right font-bold text-gray-800">₹ {parseFloat(w.totalAmount || 0).toFixed(2)}</td>
                                    <td className="table-td text-center">
                                        <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-bold">Recorded</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {view === 'add' && createPortal(
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-white">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Record Wastage</h2>
                                <p className="text-sm text-gray-500 mt-1">Log damaged or expired stock</p>
                            </div>
                            <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                            <div className="max-w-4xl mx-auto space-y-6">
                                <div className="card-standard p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="form-label">Wastage Type <span className="text-red-500">*</span></label>
                                        <div className="flex gap-4 p-1 bg-gray-100 rounded-lg border border-gray-200">
                                            <button
                                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${formData.type === 'Raw Material' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                onClick={() => setFormData({ ...formData, type: 'Raw Material', items: [] })}
                                            >
                                                Raw Material
                                            </button>
                                            <button
                                                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${formData.type === 'Item' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                onClick={() => setFormData({ ...formData, type: 'Item', items: [] })}
                                            >
                                                Processed Item
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="form-label">Wastage Date <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="card-standard p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-bold text-gray-800">Wastage Items</h3>
                                        <button onClick={addItem} className="btn-secondary text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                            <Plus className="w-4 h-4" /> Add Item
                                        </button>
                                    </div>

                                    <div className="overflow-x-auto border border-gray-200 rounded-lg min-h-[300px]">
                                        <table className="table-standard">
                                            <thead className="table-header">
                                                <tr>
                                                    <th className="px-4 py-3 w-[300px]">
                                                        {formData.type === 'Raw Material' ? 'Raw Material' : 'Item'}
                                                    </th>
                                                    <th className="px-4 py-3 w-32 text-center">Quantity</th>
                                                    <th className="px-4 py-3 w-32">Unit</th>
                                                    <th className="px-4 py-3 w-32 text-right">Avg Price</th>
                                                    <th className="px-4 py-3 w-32 text-right">Amount</th>
                                                    <th className="px-4 py-3 w-16 text-center"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {formData.items.map((item, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="p-4 relative">
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    className="input-field"
                                                                    placeholder="Select Material"
                                                                    value={focusedIndex === idx ? searchQuery : (item.name || '')}
                                                                    onFocus={() => {
                                                                        setFocusedIndex(idx);
                                                                        setSearchQuery(item.name || '');
                                                                    }}
                                                                    onChange={e => {
                                                                        const val = e.target.value;
                                                                        setSearchQuery(val);
                                                                        const newItems = [...formData.items];
                                                                        newItems[idx].name = val;
                                                                        newItems[idx].rawMaterialId = '';
                                                                        setFormData({ ...formData, items: newItems });
                                                                    }}
                                                                />
                                                                {focusedIndex === idx && (
                                                                    <>
                                                                        <div className="fixed inset-0 z-[105]" onClick={() => setFocusedIndex(null)}></div>
                                                                        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-[110] mt-1 max-h-48 overflow-y-auto">
                                                                            {rawMaterials.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                                                                rawMaterials
                                                                                    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                                                    .map(m => (
                                                                                        <button
                                                                                            key={m.id}
                                                                                            onClick={() => {
                                                                                                updateItem(idx, 'rawMaterialId', m.id);
                                                                                                setFocusedIndex(null);
                                                                                            }}
                                                                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-50 last:border-0"
                                                                                        >
                                                                                            {m.name}
                                                                                        </button>
                                                                                    ))
                                                                            ) : (
                                                                                <div className="p-3 text-xs text-gray-500 text-center">No matches</div>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white w-28 mx-auto">
                                                                <button onClick={() => updateItem(idx, 'quantity', Math.max(0, (parseFloat(item.quantity) || 0) - 1))} className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 font-bold border-r border-gray-200">-</button>
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                                    className="w-full text-center outline-none py-1.5 text-sm font-bold no-spinner"
                                                                />
                                                                <button onClick={() => updateItem(idx, 'quantity', (parseFloat(item.quantity) || 0) + 1)} className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 font-bold border-l border-gray-200">+</button>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {!item.rawMaterialId ? (
                                                                <select
                                                                    className="input-field"
                                                                    value={item.unit}
                                                                    onChange={e => updateItem(idx, 'unit', e.target.value)}
                                                                >
                                                                    <option value="">Unit</option>
                                                                    <option value="kg">kg</option>
                                                                    <option value="g">g</option>
                                                                    <option value="l">l</option>
                                                                    <option value="ml">ml</option>
                                                                    <option value="pcs">pcs</option>
                                                                </select>
                                                            ) : (
                                                                <div className="text-sm font-medium text-gray-500">{item.unit || '-'}</div>
                                                            )}
                                                        </td>
                                                        <td className="p-4">
                                                            <input
                                                                type="number"
                                                                value={item.avgPrice}
                                                                onChange={e => updateItem(idx, 'avgPrice', e.target.value)}
                                                                className="input-field text-right"
                                                            />
                                                        </td>
                                                        <td className="p-4 text-right font-bold text-gray-800">
                                                            ₹ {item.amount}
                                                        </td>
                                                        <td className="p-4 text-center">
                                                            <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
                            <button onClick={() => setView('list')} className="btn-secondary">Cancel</button>
                            <button onClick={handleSave} className="btn-primary min-w-[140px]">Record Wastage</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

function initialFormState() {
    return {
        date: getTodayLocal(),
        type: 'Raw Material',
        items: [{ rawMaterialId: '', name: '', quantity: 1, unit: '', avgPrice: 0, tax1: 0, tax2: 0, amount: 0, description: '' }]
    };
}

export default Wastage;
