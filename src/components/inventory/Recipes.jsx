import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Wand2, MoreHorizontal, FileText, ChevronDown, Check, ArrowLeft, Trash2, Info } from 'lucide-react';
import { menuService, inventoryService } from '../../services/api';

export function Recipes() {
    const [view, setView] = useState('list'); // 'list' | 'add'
    const [items, setItems] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState(initialFormState());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [itemsRes, recipesRes, materialsRes] = await Promise.all([
                menuService.getItems(),
                inventoryService.getRecipes(),
                inventoryService.getRawMaterials()
            ]);
            setItems(itemsRes.data || []);
            setRecipes(recipesRes.data || []);
            setRawMaterials(materialsRes.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            if (!formData.itemId) return alert('Please select an item');
            if (formData.ingredients.length === 0) return alert('Please add at least one ingredient');

            await inventoryService.saveRecipe(formData);
            alert('Recipe Saved Successfully!');
            setView('list');
            loadData();
        } catch (error) {
            alert('Error saving recipe: ' + (error.response?.data?.error || error.message));
        }
    };

    const addIngredient = () => {
        setFormData({
            ...formData,
            ingredients: [...formData.ingredients, { rawMaterialId: '', quantity: '', unit: '', wastagePercent: 0 }]
        });
    };

    const updateIngredient = (index, field, value) => {
        const newIngs = [...formData.ingredients];
        newIngs[index][field] = value;
        // Auto-fill unit if material selected
        if (field === 'rawMaterialId') {
            const mat = rawMaterials.find(m => m.id == value);
            if (mat) newIngs[index].unit = mat.consumptionUnit;
        }
        setFormData({ ...formData, ingredients: newIngs });
    };

    const removeIngredient = (index) => {
        setFormData({
            ...formData,
            ingredients: formData.ingredients.filter((_, i) => i !== index)
        });
    };

    if (view === 'list') {
        const categoryStats = [
            { name: 'All categories', count: items.length, active: true },
            { name: 'Ice Cream', count: items.filter(i => i.Category?.name === 'Ice Cream').length, active: false },
        ];

        return (
            <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Recipe Management</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setFormData(initialFormState()); setView('add'); }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 font-medium"
                        >
                            <Plus className="w-4 h-4" /> Create New
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 font-medium">
                            More Actions <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* AI Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex justify-between items-center text-blue-800 dark:text-blue-200">
                    <div className="flex items-center gap-3">
                        <Wand2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-semibold text-sm">Get AI-Powered Recipe Suggestions! Based On The Items You've Added To Your Menu.</span>
                    </div>
                    <button className="bg-white dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm font-bold px-4 py-2 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50">
                        Explore Recipes
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-4 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <select className="px-3 py-2 border rounded-lg bg-gray-50 text-sm outline-none"><option>Select Item</option></select>
                    <button className="px-4 py-2 text-red-600 border border-red-200 bg-red-50 rounded-lg text-sm font-medium hover:bg-red-100">Search</button>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-blue-50/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase sticky top-0">
                                <tr>
                                    <th className="p-4">Item Name</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                {loading ? <tr><td colSpan="3" className="p-4 text-center">Loading...</td></tr> :
                                    items.map((item, idx) => {
                                        const hasRecipe = recipes.some(r => r.itemId === item.id);
                                        return (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                                <td className="p-4">
                                                    {hasRecipe
                                                        ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Recipe Added</span>
                                                        : <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-bold">No Recipe</span>
                                                    }
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            const existing = recipes.find(r => r.itemId === item.id);
                                                            setFormData(existing ? {
                                                                itemId: existing.itemId,
                                                                variantId: existing.variantId,
                                                                yieldQty: existing.yieldQty,
                                                                instructions: existing.instructions,
                                                                ingredients: existing.RecipeIngredients?.map(ri => ({
                                                                    rawMaterialId: ri.rawMaterialId,
                                                                    quantity: ri.quantity,
                                                                    unit: ri.unit,
                                                                    wastagePercent: ri.wastagePercent
                                                                })) || []
                                                            } : { ...initialFormState(), itemId: item.id });
                                                            setView('add');
                                                        }}
                                                        className="text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-100"
                                                    >
                                                        {hasRecipe ? 'Edit Recipe' : 'Add Recipe'}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // ADD / EDIT VIEW
    const selectedItem = items.find(i => i.id == formData.itemId);

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {selectedItem ? `Recipe for ${selectedItem.name}` : 'New Recipe'}
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">

                {/* Basic Info */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" /> Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500">Select Item *</label>
                            <select
                                value={formData.itemId}
                                onChange={e => setFormData({ ...formData, itemId: e.target.value })}
                                className="input-field border p-2 rounded bg-gray-50"
                                disabled={!!selectedItem} // If coming from list 'add btn', lock it
                            >
                                <option value="">Select Item</option>
                                {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-500">Yield Quantity</label>
                            <input
                                type="number"
                                value={formData.yieldQty}
                                onChange={e => setFormData({ ...formData, yieldQty: parseFloat(e.target.value) })}
                                className="input-field border p-2 rounded"
                                placeholder="e.g. 1 (Serving)"
                            />
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800">Ingredients</h3>
                        <button onClick={addIngredient} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add Ingredient
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.ingredients.map((ing, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded border border-gray-100">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Raw Material</label>
                                    <select
                                        value={ing.rawMaterialId}
                                        onChange={e => updateIngredient(idx, 'rawMaterialId', e.target.value)}
                                        className="w-full p-2 border rounded bg-white"
                                    >
                                        <option value="">Select Material</option>
                                        {rawMaterials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    </select>
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Qty</label>
                                    <input
                                        type="number"
                                        value={ing.quantity}
                                        onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Unit</label>
                                    <input
                                        value={ing.unit}
                                        readOnly
                                        className="w-full p-2 border rounded bg-gray-100 text-gray-500"
                                    />
                                </div>
                                <div className="w-24">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Waste %</label>
                                    <input
                                        type="number"
                                        value={ing.wastagePercent}
                                        onChange={e => updateIngredient(idx, 'wastagePercent', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <button onClick={() => removeIngredient(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded mb-0.5">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {formData.ingredients.length === 0 && (
                            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded border border-dashed text-sm">
                                No ingredients added yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Instructions (Optional)</h3>
                    <textarea
                        value={formData.instructions}
                        onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                        className="w-full p-3 border rounded-lg h-32 outline-none focus:border-blue-500"
                        placeholder="Step-by-step preparation instructions..."
                    ></textarea>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10">
                <button onClick={() => setView('list')} className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
                <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-lg shadow-red-600/20">Save Recipe</button>
            </div>
        </div>
    );
}

function initialFormState() {
    return {
        itemId: '',
        variantId: null,
        yieldQty: 1,
        instructions: '',
        ingredients: []
    };
}
