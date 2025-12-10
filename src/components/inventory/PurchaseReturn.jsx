import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Undo2, Upload, MoreHorizontal } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function PurchaseReturn() {
    const [view, setView] = useState('list');
    const [returns, setReturns] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    const [formData, setFormData] = useState(initialFormState());

    // Summary Toggles
    const [showDiscount, setShowDiscount] = useState(false);
    const [showOtherCharges, setShowOtherCharges] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [matRes, supRes, retRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getSuppliers(),
                inventoryService.getPurchaseReturns()
            ]);
            setRawMaterials(matRes.data || []);
            setSuppliers(supRes.data || []);
            setReturns(retRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { rawMaterialId: '', quantity: '', unit: '', price: '', amount: 0, reason: '' }]
        });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        if (field === 'quantity' || field === 'price') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].price) || 0;
            newItems[index].amount = qty * price;
        }

        if (field === 'rawMaterialId') {
            const mat = rawMaterials.find(m => m.id == value);
            if (mat) newItems[index].unit = mat.purchaseUnit;
        }

        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const calculateSubTotal = () => {
        return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const calculateGrandTotal = () => {
        const subTotal = calculateSubTotal();
        const discount = showDiscount ? (parseFloat(formData.totalDiscount) || 0) : 0;
        const otherCharges = showOtherCharges ? (parseFloat(formData.otherCharges) || 0) : 0;
        return (subTotal - discount + otherCharges).toFixed(3);
    };

    const handleSave = async () => {
        try {
            await inventoryService.createPurchaseReturn({
                ...formData,
                grandTotal: calculateGrandTotal()
            });
            alert('Purchase Return Created!');
            setView('list');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error creating return: ' + error.message);
        }
    };

    if (view === 'list') {
        return (
            <div className="p-6 bg-gray-50 h-full flex flex-col">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold">Debit Note / Purchase Return</h1>
                    <button onClick={() => { setFormData(initialFormState()); setView('add'); }} className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Purchase Return
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Debit Note No</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {returns.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="p-4">{new Date(r.debitNoteDate).toLocaleDateString()}</td>
                                    <td className="p-4">{r.Supplier?.name}</td>
                                    <td className="p-4">{r.debitNoteNo}</td>
                                    <td className="p-4 text-right">₹ {r.grandTotal || r.totalAmount}</td>
                                </tr>
                            ))}
                            {returns.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No returns found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between shrink-0">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Purchase Return</h1>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <span>{new Date().toDateString()}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                {/* Form Header */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-bold text-gray-700">To:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked className="accent-green-600 w-4 h-4" readOnly />
                            <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Supplier</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-red-500">Supplier/Third Party *</label>
                            <select
                                value={formData.supplierId}
                                onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                                className="input-field border-gray-300"
                            >
                                <option value="">Please select</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-red-500">Debit Note Date *</label>
                            <input
                                type="date"
                                value={formData.debitNoteDate}
                                onChange={e => setFormData({ ...formData, debitNoteDate: e.target.value })}
                                className="input-field border-gray-300 w-full"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-red-500">Debit Note No. *</label>
                            <div className="flex gap-2">
                                <input
                                    value={formData.debitNoteNo}
                                    onChange={e => setFormData({ ...formData, debitNoteNo: e.target.value })}
                                    className="input-field border-gray-300 flex-1"
                                />
                                <button className="p-2 border rounded hover:bg-gray-50"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-600">Purchase Invoice No.</label>
                            <input
                                value={formData.invoiceNo}
                                onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                                className="input-field border-gray-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6 flex flex-col min-h-[400px]">
                    <div className="p-4 border-b border-gray-200 flex justify-end gap-3 bg-gray-50">
                        <button onClick={addItem} className="text-red-600 bg-white border border-red-200 px-4 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-red-50">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                        <button className="text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                            At Invoice Level <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                            More Actions <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 bg-white border border-gray-300 px-3 py-1.5 rounded text-sm font-bold hover:bg-gray-50 flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Upload Invoice
                        </button>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-blue-50/50 text-gray-700 text-xs font-bold uppercase">
                                <tr>
                                    <th className="p-4 w-10"><input type="checkbox" className="rounded text-gray-400" /></th>
                                    <th className="p-4 min-w-[200px]">Raw Material <span className="text-red-500">*</span></th>
                                    <th className="p-4 w-24">Qty <span className="text-red-500">*</span></th>
                                    <th className="p-4 w-24">Unit <span className="text-red-500">*</span></th>
                                    <th className="p-4 w-28">Price</th>
                                    <th className="p-4 w-32">Amount</th>
                                    <th className="p-4 w-60 text-center">Tax (%)</th>
                                    <th className="p-4 w-20 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {formData.items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 group">
                                        <td className="p-4 text-center"><input type="checkbox" className="rounded text-gray-400" /></td>
                                        <td className="p-4">
                                            <select
                                                value={item.rawMaterialId}
                                                onChange={e => updateItem(idx, 'rawMaterialId', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded outline-none"
                                            >
                                                <option value="">Select/Add Raw Material</option>
                                                {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded outline-none"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={item.unit}
                                                onChange={e => updateItem(idx, 'unit', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded outline-none bg-white"
                                            >
                                                <option>Unit</option>
                                                <option>Kg</option>
                                                <option>Piece</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={e => updateItem(idx, 'price', e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded outline-none"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                readOnly
                                                value={item.amount}
                                                className="w-full p-2 border border-gray-300 rounded outline-none bg-gray-50 text-gray-600"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <input placeholder="CGST" className="w-1/3 p-2 border border-gray-300 rounded outline-none text-center" />
                                                <input placeholder="SGST" className="w-1/3 p-2 border border-gray-300 rounded outline-none text-center" />
                                                <input placeholder="IGST" className="w-1/3 p-2 border border-gray-300 rounded outline-none text-center" />
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 border hover:bg-gray-100 rounded"><Edit2 className="w-3 h-3 text-gray-500" /></button>
                                                <button onClick={() => removeItem(idx)} className="p-1.5 border hover:bg-red-50 rounded"><Trash2 className="w-3 h-3 text-red-500" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6">
                        <div className="max-w-xs ml-auto space-y-3 text-sm">
                            <div className="flex justify-between font-bold text-gray-700">
                                <span>Sub Total :</span>
                                <span>{calculateSubTotal().toFixed(3)} <MoreHorizontal className="inline w-4 h-4" /></span>
                            </div>

                            {/* Discount Toggle */}
                            {!showDiscount ? (
                                <button onClick={() => setShowDiscount(true)} className="w-full border border-gray-300 bg-white py-1.5 rounded text-gray-600 font-bold hover:bg-gray-100 flex items-center gap-2 px-3">
                                    <Plus className="w-3 h-3" /> Total Discount
                                </button>
                            ) : (
                                <div className="flex justify-between items-center text-red-500">
                                    <span>Discount</span>
                                    <input
                                        type="number"
                                        value={formData.totalDiscount}
                                        onChange={e => setFormData({ ...formData, totalDiscount: parseFloat(e.target.value) })}
                                        className="w-24 p-1 border rounded text-right mx-2 text-black"
                                        autoFocus
                                    />
                                    <span className="-ml-1">- {formData.totalDiscount || '0.000'}</span>
                                    <button onClick={() => { setShowDiscount(false); setFormData({ ...formData, totalDiscount: 0 }); }} className="ml-2 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            )}

                            {/* Other Charges Toggle */}
                            {!showOtherCharges ? (
                                <button onClick={() => setShowOtherCharges(true)} className="w-full border border-gray-300 bg-white py-1.5 rounded text-gray-600 font-bold hover:bg-gray-100 flex items-center gap-2 px-3">
                                    <Plus className="w-3 h-3" /> Add Other Charges
                                </button>
                            ) : (
                                <div className="flex justify-between items-center text-gray-700">
                                    <span>Other Charges</span>
                                    <input
                                        type="number"
                                        value={formData.otherCharges}
                                        onChange={e => setFormData({ ...formData, otherCharges: parseFloat(e.target.value) })}
                                        className="w-24 p-1 border rounded text-right mx-2"
                                        autoFocus
                                    />
                                    <span>{formData.otherCharges || '0.000'}</span>
                                    <button onClick={() => { setShowOtherCharges(false); setFormData({ ...formData, otherCharges: 0 }); }} className="ml-2 hover:text-red-700"><Trash2 className="w-3 h-3" /></button>
                                </div>
                            )}

                            {/* Other Taxes */}
                            {!showOtherCharges && ( // Just mimicking list from SS, usually explicit
                                <button className="w-full border border-gray-300 bg-white py-1.5 rounded text-gray-600 font-bold hover:bg-gray-100 flex items-center gap-2 px-3">
                                    <Plus className="w-3 h-3" /> Other Taxes
                                </button>
                            )}

                            <div className="flex justify-between font-bold text-gray-700 pt-2 border-t border-gray-200">
                                <span>Grand Total :</span>
                                <span>{calculateGrandTotal()}</span>
                            </div>

                            <div className="flex justify-between items-center text-xs font-bold pt-2">
                                <span>Payment Type :</span>
                                <div className="bg-red-100 p-0.5 rounded-full flex">
                                    <button className="px-3 py-0.5 bg-white text-gray-800 rounded-full shadow-sm">Unpaid</button>
                                    <button className="px-3 py-0.5 text-red-500">Paid</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-red-50 border-t border-red-100 p-4 flex justify-between items-center">
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div className="w-5 h-5 flex items-center justify-center border border-green-600 rounded bg-white text-green-600">
                                <Plus className="w-4 h-4 rotate-45" />
                            </div>
                            <span className="text-sm font-bold text-gray-800">Update Inventory Stock</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div className="w-5 h-5 flex items-center justify-center border border-green-600 rounded bg-white text-green-600">
                                <Plus className="w-4 h-4 rotate-45" />
                            </div>
                            <span className="text-sm font-bold text-gray-800">Recipient can edit the invoice</span>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setView('list')} className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-red-600 text-white rounded font-bold text-sm shadow hover:bg-red-700">Save Changes</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function initialFormState() {
    return {
        supplierId: '',
        debitNoteDate: new Date().toISOString().split('T')[0],
        debitNoteNo: '1',
        invoiceNo: '',
        reason: '',
        items: [],
        totalDiscount: 0,
        otherCharges: 0
    };
}
