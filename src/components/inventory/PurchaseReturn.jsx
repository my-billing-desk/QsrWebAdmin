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
            } else {
                newItems[index].rawMaterialId = '';
                newItems[index].name = '';
            }
        } else {
            newItems[index][field] = value;
        }

        const qty = parseFloat(newItems[index].quantity) || 0;
        const price = parseFloat(newItems[index].price) || 0;
        newItems[index].amount = (qty * price).toFixed(2);

        setFormData({ ...formData, items: newItems });
        if (field === 'rawMaterialId') setFocusedIndex(null);
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const calculateGrandTotal = () => {
        return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2);
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
            <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-x-hidden text-left">
                {/* Header Area */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Purchase Returns</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage vendor returns & debit notes</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setFormData(initialFormState()); setView('add'); }}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" /> New Return
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <RotateCcw className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Return Value</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            ₹ {totals.total}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <FileText className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Transactions</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {totals.count} <span className="text-xs text-gray-500 font-normal">Units</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <ArrowUpDown className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Average Return</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            ₹ {totals.avg}
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Search returns or suppliers..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filterQuery}
                                onChange={e => setFilterQuery(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={loadData} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500"><RotateCcw className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Supplier</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Debit Note #</th>
                                    <th className="px-6 py-3">Reason</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Value (₹)</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {returns.filter(r =>
                                (r.debitNoteNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
                                    r.Supplier?.name.toLowerCase().includes(filterQuery.toLowerCase()))
                                ).map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{r.Supplier?.name}</div>
                                            <div className="text-xs text-gray-500">Vendor Account</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {r.debitNoteNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                                            {r.reason || 'No specific reason'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${r.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {r.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            ₹{parseFloat(r.grandTotal || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button className="text-gray-500 hover:text-indigo-600 p-1"><Eye className="w-4 h-4" /></button>
                                                <button className="text-gray-500 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {returns.length === 0 && !loading && (
                            <div className="p-12 text-center flex flex-col items-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-full">
                                    <FileQuestion className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-gray-500 font-medium">No purchase returns records found.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Modal View
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg w-full max-w-5xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">New Purchase Return</h2>
                        <p className="text-sm text-gray-500 mt-1">Generate debit note for supplier</p>
                    </div>
                    <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Master Fields */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Select Invoice (Link)</label>
                                <select
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
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

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">PO Reference</label>
                                <select
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.poId}
                                    onChange={e => setFormData({ ...formData, poId: e.target.value })}
                                >
                                    <option value="">No PO</option>
                                    {purchaseOrders.map(po => (
                                        <option key={po.id} value={po.id}>{po.poNumber}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Supplier <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.supplierId}
                                        onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <button
                                        onClick={() => setShowSupplierModal(true)}
                                        className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Return Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.debitNoteDate}
                                    onChange={e => setFormData({ ...formData, debitNoteDate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Debit Note #</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500 outline-none font-mono"
                                    value={formData.debitNoteNumber}
                                />
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-800">Return Items</h3>
                                <button onClick={addItem} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                                    <Plus className="w-4 h-4" /> Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 w-80">Raw Material <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-28">Qty <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-28">Unit</th>
                                            <th className="px-4 py-3 w-32 text-right">Original Price</th>
                                            <th className="px-4 py-3 w-32 text-right">Return Amount</th>
                                            <th className="px-4 py-3 w-20 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {formData.items.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 relative">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                            placeholder="Select Material"
                                                            value={focusedIndex === idx ? searchQuery : (item.name || '')}
                                                            onFocus={() => {
                                                                setFocusedIndex(idx);
                                                                setSearchQuery(item.name || '');
                                                            }}
                                                            onChange={e => setSearchQuery(e.target.value)}
                                                        />
                                                        {focusedIndex === idx && (
                                                            <>
                                                                <div className="fixed inset-0 z-40" onClick={() => setFocusedIndex(null)}></div>
                                                                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto p-1">
                                                                    {rawMaterials.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                                                        rawMaterials
                                                                            .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                                            .map(m => (
                                                                                <button
                                                                                    key={m.id}
                                                                                    onClick={() => updateItem(idx, 'rawMaterialId', m.id)}
                                                                                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
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
                                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        value={item.quantity}
                                                        onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-500">
                                                    {item.unit || '-'}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm text-right font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        value={item.price}
                                                        onChange={e => updateItem(idx, 'price', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-right font-medium text-gray-900">
                                                    ₹{item.amount}
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
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Reason for Return <span className="text-red-500">*</span></label>
                                    <textarea
                                        placeholder="Damage, quality issue, mismatch, etc..."
                                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-8 flex flex-col justify-center items-end">
                                <span className="text-sm font-medium text-gray-500 mb-1">Total Return Value</span>
                                <div className="text-3xl font-bold text-gray-900">
                                    ₹ {calculateGrandTotal()}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Net amount to be debited</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
                    <button onClick={() => setView('list')} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {isSaving ? 'Processing...' : 'Finalize Return'}
                    </button>
                </div>
            </div>

            {/* Quick Supplier Modal */}
            {showSupplierModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 font-sans">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Supplier</h3>
                            <button onClick={() => setShowSupplierModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Supplier Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="e.g. Fresh Farms Ltd"
                                    value={newSupplier.name}
                                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="+91..."
                                    value={newSupplier.phone}
                                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6 justify-end">
                            <button onClick={() => setShowSupplierModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                            <button onClick={handleAddQuickSupplier} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Save</button>
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
        status: 'Completed'
    };
}
