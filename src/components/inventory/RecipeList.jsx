import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ChefHat, Sparkles, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { menuService } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
            // Fetch Items AND Categories
            // We want to list ITEMS here, and show if they have a recipe
            const [itemsRes, categoriesRes, recipesRes] = await Promise.all([
                axios.get(`${API_URL}/menu/items`),
                menuService.getCategories(),
                axios.get(`${API_URL}/inventory/recipes`)
            ]);

            // Map recipes to items for easy lookup
            const recipeMap = {};
            recipesRes.data.forEach(r => {
                if (r.itemId) recipeMap[r.itemId] = r;
            });

            const mergedItems = itemsRes.data.map(item => ({
                ...item,
                recipe: recipeMap[item.id] || null
            }));

            setItems(mergedItems);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSetting = async () => {
        try {
            const res = await axios.get(`${API_URL}/settings`);
            // Key 'auto_consumption_enabled' - typically stored as string "true"/"false"
            const val = res.data.auto_consumption_enabled;
            setAutoConsumptionEnabled(val === 'false' ? false : true); // Default true
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    }

    const toggleAutoConsumption = async () => {
        const newValue = !autoConsumptionEnabled;
        setAutoConsumptionEnabled(newValue);
        try {
            await axios.post(`${API_URL}/settings`, {
                auto_consumption_enabled: newValue
            });
        } catch (error) {
            console.error("Failed to save setting", error);
            // Revert on error
            setAutoConsumptionEnabled(!newValue);
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

    // Calculate tabs for the scrollable strip
    const categoryTabs = ['All categories', ...categories.map(c => c.name)];

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
            {/* AI Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group">
                {/* Decorative background elements if needed */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 transition-opacity group-hover:opacity-70"></div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                        <Sparkles className="w-5 h-5 fill-blue-600 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-700 text-sm">Get AI-Powered Recipe Suggestions! Based On The Items You've Added To Your Menu, We'll Create Personalized Recipes Just For You.</h3>
                    </div>
                </div>
                <button className="px-5 py-2 bg-white text-blue-600 font-bold border border-blue-200 rounded-lg hover:bg-blue-50 text-sm shadow-sm relative z-10 whitespace-nowrap">
                    Explore Recipes
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Recipe Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/inventory/recipes/add')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 text-sm"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 text-sm">
                        More Actions <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 text-sm">
                        Files <MoreHorizontal className="w-4 h-4 rotate-90" />
                    </button>
                </div>
            </div>

            {/* Filter Row */}
            <div className="flex gap-3 items-center">
                <select className="w-40 px-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-white text-sm text-gray-600">
                    <option>Select Item</option>
                </select>
                <select className="w-40 px-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-white text-sm text-gray-600">
                    <option>Select Category</option>
                </select>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-40 px-4 py-2.5 border border-gray-200 rounded-lg outline-none bg-white text-sm text-gray-600"
                >
                    <option value="All categories">All Recipes</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>

                <button className="px-6 py-2.5 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-medium text-sm">
                    Search
                </button>
                <button
                    onClick={() => { setSearchTerm(''); setFilterCategory('All categories'); }}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-sm"
                >
                    Clear
                </button>

                {/* Auto Consumption Toggle */}
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={toggleAutoConsumption}
                        className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${autoConsumptionEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-sm ${autoConsumptionEnabled ? 'translate-x-[22px]' : 'translate-x-1'}`} />
                    </button>
                    <span className="font-bold text-gray-800 text-sm">Auto Consumption</span>
                </div>
            </div>

            {/* Category Tab Strip */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {categoryTabs.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`min-w-[160px] p-4 rounded-xl text-center border transition-all
                            ${filterCategory === cat
                                ? 'bg-white border-blue-500 ring-1 ring-blue-500 shadow-md'
                                : 'bg-blue-50/50 border-blue-100 hover:bg-blue-100 text-gray-600'}`}
                    >
                        <div className={`font-bold text-sm ${filterCategory === cat ? 'text-gray-900' : 'text-gray-700'}`}>{cat}</div>
                        <div className={`text-xs mt-1 ${filterCategory === cat ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                            {getCategoryCount(cat)} Items
                        </div>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-blue-50/50 px-6 py-3 border-b border-gray-100 flex text-xs font-bold text-gray-600 uppercase">
                    <div className="w-12"></div>
                    <div className="flex-1">Name</div>
                    <div className="w-1/4">Category</div>
                    <div className="w-48">Action</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {filteredItems.map(item => (
                        <div key={item.id} className="px-6 py-4 flex items-center hover:bg-gray-50 group transition-colors">
                            <div className="w-12">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                            </div>
                            <div className="flex-1 font-medium text-gray-800 text-sm">
                                {item.name}
                            </div>
                            <div className="w-1/4 text-sm text-gray-600">
                                {item.Category?.name || 'Uncategorized'}
                            </div>
                            <div className="w-48 flex items-center gap-2">
                                {item.recipe ? (
                                    <>
                                        <button
                                            onClick={() => navigate(`/inventory/recipes/edit/${item.id}`)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="Edit Recipe"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this recipe?')) {
                                                    // Add delete logic directly or via service
                                                    axios.delete(`${API_URL}/inventory/recipes/${item.recipe.id}`)
                                                        .then(() => {
                                                            fetchData(); // Refresh
                                                        })
                                                        .catch(err => console.error(err));
                                                }
                                            }}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            title="Delete Recipe"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/inventory/recipes/edit/${item.id}`)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                        title="Add Recipe"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}

                                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-100 flex items-center gap-1.5 transition-colors">
                                    <Sparkles className="w-3 h-3" /> Create with AI
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredItems.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No items found matching your filters.
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs font-bold text-gray-600">
                    Showing 1 to {filteredItems.length} of {filteredItems.length} records
                </div>
            </div>
        </div>
    );
}
