import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Save, ArrowLeft, ChevronDown, ChevronUp, Download, Printer, MoreHorizontal, Info, FileText } from 'lucide-react';
import { inventoryService, menuService } from '../../services/api';

export function RawMaterials() {
    const [view, setView] = useState('list'); // 'list' | 'add'
    const [materials, setMaterials] = useState([]);
    const [formData, setFormData] = useState(initialFormState());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await inventoryService.getRawMaterials();
            setMaterials(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const payload = { ...formData };
            if (payload.addOpeningStock) {
                payload.currentStock = payload.openingStock;
                if (!payload.purchasePrice && payload.avgPrice) {
                    payload.purchasePrice = payload.avgPrice;
                }
            }

            if (payload.id) {
                await inventoryService.updateRawMaterial(payload.id, payload);
            } else {
                await inventoryService.createRawMaterial(payload);
            }
            setView('list');
            loadData();
        } catch (error) {
            alert('Error saving: ' + (error.response?.data?.error || error.message));
        }
    };

    if (view === 'list') {
        return (
            <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Raw Materials Management</h1>
                        <p className="text-sm text-gray-500">Manage all your raw materials here</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFormData(initialFormState()); setView('add'); }}
                            className="btn-primary"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                        <button className="btn-secondary">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <button className="btn-secondary px-3">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white p-4 rounded-lg border mb-4 flex gap-4 items-center">
                    <div className="grid grid-cols-4 gap-4 flex-1">
                        <div className="relative">
                            <input type="date" className="input-field" placeholder="Start Date" />
                        </div>
                        <div className="relative">
                            <input type="date" className="input-field" placeholder="End Date" />
                        </div>
                        <select className="input-field">
                            <option>All</option>
                        </select>
                        <input type="text" className="input-field" placeholder="Challan No." />
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary">More Filters</button>
                        <button className="btn-secondary text-primary-600 border-primary-200 bg-primary-50 hover:bg-primary-100">Search</button>
                        <button className="btn-secondary text-gray-500">Clear</button>
                    </div>
                </div>

                {/* Empty State */}
                {materials.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white rounded-lg border border-dashed">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-red-200" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600">No Raw Materials Found</h3>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 font-semibold text-gray-600 border-b">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4">Unit</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {materials.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{m.name}</td>
                                        <td className="p-4">{m.category}</td>
                                        <td className="p-4">{m.currentStock}</td>
                                        <td className="p-4">{m.consumptionUnit}</td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => { setFormData(m); setView('add'); }} className="text-blue-600 font-medium text-sm">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    }

    // Add Form View
    const itemName = formData.name || 'Item';

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Sticky Header */}
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between shrink-0 z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{formData.id ? 'Edit' : 'Add'} Raw Material</h1>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Info className="w-4 h-4" />
                        <span>Basic Details</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-5xl mx-auto w-full">

                {/* Basic Details */}
                <Section icon={Plus} title="Basic Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Name *" required>
                            <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input-field" placeholder="e.g. Burger Bun" />
                        </Field>
                        <div className="hidden md:block"></div> {/* Spacer */}

                        <Field label="Purchase Unit *" required>
                            <select value={formData.purchaseUnit} onChange={e => setFormData({ ...formData, purchaseUnit: e.target.value })} className="input-field">
                                <option value="">Select Unit</option>
                                {['Dish', 'Piece', 'Kg', 'Ltr.', 'Milligram', 'Extra', 'Glass', 'Mtr', 'GM', 'Pkts', 'NOS', 'TIN', 'Btls', 'BULK', 'BOX', 'ML', 'Can', 'Bun', 'Bag', 'Qty', '25 kg bag', 'ltr', 'tray', 'lettuce', 'pcs', 'carton', 'pkt', 'jar', 'case', 'tub', 'sack'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Consumption Unit *" required>
                            <select value={formData.consumptionUnit} onChange={e => setFormData({ ...formData, consumptionUnit: e.target.value })} className="input-field">
                                <option value="">Select Unit</option>
                                {['Dish', 'Piece', 'Kg', 'Ltr.', 'Milligram', 'Extra', 'Glass', 'Mtr', 'GM', 'Pkts', 'NOS', 'TIN', 'Btls', 'BULK', 'BOX', 'ML', 'Can', 'Bun', 'Bag', 'Qty', '25 kg bag', 'ltr', 'tray', 'lettuce', 'pcs', 'carton', 'pkt', 'jar', 'case', 'tub', 'sack'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </Field>

                        {/* Conversion Logic Box */}
                        <div className="md:col-span-2 bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex flex-col md:flex-row items-center gap-3 text-sm text-gray-700">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <span>Purchase unit and consumption unit of <b>{formData.name || 'Item'}</b> are related as follows:</span>
                            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded border border-blue-200">
                                <span className="text-gray-500">One {formData.purchaseUnit || 'Unit'} (Purchase Unit) is equivalent to</span>
                                <input
                                    type="number"
                                    className="w-20 p-1 border border-gray-300 rounded text-center font-bold outline-none focus:border-blue-500"
                                    value={formData.conversionFactor}
                                    onChange={e => setFormData({ ...formData, conversionFactor: parseFloat(e.target.value) })}
                                />
                                <span className="font-medium text-blue-700">{formData.consumptionUnit || 'Cons. Unit'}</span>
                            </div>
                        </div>

                        <Field label="Category">
                            <input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input-field" placeholder="Select/Add Category" />
                        </Field>
                    </div>
                </Section>

                {/* Prices */}
                <Section title={`${itemName} Prices`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Purchase Price">
                            <input type="number" value={formData.purchasePrice} onChange={e => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })} className="input-field" />
                        </Field>
                        <Field label="Transfer Price">
                            <input type="number" value={formData.transferPrice} onChange={e => setFormData({ ...formData, transferPrice: parseFloat(e.target.value) })} className="input-field" />
                        </Field>
                        <Field label="Recommended Price">
                            <input type="number" value={formData.recommendedPrice} onChange={e => setFormData({ ...formData, recommendedPrice: parseFloat(e.target.value) })} className="input-field" />
                        </Field>
                    </div>
                </Section>

                {/* Taxes */}
                <Section title={`${itemName} Taxes`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Tax Type">
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="taxType" checked={formData.taxType === 'GST'} onChange={() => setFormData({ ...formData, taxType: 'GST' })} className="accent-green-600" />
                                    <span>GST</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="taxType" checked={formData.taxType === 'VAT'} onChange={() => setFormData({ ...formData, taxType: 'VAT' })} className="accent-green-600" />
                                    <span>VAT</span>
                                </label>
                            </div>
                        </Field>
                        <Field label="Tax (%)">
                            <div className="relative">
                                <input type="number" value={formData.taxPercent} onChange={e => setFormData({ ...formData, taxPercent: parseFloat(e.target.value) })} className="input-field pl-3" />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* Stock Levels */}
                <Section title={`${itemName} Levels`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Minimum Stock Level Unit *">
                            <div className="flex gap-4">
                                <select className="input-field w-1/3">
                                    <option>{formData.consumptionUnit || 'Unit'}</option>
                                    <option>{formData.purchaseUnit}</option>
                                </select>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Minimum Stock Level</label>
                                    <input type="number" value={formData.minStockLevel} onChange={e => setFormData({ ...formData, minStockLevel: parseFloat(e.target.value) })} className="input-field" />
                                </div>
                            </div>
                        </Field>
                        <Field label="At Par Stock Level Unit *">
                            <div className="flex gap-4">
                                <select className="input-field w-1/3">
                                    <option>{formData.consumptionUnit || 'Unit'}</option>
                                    <option>{formData.purchaseUnit}</option>
                                </select>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">At Par Stock Level</label>
                                    <input type="number" value={formData.atParStockLevel} onChange={e => setFormData({ ...formData, atParStockLevel: parseFloat(e.target.value) })} className="input-field" />
                                </div>
                            </div>
                        </Field>
                        <Field label="Closing stock being updated on">
                            <select value={formData.closingStockFrequency} onChange={e => setFormData({ ...formData, closingStockFrequency: e.target.value })} className="input-field">
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                            </select>
                        </Field>
                    </div>
                </Section>

                {/* Restock & Opening Stock Toggles */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-4">
                        <input type="checkbox" checked={formData.allowRestockLevel} onChange={e => setFormData({ ...formData, allowRestockLevel: e.target.checked })} className="w-4 h-4 accent-green-600 rounded" />
                        <span className="font-semibold text-gray-700 dark:text-gray-200">Allow Restock Level</span>
                        <Info className="w-4 h-4 text-gray-400" />
                    </div>
                    {formData.allowRestockLevel && (
                        <div className="bg-blue-50/50 p-4 rounded border border-blue-100 flex items-end gap-4 mb-6">
                            <div className="flex-1">
                                <Field label="Restock Qty">
                                    <input type="number" value={formData.restockQty} onChange={e => setFormData({ ...formData, restockQty: parseFloat(e.target.value) })} className="input-field" />
                                </Field>
                            </div>
                            <div className="flex-1">
                                <Field label="Restock Unit">
                                    <select value={formData.restockUnit} onChange={e => setFormData({ ...formData, restockUnit: e.target.value })} className="input-field">
                                        <option>{formData.consumptionUnit || 'Unit'}</option>
                                        <option>{formData.purchaseUnit}</option>
                                    </select>
                                </Field>
                            </div>
                            <button className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded font-bold hover:bg-red-50 mb-1">Add</button>
                        </div>
                    )}

                    <div className="h-px bg-gray-100 my-4"></div>

                    <div className="flex items-center gap-2 mb-4">
                        <input type="checkbox" checked={formData.addOpeningStock} onChange={e => setFormData({ ...formData, addOpeningStock: e.target.checked })} className="w-4 h-4 accent-green-600 rounded" />
                        <span className="font-semibold text-gray-700 dark:text-gray-200">Add opening stock and Avg purchase price</span>
                    </div>

                    {formData.addOpeningStock && (
                        <div className="bg-blue-50/50 p-4 rounded border border-blue-100 flex items-end gap-4">
                            <div className="flex-1">
                                <Field label="Opening Stock">
                                    <input type="number" value={formData.openingStock} onChange={e => setFormData({ ...formData, openingStock: parseFloat(e.target.value) })} className="input-field" placeholder="Opening Stock" />
                                </Field>
                            </div>
                            <div className="flex-1">
                                <Field label="Opening Stock Unit">
                                    <select value={formData.openingStockUnit} onChange={e => setFormData({ ...formData, openingStockUnit: e.target.value })} className="input-field">
                                        <option>Select Unit</option>
                                        <option value={formData.consumptionUnit}>{formData.consumptionUnit}</option>
                                        <option value={formData.purchaseUnit}>{formData.purchaseUnit}</option>
                                    </select>
                                </Field>
                            </div>
                            <div className="flex-1">
                                <Field label="Avg Purchase Price Per Unit">
                                    <input type="number" value={formData.avgPrice} onChange={e => setFormData({ ...formData, avgPrice: parseFloat(e.target.value) })} className="input-field" placeholder="Avg price" />
                                </Field>
                            </div>
                            <button className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded font-bold hover:bg-red-50 mb-1">Add</button>
                        </div>
                    )}
                </div>


                {/* Related Codes */}
                <Section title={`${itemName} Related Codes`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Barcode/Short Code">
                            <input value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} className="input-field" />
                        </Field>
                        <Field label="HSN Code">
                            <input value={formData.hsnCode} onChange={e => setFormData({ ...formData, hsnCode: e.target.value })} className="input-field" />
                        </Field>
                    </div>
                </Section>

                {/* Other Details */}
                <Section title="Other Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Exclusive to this outlet">
                            <select className="input-field"><option>No</option><option>Yes</option></select>
                        </Field>
                        <Field label="Is Expiry">
                            <select value={formData.inExpiry ? 'Yes' : 'No'} onChange={e => setFormData({ ...formData, inExpiry: e.target.value === 'Yes' })} className="input-field">
                                <option>No</option><option>Yes</option>
                            </select>
                        </Field>
                        {formData.inExpiry && (
                            <Field label="Best Before (in Days)">
                                <input type="number" value={formData.bestBeforeDays} onChange={e => setFormData({ ...formData, bestBeforeDays: parseInt(e.target.value) })} className="input-field" />
                            </Field>
                        )}
                        <Field label="Allow Decimal Quantity">
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2"><input type="radio" checked={formData.allowDecimalQty} onChange={() => setFormData({ ...formData, allowDecimalQty: true })} className="accent-green-600" /> Yes</label>
                                <label className="flex items-center gap-2"><input type="radio" checked={!formData.allowDecimalQty} onChange={() => setFormData({ ...formData, allowDecimalQty: false })} className="accent-green-600" /> No</label>
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* Excise */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center gap-2 font-bold text-gray-700">
                            <FileText className="w-5 h-5" /> For Excise Report
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Quantity (mg/ml)"><input className="input-field" /></Field>
                        <Field label="OTIN"><input className="input-field" /></Field>
                        <Field label="Brand"><input className="input-field" /></Field>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button onClick={() => setView('list')} className="btn-secondary">Cancel</button>
                <button onClick={handleSave} className="btn-primary shadow-xl shadow-primary-500/20">Save Material</button>
            </div>
        </div>
    );
}

function Section({ title, icon: Icon, children }) {
    return (
        <div className="card p-0 overflow-hidden mb-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">{title}</h3>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}

function Field({ label, required, children }) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="form-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function initialFormState() {
    return {
        name: '',
        purchaseUnit: 'Piece',
        consumptionUnit: 'Piece',
        conversionFactor: 1,
        category: '',
        purchasePrice: 0,
        transferPrice: 0,
        recommendedPrice: 0,
        taxType: 'GST',
        taxPercent: 5,
        minStockLevel: 0,
        atParStockLevel: 0,
        closingStockFrequency: 'Daily',
        allowRestockLevel: false,
        restockQty: 0,
        restockUnit: 'Piece',
        addOpeningStock: false, // New Field
        openingStock: 0, // New Field
        openingStockUnit: 'Piece', // New Field
        avgPrice: 0, // New Field
        barcode: '',
        hsnCode: '',
        inExpiry: false,
        bestBeforeDays: 0,
        allowDecimalQty: true,
    };
}
