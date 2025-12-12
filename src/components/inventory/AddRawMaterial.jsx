import React, { useState, useEffect } from 'react';
import { Plus, Info, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function AddRawMaterial() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormState());

    useEffect(() => {
        if (id) {
            fetchMaterial(id);
        }
    }, [id]);

    const fetchMaterial = async (materialId) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/inventory/materials`);
            // Assuming get returns all, we find one. Or implementing getOne endpoint. 
            // The list endpoint returns all, let's just find it for now or assume filtering works?
            // Actually usually we'd have a getById. Let's try finding it from list if getById fails or just use list for now to be safe.
            // Better: InventoryController has updateRawMaterial but no explicit getOne? 
            // InventoryController.js: exports.getRawMaterials (all)
            // It doesn't seem to have getOne. I'll use the list and find.
            // Optimization: Add getOne to backend later.
            const material = res.data.find(m => m.id === parseInt(materialId));
            if (material) setFormData(material);
        } catch (error) {
            console.error("Failed to load material", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = { ...formData };
            // Ensure numbers are numbers
            ['purchasePrice', 'transferPrice', 'recommendedPrice', 'taxPercent', 'minStockLevel', 'atParStockLevel', 'conversionFactor', 'restockQty', 'bestBeforeDays', 'normalLossPercent'].forEach(key => {
                payload[key] = parseFloat(payload[key]) || 0;
            });

            if (payload.id) {
                await axios.put(`${API_URL}/inventory/materials/${payload.id}`, payload);
            } else {
                await axios.post(`${API_URL}/inventory/materials`, payload);
            }
            alert("Raw Material Saved Successfully!");
            navigate('/inventory/raw-materials');
        } catch (error) {
            console.error("Error saving material", error);
            alert("Failed to save raw material.");
        }
    };

    const isActiveStep = true; // Placeholder for tabs if needed

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/inventory/raw-materials')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            {id ? 'Edit' : 'Add'} Raw Material
                        </h1>
                        <p className="text-sm text-gray-500">Configure inventory item details</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all"
                    >
                        <Save className="w-4 h-4" /> Save Material
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">

                {/* Basic Details */}
                <Section title="Basic Details" icon={Info}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <Field label="Name" required>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                placeholder="e.g. Burger Bun"
                            />
                        </Field>

                        {/* Unit Setup */}
                        <Field label="Purchase Unit" required>
                            <select value={formData.purchaseUnit} onChange={e => setFormData({ ...formData, purchaseUnit: e.target.value })} className="input-field">
                                <option value="">Select Unit</option>
                                {['Piece', 'Kg', 'Ltr', 'GM', 'ML', 'Box', 'Packet', 'Can', 'Bottle'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Consumption Unit" required>
                            <select value={formData.consumptionUnit} onChange={e => setFormData({ ...formData, consumptionUnit: e.target.value })} className="input-field">
                                <option value="">Select Unit</option>
                                {['Piece', 'Kg', 'Ltr', 'GM', 'ML', 'Box', 'Packet', 'Can', 'Bottle'].map(u => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Category">
                            <input
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="input-field"
                                placeholder="Select/Add Category"
                            />
                        </Field>

                        {/* Conversion Logic */}
                        <div className="md:col-span-2 bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex flex-col md:flex-row items-center gap-4 text-sm text-gray-700">
                            <Info className="w-5 h-5 text-blue-500 shrink-0" />
                            <div className="flex-1">
                                <p className="mb-2"><strong>Conversion Formula:</strong> How much consumption unit is in one purchase unit?</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="text-gray-500">1 {formData.purchaseUnit || '(Purchase Unit)'} =</span>
                                    <input
                                        type="number"
                                        className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-center font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        value={formData.conversionFactor}
                                        onChange={e => setFormData({ ...formData, conversionFactor: e.target.value })}
                                    />
                                    <span className="font-bold text-blue-700">{formData.consumptionUnit || '(Cons. Unit)'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* Prices */}
                <Section title="Prices">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Field label="Purchase Price">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input type="number" value={formData.purchasePrice} onChange={e => setFormData({ ...formData, purchasePrice: e.target.value })} className="input-field pl-7" placeholder="0.00" />
                            </div>
                        </Field>
                        <Field label="Transfer Price">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input type="number" value={formData.transferPrice} onChange={e => setFormData({ ...formData, transferPrice: e.target.value })} className="input-field pl-7" placeholder="0.00" />
                            </div>
                        </Field>
                        <Field label="Reconciliation Price">
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input type="number" value={formData.recommendedPrice} onChange={e => setFormData({ ...formData, recommendedPrice: e.target.value })} className="input-field pl-7" placeholder="0.00" />
                            </div>
                        </Field>
                    </div>
                </Section>

                {/* Taxes */}
                <Section title="Taxes">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Tax Type">
                            <div className="flex gap-4 p-1">
                                <label className={`flex-1 py-2 px-4 rounded-lg border cursor-pointer text-center transition-all ${formData.taxType === 'GST' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'border-gray-200 text-gray-500'}`}>
                                    <input type="radio" name="taxType" checked={formData.taxType === 'GST'} onChange={() => setFormData({ ...formData, taxType: 'GST' })} className="hidden" />
                                    GST
                                </label>
                                <label className={`flex-1 py-2 px-4 rounded-lg border cursor-pointer text-center transition-all ${formData.taxType === 'VAT' ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'border-gray-200 text-gray-500'}`}>
                                    <input type="radio" name="taxType" checked={formData.taxType === 'VAT'} onChange={() => setFormData({ ...formData, taxType: 'VAT' })} className="hidden" />
                                    VAT
                                </label>
                            </div>
                        </Field>
                        <Field label="Tax Percentage (%)">
                            <input type="number" value={formData.taxPercent} onChange={e => setFormData({ ...formData, taxPercent: e.target.value })} className="input-field" placeholder="5" />
                        </Field>
                    </div>
                </Section>

                {/* Stock Levels */}
                <Section title="Stock Levels">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold text-gray-700">Minimum Stock Level</label>
                                <span className="text-xs text-gray-400">{formData.minStockLevel} {formData.consumptionUnit}</span>
                            </div>
                            <div className="flex gap-2">
                                <input type="number" value={formData.minStockLevel} onChange={e => setFormData({ ...formData, minStockLevel: e.target.value })} className="input-field flex-1" />
                                <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-500 text-sm font-medium flex items-center justify-center min-w-[60px]">
                                    {formData.consumptionUnit || 'Unit'}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Alert when stock falls below this.</p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-semibold text-gray-700">At Par Stock Level</label>
                                <span className="text-xs text-gray-400">{formData.atParStockLevel} {formData.consumptionUnit}</span>
                            </div>
                            <div className="flex gap-2">
                                <input type="number" value={formData.atParStockLevel} onChange={e => setFormData({ ...formData, atParStockLevel: e.target.value })} className="input-field flex-1" />
                                <div className="px-3 py-2 bg-gray-100 rounded-lg text-gray-500 text-sm font-medium flex items-center justify-center min-w-[60px]">
                                    {formData.consumptionUnit || 'Unit'}
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Ideal stock level to maintain.</p>
                        </div>
                    </div>
                </Section>

                {/* Codes & Other */}
                <Section title="Attributes & Codes">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Barcode / Short Code">
                            <input value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} className="input-field" />
                        </Field>
                        <Field label="HSN Code">
                            <input value={formData.hsnCode} onChange={e => setFormData({ ...formData, hsnCode: e.target.value })} className="input-field" />
                        </Field>
                        <div className="md:col-span-2 pt-4 flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1">
                                <input type="checkbox" checked={formData.allowDecimalQty} onChange={e => setFormData({ ...formData, allowDecimalQty: e.target.checked })} className="w-5 h-5 rounded text-red-600 focus:ring-red-500" />
                                <div>
                                    <div className="font-semibold text-gray-800">Allow Decimals</div>
                                    <div className="text-xs text-gray-400">Can be consumed in fractions</div>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-1">
                                <input type="checkbox" checked={formData.inExpiry} onChange={e => setFormData({ ...formData, inExpiry: e.target.checked })} className="w-5 h-5 rounded text-red-600 focus:ring-red-500" />
                                <div>
                                    <div className="font-semibold text-gray-800">Has Expiry</div>
                                    <div className="text-xs text-gray-400">Track expiration dates</div>
                                </div>
                            </label>
                        </div>
                        {formData.inExpiry && (
                            <Field label="Best Before (Days)">
                                <input type="number" value={formData.bestBeforeDays} onChange={e => setFormData({ ...formData, bestBeforeDays: e.target.value })} className="input-field" />
                            </Field>
                        )}
                    </div>
                </Section>

            </div>
        </div>
    );
}

// Subcomponents
function Section({ title, icon: Icon, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {title && (
                <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-700/50 flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                    <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

function Field({ label, required, children }) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function initialFormState() {
    return {
        name: '',
        purchaseUnit: 'Kg',
        consumptionUnit: 'Gm',
        conversionFactor: 1000,
        category: '',
        purchasePrice: '',
        transferPrice: '',
        recommendedPrice: '',
        taxType: 'GST',
        taxPercent: 5,
        minStockLevel: 0,
        atParStockLevel: 0,
        closingStockFrequency: 'Daily',
        barcode: '',
        hsnCode: '',
        allowDecimalQty: true,
        inExpiry: false,
        bestBeforeDays: 0
    };
}
