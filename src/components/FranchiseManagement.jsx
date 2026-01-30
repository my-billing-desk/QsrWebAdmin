import React, { useState, useEffect } from 'react';
import { Plus, Search, Building2, MapPin, DollarSign, Store, X } from 'lucide-react';
import { tenantService } from '../services/api';
import toast from 'react-hot-toast';

export function FranchiseManagement() {
    const [view, setView] = useState('list');
    const [subTenants, setSubTenants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormState());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await tenantService.getSubTenants();
            setSubTenants(res.data || []);
        } catch (error) {
            console.error(error);
            // toast.error('Failed to load franchises'); 
            // Silently fail if not master to avoid UI clutter or show specific error if 403
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.ownerEmail || !formData.ownerPassword) {
            return toast.error("Please fill required fields");
        }
        try {
            await tenantService.createSubTenant(formData);
            toast.success("Franchise created successfully!");
            setFormData(initialFormState());
            setView('list');
            loadData();
        } catch (error) {
            console.error(error);
            toast.error("Error creating franchise: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 gap-6">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Franchise Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage sub-tenants and royalty settings</p>
                </div>
                <button
                    onClick={() => setView('add')}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" /> Add Franchise
                </button>
            </div>

            {view === 'list' ? (
                <div className="card-standard overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div className="relative w-72">
                            <input
                                type="text"
                                placeholder="Search franchises..."
                                className="input-field pl-10"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                    </div>
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Loading franchises...</div>
                    ) : subTenants.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                                <Store className="w-6 h-6" />
                            </div>
                            <h3 className="text-gray-900 font-medium">No Franchises Found</h3>
                            <p className="text-sm text-gray-500">Create your first sub-tenant to get started.</p>
                        </div>
                    ) : (
                        <table className="table-standard">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Franchise Name</th>
                                    <th className="table-th">Subdomain</th>
                                    <th className="table-th">Royalty %</th>
                                    <th className="table-th">FSSAI Status</th>
                                    <th className="table-th">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {subTenants.map(t => (
                                    <tr key={t.id} className="table-row">
                                        <td className="table-td font-medium text-gray-900 flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-gray-400" /> {t.name}
                                        </td>
                                        <td className="table-td text-gray-600 font-mono text-xs">
                                            {t.subdomain || '-'}
                                        </td>
                                        <td className="table-td font-bold text-gray-700">
                                            {t.royaltyPercentage}%
                                        </td>
                                        <td className="table-td">
                                            {t.fssaiNumber ? (
                                                <span className="text-green-600 text-xs font-bold flex items-center gap-1">
                                                    ✓ Verified
                                                </span>
                                            ) : (
                                                <span className="text-red-500 text-xs font-medium">Missing</span>
                                            )}
                                        </td>
                                        <td className="table-td">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${t.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="card-standard p-6 max-w-3xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-800">Add New Franchise</h2>
                        <button onClick={() => setView('list')} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-1.5 lead">
                            <label className="form-label">Franchise Name *</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="e.g. Sunburst Stack - Indiranagar"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="form-label">Subdomain *</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    className="input-field rounded-r-none border-r-0"
                                    placeholder="indiranagar"
                                    value={formData.subdomain}
                                    onChange={e => setFormData({ ...formData, subdomain: e.target.value })}
                                />
                                <span className="px-3 py-2 bg-gray-50 border border-gray-200 border-l-0 rounded-r-lg text-gray-500 text-sm">.yourpos.com</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="form-label">Royalty Percentage (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="input-field pl-8"
                                    value={formData.royaltyPercentage}
                                    onChange={e => setFormData({ ...formData, royaltyPercentage: e.target.value })}
                                />
                                <DollarSign className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" />
                            </div>
                        </div>

                        <div className="col-span-2 border-t border-gray-100 pt-4">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Admin Credentials
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="form-label">Owner Email *</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        placeholder="owner@franchise.com"
                                        value={formData.ownerEmail}
                                        onChange={e => setFormData({ ...formData, ownerEmail: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="form-label">Initial Password *</label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={formData.ownerPassword}
                                        onChange={e => setFormData({ ...formData, ownerPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                        <button onClick={() => setView('list')} className="btn-secondary">Cancel</button>
                        <button onClick={handleCreate} className="btn-primary">Create Franchise</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function initialFormState() {
    return {
        name: '',
        subdomain: '',
        ownerEmail: '',
        ownerPassword: '',
        fssaiNumber: '',
        royaltyPercentage: 10.0
    };
}
