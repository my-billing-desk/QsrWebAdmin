import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Heart, Check, X, FileText, Upload, Download, MoreHorizontal } from 'lucide-react';
import { inventoryService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

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
            const res = await inventoryService.getRawMaterials();
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
            await inventoryService.deleteRawMaterial(id);
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
                        className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] font-medium flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" /> Quick Add
                    </button>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center gap-2 transition-colors">
                        Action <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center gap-2 transition-colors">
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
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <button className="px-6 py-2 bg-white dark:bg-gray-800 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)]/10 font-medium transition-colors">
                    Search
                </button>
                <button
                    onClick={() => { setSearchTerm(''); setCategoryFilter('All'); }}
                    className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 font-medium transition-colors"
                >
                    Clear
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
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
                                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                                </td>
                                <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                                    {material.name}
                                </td>
                                <td className="p-4 text-gray-500">
                                    {material.category || <span className="text-gray-400 italic">No Category</span>}
                                </td>
                                <td className="p-4 text-center">
                                    <button className="text-gray-300 dark:text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                                        <Heart className={`w-5 h-5 ${false ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : ''}`} />
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="inline-flex justify-center items-center w-6 h-6 rounded-full border border-[var(--status-success)]/20 text-[var(--status-success)] bg-[var(--status-success)]/10">
                                        <Check className="w-3 h-3" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/inventory/raw-materials/edit/${material.id}`)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(material.id)}
                                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-[var(--status-error)] hover:bg-[var(--status-error)]/10 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
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
