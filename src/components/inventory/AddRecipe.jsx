import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function AddRecipe() {
    const navigate = useNavigate();
    const { id } = useParams(); // Start with Item ID if editing
    const [layoutLoading, setLayoutLoading] = useState(true);

    // Data Sources
    const [menuItems, setMenuItems] = useState([]);
    const [rawMaterials, setRawMaterials] = useState([]);

    // Form State
    const [selectedItemId, setSelectedItemId] = useState(id || '');
    const [ingredients, setIngredients] = useState([]);
    const [autoConsumption, setAutoConsumption] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedItemId) {
            fetchRecipeForItem(selectedItemId);
        } else {
            setIngredients([]);
        }
    }, [selectedItemId]);

    const loadInitialData = async () => {
        try {
            const [itemsRes, materialsRes] = await Promise.all([
                axios.get(`${API_URL}/menu/items`),
                axios.get(`${API_URL}/inventory/materials`)
            ]);
            setMenuItems(itemsRes.data);
            setRawMaterials(materialsRes.data);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLayoutLoading(false);
        }
    };

    const fetchRecipeForItem = async (itemId) => {
        try {
            // Get recipe for this item
            const res = await axios.get(`${API_URL}/inventory/recipe?itemId=${itemId}`); // Assuming this endpoint handles finding by item
            if (res.data) {
                // Transform to form format
                const loadedIngredients = res.data.RecipeIngredients.map(ri => ({
                    id: ri.id, // Keep ID for potential updates
                    rawMaterialId: ri.rawMaterialId,
                    quantity: ri.quantity,
                    unit: ri.unit,
                    // Helper for UI display
                    rawMaterialName: ri.RawMaterial?.name || 'Unknown'
                }));
                setIngredients(loadedIngredients);
                setAutoConsumption(res.data.autoConsumption ?? true);
            } else {
                setIngredients([]);
            }
        } catch (error) {
            // 404 is fine, means no recipe yet
            setIngredients([]);
        }
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { rawMaterialId: '', quantity: '', unit: '' }]);
    };

    const updateIngredient = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;

        // Auto-set unit if raw material selected
        if (field === 'rawMaterialId') {
            const material = rawMaterials.find(m => m.id === parseInt(value));
            if (material) {
                newIngredients[index].unit = material.consumptionUnit;
                newIngredients[index].rawMaterialName = material.name;
            }
        }
        setIngredients(newIngredients);
    };

    const removeIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!selectedItemId) return alert("Please select a menu item");
        if (ingredients.length === 0) return alert("Please add at least one ingredient");

        try {
            const payload = {
                itemId: selectedItemId,
                ingredients: ingredients.map(ing => ({
                    rawMaterialId: ing.rawMaterialId,
                    quantity: parseFloat(ing.quantity),
                    unit: ing.unit
                })),
                autoConsumption
            };

            await axios.post(`${API_URL}/inventory/recipes`, payload);
            alert("Recipe saved successfully!");
            navigate('/inventory/recipes');
        } catch (error) {
            console.error("Failed to save recipe", error);
            alert("Error saving recipe");
        }
    };

    const selectedItem = menuItems.find(i => i.id === parseInt(selectedItemId));

    if (layoutLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/inventory/recipes')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                            Recipe Management
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full space-y-8">

                {/* Selection */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <label className="font-bold text-gray-700 whitespace-nowrap">Select Menu</label>
                    <select
                        value={selectedItemId}
                        onChange={e => setSelectedItemId(e.target.value)}
                        className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500"
                    >
                        <option value="">-- Choose Item --</option>
                        {menuItems.map(item => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>

                {/* Recipe Area */}
                {selectedItemId && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 bg-red-50/30 flex justify-between items-center">
                            <div>
                                <h2 className="font-bold text-gray-800">Recipe For {selectedItem?.name}</h2>
                                {ingredients.length === 0 && (
                                    <p className="text-sm text-red-500 mt-1">No recipe data is available for this item.</p>
                                )}
                            </div>
                            <div className="flex gap-3 items-center">
                                <div className="flex items-center gap-2 mr-4 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                    <span className="text-sm font-medium text-gray-700">Auto Consumption</span>
                                    <button
                                        onClick={() => setAutoConsumption(!autoConsumption)}
                                        className={`w-10 h-5 rounded-full transition-colors relative ${autoConsumption ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${autoConsumption ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddIngredient}
                                    className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg font-bold hover:bg-red-50 flex items-center gap-2 text-sm"
                                >
                                    <Plus className="w-4 h-4" /> Add New Raw-Material
                                </button>
                                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 text-sm">
                                    Preserve
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-bold text-gray-500 uppercase">
                                        <th className="pb-3 pl-2">Raw Material Name</th>
                                        <th className="pb-3">Quantity</th>
                                        <th className="pb-3">Unit</th>
                                        <th className="pb-3">Area</th>
                                        <th className="pb-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="space-y-2">
                                    {ingredients.map((ing, idx) => (
                                        <tr key={idx} className="group">
                                            <td className="pr-4 py-2">
                                                <select
                                                    value={ing.rawMaterialId}
                                                    onChange={e => updateIngredient(idx, 'rawMaterialId', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 bg-white"
                                                >
                                                    <option value="">Select Material</option>
                                                    {rawMaterials.map(rm => (
                                                        <option key={rm.id} value={rm.id}>{rm.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="pr-4 py-2 w-48">
                                                <input
                                                    type="number"
                                                    value={ing.quantity}
                                                    onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500"
                                                    placeholder="0"
                                                />
                                            </td>
                                            <td className="pr-4 py-2 w-48">
                                                <select
                                                    value={ing.unit}
                                                    onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 bg-white"
                                                >
                                                    <option value="">Unit</option>
                                                    {/* Use raw material's purchase/consumption units availability usually, or standard list */}
                                                    {['Piece', 'Kg', 'Gm', 'Ltr', 'Ml', 'Slice'].map(u => (
                                                        <option key={u} value={u}>{u}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="pr-4 py-2">
                                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none bg-gray-50 text-gray-400" disabled>
                                                    <option>-- Select Area --</option>
                                                </select>
                                            </td>
                                            <td className="py-2 text-center">
                                                <button
                                                    onClick={() => removeIngredient(idx)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {ingredients.length > 0 && (
                                <p className="text-xs text-red-500 mt-4 pl-2">
                                    Please fill all details related to raw material eg: qty, unit
                                </p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-red-50/50 border-t border-red-100 flex justify-end gap-3">
                            <button onClick={() => navigate('/inventory/recipes')} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleSave} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-600/20">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
