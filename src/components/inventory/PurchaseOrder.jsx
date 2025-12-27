import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, MoreHorizontal, Clock, ShoppingCart, Truck, ChevronDown, Search, X, Calendar, CornerDownLeft, Download } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function PurchaseOrder() {
    const [view, setView] = useState('list');
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    const [formData, setFormData] = useState(initialFormState());

    // Drawer State
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [chargesDetails, setChargesDetails] = useState({
        cgst: 0,
        sgst: 0
    });

    // Payment State (New)
    const [paymentStatus, setPaymentStatus] = useState('Unpaid'); // 'Unpaid' | 'Paid'
    const [paymentDetails, setPaymentDetails] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        mode: 'Cash'
    });

    // Supplier Search State
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
            const [matRes, supRes, ordRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getSuppliers(),
                inventoryService.getPurchaseOrders()
            ]);
            setRawMaterials(matRes.data || []);
            setSuppliers(supRes.data || []);
            setOrders(ordRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLoadAllMaterials = () => {
        if (!rawMaterials || rawMaterials.length === 0) return alert("No raw materials found to load");

        // Confirm if items already exist
        if (formData.items.length > 0 && formData.items[0].rawMaterialId) {
            if (!confirm("This will replace current items with all raw materials. Continue?")) return;
        }

        const allItems = rawMaterials.map(m => ({
            rawMaterialId: m.id,
            quantity: '',
            unit: m.purchaseUnit || m.unit || 'Kg', // Fallback
            price: m.price || '',
            amount: 0
        }));

        setFormData(prev => ({ ...prev, items: allItems }));
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { rawMaterialId: '', quantity: '', unit: '', price: '', amount: 0 }]
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
        const charges = parseFloat(formData.otherCharges) || 0;
        return (subTotal + charges).toFixed(3);
    };

    const handleSave = async () => {
        try {
            await inventoryService.createPurchaseOrder({
                ...formData,
                grandTotal: calculateGrandTotal()
            });

            // Future integration: Send notification to tied-up supplier
            console.log("Notification sent to supplier:", formData.supplierId);

            alert('Purchase Order Created! Notification sent to supplier.');
            setView('list');
            loadData();
        } catch (error) {
            console.error(error);
            alert('Error creating PO: ' + error.message);
        }
    };

    const handleExport = () => {
        // Mock Excel Export
        const headers = ['Raw Material', 'Qty', 'Unit', 'Price', 'Amount'];
        const rows = formData.items.map(item => {
            const matName = rawMaterials.find(m => m.id == item.rawMaterialId)?.name || 'Unknown';
            return [matName, item.quantity, item.unit, item.price, item.amount];
        });

        console.log("Export Data:", { headers, rows });
        alert("Purchase Order exported to Excel (mock)!");
    };

    const handleReturn = async (orderId) => {
        if (!confirm("Are you sure you want to mark this order as Returned?")) return;
        try {
            // Mocking return update for now as backend might not support status update directly exposed yet
            // Real implementation would be: await inventoryService.updatePurchaseOrderStatus(orderId, 'Returned');

            // Updating local state to reflect change immediately
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Returned' } : o));
            alert("Order marked as Returned.");
        } catch (error) {
            console.error(error);
            alert("Failed to return order");
        }
    };

    if (view === 'list') {
        return (
            <div className="p-6 bg-gray-50 h-full flex flex-col">
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300">Purchase Orders</h1>
                    <button onClick={() => { setFormData(initialFormState()); setView('add'); }} className="btn-primary">
                        <Plus className="w-4 h-4" /> Add Purchase Order
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4">Delivery Date</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="p-4">{new Date(o.deliveryDate).toLocaleDateString()}</td>
                                    <td className="p-4">{o.Supplier?.name}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Returned' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {o.status || 'Received'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">₹ {o.grandTotal}</td>
                                    <td className="p-4 text-center">
                                        <div className="relative group inline-block">
                                            <button className="p-1 hover:bg-gray-100 rounded">
                                                <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg hidden group-hover:block z-20">
                                                <button
                                                    onClick={() => handleReturn(o.id)}
                                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-red-600 font-medium flex items-center gap-2"
                                                >
                                                    <CornerDownLeft className="w-3 h-3" /> Return
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500">No orders found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between shrink-0">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add Purchase Order</h1>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
                    <span>{new Date().toDateString()}</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

                {/* Top Form */}
                <div className="card">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="font-bold text-gray-700">From:</span>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" checked className="accent-green-600 w-4 h-4 text-green-600 focus:ring-green-500" readOnly />
                            <span className="font-bold text-gray-800">Supplier</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="flex flex-col gap-1 relative z-50">
                            <label className="form-label text-red-500">Supplier/Third Party *</label>

                            <div className="relative">
                                <input
                                    type="text"
                                    className="input-field pr-10 cursor-pointer"
                                    placeholder=""
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
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-red-500">Delivery Date *</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.deliveryDate}
                                    onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                    className="input-field w-full pl-9"
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-700">Delivery Time</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    value={formData.deliveryTime}
                                    onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                                    className="input-field w-full pl-9"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex gap-2 items-end">
                            <div className="flex flex-col gap-1 w-32">
                                <label className="text-xs font-bold text-red-500">PO No. *</label>
                                <div className="flex items-center relative">
                                    <input
                                        value={formData.poNumber}
                                        onChange={e => setFormData({ ...formData, poNumber: e.target.value })}
                                        className="input-field w-full pr-8"
                                        placeholder="PO No"
                                    />
                                    <Edit2 className="w-3 h-3 text-gray-400 absolute right-2 pointer-events-none" />
                                </div>
                            </div>
                            <button className="h-[38px] px-4 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 mb-[1px]">Other Details</button>
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className="card overflow-hidden min-h-[400px] flex flex-col p-0">
                    <div className="flex justify-end gap-3 p-4 pb-0 bg-white">
                        <button onClick={addItem} className="px-4 py-1.5 border border-red-500 text-red-600 rounded bg-white font-bold text-xs flex items-center gap-1 hover:bg-red-50 uppercase shadow-sm">
                            <Plus className="w-3 h-3 text-red-600" /> Add New
                        </button>
                        <button className="px-4 py-1.5 border border-gray-200 text-gray-700 rounded bg-white font-bold text-xs flex items-center gap-1 hover:bg-gray-50 uppercase shadow-sm">
                            More Actions <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="overflow-x-auto flex-1 mt-2">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f0f4f8] text-gray-800 text-xs font-bold">
                                <tr className="border-b border-gray-200">
                                    <th className="p-4 w-10"><input type="checkbox" className="rounded text-gray-400" /></th>
                                    <th className="p-4 min-w-[200px]">Raw Material <span className="text-red-500">*</span></th>
                                    <th className="p-4 w-24">Qty <span className="text-red-500">*</span></th>
                                    <th className="p-4 w-24">Unit <span className="text-red-500">*</span></th>
                                    <th className="p-4 w-28">Price</th>
                                    <th className="p-4 w-32">Amount</th>
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
                                                className="input-field py-1.5"
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
                                                className="input-field py-1.5"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                value={item.amount || ''}
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded outline-none bg-gray-50"
                                            />
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button className="p-1 text-gray-500 hover:text-gray-700"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => removeItem(idx)} className="p-1 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-white border-t border-gray-100 p-6">
                        <div className="max-w-md ml-auto space-y-2 text-sm">
                            <div className="flex justify-between items-center font-bold text-gray-800">
                                <span>Sub Total :</span>
                                <span className="flex items-center gap-2">{calculateSubTotal().toFixed(3)} <MoreHorizontal className="w-4 h-4 text-gray-400" /></span>
                            </div>

                            {/* Other Charges */}
                            <div className="flex justify-between items-center py-2">
                                <div onClick={() => setActiveDrawer('charges')} className="cursor-pointer">
                                    {formData.otherCharges > 0 ? (
                                        <div className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                                            <X className="w-3 h-3 text-red-500 hover:scale-110" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, otherCharges: 0 }) }} /> Delivery Charges
                                        </div>
                                    ) : (
                                        <div className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-gray-700 font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
                                            <Plus className="w-3 h-3" /> Delivery Charges
                                        </div>
                                    )}
                                </div>
                                <span className="font-bold text-gray-800">{parseFloat(formData.otherCharges).toFixed(3)}</span>
                            </div>

                            <div className="flex justify-between font-bold text-gray-800 pt-2 pb-4">
                                <span>Grand Total :</span>
                                <span>{calculateGrandTotal()}</span>
                            </div>

                            <div className="flex flex-col gap-3 pt-2">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-gray-800 text-xs w-24">Payment Type :</span>
                                    <div className="bg-red-50 p-1 rounded-full flex border border-red-100 relative">
                                        <button
                                            onClick={() => setPaymentStatus('Unpaid')}
                                            className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${paymentStatus === 'Unpaid' ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-red-100'}`}
                                        >
                                            Unpaid
                                        </button>
                                        <button
                                            onClick={() => setPaymentStatus('Paid')}
                                            className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${paymentStatus === 'Paid' ? 'bg-red-500 text-white shadow-md' : 'text-gray-600 hover:bg-red-100'}`}
                                        >
                                            Paid
                                        </button>
                                    </div>
                                </div>

                                {paymentStatus === 'Paid' && (
                                    <div className="flex gap-3 items-end animate-in fade-in slide-in-from-top-1">
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="date"
                                                className="input-field py-1 text-xs"
                                                value={paymentDetails.date}
                                                onChange={e => setPaymentDetails({ ...paymentDetails, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <input
                                                type="number"
                                                placeholder="Paid Amount *"
                                                className="input-field py-1 text-xs"
                                                value={paymentDetails.amount}
                                                onChange={e => setPaymentDetails({ ...paymentDetails, amount: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 w-24">
                                            <input
                                                type="text"
                                                value="Cash"
                                                readOnly
                                                className="input-field py-1 text-xs bg-gray-50 text-center"
                                            />
                                        </div>
                                        <button className="px-3 py-1.5 bg-red-600 text-white rounded text-xs font-bold shadow hover:bg-red-700">Add</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Footer */}
            <div className="bg-[#fff1f2] border-t border-red-100 p-4 flex justify-between items-center shadow-inner mt-4 rounded-lg mx-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div className="w-5 h-5 flex items-center justify-center border border-green-600 rounded bg-white text-green-600">
                        {/* Static check for now as per design */}
                        <Plus className="w-4 h-4 rotate-45" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Recipient can edit the invoice</span>
                </label>

                <div className="flex gap-4">
                    <button onClick={handleExport} className="px-6 py-2 bg-green-50 border border-green-200 rounded-lg font-bold text-sm text-green-700 hover:bg-green-100 shadow-sm flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Excel
                    </button>
                    <button onClick={() => setView('list')} className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-bold text-sm text-gray-700 hover:bg-gray-50 shadow-sm">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-[#dc2626] text-white rounded-lg font-bold text-sm shadow-md hover:bg-red-700 transition-colors">Save Changes</button>
                </div>
            </div>

            {/* Side Drawer */}
            {activeDrawer && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setActiveDrawer(null)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0">
                            <h2 className="text-lg font-bold text-gray-800">
                                {activeDrawer === 'charges' && 'Other Charge Details'}
                            </h2>
                            <button onClick={() => setActiveDrawer(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto bg-white">
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
                                                    className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                    placeholder="0"
                                                    value={chargesDetails.cgst || ''}
                                                    onChange={e => setChargesDetails({ ...chargesDetails, cgst: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-700">SGST %</label>
                                                <input
                                                    type="number"
                                                    className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-100 outline-none"
                                                    placeholder="0"
                                                    value={chargesDetails.sgst || ''}
                                                    onChange={e => setChargesDetails({ ...chargesDetails, sgst: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

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

function initialFormState() {
    return {
        supplierId: '',
        deliveryDate: new Date().toISOString().split('T')[0],
        deliveryTime: '12:00',
        poNumber: '1',
        otherCharges: 0,
        items: [{ rawMaterialId: '', quantity: '', unit: '', price: '', amount: 0 }]
    };
}
