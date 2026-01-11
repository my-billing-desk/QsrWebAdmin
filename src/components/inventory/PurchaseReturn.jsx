import React, { useState, useEffect } from 'react';
import {
    Search, ChevronDown, Plus, FileText, RotateCcw, Eye, Trash2, X,
    Calendar, Download, ShoppingBag, Settings, MoreVertical, Edit2,
    Filter, ArrowUpDown, Upload, UserPlus, FileQuestion
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import { getTodayLocal } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export function PurchaseReturn() {
    const [returns, setReturns] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('list');
    const [isSaving, setIsSaving] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterQuery, setFilterQuery] = useState('');

    const [formData, setFormData] = useState(initialFormState());
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', email: '' });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [retRes, supRes, matRes, purRes, poRes] = await Promise.all([
                inventoryService.getPurchaseReturns(),
                inventoryService.getSuppliers(),
                inventoryService.getRawMaterials(),
                inventoryService.getPurchases(),
                inventoryService.getPurchaseOrders()
            ]);
            setReturns(retRes.data || []);
            setSuppliers(supRes.data || []);
            setRawMaterials(matRes.data || []);
            setPurchases(purRes.data || []);
            setPurchaseOrders(poRes.data || []);
        } catch (error) {
            console.error('Failed to load return data:', error);
            toast.error("Failed to load records");
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { ...initialItemState }]
        }));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];

        if (field === 'rawMaterialId') {
            const mat = rawMaterials.find(m => m.id == value);
            if (mat) {
                newItems[index].rawMaterialId = mat.id;
                newItems[index].name = mat.name;
                newItems[index].unit = mat.purchaseUnit || mat.consumptionUnit;
                newItems[index].price = mat.purchasePrice || 0;
                newItems[index].tax1 = mat.tax1 || 0;
                newItems[index].tax2 = mat.tax2 || 0;
            } else {
                newItems[index].rawMaterialId = '';
                newItems[index].name = '';
            }
        } else {
            newItems[index][field] = value;
        }

        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].price) || 0;
        const tax1 = parseFloat(newItems[index].tax1) || 0;
        const tax2 = parseFloat(newItems[index].tax2) || 0;

        const baseAmount = qty * price;
        const taxAmt = baseAmount * ((tax1 + tax2) / 100);
        const total = baseAmount + taxAmt;

        newItems[index].taxAmount = taxAmt.toFixed(2);
        newItems[index].amount = total.toFixed(2);

        setFormData({ ...formData, items: newItems });
        if (field === 'rawMaterialId') setFocusedIndex(null);
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateSubTotal = () => {
        return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const calculateGrandTotal = () => {
        const sub = calculateSubTotal();
        const disc = parseFloat(formData.totalDiscount) || 0;
        const other = parseFloat(formData.otherCharges) || 0;
        const delivery = parseFloat(formData.deliveryCharges) || 0;
        const taxes = parseFloat(formData.otherTaxes) || 0;
        return (sub - disc + other + taxes + delivery).toFixed(2);
    };

    const applyPurchaseData = (purchase) => {
        if (!purchase) return;
        setFormData(prev => ({
            ...prev,
            supplierId: purchase.supplierId || purchase.Supplier?.id || prev.supplierId,
            purchaseId: purchase.id,
            items: purchase.PurchaseItems?.map(item => ({
                rawMaterialId: item.rawMaterialId,
                name: item.RawMaterial?.name || 'Item',
                quantity: item.quantity,
                unit: item.unit || item.RawMaterial?.purchaseUnit || '',
                price: item.price,
                tax1: item.tax1 || 0,
                tax2: item.tax2 || 0,
                taxAmount: item.taxAmount || 0,
                amount: item.amount
            })) || prev.items
        }));
    };

    const handleSave = async () => {
        if (!formData.supplierId) return toast.error('Please select a supplier');
        if (formData.items.length === 0) return toast.error('Please add at least one item');

        setIsSaving(true);
        try {
            await inventoryService.createPurchaseReturn({
                ...formData,
                grandTotal: calculateGrandTotal()
            });
            toast.success('Purchase Return Saved Successfully!');
            setView('list');
            loadData();
        } catch (error) {
            toast.error('Error saving return: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddQuickSupplier = async () => {
        if (!newSupplier.name) return toast.error("Supplier name is required");
        try {
            const res = await inventoryService.createSupplier(newSupplier);
            toast.success("Supplier added!");
            const added = res.data;
            setSuppliers(prev => [...prev, added]);
            setFormData(prev => ({ ...prev, supplierId: added.id }));
            setShowSupplierModal(false);
            setNewSupplier({ name: '', phone: '', email: '' });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add supplier");
        }
    };

    const totals = {
        total: returns.reduce((sum, r) => sum + (parseFloat(r.grandTotal) || 0), 0).toFixed(2),
        count: returns.length,
        avg: returns.length ? (returns.reduce((sum, r) => sum + (parseFloat(r.grandTotal) || 0), 0) / returns.length).toFixed(2) : '0.00'
    };

    if (view === 'list') {
        return (
            <div className="flex flex-col h-full bg-gray-50 p-6 gap-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Purchase Returns</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage returns & debit notes</p>
                    </div>
                    <button
                        onClick={() => { setFormData(initialFormState()); setView('add'); }}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" /> Create Return
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-standard p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-50 rounded-xl">
                                <RotateCcw className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Return Value</p>
                                <p className="text-2xl font-bold text-gray-900">₹ {totals.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-standard p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-orange-50 rounded-xl">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Transactions</p>
                                <p className="text-2xl font-bold text-gray-900">{totals.count} <span className="text-xs text-gray-400">Orders</span></p>
                            </div>
                        </div>
                    </div>
                    <div className="card-standard p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <ArrowUpDown className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Average Return</p>
                                <p className="text-2xl font-bold text-gray-900">₹ {totals.avg}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="card-standard flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-4 bg-gray-50/50">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search returns or suppliers..."
                                className="input-field pl-10"
                                value={filterQuery}
                                onChange={e => setFilterQuery(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={loadData} className="btn-secondary"><RotateCcw className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="table-standard">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Supplier</th>
                                    <th className="table-th">Date</th>
                                    <th className="table-th">Debit Note #</th>
                                    <th className="table-th">Reason</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-right">Value (₹)</th>
                                    <th className="table-th text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {returns.filter(r =>
                                (r.debitNoteNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
                                    r.Supplier?.name.toLowerCase().includes(filterQuery.toLowerCase()))
                                ).map((r) => (
                                    <tr key={r.id} className="table-row">
                                        <td className="table-td">
                                            <div className="font-semibold text-gray-900">{r.Supplier?.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">Vendor Account</div>
                                        </td>
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span className="font-medium text-gray-700">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="table-td">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-mono font-medium">
                                                {r.debitNoteNumber}
                                            </span>
                                        </td>
                                        <td className="table-td max-w-xs truncate text-gray-600 font-medium text-xs">
                                            {r.reason || 'No specific reason'}
                                        </td>
                                        <td className="table-td">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                {r.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="table-td text-right font-bold text-gray-900">
                                            ₹{parseFloat(r.grandTotal || 0).toFixed(2)}
                                        </td>
                                        <td className="table-td">
                                            <div className="flex justify-center gap-2">
                                                <button className="btn-icon text-gray-400 hover:text-blue-500" title="View"><Eye className="w-4 h-4" /></button>
                                                <button className="btn-icon text-gray-400 hover:text-red-500" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {returns.length === 0 && !loading && (
                            <div className="p-12 text-center flex flex-col items-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-full">
                                    <FileQuestion className="w-6 h-6 text-gray-300" />
                                </div>
                                <div className="text-gray-400 font-medium">No purchase return records found.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Modal View
    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">New Purchase Return</h2>
                        <p className="text-sm text-gray-500 mt-1">Generate debit note for supplier</p>
                    </div>
                    <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Master Fields */}
                        <div className="card-standard p-6 grid grid-cols-12 gap-6">
                            <div className="col-span-3 space-y-1.5">
                                <label className="form-label">Select Invoice (Link)</label>
                                <select
                                    className="input-field"
                                    value={formData.purchaseId}
                                    onChange={e => {
                                        const pur = purchases.find(p => p.id == e.target.value);
                                        if (pur) applyPurchaseData(pur);
                                    }}
                                >
                                    <option value="">Direct Return (No Link)</option>
                                    {purchases.map(p => (
                                        <option key={p.id} value={p.id}>{p.invoiceNumber} (₹{p.grandTotal})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="form-label">PO Reference</label>
                                <select
                                    className="input-field"
                                    value={formData.poId}
                                    onChange={e => setFormData({ ...formData, poId: e.target.value })}
                                >
                                    <option value="">No PO</option>
                                    {purchaseOrders.map(po => (
                                        <option key={po.id} value={po.id}>{po.poNumber}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-3 space-y-1.5">
                                <label className="form-label">Supplier <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <select
                                        className="input-field"
                                        value={formData.supplierId}
                                        onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <button
                                        onClick={() => setShowSupplierModal(true)}
                                        className="btn-secondary px-3"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="form-label">Return Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.debitNoteDate}
                                    onChange={e => setFormData({ ...formData, debitNoteDate: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="form-label">Debit Note #</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="input-field bg-gray-100 text-gray-500 font-mono"
                                    value={formData.debitNoteNumber}
                                />
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="card-standard p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-800">Return Items</h3>
                                <button onClick={addItem} className="btn-secondary text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="table-standard">
                                    <thead className="table-header">
                                        <tr>
                                            <th className="px-4 py-3 w-[350px]">Raw Material <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-36">Qty <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-40">Unit <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-40 text-right">Price</th>
                                            <th className="px-4 py-3 w-28 text-right">Tax 1 (%)</th>
                                            <th className="px-4 py-3 w-28 text-right">Tax 2 (%)</th>
                                            <th className="px-4 py-3 w-40 text-right">Total</th>
                                            <th className="px-4 py-3 w-16 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {formData.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-2 relative">
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
                                                                                    onClick={() => updateItem(idx, 'rawMaterialId', m.id)}
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
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="input-field"
                                                        value={item.quantity}
                                                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
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
                                                            <option value="pkt">pkt</option>
                                                            <option value="box">box</option>
                                                            <option value="can">can</option>
                                                        </select>
                                                    ) : (
                                                        <span className="text-sm text-gray-500 px-2 font-medium">{item.unit || '-'}</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="input-field text-right"
                                                        value={item.price}
                                                        onChange={e => updateItem(idx, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="input-field text-right"
                                                        placeholder="0"
                                                        value={item.tax1}
                                                        onChange={e => updateItem(idx, 'tax1', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="input-field text-right"
                                                        placeholder="0"
                                                        value={item.tax2}
                                                        onChange={e => updateItem(idx, 'tax2', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-bold text-gray-900">
                                                    ₹ {item.amount}
                                                </td>
                                                <td className="px-4 py-2 text-center">
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

                        {/* Summary Section */}
                        <div className="card-standard p-6 flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="form-label">Reason for Return *</label>
                                    <textarea
                                        placeholder="Damage, quality issue, mismatch, etc..."
                                        className="input-field h-24 resize-none"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    ></textarea>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="form-label">Internal Notes</label>
                                    <textarea
                                        placeholder="Add notes..."
                                        className="input-field h-24 resize-none"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-900">₹ {calculateSubTotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Discount</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.totalDiscount}
                                            onChange={e => setFormData({ ...formData, totalDiscount: e.target.value })}
                                            className="input-field text-right py-1 h-8 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Other Taxes</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.otherTaxes}
                                            onChange={e => setFormData({ ...formData, otherTaxes: e.target.value })}
                                            className="input-field text-right py-1 h-8 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Shipping / Delivery</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.deliveryCharges}
                                            onChange={e => setFormData({ ...formData, deliveryCharges: e.target.value })}
                                            className="input-field text-right py-1 h-8 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Other Charges</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.otherCharges}
                                            onChange={e => setFormData({ ...formData, otherCharges: e.target.value })}
                                            className="input-field text-right py-1 h-8 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Grand Total</span>
                                    <span className="text-xl font-bold text-blue-600">₹ {calculateGrandTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={formData.updateStock}
                            onChange={e => setFormData({ ...formData, updateStock: e.target.checked })}
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">Update Inventory Stock (Deduct)</span>
                    </label>
                    <div className="flex gap-3">
                        <button onClick={() => setView('list')} className="btn-secondary">Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-primary min-w-[120px]"
                        >
                            {isSaving ? 'Processing...' : (formData.id ? 'Update Return' : 'Finalize Purchase Return')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Supplier Modal */}
            {showSupplierModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Supplier</h3>
                            <button onClick={() => setShowSupplierModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="form-label">Supplier Name *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. Fresh Farms Ltd"
                                    value={newSupplier.name}
                                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="+91..."
                                    value={newSupplier.phone}
                                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6 justify-end">
                            <button onClick={() => setShowSupplierModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleAddQuickSupplier} className="btn-primary">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const initialItemState = {
    rawMaterialId: '',
    name: '',
    quantity: 1,
    unit: '',
    price: 0,
    tax1: 0,
    tax2: 0,
    taxAmount: 0,
    amount: 0
};

function initialFormState() {
    return {
        supplierId: '',
        purchaseId: '',
        poId: '',
        debitNoteDate: getTodayLocal(),
        debitNoteNumber: `DN-${Date.now().toString().slice(-6)}`,
        items: [{ ...initialItemState }],
        reason: '',
        notes: '',
        totalDiscount: 0,
        otherCharges: 0,
        deliveryCharges: 0,
        otherTaxes: 0,
        status: 'Completed',
        updateStock: true
    };
}
