import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, MoreHorizontal, Calendar, Edit2, RotateCcw, X, Search, Filter, ArrowUpDown, FileQuestion, ChevronDown, ShoppingBag, Clock, CheckCircle2, FileText, UserPlus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { inventoryService } from '../../services/api';
import toast from 'react-hot-toast';

export function StockPurchase() {
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

    const initialItemState = { rawMaterialId: '', name: '', quantity: '', unit: '', price: '', tax1: 0, tax2: 0, taxAmount: 0, amount: 0 };
    const initialFormState = () => ({
        supplierId: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        invoiceNo: '',
        poNumber: '',
        purchaseOrderId: '',
        items: [{ ...initialItemState }],
        totalDiscount: 0,
        otherCharges: 0,
        otherTaxes: 0,
        paymentStatus: 'Unpaid',
        paymentType: 'Cash',
        notes: ''
    });

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
        const tax1 = parseFloat(newItems[index].tax1) || 0;
        const tax2 = parseFloat(newItems[index].tax2) || 0;

        const baseAmount = qty * price;
        const afterDisc = baseAmount - disc;
        const taxAmt = afterDisc * ((tax1 + tax2) / 100);
        const total = afterDisc + taxAmt;

        newItems[index].taxAmount = taxAmt.toFixed(2);
        newItems[index].amount = total.toFixed(2);
        newItems[index].unitCost = qty > 0 ? (total / qty).toFixed(2) : 0;

        setFormData({ ...formData, items: newItems });
        if (field === 'rawMaterialId') setFocusedIndex(null);
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
                            <span style="color: #2563eb;">- ₹ ${parseFloat(purchase.discount || 0).toFixed(2)}</span>
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
                cgst: (item.taxPercent || 0) / 2,
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
            // Create new raw materials if any
            const updatedItems = [...formData.items];
            for (let i = 0; i < updatedItems.length; i++) {
                const item = updatedItems[i];
                if (!item.rawMaterialId && item.name.trim()) {
                    const existingMat = rawMaterials.find(rm => rm.name.toLowerCase() === item.name.toLowerCase());
                    if (existingMat) {
                        updatedItems[i].rawMaterialId = existingMat.id;
                        updatedItems[i].name = existingMat.name;
                        updatedItems[i].unit = existingMat.purchaseUnit || existingMat.consumptionUnit;
                    } else {
                        const res = await inventoryService.createRawMaterial({
                            name: item.name,
                            consumptionUnit: item.unit || 'kg',
                            purchaseUnit: item.unit || 'kg',
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

            const finalData = {
                ...formData,
                items: updatedItems,
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
            <div className="flex flex-col h-full bg-gray-50 p-6 gap-6">
                <div className="flex justify-between items-center text-left">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Stock Purchase</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage inbound inventory & vendor invoices</p>
                    </div>
                    <button
                        onClick={() => { setFormData(initialFormState()); setView('add'); }}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" /> Add Purchase
                    </button>
                </div>

                <div className="card-standard flex-1 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-4 bg-gray-50/50">
                        <div className="relative w-full md:w-96">
                            <input
                                type="text"
                                placeholder="Search by invoice or supplier..."
                                className="input-field pl-10"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
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
                                    <th className="table-th">Purchase Date</th>
                                    <th className="table-th">Supplier</th>
                                    <th className="table-th">Invoice Number</th>
                                    <th className="table-th">PO Reference</th>
                                    <th className="table-th text-right">Grand Total</th>
                                    <th className="table-th text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {purchases.filter(p => !searchQuery || JSON.stringify(p).toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                                    <tr key={p.id} className="table-row">
                                        <td className="table-td">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-gray-500" />
                                                </div>
                                                <span className="font-medium text-gray-700">{new Date(p.invoiceDate || p.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="table-td">
                                            <div className="font-semibold text-gray-900">{p.Supplier?.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase leading-none mt-1">{p.Supplier?.category || 'General Vendor'}</div>
                                        </td>
                                        <td className="table-td">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-mono font-medium">
                                                {p.invoiceNumber || p.invoiceNo}
                                            </span>
                                        </td>
                                        <td className="table-td">
                                            <div className="flex items-center gap-2 text-indigo-600 font-medium text-xs">
                                                {p.poNumber || (
                                                    <span className="text-gray-400 italic font-normal">Direct Purchase</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="table-td text-right font-bold text-gray-900">
                                            ₹ {parseFloat(p.grandTotal || p.totalAmount || 0).toFixed(2)}
                                        </td>
                                        <td className="table-td">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => generatePurchasePDF(p)}
                                                    className="btn-icon text-gray-400 hover:text-blue-600"
                                                    title="View Invoice"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="btn-icon text-gray-400 hover:text-indigo-600"
                                                    title="Edit Purchase"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id)}
                                                    className="btn-icon text-gray-400 hover:text-red-500"
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
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                                    <FileQuestion className="w-8 h-8 text-gray-300" />
                                </div>
                                <div className="text-gray-400 font-medium">No purchase records found. Start by adding one.</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-7xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">{formData.id ? 'Edit Stock Purchase' : 'Add Stock Purchase'}</h2>
                    <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                    <div className="max-w-6xl mx-auto space-y-6">
                        {/* Master Fields Grid */}
                        <div className="card-standard p-6 grid grid-cols-12 gap-6">
                            <div className="col-span-3 space-y-1.5">
                                <label className="form-label">Purchase From</label>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-semibold text-gray-800">{formData.poNumber ? `Linked to PO: ${formData.poNumber}` : 'Direct Purchase'}</span>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowPOSelector(!showPOSelector)}
                                                className="text-blue-600 text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
                                            >
                                                Change <ChevronDown className="w-3 h-3" />
                                            </button>
                                            {showPOSelector && (
                                                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-[110] p-2 max-h-64 overflow-y-auto">
                                                    <button onClick={() => handlePOSelction('')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded font-medium text-gray-600">Direct Purchase</button>
                                                    <div className="h-px bg-gray-100 my-1"></div>
                                                    {purchaseOrders.length > 0 ? (
                                                        purchaseOrders.map(po => (
                                                            <button
                                                                key={po.id}
                                                                onClick={() => handlePOSelction(po.id)}
                                                                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded text-gray-700 transition-all flex flex-col"
                                                            >
                                                                <span className="font-bold">{po.poNumber}</span>
                                                                <span className="text-[10px] text-gray-400">{po.Supplier?.name}</span>
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

                            <div className="col-span-2 space-y-1.5">
                                <label className="form-label">Invoice Date *</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.invoiceDate}
                                    onChange={e => setFormData({ ...formData, invoiceDate: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="form-label">Invoice Number *</label>
                                <input
                                    type="text"
                                    placeholder="INV-..."
                                    className="input-field font-mono"
                                    value={formData.invoiceNo}
                                    onChange={e => setFormData({ ...formData, invoiceNo: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <label className="form-label">Delivery Date</label>
                                <input
                                    type="date"
                                    className="input-field"
                                    value={formData.deliveryDate}
                                    onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex justify-start items-center gap-3 pt-2">
                            <button onClick={addItem} className="btn-secondary text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
                                <Plus className="w-4 h-4" /> Add New Item
                            </button>
                            <div className="relative group">
                                <button className="btn-secondary text-xs">
                                    Apply Extra Charges <ChevronDown className="w-4 h-4" />
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all">
                                    <button onClick={() => setShowDiscountInput(!showDiscountInput)} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded">APPLY DISCOUNT</button>
                                    <button onClick={() => setShowOtherChargesInput(!showOtherChargesInput)} className="w-full text-left px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 rounded">APPLY TAX</button>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="card-standard overflow-hidden">
                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-800">Purchase Items</h3>
                                <div className="text-xs text-gray-500">Total Items: {formData.items.length}</div>
                            </div>

                            <div className="overflow-x-auto min-h-[300px]">
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
                                                                        <div className="p-3 text-xs text-gray-500 text-center">No matches. New item will be created.</div>
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
                                                <td className="px-4 py-2 text-right">
                                                    <span className="font-bold text-gray-700">₹ {parseFloat(item.amount || 0).toFixed(2)}</span>
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm w-96 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Sub Total</span>
                                    <span className="font-bold text-gray-800">₹ {calculateSubTotal().toFixed(2)}</span>
                                </div>
                                {showDiscountInput && (
                                    <div className="flex justify-between text-sm text-gray-600 items-center">
                                        <span>Discount</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">-</span>
                                            <input
                                                type="number"
                                                className="w-24 input-field text-right py-1 h-8"
                                                value={formData.totalDiscount}
                                                onChange={e => setFormData({ ...formData, totalDiscount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                                {showOtherChargesInput && (
                                    <>
                                        <div className="flex justify-between text-sm text-gray-600 items-center">
                                            <span>Other Charges</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-xs">+</span>
                                                <input
                                                    type="number"
                                                    className="w-24 input-field text-right py-1 h-8"
                                                    value={formData.otherCharges}
                                                    onChange={e => setFormData({ ...formData, otherCharges: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-600 items-center">
                                            <span>Extra Tax</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-xs">+</span>
                                                <input
                                                    type="number"
                                                    className="w-24 input-field text-right py-1 h-8"
                                                    value={formData.otherTaxes}
                                                    onChange={e => setFormData({ ...formData, otherTaxes: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900">
                                    <span>Grand Total</span>
                                    <span>₹ {calculateGrandTotal()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white shrink-0">
                    <button onClick={() => setView('list')} className="btn-secondary">
                        Cancel
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="btn-primary min-w-[120px]">
                        {isSaving ? 'Saving...' : 'Save Purchase'}
                    </button>
                </div>
            </div>
        </div>
    );
}
