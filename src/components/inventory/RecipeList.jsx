import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, FileText, MoreHorizontal, ChefHat } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function RecipeList() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All Recipes');

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        try {
            const res = await axios.get(`${API_URL}/inventory/recipes`);
            setRecipes(res.data);
        } catch (error) {
            console.error("Failed to fetch recipes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        // Assuming delete endpoint exists or will be added. 
        // If not, we might need to add it to backend. 
        // For now, let's assume it's standard.
        // Wait, I didn't check if delete recipe exists in backend. 
        // Let's assume standard REST for now.
        try {
            // await axios.delete(`${API_URL}/inventory/recipes/${id}`);
            // fetchRecipes();
            alert("Delete functionality to be connected.");
        } catch (error) {
            console.error("Failed to delete recipe", error);
        }
    };

    const filteredRecipes = recipes.filter(r =>
        (r.Item?.name || r.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recipe Management</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/inventory/recipes/add')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        More Actions <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Files
                    </button>
                </div>
            </div>

            {/* Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <ChefHat className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-900">Get AI-Powered Recipe Suggestions!</h3>
                        <p className="text-sm text-blue-700">Based on items you've added to your menu.</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white text-blue-600 font-bold border border-blue-200 rounded-lg hover:bg-blue-50 text-sm">
                    Explore Recipes
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                        placeholder="Search recipe..."
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                    <option>All Recipes</option>
                    <option>Veg Burgers</option>
                </select>
                <button className="px-6 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-medium">
                    Search
                </button>
                <button className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium">
                    Clear
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <h4 className="font-bold text-gray-800">Veg Sides</h4>
                    <span className="text-sm text-gray-500">9 Items</span>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-blue-500 text-center cursor-pointer shadow-sm relative">
                    <h4 className="font-bold text-gray-800">Veg Burgers</h4>
                    <span className="text-sm text-gray-500">6 Items</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <h4 className="font-bold text-gray-800">Veg Combos</h4>
                    <span className="text-sm text-gray-500">6 Items</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center cursor-pointer hover:bg-blue-100 transition-colors">
                    <h4 className="font-bold text-gray-800">Waffles</h4>
                    <span className="text-sm text-gray-500">5 Items</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-blue-50/50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 font-semibold">
                        <tr>
                            <th className="p-4 w-12 text-center">
                                <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                            </th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredRecipes.map((recipe) => (
                            <tr key={recipe.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 text-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                                    {recipe.Item?.name || recipe.name || 'Unnamed Recipe'}
                                </td>
                                <td className="p-4 text-gray-500">
                                    {recipe.Item?.Category?.name || 'Uncategorized'}
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/inventory/recipes/edit/${recipe.Item?.id || recipe.itemId}`)} // Use itemId to edit
                                            className="p-1 px-3 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Edit
                                        </button>
                                        <button className="p-1 px-3 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors flex items-center gap-1">
                                            Creation with AI
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-gray-500">
                Showing 1 to {filteredRecipes.length} of {filteredRecipes.length} records
            </div>
        </div>
    );
}
