import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ChefHat, Sparkles, Pencil, Trash2 } from 'lucide-react';
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
            // Fetch Items AND Categories
            // We want to list ITEMS here, and show if they have a recipe
            const [itemsRes, categoriesRes, recipesRes] = await Promise.all([
                menuService.getItems(),
                menuService.getCategories(),
                inventoryService.getRecipes()
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
            toast.error("Failed to load recipes");
        } finally {
            setLoading(false);
        }
    };

    const fetchSetting = async () => {
        try {
            // TODO: Add settings service when available
            // For now, default to true
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

    // Calculate tabs for the scrollable strip
    const categoryTabs = ['All categories', ...categories.map(c => c.name)];

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans">
            {/* AI Banner */}
            {/* AI Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center justify-between shadow-sm relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-indigo-700 text-sm">Get AI-Powered Recipe Suggestions! We'll Create Personalized Recipes Just For You.</h3>
                    </div>
                </div>
                <button className="font-bold border border-indigo-200 rounded-lg shadow-sm relative z-10 whitespace-nowrap transition-colors">
                    Explore Recipes
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Recipe Management</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/inventory/recipes/add')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all">
                        More Actions <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all">
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

                <button className="px-4 py-2 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-all">
                    Search
                </button>
                <button
                    onClick={() => { setSearchTerm(''); setFilterCategory('All categories'); }}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                >
                    Clear
                </button>

                {/* Auto Consumption Toggle */}
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={toggleAutoConsumption}
                        className={`rounded-full transition-colors relative flex items-center`}
                    >
                        <div className={`rounded-full absolute transition-all shadow-sm ${autoConsumptionEnabled ? 'translate-x-[22px]' : 'translate-x-1'}`} />
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
                        className={`rounded-xl text-center border transition-all
                            ${filterCategory === cat
                                ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-sm'
                                : 'border-gray-200 dark:border-gray-700'}`}
                    >
                        <div className={`font-bold ${filterCategory === cat ? '' : ''}`}>{cat}</div>
                        <div className={`mt-1 ${filterCategory === cat ? 'font-medium' : ''}`}>
                            {getCategoryCount(cat)} Items
                        </div>
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 border-b border-gray-100 dark:border-gray-700 flex text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                    <div className="w-12"></div>
                    <div className="flex-1">Name</div>
                    <div className="w-1/4">Category</div>
                    <div className="w-48">Action</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {filteredItems.map(item => (
                        <div key={item.id} className="px-6 py-4 flex items-center hover:bg-gray-50 group transition-colors">
                            <div className="w-12">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-600" />
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
                                            className="flex items-center justify-center rounded-lg transition-colors"
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
                                            className="flex items-center justify-center rounded-lg transition-colors"
                                            title="Delete Recipe"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/inventory/recipes/edit/${item.id}`)}
                                        className="flex items-center justify-center rounded-lg transition-colors"
                                        title="Add Recipe"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}

                                <button className="font-bold rounded-lg flex items-center gap-1.5 transition-colors">
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
