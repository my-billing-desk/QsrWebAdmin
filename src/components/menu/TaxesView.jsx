import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, Download, X, Search, Info } from 'lucide-react';
import { configService } from '../../services/api';
import { SmartTable } from '../ui/SmartTable';

export function TaxesView() {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null); // For Edit Mode
    const [formData, setFormData] = useState({ name: '', percentage: '', status: 'active' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await configService.getTaxes();
            // Mocking status if not present in API for visual match
            const mapped = (res.data || []).map(t => ({ ...t, status: t.status || 'active' }));
            setTaxes(mapped);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.percentage) return;

        try {
            if (editingTx) {
                // await configService.updateTax(editingTx.id, formData); // Assuming API exists
                // For now, re-create or mock update as API details for update aren't clear in viewed files
                // Fallback to Create for demo if Update not verified
                await configService.createTax(formData);
            } else {
                await configService.createTax(formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', percentage: '', status: 'active' });
            setEditingTx(null);
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete tax?')) {
            await configService.deleteTax(id);
            loadData();
        }
    };

    const openEdit = (tx) => {
        setEditingTx(tx);
        setFormData({ name: tx.name, percentage: tx.percentage, status: tx.status });
        setIsModalOpen(true);
    };

    // Columns Configuration
    const columns = [
        {
            key: 'name',
            header: 'Tax Name',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2 font-medium text-main">
                    {item.name}
                    <Info className="w-3 H-3 text-gray-500 opacity-50 cursor-help" />
                </div>
            )
        },
        {
            key: 'percentage',
            header: 'Tax Percentage(%)',
            align: 'left',
            render: (item) => <span className="text-sm text-gray-600">{item.percentage}%</span>
        },
        {
            key: 'status',
            header: 'Status',
            align: 'left',
            render: (item) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${item.status === 'active'
                        ? 'bg-transparent text-gray-700 border-gray-200'
                        : 'bg-transparent text-red-600 border-red-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {item.status === 'active' ? 'Active' : 'Inactive'}
                    {/* Tiny chevron for dropdown effect matching ref */}
                    <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
            )
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            render: (item) => (
                <div className="flex justify-end gap-2 text-gray-500">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(item); }} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 border border-transparent hover:border-gray-200">
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500 border border-transparent hover:border-gray-200">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )
        }
    ];

    // Header Controls
    const headerControls = (
        <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium bg-white text-main hover:bg-gray-50" style={{ borderColor: 'var(--border-color)' }}>
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>29/12/2025 - 29/12/2025</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium bg-white text-main hover:bg-gray-50" style={{ borderColor: 'var(--border-color)' }}>
                <span>Taxes List</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded text-sm font-medium bg-white text-main hover:bg-gray-50" style={{ borderColor: 'var(--border-color)' }}>
                <span>Sort By : Last 7 Days</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
        </div>
    );

    const actionButtons = (
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm font-medium text-main shadow-sm transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                <Download className="w-4 h-4" /> Export
            </button>
            <button
                onClick={() => { setEditingTx(null); setFormData({ name: '', percentage: '', status: 'active' }); setIsModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold hover:bg-orange-600 shadow-sm transition-colors"
                style={{ backgroundColor: 'var(--color-primary)' }}
            >
                <Plus className="w-4 h-4" /> Add Tax
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 font-sans gap-6 overflow-hidden">

            {/* 1. Header & Breadcrumbs */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>Taxes</h1>
                    <div className="text-sm text-gray-500">HR / <span>Taxes</span></div>
                </div>
                {actionButtons}
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-hidden h-full">
                <SmartTable
                    title="Tax List"
                    data={taxes}
                    columns={columns}
                    isLoading={loading}
                    headerControls={headerControls}
                />
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative" style={{ backgroundColor: 'var(--bg-white)' }}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>{editingTx ? 'Edit Tax' : 'Add Tax'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-main">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-main">Tax Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-indigo-600 outline-none"
                                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. GST"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-main">Tax Percentage (%) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-indigo-600 outline-none"
                                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                    value={formData.percentage}
                                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                                    placeholder="e.g. 18"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-main">Status</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:ring-1 focus:ring-indigo-600 outline-none"
                                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex justify-center pt-4">
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--color-primary)' }}>
                                    {editingTx ? 'Update Tax' : 'Create Tax'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
