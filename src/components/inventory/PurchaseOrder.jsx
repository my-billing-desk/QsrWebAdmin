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
import { createPortal } from 'react-dom';

const getNextPONumber = (existingOrders) => {
    if (!existingOrders || existingOrders.length === 0) return 'PO-0001';

    // Extract numbers from "PO-XXXX" or just digit format
    const numbers = existingOrders
        .map(o => {
            const match = o.poNumber.match(/(\d+)/);
            return match ? parseInt(match[0]) : 0;
        })
        .filter(n => !isNaN(n));

    const max = Math.max(0, ...numbers);
    const nextNum = max + 1;
    return `PO-${nextNum.toString().padStart(4, '0')}`;
};

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

        // Calculate amount: (qty * price) + tax percentage if they are percentages, 
        // OR just sum them up. Usually it's percentage on (qty * price).
        // I'll assume they are percentages for now.
        const baseAmount = qty * price;
        const taxAmount = baseAmount * ((tax1 + tax2) / 100);
        newItems[index].amount = (baseAmount + taxAmount).toFixed(2);

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
            // Create new raw materials if any
            const updatedItems = [...formData.items];
            for (let i = 0; i < updatedItems.length; i++) {
                const item = updatedItems[i];
                if (!item.rawMaterialId && item.name.trim()) {
                    // Check if a material with same name already exists (case insensitive)
                    const existingMat = rawMaterials.find(rm => rm.name.toLowerCase() === item.name.toLowerCase());
                    if (existingMat) {
                        updatedItems[i].rawMaterialId = existingMat.id;
                        updatedItems[i].name = existingMat.name;
                        updatedItems[i].unit = existingMat.purchaseUnit || existingMat.consumptionUnit;
                    } else {
                        // Create it
                        const res = await inventoryService.createRawMaterial({
                            name: item.name,
                            consumptionUnit: item.unit || 'Piece',
                            purchaseUnit: item.unit || 'Piece',
                            category: 'Uncategorized',
                            purchasePrice: item.price,
                            tax1: item.tax1,
                            tax2: item.tax2
                        });
                        updatedItems[i].rawMaterialId = res.data.id;
                        updatedItems[i].name = res.data.name;
                        updatedItems[i].unit = res.data.consumptionUnit;
                    }
                }
            }

            const payload = {
                ...formData,
                items: updatedItems,
                grandTotal: calculateGrandTotal()
            };

            if (formData.id) {
                await inventoryService.updatePurchaseOrder(formData.id, payload);
                toast.success('Purchase Order Updated!');
                setView('list'); // Switch back to list view on success
                loadData();
            } else {
                await inventoryService.createPurchaseOrder(payload);
                toast.success('Purchase Order Created!');
                setView('list'); // Switch back to list view on success
                loadData();
            }

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
                    .company-info h2 { margin: 0; color: #2563eb; font-size: 28px; font-weight: 900; }
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
                    <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 8px;">
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
        recorded: orders.reduce((sum, o) => sum + (parseFloat(o.grandTotal) || 0), 0).toFixed(2),
        outstanding: orders.filter(o => o.status !== 'Received').reduce((sum, o) => sum + (parseFloat(o.grandTotal) || 0), 0).toFixed(2),
        tax: orders.reduce((sum, o) => sum + (parseFloat(o.orderTax) || 0), 0).toFixed(2)
    };

    if (view === 'list') {
        return (
            <div className="flex flex-col h-full bg-gray-50 p-6 gap-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Purchase Orders</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage vendor requests & incoming stock</p>
                    </div>
                    <button
                        onClick={() => {
                            const nextPO = getNextPONumber(orders);
                            setFormData({ ...initialFormState(), poNumber: nextPO });
                            setView('add');
                        }}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" /> Create PO
                    </button>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-standard p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-50 rounded-xl">
                                <ShoppingBag className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Recorded</p>
                                <p className="text-2xl font-bold text-gray-900">₹ {totals.recorded}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-standard p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-emerald-50 rounded-xl">
                                <Truck className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pending Deliveries</p>
                                <p className="text-2xl font-bold text-gray-900">₹ {totals.outstanding}</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-standard p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-amber-50 rounded-xl">
                                <FileText className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Estimated Tax</p>
                                <p className="text-2xl font-bold text-gray-900">₹ {totals.tax}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-standard flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-4 bg-gray-50/50">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by PO number or supplier..."
                                className="input-field pl-10"
                                value={filterPO}
                                onChange={e => setFilterPO(e.target.value)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="flex gap-3">
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field w-auto" />
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field w-auto" />
                            <button onClick={loadData} className="btn-secondary"><RotateCcw className="w-4 h-4" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="table-standard">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Supplier</th>
                                    <th className="table-th">Expected Date</th>
                                    <th className="table-th">PO Number</th>
                                    <th className="table-th text-right">Grand Total</th>
                                    <th className="table-th">Status</th>
                                    <th className="table-th text-center">Actions</th>
                                    <th className="table-th text-center">Workflow</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.filter(o =>
                                (o.poNumber.toLowerCase().includes(filterPO.toLowerCase()) ||
                                    o.Supplier?.name.toLowerCase().includes(filterPO.toLowerCase()))
                                ).map(o => (
                                    <tr key={o.id} className="table-row">
                                        <td className="table-td">
                                            <div className="font-semibold text-gray-900">{o.Supplier?.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">{o.Supplier?.category || 'General Vendor'}</div>
                                        </td>
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span className="font-medium text-gray-700">{new Date(o.deliveryDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="table-td">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-mono font-medium">
                                                {o.poNumber}
                                            </span>
                                        </td>
                                        <td className="table-td text-right font-bold text-gray-900">
                                            ₹ {(parseFloat(o.grandTotal) || 0).toFixed(2)}
                                        </td>
                                        <td className="table-td">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.status === 'Received' ? 'bg-emerald-100 text-emerald-800' :
                                                o.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                                    o.status === 'Pending Approval' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-indigo-100 text-indigo-800'
                                                }`}>
                                                {o.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="table-td">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => generateInvoicePDF(o)} className="btn-icon text-gray-400 hover:text-blue-600" title="View PO">
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleEdit(o)} className="btn-icon text-gray-400 hover:text-indigo-600" title="Edit PO">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="table-td text-center">
                                            {o.status !== 'Pending Approval' && o.status !== 'Received' && (
                                                <button
                                                    onClick={() => navigate('/inventory/purchase', { state: { fromPO: o } })}
                                                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-all border border-indigo-100"
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
                                    <ShoppingBag className="w-6 h-6 text-gray-300" />
                                </div>
                                <div className="text-gray-400 font-medium">No purchase orders found.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
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
                                <label className="form-label">Supplier *</label>
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

                            <div className="col-span-3 space-y-1.5">
                                <label className="form-label">PO Date *</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.deliveryDate}
                                    onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                />
                            </div>

                            <div className="col-span-3 space-y-1.5">
                                <label className="form-label">Expect Arrival Time</label>
                                <input
                                    type="time"
                                    className="input-field"
                                    value={formData.deliveryTime}
                                    onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                                />
                            </div>

                            <div className="col-span-3 space-y-1.5">
                                <label className="form-label">PO Reference No</label>
                                <input
                                    type="text"
                                    readOnly
                                    className="input-field bg-gray-100 text-gray-500 font-mono"
                                    value={formData.poNumber || 'Generating...'}
                                />
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="card-standard p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-800">Order Items</h3>
                                <div className="flex gap-2">
                                    <button onClick={addItem} className="btn-secondary text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                        <Plus className="w-4 h-4" /> Add Item
                                    </button>
                                    <button className="btn-secondary text-gray-600">
                                        <Upload className="w-4 h-4" /> Bulk Import
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto border border-gray-200 rounded-lg min-h-[300px]">
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
                                                                newItems[idx].rawMaterialId = ''; // Reset ID since name changed manually
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
                                                <td className="px-4 py-2 text-right font-bold text-gray-700">
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
                        <div className="card-standard p-6 flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="form-label">Internal Notes</label>
                                    <textarea
                                        placeholder="Add notes..."
                                        className="input-field h-24 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-gray-800">₹ {calculateSubTotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Discount</span>
                                    <div className="w-24">
                                        <input
                                            type="number"
                                            value={formData.discount}
                                            onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                            className="input-field text-right py-1 h-8 text-xs"
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
                                            className="input-field text-right py-1 h-8 text-xs"
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
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 shrink-0">
                    <button onClick={() => setView('list')} className="btn-secondary">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary min-w-[120px]"
                    >
                        {isSaving ? 'Processing...' : (formData.id ? 'Update PO' : 'Finalize PO')}
                    </button>
                </div>
            </div>

            {/* Quick Supplier Modal */}
            {showSupplierModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Add Supplier</h3>
                            <button onClick={() => setShowSupplierModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Wrapper to add spacing */}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="form-label">Supplier Name *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newSupplier.name}
                                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newSupplier.phone}
                                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowSupplierModal(false)} className="btn-secondary">Cancel</button>
                            <button onClick={handleAddQuickSupplier} className="btn-primary">Add Supplier</button>
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
    amount: 0
};

function initialFormState() {
    return {
        supplierId: '',
        poNumber: '',
        deliveryDate: getTodayLocal(),
        deliveryTime: '09:00',
        items: [{ ...initialItemState }],
        discount: 0,
        shipping: 0,
        orderTax: 0,
        status: 'Draft',
        description: ''
    };
}

export default PurchaseOrder;
