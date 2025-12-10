import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, MoreHorizontal, Calendar, Edit2, RotateCcw, X, Search, Filter, ArrowUpDown, FileQuestion, ChevronDown } from 'lucide-react';
import { inventoryService } from '../../services/api';


export function PurchaseEntry() {
    const [view, setView] = useState('list');
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    const [formData, setFormData] = useState(initialFormState());

    // Active Drawer State: 'po', 'discount', 'charges', 'tax', or null
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [discountType, setDiscountType] = useState('amount'); // amount | percentage
    const [discountTaxEffect, setDiscountTaxEffect] = useState('before'); // before | after

    // Detailed Charges State
    const [chargesDetails, setChargesDetails] = useState({
        deliveryCharge: 0,
        cgst: 0,
        sgst: 0
    });

    // Tax Details State
    const [taxDetails, setTaxDetails] = useState({
        tcs: 0,
        tcsType: 'amount',
        tds: 0,
        tds: 0,
        tdsType: 'amount'
    });

    // Supplier Search State (Duplicate from PurchaseOrder for consistency)
    const [supplierSearch, setSupplierSearch] = useState('');
    const [isSupplierOpen, setIsSupplierOpen] = useState(false);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);

    useEffect(() => {
        if (!supplierSearch) {
            setFilteredSuppliers(suppliers);
        } else {
            setFilteredSuppliers(suppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase())));
        }
    }, [supplierSearch, suppliers]);

    const handleCreateSupplier = (name) => {
        const newSupplier = { id: Date.now().toString(), name }; // Temporary ID
        setSuppliers([...suppliers, newSupplier]);
        setFormData({ ...formData, supplierId: newSupplier.id });
        setSupplierSearch('');
        setIsSupplierOpen(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [matRes, supRes, purRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getSuppliers(),
                inventoryService.getPurchases()
            ]);
            setRawMaterials(matRes.data || []);
            setSuppliers(supRes.data || []);
            setPurchases(purRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    // Calculations
    const calculateSubTotal = () => {
        return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const calculateGrandTotal = () => {
        const subTotal = calculateSubTotal();
        const discount = parseFloat(formData.totalDiscount) || 0;
        const otherCharges = parseFloat(formData.otherCharges) || 0;
        // Note: Real tax calc would need more complex logic based on 'before/after' tax
        return (subTotal - discount + otherCharges).toFixed(3);
    };

    // Item Handlers
    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { ...initialItemState }]
        });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;

        // Auto-populate unit if material selected
        if (field === 'rawMaterialId') {
            const mat = rawMaterials.find(m => m.id == value);
            if (mat) newItems[index].unit = mat.purchaseUnit;
        }

        // Calculate Amount
        if (field === 'quantity' || field === 'price') {
            const qty = parseFloat(newItems[index].quantity) || 0;
            const price = parseFloat(newItems[index].price) || 0;
            newItems[index].amount = qty * price;
        }

        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const handleSave = async () => {
        try {
            await inventoryService.createPurchase(formData);
            alert('Purchase Saved Successfully!');
            setView('list');
            loadData();
        } catch (error) {
            alert('Error saving purchase: ' + error.message);
        }
    };

    if (view === 'list') {
        return (
            <div className="p-6 bg-gray-50 h-full flex flex-col">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">Purchase Management</h1>
                    <button onClick={() => { setFormData(initialFormState()); setView('add'); }} className="btn-primary">
                        <Plus className="w-4 h-4" /> Add Purchase
                    </button>
                </div>
                {/* Simple List for now */}
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Invoice No</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {purchases.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-4">{new Date(p.invoiceDate).toLocaleDateString()}</td>
                                    <td className="p-4">{p.Supplier?.name}</td>
                                    <td className="p-4">{p.invoiceNo}</td>
                                    <td className="p-4 text-right">₹ {p.totalAmount}</td>
                                </tr>
                            ))}
                            {purchases.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No purchases found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    // ADD PURCHASE FORM
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between shrink-0">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Purchase</h1>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <span>{new Date().toDateString()}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

                {/* Top Form */}
                <div className="card">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-bold text-gray-700">Purchase From:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked className="accent-green-600 w-4 h-4" readOnly />
                            <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Supplier</span>
                        </label>
                        <button onClick={() => setActiveDrawer('po')} className="text-gray-500 border border-gray-300 px-3 py-1 rounded text-xs font-bold hover:bg-gray-50">Select Purchase Order/Sales</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1 relative z-50">
                            <label className="form-label text-red-500">Supplier *</label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="input-field pr-10 cursor-pointer"
                                    placeholder="Select or Type to Add..."
                                    value={supplierSearch || (suppliers.find(s => s.id == formData.supplierId)?.name || '')}
                                    onChange={e => {
                                        setSupplierSearch(e.target.value);
                                        if (formData.supplierId) setFormData({ ...formData, supplierId: '' });
                                        setIsSupplierOpen(true);
                                    }}
                                    onFocus={() => {
                                        setIsSupplierOpen(true);
                                        if (formData.supplierId) setSupplierSearch('');
                                    }}
                                    onClick={() => setIsSupplierOpen(true)}
                                />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>

                            {isSupplierOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsSupplierOpen(false)}></div>
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 p-1.5 custom-scrollbar">
                                        {filteredSuppliers.map(s => (
                                            <div
                                                key={s.id}
                                                className="px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-between items-center transition-colors"
                                                onClick={() => {
                                                    setFormData({ ...formData, supplierId: s.id });
                                                    setSupplierSearch('');
                                                    setIsSupplierOpen(false);
                                                }}
                                            >
                                                {s.name}
                                            </div>
                                        ))}
                                        {filteredSuppliers.length === 0 && supplierSearch && (
                                            <div
                                                className="px-4 py-2.5 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg cursor-pointer text-sm font-bold text-primary-600 flex items-center gap-2 transition-colors"
                                                onClick={() => handleCreateSupplier(supplierSearch)}
                                            >
                                                <Plus className="w-4 h-4" /> Add "{supplierSearch}"
                                            </div>
                                        )}
                                        {filteredSuppliers.length === 0 && !supplierSearch && (
                                            <div className="p-4 text-center text-gray-400 text-xs">No suppliers found</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-red-500">Invoice Date *</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.invoiceDate}
                                    onChange={e => setFormData({ ...formData, invoiceDate: e.target.value })}
                                    className="input-field border-gray-300 w-full"
                                />
                                {/* <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-600">Invoice Number</label>
                            <input
                                value={formData.invoiceNo}
                                onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                                className="input-field border-gray-300"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-red-500">PO No. *</label>
                            <div className="flex gap-2">
                                <input
                                    value={formData.poNumber}
                                    onChange={e => setFormData({ ...formData, poNumber: e.target.value })}
                                    className="input-field border-gray-300 flex-1"
                                    placeholder="PO No."
                                />
                                <button className="p-2 border rounded hover:bg-gray-50"><Edit2 className="w-4 h-4 text-gray-500" /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="card overflow-hidden min-h-[400px] flex flex-col p-0">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50/50 dark:bg-gray-800/50">
                        <button onClick={addItem} className="btn-secondary text-red-600 border-red-200 bg-red-50 hover:bg-red-100">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                        <button className="btn-secondary">
                            At Invoice Level <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <button className="btn-secondary">
                            More Action <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <button className="btn-secondary">
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
                                                {['Dish', 'Piece', 'Kg', 'Ltr.', 'Milligram', 'Extra', 'Glass', 'Mtr', 'GM', 'Pkts', 'NOS', 'TIN', 'Btls', 'BULK', 'BOX', 'ML', 'Can', 'Bun', 'Bag', 'Qty', '25 kg bag', 'ltr', 'tray', 'lettuce', 'pcs', 'carton', 'pkt', 'jar', 'case', 'tub', 'sack'].map(u => (
                                                    <option key={u} value={u}>{u}</option>
                                                ))}
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
                                                value={item.amount || ''}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded outline-none bg-gray-50"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <input placeholder="CGST %" className="w-1/3 p-2 border border-gray-300 rounded outline-none text-center" />
                                                <input placeholder="SGST %" className="w-1/3 p-2 border border-gray-300 rounded outline-none text-center" />
                                                <input placeholder="IGST %" className="w-1/3 p-2 border border-gray-300 rounded outline-none text-center" />
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

                    {/* Summary Footer */}
                    <div className="bg-gray-50 border-t border-gray-200 p-6">
                        <div className="max-w-xs ml-auto space-y-3 text-sm">
                            <div className="flex justify-between font-bold text-gray-700">
                                <span>Sub Total :</span>
                                <span>{calculateSubTotal().toFixed(3)} <MoreHorizontal className="inline w-4 h-4" /></span>
                            </div>

                            {/* Discount Button/Display */}
                            <div className="flex justify-between items-center group cursor-pointer" onClick={() => setActiveDrawer('discount')}>
                                {formData.totalDiscount > 0 ? (
                                    <>
                                        <span className="text-red-600 flex items-center gap-2"><Trash2 className="w-3 h-3 cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, totalDiscount: 0 }); }} /> Discount</span>
                                        <span className="text-red-600">- {formData.totalDiscount}</span>
                                    </>
                                ) : (
                                    <button className="w-full border border-gray-300 bg-white py-1.5 rounded text-gray-600 font-bold hover:bg-gray-100 flex items-center gap-2 px-3">
                                        <Plus className="w-3 h-3" /> Total Discount
                                    </button>
                                )}
                            </div>

                            {/* Other Charges Button/Display */}
                            <div className="flex justify-between items-center group cursor-pointer" onClick={() => setActiveDrawer('charges')}>
                                {formData.otherCharges > 0 ? (
                                    <>
                                        <span className="text-gray-700 flex items-center gap-2"><Trash2 className="w-3 h-3 text-red-500 cursor-pointer hover:scale-110" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, otherCharges: 0 }); }} /> Other Charges</span>
                                        <span>{formData.otherCharges}</span>
                                    </>
                                ) : (
                                    <button className="w-full border border-gray-300 bg-white py-1.5 rounded text-gray-600 font-bold hover:bg-gray-100 flex items-center gap-2 px-3">
                                        <Plus className="w-3 h-3" /> Add Other Charges
                                    </button>
                                )}
                            </div>

                            {/* Other Taxes Button/Display */}
                            <button onClick={() => setActiveDrawer('tax')} className="w-full border border-gray-300 bg-white py-1.5 rounded text-gray-600 font-bold hover:bg-gray-100 flex items-center gap-2 px-3">
                                <Plus className="w-3 h-3" /> Other Taxes
                            </button>

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
            </div>

            {/* Bottom Footer */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 p-6 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                <label className="flex items-center gap-3 cursor-pointer select-none group">
                    <div className="w-6 h-6 flex items-center justify-center border-2 border-green-500 rounded-lg bg-white text-green-600 group-hover:bg-green-50 transition-colors">
                        <Plus className="w-4 h-4 rotate-45" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-green-600 transition-colors">Update Inventory Stock</span>
                </label>

                <div className="flex gap-4">
                    <button onClick={() => setView('list')} className="btn-secondary">Cancel</button>
                    <button onClick={handleSave} className="btn-primary shadow-xl shadow-primary-500/20">Save Purchase</button>
                </div>
            </div>
            {/* Active Side Drawer */}
            {activeDrawer && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>

                    {/* Drawer Content */}
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                            <h2 className="text-lg font-bold text-gray-800">
                                {activeDrawer === 'discount' && 'Discount Details'}
                                {activeDrawer === 'charges' && 'Other Charge Details'}
                                {activeDrawer === 'tax' && 'Tax Details'}
                                {activeDrawer === 'po' && 'Purchase Order/Sales'}
                            </h2>
                            <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="p-6 flex-1 overflow-y-auto bg-white">

                            {/* --- DISCOUNT DRAWER --- */}
                            {activeDrawer === 'discount' && (
                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                                        <div className="flex items-center gap-6">
                                            <span className="text-sm font-bold text-gray-700">Discount Type</span>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" checked={discountType === 'amount'} onChange={() => setDiscountType('amount')} className="accent-green-600 w-4 h-4" />
                                                    <span className="text-sm">Amount (₹)</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" checked={discountType === 'percentage'} onChange={() => setDiscountType('percentage')} className="accent-green-600 w-4 h-4" />
                                                    <span className="text-sm">Percentage (%)</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-700">Total Discount Included in Invoice</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                value={formData.totalDiscount}
                                                onChange={e => setFormData({ ...formData, totalDiscount: Math.max(0, parseFloat(e.target.value) || 0) })}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Total amount of discount applicable: {formData.totalDiscount || '00.00'}
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                                        <div className="space-y-2">
                                            <span className="text-sm font-bold text-gray-700">Determine when tax is applicable</span>
                                            <div className="flex gap-4 mt-1">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" checked={discountTaxEffect === 'before'} onChange={() => setDiscountTaxEffect('before')} className="accent-green-600 w-4 h-4" />
                                                    <span className="text-sm">Before tax</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" checked={discountTaxEffect === 'after'} onChange={() => setDiscountTaxEffect('after')} className="accent-green-600 w-4 h-4" />
                                                    <span className="text-sm">After tax</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-3 rounded-lg flex gap-3 items-start">
                                            <div className="mt-0.5">💡</div>
                                            <p className="text-xs leading-relaxed font-medium">Discounts Apply Before Tax By Default; Select The Option If Applying After Tax.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- CHARGES DRAWER --- */}
                            {activeDrawer === 'charges' && (
                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
                                        <h3 className="text-sm font-bold text-gray-700 mb-2">Delivery Charge</h3>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-700">Delivery Charge Included in Invoice</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                value={formData.otherCharges}
                                                onChange={e => setFormData({ ...formData, otherCharges: Math.max(0, parseFloat(e.target.value) || 0) })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700">CGST %</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                    placeholder="0"
                                                    value={chargesDetails.cgst || ''}
                                                    onChange={e => setChargesDetails({ ...chargesDetails, cgst: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700">SGST %</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                    placeholder="0"
                                                    value={chargesDetails.sgst || ''}
                                                    onChange={e => setChargesDetails({ ...chargesDetails, sgst: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAX DRAWER --- */}
                            {activeDrawer === 'tax' && (
                                <div className="space-y-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-6">

                                        {/* TCS */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-700">Tax collected at source(TCS)</label>
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Percentage Wise</span>
                                            </div>
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                value={taxDetails.tcs || ''}
                                                onChange={e => setTaxDetails({ ...taxDetails, tcs: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-500">Total TCS applicable : 00.00</p>
                                        </div>

                                        {/* TDS */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-gray-700">Tax deducted at source(TDS)</label>
                                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">Percentage Wise</span>
                                            </div>
                                            <input
                                                type="number"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                value={taxDetails.tds || ''}
                                                onChange={e => setTaxDetails({ ...taxDetails, tds: e.target.value })}
                                            />
                                            <p className="text-xs text-gray-500">Total TDS deducted : 00.00</p>
                                        </div>

                                    </div>
                                </div>
                            )}

                            {/* --- PO DRAWER (Existing) --- */}
                            {activeDrawer === 'po' && (
                                <div className="space-y-4">
                                    <div className="flex gap-4 mb-6">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search Invoice/Request No..."
                                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-red-500 bg-white"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 rounded-lg">
                                            <span className="text-xs font-bold text-gray-600">Supplier View</span>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                            <FileQuestion className="w-10 h-10 text-red-300" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-600">No Record Found</h3>
                                        <p className="text-gray-400 text-sm mt-1">We could not find what you searched for.</p>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Drawer Footer (Save/Cancel) */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setActiveDrawer(null)} className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={() => setActiveDrawer(null)} className="px-6 py-2 bg-red-600 text-white rounded font-bold text-sm shadow hover:bg-red-700">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const initialItemState = { rawMaterialId: '', quantity: '', unit: '', price: '', amount: 0 };

function initialFormState() {
    return {
        supplierId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        invoiceNo: '',
        poNumber: '',
        items: [{ ...initialItemState }],
        totalDiscount: 0,
        otherCharges: 0
    };
}
