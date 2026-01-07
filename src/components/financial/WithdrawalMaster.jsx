import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Edit, Calendar } from 'lucide-react';
import { financialService } from '../../services/api';
import toast from 'react-hot-toast';

export function WithdrawalMaster() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ title: '', status: true });
    const [filters, setFilters] = useState({
        startDate: '2025-12-01',
        endDate: '2026-01-04',
        title: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await financialService.getWithdrawalMaster();
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching withdrawal master:', error);
            toast.error('Failed to load withdrawal master');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategory.title.trim()) {
            toast.error('Title is required');
            return;
        }
        try {
            await financialService.createWithdrawalCategory(newCategory);
            toast.success('Category added successfully');
            setIsAddModalOpen(false);
            setNewCategory({ title: '', status: true });
            fetchCategories();
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error('Failed to add category');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await financialService.updateWithdrawalCategory(id, { status: !currentStatus });
            fetchCategories();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.title.toLowerCase().includes(filters.title.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-4 gap-4 overflow-hidden w-full relative">
            {/* Header Actions */}
            <div className="flex justify-end items-center gap-2">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded font-bold shadow-sm hover:bg-red-700 text-sm"
                >
                    Add Withdrawal Master
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded font-bold shadow-sm hover:bg-red-700 text-sm">
                    Import Withdrawal Master
                </button>
                <button className="px-3 py-2 bg-white border rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    Action <ChevronDown className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 bg-white border rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    Export Excel <ChevronDown className="w-4 h-4" />
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap items-end gap-4">
                <div className="w-full">
                    <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            className="border rounded p-2 text-sm w-40 pl-8"
                            value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        />
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-2 top-2.5 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            className="border rounded p-2 text-sm w-40 pl-8"
                            value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        />
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-2 top-2.5 pointer-events-none" />
                    </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                    <input
                        type="text"
                        className="border rounded p-2 text-sm w-full"
                        value={filters.title}
                        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                    />
                </div>
                <button className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-sm">Search</button>
                <button className="px-6 py-2 bg-white border text-gray-700 rounded font-bold hover:bg-gray-50 text-sm">Show All</button>
            </div>

            {/* Data Table */}
            <div className="bg-white border rounded-lg shadow-sm flex-1 overflow-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-blue-50/50 text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4">Title</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">Usage Count</th>
                                <th className="p-4">Last Reported Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {filteredCategories.length === 0 ? (
                                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No categories found</td></tr>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50">
                                        <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                        <td className="p-4 font-medium text-gray-800">{cat.title}</td>
                                        <td className="p-4 text-center">
                                            <div
                                                onClick={() => handleToggleStatus(cat.id, cat.status)}
                                                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors inline-block ${cat.status ? 'bg-green-500' : 'bg-gray-300'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${cat.status ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                                                {cat.usageCount} times
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {cat.lastUsed ? new Date(cat.lastUsed).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-gray-500">
                                                <Edit className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="font-bold">
                    Showing 1 to {filteredCategories.length} of {filteredCategories.length} records
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-red-600 text-white rounded text-sm font-bold">1</button>
                    <button className="px-3 py-1 border hover:bg-gray-50 rounded text-sm">Next</button>
                    <button className="px-3 py-1 border hover:bg-gray-50 rounded text-sm">Last</button>
                </div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-5 w-80 border animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">New Withdrawal Master</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Enter title (e.g. Owner Draw)"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                value={newCategory.title}
                                onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            />
                            <button
                                onClick={handleAddCategory}
                                className="w-full py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 active:scale-[0.98] transition-all shadow-md shadow-red-200"
                            >
                                Add Master
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
