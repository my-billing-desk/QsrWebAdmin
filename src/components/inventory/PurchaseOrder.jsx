import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Edit2, MoreHorizontal, Clock, ShoppingBag, Truck,
    ChevronDown, Search, X, Calendar, RotateCcw, FileText, Download, List,
    Settings, Eye, Filter, ArrowUpDown, MoreVertical, Upload, UserPlus
} from 'lucide-react';
import { inventoryService } from '../../services/api';
import { getTodayLocal } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function PurchaseOrder() {
    const navigate = useNavigate();
    const [view, setView] = useState('list');
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Filters state
    const [startDate, setStartDate] = useState(getTodayLocal());
    const [endDate, setEndDate] = useState(getTodayLocal());
    const [filterPO, setFilterPO] = useState('');

    const [formData, setFormData] = useState(initialFormState());
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', email: '' });
    const [showDiscountInput, setShowDiscountInput] = useState(false);
    const [showTaxInput, setShowTaxInput] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
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

    const calculateSubTotal = () => {
        return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    };

    const calculateGrandTotal = () => {
        const subTotal = calculateSubTotal();
        const tax = parseFloat(formData.orderTax) || 0;
        const discount = parseFloat(formData.discount) || 0;
        const shipping = parseFloat(formData.shipping) || 0;
        return (subTotal + tax + shipping - discount).toFixed(2);
    };

    const handleSave = async () => {
        if (!formData.supplierId) return toast.error('Please select a supplier');

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                grandTotal: calculateGrandTotal()
            };

            if (formData.id) {
                await inventoryService.updatePurchaseOrder(formData.id, payload);
                toast.success('Purchase Order Updated!');
            } else {
                await inventoryService.createPurchaseOrder(payload);
                toast.success('Purchase Order Created!');
            }

            setView('list');
            loadData();
        } catch (error) {
            toast.error('Error saving PO: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (order) => {
        setFormData({
            ...order,
            items: order.PurchaseOrderItems?.map(item => ({
                rawMaterialId: item.rawMaterialId,
                name: item.RawMaterial?.name || '',
                quantity: item.quantity,
                unit: item.unit || item.RawMaterial?.purchaseUnit || item.RawMaterial?.consumptionUnit,
                price: item.price,
                amount: item.amount || (item.quantity * item.price).toFixed(2)
            })) || [{ ...initialItemState }]
        });
        setView('add');
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

    const generateInvoicePDF = (order) => {
        const printWindow = window.open('', '_blank');
        const itemsHtml = (order.PurchaseOrderItems || []).map((item, index) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <div style="font-weight: bold; color: #333;">${item.RawMaterial?.name || 'Product'}</div>
                    <div style="font-size: 10px; color: #777;">Unit: ${item.unit || '---'}</div>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹ ${parseFloat(item.price || 0).toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹ ${parseFloat(item.amount || 0).toFixed(2)}</td>
            </tr>
        `).join('');

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Purchase Order - ${order.poNumber}</title>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #444; margin: 0; padding: 40px; }
                    .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.05); font-size: 14px; line-height: 24px; color: #555; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .company-info h2 { margin: 0; color: #d92d20; font-size: 28px; font-weight: 900; }
                    .invoice-info { text-align: right; }
                    .invoice-info h1 { margin: 0; font-size: 24px; color: #333; }
                    .details { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .details div { flex: 1; }
                    .details h3 { font-size: 12px; font-weight: 900; text-transform: uppercase; color: #999; letter-spacing: 1px; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
                    th { background-color: #f8f9fa; padding: 12px; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #777; border-bottom: 2px solid #eee; }
                    .totals { float: right; width: 300px; }
                    .totals div { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .totals .grand-total { border-bottom: none; font-size: 18px; font-weight: 900; color: #000; }
                    @media print { .no-print { display: none; } }
                </style>
            </head>
            <body>
                <div class="header no-print" style="max-width: 800px; margin: 0 auto 20px auto; display: flex; justify-content: flex-end;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #d92d20; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;">
                        Save as PDF / Print
                    </button>
                </div>
                <div class="invoice-box">
                    <div class="header">
                        <div class="company-info">
                            <h2>SmartQSR</h2>
                            <p>Premium Kitchen Solutions</p>
                        </div>
                        <div class="invoice-info">
                            <h1>PURCHASE ORDER</h1>
                            <p><strong>PO Number:</strong> ${order.poNumber}<br>
                            <strong>Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="details">
                        <div>
                            <h3>Supplier</h3>
                            <p><strong>${order.Supplier?.name}</strong><br>
                            ${order.Supplier?.phone || 'No Phone'}<br>
                            ${order.Supplier?.email || 'No Email'}</p>
                        </div>
                        <div style="text-align: right;">
                            <h3>Ship To</h3>
                            <p>Sunburst Stack HQ<br>
                            Main Warehouse, Cluster A<br>
                            Tech City, IN</p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="text-align: left;">#</th>
                                <th style="text-align: left;">Description</th>
                                <th>Quantity</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div class="totals">
                        <div>
                            <span>Subtotal</span>
                            <span>₹ ${parseFloat(order.grandTotal || 0).toFixed(2)}</span>
                        </div>
                        <div>
                            <span>Tax (Estimated)</span>
                            <span>₹ ${parseFloat(order.orderTax || 0).toFixed(2)}</span>
                        </div>
                        <div class="grand-total">
                            <span>TOTAL</span>
                            <span>₹ ${parseFloat(order.grandTotal || 0).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div style="clear: both; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
                        <p><strong>Note:</strong> ${order.description || 'No additional notes.'}</p>
                        <p style="text-align: center; margin-top: 40px; font-weight: bold; color: #ccc; text-transform: uppercase; letter-spacing: 2px;">Thank you for your business</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const totals = {
        recorded: orders.reduce((sum, o) => sum + (parseFloat(o.grandTotal) || 0), 0).toFixed(3),
        outstanding: orders.filter(o => o.status !== 'Received').reduce((sum, o) => sum + (parseFloat(o.grandTotal) || 0), 0).toFixed(3),
        tax: orders.reduce((sum, o) => sum + (parseFloat(o.orderTax) || 0), 0).toFixed(3)
    };

    if (view === 'list') {
        return (
            <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-x-hidden text-left">
                {/* Header Area */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage procurement & vendor requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setFormData(initialFormState()); setView('add'); }}
                            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Create New PO
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <ShoppingBag className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Recorded Amount</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            ₹ {totals.recorded}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Truck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Pending Deliveries</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            ₹ {totals.outstanding}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <FileText className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Estimated Tax</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            ₹ {totals.tax}
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Search by PO number or supplier..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                value={filterPO}
                                onChange={e => setFilterPO(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="flex gap-2">
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            <button onClick={loadData} className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-500"><RotateCcw className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Supplier</th>
                                    <th className="px-6 py-3">Delivery Date</th>
                                    <th className="px-6 py-3">PO Number</th>
                                    <th className="px-6 py-3 text-right">Grand Total</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                    <th className="px-6 py-3 text-center">Next Step</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {orders.filter(o =>
                                (o.poNumber.toLowerCase().includes(filterPO.toLowerCase()) ||
                                    o.Supplier?.name.toLowerCase().includes(filterPO.toLowerCase()))
                                ).map(o => (
                                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{o.Supplier?.name}</div>
                                            <div className="text-xs text-gray-500">{o.Supplier?.category || 'General Vendor'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {new Date(o.deliveryDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">
                                                {o.poNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            ₹ {(parseFloat(o.grandTotal) || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${o.status === 'Received' ? 'bg-green-100 text-green-800' :
                                                o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    o.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-blue-100 text-blue-800'
                                                }`}>
                                                {o.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => generateInvoicePDF(o)} className="text-gray-500 hover:text-indigo-600 p-1" title="View PO">
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(o)} className="text-gray-500 hover:text-blue-600 p-1" title="Edit PO">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {o.status !== 'Pending Approval' && o.status !== 'Received' && (
                                                <button
                                                    onClick={() => navigate('/inventory/purchase', { state: { fromPO: o } })}
                                                    className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded hover:bg-indigo-100 font-medium transition-colors"
                                                >
                                                    Inward Stock
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {orders.length === 0 && !loading && (
                            <div className="p-12 text-center flex flex-col items-center gap-3">
                                <div className="p-3 bg-gray-50 rounded-full">
                                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="text-gray-500 font-medium">No purchase orders found.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg w-full max-w-5xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-bold text-gray-900">{formData.id ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
                    <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Master Fields */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6">
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
                                <label className="text-sm font-medium text-gray-700">PO Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.deliveryDate}
                                    onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Expect Arrival Time</label>
                                <input
                                    type="time"
                                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.deliveryTime}
                                    onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">PO Reference No</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500 outline-none font-mono"
                                    value={formData.poNumber || 'Generating...'}
                                />
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-800">Order Items</h3>
                                <div className="flex gap-2">
                                    <button onClick={addItem} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                                        <Plus className="w-4 h-4" /> Add Item
                                    </button>
                                    <button className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 ml-4">
                                        <Upload className="w-4 h-4" /> Bulk Import
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase font-semibold">
                                        <tr>
                                            <th className="px-4 py-3 w-80">Raw Material <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-32">Qty <span className="text-red-500">*</span></th>
                                            <th className="px-4 py-3 w-24">Unit</th>
                                            <th className="px-4 py-3 w-32 text-right">Estimate Price</th>
                                            <th className="px-4 py-3 w-32 text-right">Total</th>
                                            <th className="px-4 py-3 w-16 text-center"></th>
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
                                                                <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-48 overflow-y-auto">
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

                        {/* Summary & Totals */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Internal Notes</label>
                                    <textarea
                                        placeholder="Add notes..."
                                        className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 h-24"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">₹ {calculateSubTotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Discount</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.discount}
                                            onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                            className="w-full text-right border border-gray-300 rounded px-2 py-1 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Tax</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.orderTax}
                                            onChange={e => setFormData({ ...formData, orderTax: e.target.value })}
                                            className="w-full text-right border border-gray-300 rounded px-2 py-1 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.shipping}
                                            onChange={e => setFormData({ ...formData, shipping: e.target.value })}
                                            className="w-full text-right border border-gray-300 rounded px-2 py-1 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="font-bold text-gray-900">Grand Total</span>
                                    <span className="text-xl font-bold text-indigo-600">₹ {calculateGrandTotal()}</span>
                                </div>
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
                        {isSaving ? 'Processing...' : (formData.id ? 'Update PO' : 'Finalize PO')}
                    </button>
                </div>
            </div>

            {/* Quick Supplier Modal */}
            {showSupplierModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Supplier</h3>
                            <button onClick={() => setShowSupplierModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
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
        deliveryDate: getTodayLocal(),
        deliveryTime: '12:00',
        poNumber: '',
        orderTax: 0,
        discount: 0,
        shipping: 0,
        status: 'Ordered',
        description: '',
        items: [{ ...initialItemState }]
    };
}
