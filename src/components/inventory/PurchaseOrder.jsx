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
            <div className="flex flex-col h-full bg-[#f8f9fa] font-sans p-6 gap-6 overflow-x-hidden text-left">
                {/* Header Area */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">Purchase Orders</h1>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage procurement & vendor requests</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setFormData(initialFormState()); setView('add'); }}
                            className="px-6 py-3 bg-[#d92d20] text-white rounded-2xl font-black shadow-2xl shadow-red-500/20 hover:bg-[#b42318] flex items-center gap-2 transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
                        >
                            <Plus className="w-4 h-4" /> Create New PO
                        </button>
                        <button className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 transition-all shadow-sm">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-center gap-2 text-gray-600 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Recorded Amount</span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 flex items-center gap-1 relative z-10 italic">
                            <span className="text-gray-400 font-medium">₹</span> {totals.recorded}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-center gap-2 text-gray-600 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Pending Deliveries</span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 flex items-center gap-1 relative z-10 italic">
                            <span className="text-gray-400 font-medium">₹</span> {totals.outstanding}
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col gap-2 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-110 transition-transform"></div>
                        <div className="flex items-center gap-2 text-gray-600 relative z-10">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Estimated Tax</span>
                        </div>
                        <div className="text-3xl font-black text-gray-900 flex items-center gap-1 relative z-10 italic">
                            <span className="text-gray-400 font-medium">₹</span> {totals.tax}
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center gap-4 bg-gray-50/30">
                        <div className="flex gap-4 items-center">
                            <div className="relative w-80">
                                <input
                                    type="text"
                                    placeholder="Search by PO number or supplier..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-500/5 focus:border-[#d92d20] outline-none transition-all shadow-sm"
                                    value={filterPO}
                                    onChange={e => setFilterPO(e.target.value)}
                                />
                                <Search className="w-5 h-5 text-gray-300 absolute left-4 top-3" />
                            </div>
                            <div className="flex gap-2">
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold shadow-sm outline-none focus:border-red-500 transition-all" />
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold shadow-sm outline-none focus:border-red-500 transition-all" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={loadData} className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 transition-all shadow-sm"><RotateCcw className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#fcfcfc] text-[10px] uppercase font-black text-gray-400 border-b tracking-[0.15em]">
                                <tr>
                                    <th className="p-6">Supplier</th>
                                    <th className="p-6">Delivery Date</th>
                                    <th className="p-6">PO Number</th>
                                    <th className="p-6 text-right">Grand Total</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-center">Actions</th>
                                    <th className="p-6 text-center">Next Step</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {orders.filter(o =>
                                (o.poNumber.toLowerCase().includes(filterPO.toLowerCase()) ||
                                    o.Supplier?.name.toLowerCase().includes(filterPO.toLowerCase()))
                                ).map(o => (
                                    <tr key={o.id} className="hover:bg-red-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="font-black text-gray-900 tracking-tight">{o.Supplier?.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{o.Supplier?.category || 'General Vendor'}</div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <span className="font-bold text-gray-700">{new Date(o.deliveryDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black font-mono shadow-sm">
                                                {o.poNumber}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right font-black text-gray-900 italic tracking-tighter text-lg">
                                            ₹ {(parseFloat(o.grandTotal) || 0).toFixed(2)}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${o.status === 'Received' ? 'bg-emerald-50 text-emerald-600' :
                                                o.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                                                    o.status === 'Pending Approval' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-blue-50 text-blue-600'
                                                }`}>
                                                {o.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => generateInvoicePDF(o)}
                                                    className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 hover:text-blue-500 transition-all font-bold"
                                                    title="View PO"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(o)}
                                                    className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 hover:text-blue-500 transition-all font-bold"
                                                    title="Edit PO"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 transition-all">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            {o.status !== 'Pending Approval' && o.status !== 'Received' && (
                                                <button
                                                    onClick={() => navigate('/inventory/purchase', { state: { fromPO: o } })}
                                                    className="px-4 py-1.5 bg-[#d92d20] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#b42318] transition-all shadow-lg shadow-red-500/10"
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
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                                </div>
                                <div className="text-gray-400 italic font-bold">No purchase orders found. Start by creating one.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300 overflow-hidden text-left">
            <div className="bg-white rounded-[2rem] w-full max-w-7xl shadow-2xl flex flex-col max-h-[96vh] border border-white/20 animate-in zoom-in-95 duration-300">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
                    <button onClick={() => setView('list')} className="w-8 h-8 text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-[#fcfcfc] custom-scrollbar">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Header Controls */}
                        <div className="flex items-center gap-12 text-sm">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Procurement Method</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-800 italic">Direct Vendor Order</span>
                                </div>
                            </div>
                        </div>

                        {/* Master Fields */}
                        <div className="grid grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier *</label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 transition-all appearance-none"
                                        value={formData.supplierId}
                                        onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                                    >
                                        <option value="">Select Supplier</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <button
                                        onClick={() => setShowSupplierModal(true)}
                                        className="w-9 h-9 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PO Date *</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
                                        value={formData.deliveryDate}
                                        onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expect Arrival Time</label>
                                <div className="flex gap-2">
                                    <input
                                        type="time"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
                                        value={formData.deliveryTime}
                                        onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PO Reference No (Auto)</label>
                                <input
                                    type="text"
                                    placeholder="PO-000000"
                                    readOnly
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-gray-500 outline-none font-mono"
                                    value={formData.poNumber || 'PO-GENERATING...'}
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-start items-center gap-3 pt-4 border-t border-gray-50">
                            <button onClick={addItem} className="px-4 py-2 border border-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 flex items-center gap-2 transition-all">
                                <Plus className="w-4 h-4" /> Add Item
                            </button>
                            <div className="relative group">
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px]">×</div>
                                    At Order Level <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                                    <button onClick={() => setShowDiscountInput(!showDiscountInput)} className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg uppercase tracking-wider">Apply Discount</button>
                                    <button onClick={() => setShowTaxInput(!showTaxInput)} className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg uppercase tracking-wider">Apply Estimate Tax</button>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Bulk Import
                            </button>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-auto border border-gray-100 rounded-xl shadow-sm bg-white min-h-[400px]">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                    <tr className="text-gray-600 text-[10px] font-black uppercase tracking-widest text-center">
                                        <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded" /></th>
                                        <th className="px-4 py-3 text-left w-80">Raw Material <span className="text-red-500">*</span></th>
                                        <th className="px-4 py-3 w-28">Qty <span className="text-red-500">*</span></th>
                                        <th className="px-4 py-3 w-28">Unit <span className="text-red-500">*</span></th>
                                        <th className="px-4 py-3 text-right w-32">Estimate Price</th>
                                        <th className="px-4 py-3 text-right w-32">Total Amount</th>
                                        <th className="px-4 py-3 w-20">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {formData.items.map((item, idx) => (
                                        <tr key={idx} className="group hover:bg-blue-50/10 transition-colors">
                                            <td className="px-4 py-6 text-center"><input type="checkbox" className="rounded" /></td>
                                            <td className="px-4 py-6 relative">
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
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
                                                            <div className="fixed inset-0 z-[100]" onClick={() => setFocusedIndex(null)}></div>
                                                            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-[110] mt-1 max-h-60 overflow-y-auto p-1">
                                                                {rawMaterials.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                                                                    rawMaterials
                                                                        .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                                                        .map(m => (
                                                                            <button
                                                                                key={m.id}
                                                                                onClick={() => updateItem(idx, 'rawMaterialId', m.id)}
                                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-gray-700 rounded-md transition-colors flex justify-between items-center group"
                                                                            >
                                                                                <span className="font-medium">{m.name}</span>
                                                                                <span className="text-[10px] text-gray-400 group-hover:text-blue-500">Select</span>
                                                                            </button>
                                                                        ))
                                                                ) : (
                                                                    <div className="p-3 text-xs text-center text-gray-400 italic">No materials found</div>
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="number"
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-center outline-none focus:border-blue-500"
                                                    value={item.quantity}
                                                    onChange={e => updateItem(idx, 'quantity', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-6 text-center">
                                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.unit || '---'}</span>
                                            </td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="number"
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-right outline-none focus:border-blue-500"
                                                    value={item.price}
                                                    onChange={e => updateItem(idx, 'price', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-6">
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm font-bold text-right text-gray-600"
                                                    value={item.amount}
                                                />
                                            </td>
                                            <td className="px-4 py-6 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => removeItem(idx)} className="p-1.5 hover:text-red-500 text-gray-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary & Totals */}
                        <div className="flex justify-between items-start pt-8 pb-12">
                            <div className="w-1/2 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6 font-bold text-gray-700">
                                        <span className="text-sm">Sub Total :</span>
                                        <span className="text-lg text-gray-900 italic font-black">₹ {calculateSubTotal().toFixed(2)}</span>
                                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setShowDiscountInput(!showDiscountInput)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                                            >
                                                <span className="text-blue-500 font-black">+</span> Order Discount
                                                <span className="ml-8 text-red-500 font-mono">- {parseFloat(formData.discount).toFixed(2)}</span>
                                            </button>
                                            {showDiscountInput && (
                                                <input
                                                    type="number"
                                                    className="w-24 bg-white border border-blue-500 rounded-lg px-3 py-2 text-xs font-bold outline-none"
                                                    value={formData.discount}
                                                    onChange={e => setFormData({ ...formData, discount: e.target.value })}
                                                    autoFocus
                                                />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setShowTaxInput(!showTaxInput)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                                            >
                                                <span className="text-blue-500 font-black">+</span> Estimated Tax
                                                <span className="ml-8 text-emerald-500 font-mono">+ {parseFloat(formData.orderTax).toFixed(2)}</span>
                                            </button>
                                            {showTaxInput && (
                                                <input
                                                    type="number"
                                                    className="w-24 bg-white border border-blue-500 rounded-lg px-3 py-2 text-xs font-bold outline-none"
                                                    value={formData.orderTax}
                                                    onChange={e => setFormData({ ...formData, orderTax: e.target.value })}
                                                    autoFocus
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="max-w-md">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Internal Instructions (Private)</label>
                                    <textarea
                                        placeholder="Add notes for the procurement team..."
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 h-24 bg-white/50"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="w-1/3 flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total (EST)</span>
                                <div className="text-5xl font-black text-gray-900 tracking-tighter flex items-start gap-1">
                                    <span className="text-xl mt-2 text-gray-400">₹</span>
                                    {calculateGrandTotal()}
                                </div>
                                <div className="w-full h-px bg-gray-100 my-4"></div>
                                <div className="flex gap-4 text-xs font-bold text-gray-500">
                                    <span>Shipping: ₹ {parseFloat(formData.shipping).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-[#fff1f1] px-8 py-4 border-t border-red-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-red-100 shadow-sm">
                            <ShoppingBag className="w-5 h-5 text-[#d92d20]" />
                        </div>
                        <div>
                            <span className="text-sm font-black text-gray-700">Vendor Notification</span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">PO will be saved & ready for dispatch</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => setView('list')} className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-10 py-3 bg-[#d92d20] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#b42318] transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                        >
                            {isSaving ? 'Processing...' : (formData.id ? 'Update PO' : 'Finalize PO')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Supplier Modal */}
            {showSupplierModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-black text-gray-900 uppercase tracking-tight text-left">Quick Add Supplier</h3>
                            </div>
                            <button onClick={() => setShowSupplierModal(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-4 text-left">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supplier Name *</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-blue-500 transition-all font-sans"
                                    placeholder="e.g. Fresh Farms Ltd"
                                    value={newSupplier.name}
                                    onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none font-sans"
                                    placeholder="+91 00000 00000"
                                    value={newSupplier.phone}
                                    onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowSupplierModal(false)} className="flex-1 py-3 bg-gray-50 text-gray-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Cancel</button>
                            <button onClick={handleAddQuickSupplier} className="flex-1 py-3 bg-[#d92d20] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Add Supplier</button>
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
