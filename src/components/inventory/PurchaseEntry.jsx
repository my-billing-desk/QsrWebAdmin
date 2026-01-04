import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Upload, MoreHorizontal, Calendar, Edit2, RotateCcw, X, Search,
    Filter, ArrowUpDown, FileQuestion, ChevronDown, ShoppingBag, Clock, CheckCircle2,
    FileText, UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { inventoryService } from '../../services/api';
import { getTodayLocal } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export function PurchaseEntry() {
    const navigate = useNavigate();
    const location = useLocation();
    const [view, setView] = useState('list');
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState(initialFormState());
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showPOSelector, setShowPOSelector] = useState(false);
    const [showDiscountInput, setShowDiscountInput] = useState(false);
    const [showOtherChargesInput, setShowOtherChargesInput] = useState(false);
    const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', email: '' });

    const fromPOState = location.state?.fromPO;

    useEffect(() => {
        loadData().then(() => {
            if (fromPOState) {
                setFormData(initialFormState());
                setView('add');
            }
        });
    }, [fromPOState]);

    useEffect(() => {
        if (view === 'add' && location.state?.fromPO) {
            const poData = location.state.fromPO;
            if (typeof poData === 'object' && poData.id) {
                setPurchaseOrders(prev => {
                    if (!prev.find(p => p.id === poData.id)) {
                        return [poData, ...prev];
                    }
                    return prev;
                });
                applyPOData(poData);
            } else if (purchaseOrders.length > 0) {
                const po = purchaseOrders.find(p => p.id == poData);
                if (po) applyPOData(po);
            }
            const { fromPO: _, ...restState } = location.state || {};
            navigate(location.pathname, { replace: true, state: restState });
        }
    }, [view, purchaseOrders, location.state, location.pathname, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [matRes, supRes, purRes, poRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getSuppliers(),
                inventoryService.getPurchases(),
                inventoryService.getPurchaseOrders()
            ]);
            setRawMaterials(matRes.data || []);
            setSuppliers(supRes.data || []);
            setPurchases(purRes.data || []);
            setPurchaseOrders(poRes.data?.filter(po => po.status !== 'Received') || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const applyPOData = (po) => {
        if (!po) return;

        const items = po.PurchaseOrderItems?.map(poi => {
            const qty = parseFloat(poi.quantity) || 0;
            const price = parseFloat(poi.price || poi.RawMaterial?.purchasePrice || 0);
            return {
                rawMaterialId: poi.rawMaterialId,
                name: poi.RawMaterial?.name || '',
                quantity: qty,
                orderQty: qty,
                unit: poi.unit || poi.RawMaterial?.consumptionUnit,
                price: price,
                discount: 0,
                tax: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                taxAmount: 0,
                unitCost: price,
                amount: (qty * price).toFixed(2)
            };
        }) || [];

        setFormData(prev => ({
            ...prev,
            supplierId: po.supplierId,
            poNumber: po.poNumber,
            purchaseOrderId: po.id,
            items: items.length > 0 ? items : prev.items,
            otherTaxes: parseFloat(po.orderTax || 0),
            totalDiscount: parseFloat(po.discount || 0)
        }));
    };

    const handlePOSelction = (poId) => {
        if (!poId) {
            setFormData(prev => ({ ...prev, purchaseOrderId: '', poNumber: '', items: [{ ...initialItemState }] }));
            setShowPOSelector(false);
            return;
        }
        const po = purchaseOrders.find(p => p.id == poId);
        applyPOData(po);
        setShowPOSelector(false);
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
        const disc = parseFloat(newItems[index].discount) || 0;

        const cgst = parseFloat(newItems[index].cgst) || 0;
        const sgst = parseFloat(newItems[index].sgst) || 0;
        const igst = parseFloat(newItems[index].igst) || 0;

        const taxPercent = cgst + sgst + igst;
        const baseAmount = qty * price;
        const afterDisc = baseAmount - disc;
        const taxAmt = (afterDisc * taxPercent) / 100;
        const total = afterDisc + taxAmt;

        newItems[index].taxAmount = taxAmt.toFixed(2);
        newItems[index].amount = total.toFixed(2);
        newItems[index].unitCost = qty > 0 ? (total / qty).toFixed(2) : 0;

        setFormData({ ...formData, items: newItems });
        if (field === 'rawMaterialId') setFocusedIndex(null);
    };

    // const isAdmin = user?.role === 'Admin' || user?.role === 'Super Admin';

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

    const generatePurchasePDF = (purchase) => {
        const printWindow = window.open('', '_blank');
        const itemsHtml = (purchase.PurchaseItems || []).map((item, index) => `
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
                <title>Purchase Invoice - ${purchase.invoiceNumber}</title>
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
                            <h1>STOCK PURCHASE</h1>
                            <p><strong>Invoice #:</strong> ${purchase.invoiceNumber}<br>
                            <strong>Date:</strong> ${new Date(purchase.invoiceDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="details">
                        <div>
                            <h3>Supplier</h3>
                            <p><strong>${purchase.Supplier?.name}</strong><br>
                            ${purchase.Supplier?.phone || 'No Phone'}<br>
                            ${purchase.Supplier?.email || 'No Email'}</p>
                        </div>
                        <div style="text-align: right;">
                            <h3>Purchase Ref</h3>
                            <p><strong>PO Reference:</strong> ${purchase.poNumber || 'Direct Purchase'}<br>
                            <strong>Payment:</strong> ${purchase.paymentStatus} (${purchase.paymentType || 'N/A'})<br>
                            ${purchase.transactionNumber ? `<strong>Txn:</strong> ${purchase.transactionNumber}` : ''}</p>
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
                            <span>₹ ${parseFloat(purchase.subTotal || 0).toFixed(2)}</span>
                        </div>
                        <div>
                            <span>Discount / Credits</span>
                            <span style="color: #d92d20;">- ₹ ${parseFloat(purchase.discount || 0).toFixed(2)}</span>
                        </div>
                        <div>
                            <span>Delivery Charges</span>
                            <span>+ ₹ ${parseFloat(purchase.deliveryCharges || 0).toFixed(2)}</span>
                        </div>
                        <div>
                            <span>Other Charges</span>
                            <span>+ ₹ ${parseFloat(purchase.otherCharges || 0).toFixed(2)}</span>
                        </div>
                        <div class="grand-total">
                            <span>TOTAL</span>
                            <span>₹ ${parseFloat(purchase.grandTotal || 0).toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div style="clear: both; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
                        <p><strong>Note:</strong> ${purchase.notes || 'No additional notes.'}</p>
                        <p style="text-align: center; margin-top: 40px; font-weight: bold; color: #ccc; text-transform: uppercase; letter-spacing: 2px;">Receipt for Inventory Inward</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const handleEdit = (purchase) => {
        setFormData({
            id: purchase.id,
            supplierId: purchase.supplierId,
            invoiceDate: purchase.invoiceDate,
            deliveryDate: purchase.deliveryDate || purchase.invoiceDate,
            deliveryTime: purchase.deliveryTime || '12:00',
            invoiceNo: purchase.invoiceNumber,
            poNumber: purchase.poNumber,
            purchaseOrderId: purchase.purchaseOrderId,
            items: purchase.PurchaseItems?.map(item => ({
                rawMaterialId: item.rawMaterialId,
                name: item.RawMaterial?.name || '',
                quantity: item.quantity,
                orderQty: item.quantity,
                unit: item.unit,
                price: item.price,
                discount: 0,
                tax: item.taxPercent || 0,
                cgst: (item.taxPercent || 0) / 2, // Simple split for historical data
                sgst: (item.taxPercent || 0) / 2,
                igst: 0,
                taxAmount: ((parseFloat(item.quantity || 0) * parseFloat(item.price || 0)) * (parseFloat(item.taxPercent) || 0)) / 100,
                unitCost: item.price,
                amount: item.amount
            })) || [{ ...initialItemState }],
            totalDiscount: purchase.discount || 0,
            otherCharges: purchase.otherCharges || 0,
            otherTaxes: (purchase.totalCgst || 0) + (purchase.totalSgst || 0) + (purchase.totalIgst || 0),
            paymentStatus: purchase.status || 'Unpaid',
            paymentType: purchase.paymentType || 'Cash',
            transactionNumber: purchase.transactionNumber || '',
            paidAmount: purchase.paidAmount || 0,
            notes: purchase.notes || '',
            updateStock: true
        });
        setView('add');
    };

    const handleSave = async () => {
        if (!formData.supplierId) return toast.error('Please select a supplier');
        if (!formData.invoiceNo) return toast.error('Vendor Invoice Number is required');

        setIsSaving(true);
        try {
            const finalData = {
                ...formData,
                invoiceNumber: formData.invoiceNo,
                grandTotal: calculateGrandTotal()
            };

            if (formData.id) {
                await inventoryService.updatePurchase(formData.id, finalData);
            } else if (formData.purchaseOrderId) {
                await inventoryService.receivePurchaseOrder(formData.purchaseOrderId, finalData);
            } else {
                await inventoryService.createPurchase(finalData);
            }
            toast.success(formData.id ? 'Stock Purchase Updated!' : 'Stock Purchase Saved!');
            setView('list');
            loadData();
        } catch (error) {
            toast.error('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this purchase? This will revert the stock impact.')) return;
        try {
            await inventoryService.deletePurchase(id);
            toast.success('Purchase deleted successfully');
            loadData();
        } catch (error) {
            toast.error('Error deleting purchase: ' + (error.response?.data?.error || error.message));
        }
    };

    if (view === 'list') {
        return (
            <div className="flex flex-col h-full bg-[#f8f9fa] font-sans p-6 gap-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h1 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">Stock Purchase</h1>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Manage inbound inventory & vendor invoices</p>
                    </div>
                    <button
                        onClick={() => { setFormData(initialFormState()); setView('add'); }}
                        className="px-6 py-3 bg-[#d92d20] text-white rounded-2xl font-black shadow-2xl shadow-red-500/20 hover:bg-[#b42318] flex items-center gap-2 transition-all transform hover:scale-105 uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-4 h-4" /> Add Purchase
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-sm flex-1 overflow-hidden flex flex-col">
                    <div className="p-6 border-b flex justify-between items-center gap-4 bg-gray-50/30 text-left">
                        <div className="relative w-full md:w-96">
                            <input type="text" placeholder="Search by invoice or supplier..." className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-500/5 focus:border-[#d92d20] outline-none transition-all shadow-sm" />
                            <Search className="w-5 h-5 text-gray-300 absolute left-4 top-3" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={loadData} className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 transition-all shadow-sm"><RotateCcw className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#fcfcfc] text-[10px] uppercase font-black text-gray-400 border-b tracking-[0.15em]">
                                <tr>
                                    <th className="p-6">Purchase Date</th>
                                    <th className="p-6">Supplier</th>
                                    <th className="p-6">Invoice Number</th>
                                    <th className="p-6">PO Reference</th>
                                    <th className="p-6 text-right">Grand Total</th>
                                    <th className="p-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {purchases.map(p => (
                                    <tr key={p.id} className="hover:bg-red-50/30 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <span className="font-bold text-gray-700">{new Date(p.invoiceDate || p.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="font-black text-gray-900 tracking-tight">{p.Supplier?.name}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{p.Supplier?.category || 'General Vendor'}</div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-black font-mono shadow-sm">
                                                {p.invoiceNumber || p.invoiceNo}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-orange-600 font-bold">
                                                <ShoppingBag className="w-4 h-4 opacity-50" />
                                                {p.poNumber || 'Direct Purchase'}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right font-black text-gray-900 italic tracking-tighter text-lg">
                                            ₹ {parseFloat(p.grandTotal || p.totalAmount || 0).toFixed(2)}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => generatePurchasePDF(p)}
                                                    className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 hover:text-blue-500 transition-all font-bold"
                                                    title="View Invoice"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 hover:text-blue-500 transition-all"
                                                    title="Edit Purchase"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="p-2.5 hover:bg-white hover:shadow-md rounded-xl text-gray-300 hover:text-red-500 transition-all"
                                                    title="Delete Purchase"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {purchases.length === 0 && !loading && (
                            <div className="p-20 text-center flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
                                    <FileQuestion className="w-10 h-10 text-gray-200" />
                                </div>
                                <div className="text-gray-400 italic font-bold">No purchase records found. Start by adding one.</div>
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
                    <h2 className="text-xl font-bold text-gray-800">Add Purchase</h2>
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
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Purchase From</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-gray-800">Direct Purchase</span>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowPOSelector(!showPOSelector)}
                                            className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:underline"
                                        >
                                            Select Purchase Order/Sales <ChevronDown className="w-3 h-3" />
                                        </button>
                                        {showPOSelector && (
                                            <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-2 max-h-64 overflow-y-auto">
                                                <button onClick={() => handlePOSelction('')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg font-medium text-gray-600">Direct Purchase</button>
                                                <div className="h-px bg-gray-50 my-1"></div>
                                                {purchaseOrders.length > 0 ? (
                                                    purchaseOrders.map(po => (
                                                        <button
                                                            key={po.id}
                                                            onClick={() => handlePOSelction(po.id)}
                                                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded-lg text-gray-700 transition-all flex flex-col"
                                                        >
                                                            <span className="font-bold">{po.poNumber}</span>
                                                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{po.Supplier?.name}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-3 text-xs text-center text-gray-400 italic">No pending POs found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Purchase Date *</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
                                        value={formData.invoiceDate}
                                        onChange={e => setFormData({ ...formData, invoiceDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expect Delivery (Date & Time)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
                                        value={formData.deliveryDate}
                                        onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                    />
                                    <input
                                        type="time"
                                        className="w-24 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500"
                                        value={formData.deliveryTime}
                                        onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor Invoice No *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. INV-2024-001"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 font-mono"
                                    value={formData.invoiceNo}
                                    onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-start items-center gap-3 pt-4 border-t border-gray-50">
                            <button onClick={addItem} className="px-4 py-2 border border-blue-100 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 flex items-center gap-2 transition-all">
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                            <div className="relative group">
                                <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px]">×</div>
                                    At Invoice Level <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                                    <button onClick={() => setShowDiscountInput(!showDiscountInput)} className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg uppercase tracking-wider">Apply Discount</button>
                                    <button onClick={() => setShowOtherChargesInput(!showOtherChargesInput)} className="w-full text-left px-3 py-2 text-[11px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg uppercase tracking-wider">Apply Tax</button>
                                </div>
                            </div>
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                More Action <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                                <Upload className="w-4 h-4" /> Upload Invoice
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
                                        <th className="px-4 py-3 text-right w-32">Price</th>
                                        <th className="px-4 py-3 text-right w-32">Amount</th>
                                        <th className="px-4 py-3 w-48">Tax Detail (CGST/SGST/IGST)</th>
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
                                            <td className="px-4 py-6">
                                                <select
                                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 appearance-none bg-white text-center"
                                                    value={item.unit}
                                                    onChange={e => updateItem(idx, 'unit', e.target.value)}
                                                >
                                                    {['Kg', 'Ltr', 'GM', 'ML', 'Piece', 'Box', 'Packet'].map(u => (
                                                        <option key={u} value={u}>{u}</option>
                                                    ))}
                                                </select>
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
                                            <td className="px-4 py-6">
                                                <div className="flex gap-1 justify-center">
                                                    <input type="number" placeholder="CGST" className="w-14 border border-gray-200 rounded px-1.5 py-1 text-[10px] text-center outline-none focus:border-blue-400" value={item.cgst || 0} onChange={e => updateItem(idx, 'cgst', e.target.value)} />
                                                    <input type="number" placeholder="SGST" className="w-14 border border-gray-200 rounded px-1.5 py-1 text-[10px] text-center outline-none focus:border-blue-400" value={item.sgst || 0} onChange={e => updateItem(idx, 'sgst', e.target.value)} />
                                                    <input type="number" placeholder="IGST" className="w-14 border border-gray-200 rounded px-1.5 py-1 text-[10px] text-center outline-none focus:border-blue-400" value={item.igst || 0} onChange={e => updateItem(idx, 'igst', e.target.value)} />
                                                </div>
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
                                                <span className="text-blue-500 font-black">+</span> Total Discount
                                                <span className="ml-8 text-red-500 font-mono">- {parseFloat(formData.totalDiscount).toFixed(2)}</span>
                                            </button>
                                            {showDiscountInput && (
                                                <input
                                                    type="number"
                                                    className="w-24 bg-white border border-blue-500 rounded-lg px-3 py-2 text-xs font-bold outline-none"
                                                    value={formData.totalDiscount}
                                                    onChange={e => setFormData({ ...formData, totalDiscount: e.target.value })}
                                                    autoFocus
                                                />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setShowOtherChargesInput(!showOtherChargesInput)}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                                            >
                                                <span className="text-blue-500 font-black">+</span> Add Other Charges
                                                <span className="ml-8 text-emerald-500 font-mono">+ {parseFloat(formData.otherCharges).toFixed(2)}</span>
                                            </button>
                                            {showOtherChargesInput && (
                                                <input
                                                    type="number"
                                                    className="w-24 bg-white border border-blue-500 rounded-lg px-3 py-2 text-xs font-bold outline-none"
                                                    value={formData.otherCharges}
                                                    onChange={e => setFormData({ ...formData, otherCharges: e.target.value })}
                                                    autoFocus
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="max-w-md">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Notes</label>
                                    <textarea
                                        placeholder="Add internal notes or vendor instructions..."
                                        className="w-full border border-gray-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-blue-500 h-24 bg-white/50"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="w-1/3 flex flex-col items-end gap-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Grand Total</span>
                                <div className="text-5xl font-black text-gray-900 tracking-tighter flex items-start gap-1">
                                    <span className="text-xl mt-2 text-gray-400">₹</span>
                                    {calculateGrandTotal()}
                                </div>
                                <div className="w-full h-px bg-gray-100 my-4"></div>
                                <div className="flex gap-4 text-xs font-bold text-gray-500">
                                    <span>Taxes: ₹ {parseFloat(formData.otherTaxes).toFixed(2)}</span>
                                    <span>Delivery: ₹ {parseFloat(formData.deliveryCharges).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="bg-[#fff1f1] px-8 py-4 border-t border-red-100 flex justify-between items-center shrink-0">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${formData.updateStock ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-gray-300'}`}>
                            {formData.updateStock && <div className="w-3 h-1.5 border-b-2 border-l-2 border-white -rotate-45 mb-1"></div>}
                            <input type="checkbox" className="hidden" checked={formData.updateStock} onChange={e => setFormData({ ...formData, updateStock: e.target.checked })} />
                        </div>
                        <div>
                            <span className="text-sm font-black text-gray-700 group-hover:text-emerald-600 transition-colors">Update Inventory Stock</span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Increment material levels automatically</p>
                        </div>
                    </label>
                    <div className="flex gap-4">
                        <button onClick={() => setView('list')} className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all">Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-10 py-3 bg-[#d92d20] text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#b42318] transition-all shadow-xl shadow-red-500/20 disabled:opacity-50"
                        >
                            {isSaving ? 'Processing...' : 'Complete Purchase'}
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
    orderQty: 0,
    unit: 'Kg',
    price: 0,
    discount: 0,
    tax: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    taxAmount: 0,
    unitCost: 0,
    amount: 0
};

function initialFormState() {
    return {
        supplierId: '',
        invoiceDate: getTodayLocal(),
        deliveryDate: getTodayLocal(),
        deliveryTime: '12:00',
        invoiceNo: '',
        poNumber: '',
        purchaseOrderId: '',
        items: [{ ...initialItemState }],
        totalDiscount: 0,
        otherCharges: 0,
        deliveryCharges: 0,
        otherTaxes: 0,
        paymentStatus: 'Unpaid',
        paymentType: 'Cash',
        transactionNumber: '',
        paidAmount: 0,
        notes: '',
        updateStock: true
    };
}
