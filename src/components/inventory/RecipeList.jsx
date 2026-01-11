import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ChefHat, Sparkles, Pencil, Trash2, CheckSquare, Square } from 'lucide-react';
import { menuService, inventoryService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RecipeList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All categories');

    // Global Auto Consumption Setting
    const [autoConsumptionEnabled, setAutoConsumptionEnabled] = useState(true);

    useEffect(() => {
        fetchData();
        fetchSetting();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [itemsRes, categoriesRes, recipesRes] = await Promise.all([
                menuService.getItems(),
                menuService.getCategories(),
                inventoryService.getRecipes()
            ]);

            // Map recipes to items for easy lookup
            const recipeMap = {};
            (recipesRes.data || []).forEach(r => {
                if (r.itemId) recipeMap[r.itemId] = r;
            });

            const mergedItems = (itemsRes.data || []).map(item => ({
                ...item,
                recipe: recipeMap[item.id] || null
            }));

            setItems(mergedItems);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            console.error("Failed to fetch data", error);
            // toast.error("Failed to load recipes");
        } finally {
            setLoading(false);
        }
    };

    const fetchSetting = async () => {
        try {
            // TODO: Add settings service when available
            setAutoConsumptionEnabled(true);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    }

    const toggleAutoConsumption = async () => {
        const newValue = !autoConsumptionEnabled;
        setAutoConsumptionEnabled(newValue);
        try {
            // TODO: Add settings service when available
            toast.success(`Auto consumption ${newValue ? 'enabled' : 'disabled'} `);
        } catch (error) {
            console.error("Failed to save setting", error);
            // Revert on error
            setAutoConsumptionEnabled(!newValue);
            toast.error("Failed to save setting");
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All categories'
            ? true
            : (item.Category?.name === filterCategory);
        return matchesSearch && matchesCategory;
    });

    const getCategoryCount = (catName) => {
        if (catName === 'All categories') return items.length;
        return items.filter(i => i.Category?.name === catName).length;
    };

    const categoryTabs = ['All categories', ...categories.map(c => c.name)];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 p-8 space-y-6 font-sans">
            {/* AI Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-800 text-sm">Get AI-Powered Recipe Suggestions!</h3>
                        <p className="text-xs text-blue-600">We'll create personalized recipes just for you.</p>
                    </div>
                </div>
                <button className="btn-secondary text-blue-700 bg-white border-blue-200 hover:bg-blue-50 relative z-10 whitespace-nowrap shadow-sm">
                    Explore Recipes
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Recipe Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/inventory/recipes/add')}
                        className="btn-primary"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                    <button className="btn-secondary">
                        More Actions <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-xl border border-gray-200">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search items..."
                        className="input-field pl-9 w-64"
                    />
                </div>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="input-field w-40"
                >
                    <option value="All categories">All Recipes</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>

                <button
                    onClick={() => { setSearchTerm(''); setFilterCategory('All categories'); }}
                    className="btn-secondary"
                >
                    Clear Filter
                </button>

                {/* Auto Consumption Toggle */}
                <div className="ml-auto flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                    <span className="font-bold text-gray-700 text-sm">Auto Consumption</span>
                    <button
                        onClick={toggleAutoConsumption}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoConsumptionEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span
                            className={`${autoConsumptionEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                    </button>
                </div>
            </div>

            {/* Category Tab Strip */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {categoryTabs.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-center border transition-all min-w-[140px] flex flex-col items-center justify-center
                            ${filterCategory === cat
                                ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-md transform scale-105'
                                : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 text-gray-600'}`}
                    >
                        <div className={`font-bold text-sm ${filterCategory === cat ? 'text-blue-700' : ''}`}>{cat}</div>
                        <div className="text-xs text-gray-400 mt-1">
                            {getCategoryCount(cat)} Items
                        </div>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
                <table className="table-standard">
                    <thead className="table-header">
                        <tr>
                            <th className="table-th w-12">
                                <div className="flex items-center justify-center">
                                    <Square className="w-4 h-4 text-gray-400" />
                                </div>
                            </th>
                            <th className="table-th">Name</th>
                            <th className="table-th w-1/4">Category</th>
                            <th className="table-th w-64 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-12 text-center text-gray-500">
                                    No items found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map(item => (
                                <tr key={item.id} className="table-row">
                                    <td className="table-td w-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
                                        </div>
                                    </td>
                                    <td className="table-td font-medium text-gray-800">
                                        {item.name}
                                    </td>
                                    <td className="table-td text-gray-600">
                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600">
                                            {item.Category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="table-td text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {item.recipe ? (
                                                <>
                                                    <button
                                                        onClick={() => navigate(`/inventory/recipes/edit/${item.id}`)}
                                                        className="p-1.5 hover:bg-blue-50 text-gray-500 hover:text-blue-600 rounded-lg transition-colors"
                                                        title="Edit Recipe"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm('Are you sure you want to delete this recipe?')) {
                                                                try {
                                                                    await inventoryService.deleteRecipe(item.recipe.id);
                                                                    toast.success("Recipe deleted");
                                                                    fetchData(); // Refresh
                                                                } catch (err) {
                                                                    console.error(err);
                                                                    toast.error("Failed to delete recipe");
                                                                }
                                                            }
                                                        }}
                                                        className="p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
                                                        title="Delete Recipe"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => navigate(`/inventory/recipes/edit/${item.id}`)}
                                                    className="p-1.5 hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-lg transition-colors bg-blue-50"
                                                    title="Add Recipe"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button className="btn-secondary py-1 px-3 text-xs bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100 flex items-center gap-1.5">
                                                <Sparkles className="w-3 h-3" /> AI Create
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 flex justify-between items-center">
                <span>Showing 1 to {filteredItems.length} of {filteredItems.length} records</span>
                {/* Pagination placeholder if needed */}
            </div>
        </div>
    );
}
