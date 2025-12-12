import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Heart, Check, X, FileText, Upload, Download, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export default function RawMaterialsList() {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`${API_URL}/inventory/materials`);
            setMaterials(res.data);
        } catch (error) {
            console.error("Failed to fetch materials", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this raw material?")) return;
        try {
            await axios.delete(`${API_URL}/inventory/materials/${id}`);
            fetchMaterials();
        } catch (error) {
            console.error("Failed to delete material", error);
        }
    };

    const filteredMaterials = materials.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(materials.map(m => m.category).filter(Boolean))];

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Raw Materials Management</h1>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/inventory/raw-materials/add')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2 shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                    <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Quick Add
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        Action <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Files
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-end">
                <div className="flex-1 w-full min-w-[200px]">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                            placeholder="Search raw material..."
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
                <div className="w-64">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none appearance-none bg-white"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <button className="px-6 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-medium">
                    Search
                </button>
                <button
                    onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                    className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium"
                >
                    Clear
                </button>
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
                            <th className="p-4 text-center">Set As Favourite</th>
                            <th className="p-4 text-center">Active</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredMaterials.map((material) => (
                            <tr key={material.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="p-4 text-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                                    {material.name}
                                </td>
                                <td className="p-4 text-gray-500">
                                    {material.category || <span className="text-gray-400 italic">No Category</span>}
                                </td>
                                <td className="p-4 text-center">
                                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Heart className={`w-5 h-5 ${false ? 'fill-red-500 text-red-500' : ''}`} />
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="inline-flex justify-center items-center w-6 h-6 rounded-full border border-green-200 text-green-600 bg-green-50">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/inventory/raw-materials/edit/${material.id}`)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(material.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredMaterials.length === 0 && (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-500">
                                    No raw materials found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="text-xs text-gray-500">
                Showing 1 to {filteredMaterials.length} of {filteredMaterials.length} records
            </div>
        </div>
    );
}
