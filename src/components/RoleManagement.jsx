import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, ArrowLeft, Users, Shield, Check } from 'lucide-react';
import { roleService } from '../services/api';
import toast from 'react-hot-toast';

const MASTER_PERMISSIONS = [
    // Admin Modules
    { id: 1, section: 'Admin', name: 'Dashboard & Analytics', read: true, write: false },
    { id: 2, section: 'Admin', name: 'Menu Management', read: true, write: true },
    { id: 3, section: 'Admin', name: 'Category Management', read: true, write: true },
    { id: 4, section: 'Admin', name: 'Addon & Variations', read: true, write: true },
    { id: 5, section: 'Admin', name: 'Tax Configuration', read: true, write: true },
    { id: 6, section: 'Admin', name: 'Customer Management', read: true, write: true },
    { id: 11, section: 'Admin', name: 'Discount & Promo Config', read: true, write: true },
    { id: 12, section: 'Admin', name: 'Outlet & POS Config', read: true, write: true },
    { id: 25, section: 'Admin', name: 'User & Staff Management', read: true, write: true },
    { id: 24, section: 'Admin', name: 'Marketplace Integrations', read: true, write: true },

    // Inventory
    { id: 14, section: 'Inventory', name: 'Raw Materials', read: true, write: true },
    { id: 15, section: 'Inventory', name: 'Recipe Management', read: true, write: true },
    { id: 16, section: 'Inventory', name: 'Supplier Management', read: true, write: true },
    { id: 17, section: 'Inventory', name: 'Purchase Entry', read: true, write: true },
    { id: 18, section: 'Inventory', name: 'Stock Adjustment/Wastage', read: true, write: true },
    { id: 19, section: 'Inventory', name: 'Indent & Transfer', read: true, write: true },

    // POS Operations
    { id: 30, section: 'POS', name: 'Access POS App', type: 'yes_no', value: true },
    { id: 140, section: 'POS', name: 'Create Order / Billing', read: true, write: true },
    { id: 7, section: 'POS', name: 'KOT Management', read: true, write: true },
    { id: 141, section: 'POS', name: 'Void/Delete Item', type: 'yes_no', value: false },
    { id: 142, section: 'POS', name: 'Void/Cancel Full Bill', type: 'yes_no', value: false },
    { id: 143, section: 'POS', name: 'Apply Custom Discount', type: 'yes_no', value: false },
    { id: 39, section: 'POS', name: 'Reprint KOT/Bill', type: 'yes_no', value: true },
    { id: 21, section: 'POS', name: 'Table Management', read: true, write: true },
    { id: 8, section: 'POS', name: 'Billing & Settlement', read: true, write: true },
    { id: 144, section: 'POS', name: 'Order History Access', read: true, write: false },
    { id: 26, section: 'POS', name: 'POS Printer Settings', read: true, write: true },
    { id: 27, section: 'POS', name: 'Shift / Day End (POS)', type: 'yes_no', value: true },
    { id: 145, section: 'POS', name: 'Cash Drawer Open', type: 'yes_no', value: false },
    { id: 28, section: 'POS', name: 'Special Note Management', type: 'yes_no', value: true },
];

export function RoleManagement() {
    const [roles, setRoles] = useState([]);
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [editingRole, setEditingRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const [permissions, setPermissions] = useState(MASTER_PERMISSIONS);

    useEffect(() => {
        if (view === 'list') {
            loadRoles();
        }
    }, [view]);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const res = await roleService.getAll();
            setRoles(res.data);
        } catch (error) {
            console.error("Failed to load roles", error);
            toast.error("Failed to load roles");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                permissions: permissions
            };

            if (editingRole) {
                await roleService.update(editingRole.id, payload);
                toast.success("Role updated successfully");
            } else {
                await roleService.create(payload);
                toast.success("Role created successfully");
            }
            setView('list');
            setEditingRole(null);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to save role");
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            description: role.description || ''
        });
        if (role.permissions) {
            // Merge saved permissions with MASTER list to ensure new modules are included
            const merged = MASTER_PERMISSIONS.map(masterPerm => {
                const savedPerm = role.permissions.find(p => p.id === masterPerm.id);
                return savedPerm ? { ...masterPerm, ...savedPerm } : masterPerm;
            });
            setPermissions(merged);
        } else {
            setPermissions(MASTER_PERMISSIONS);
        }
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;
        try {
            await roleService.delete(id);
            toast.success("Role deleted");
            loadRoles();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete role");
        }
    };

    const handlePermissionChange = (id, field) => {
        setPermissions(prev => prev.map(perm => {
            if (perm.id === id) {
                if (perm.type === 'yes_no') {
                    return { ...perm, value: !perm.value };
                }
                return { ...perm, [field]: !perm[field] };
            }
            return perm;
        }));
    };

    if (view === 'list') {
        return (
            <div className="p-6 space-y-6 text-gray-800 dark:text-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-600" />
                            System Roles
                        </h2>
                        <p className="text-sm text-gray-500">Manage permission-based roles for your organization.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingRole(null);
                            setFormData({ name: '', description: '' });
                            setPermissions(MASTER_PERMISSIONS);
                            setView('form');
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                    >
                        <Plus className="w-4 h-4" /> Create Role
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-12 text-center text-gray-400">Loading roles...</div>
                    ) : roles.length > 0 ? (
                        roles.map(role => (
                            <div key={role.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl flex items-center justify-center">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(role)}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(role.id)}
                                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{role.name}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{role.description || 'No description provided.'}</p>
                                <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-700 flex justify-between items-center text-xs font-semibold text-gray-400">
                                    <span>{role.permissions?.length || 0} Modules Configured</span>
                                    <span className={role.isActive ? 'text-green-500' : 'text-gray-400'}>
                                        {role.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
                            No custom roles created yet.
                        </div>
                    )}
                </div>
            </div >
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6 text-gray-800 dark:text-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{editingRole ? 'Edit Role' : 'Create New Role'}</h2>
                        <p className="text-sm text-gray-500">Configure name and permissions for this role.</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                    <Save className="w-4 h-4" /> Save Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Role Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Role Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="e.g. Senior Cashier"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
                                <textarea
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="Brief description of this role's responsibilities..."
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-100">Access Control</h4>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed opacity-80">
                            Users assigned to this role will inherit these specific module permissions centrally.
                            This simplifies management for large teams.
                        </p>
                    </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wider">Module Permissions</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPermissions(prev => prev.map(p => ({
                                    ...p,
                                    read: p.read !== undefined ? true : p.read,
                                    write: p.write !== undefined ? true : p.write,
                                    value: p.value !== undefined ? true : p.value,
                                    add: p.add !== undefined ? true : p.add,
                                    modify: p.modify !== undefined ? true : p.modify
                                })))}
                                className="text-[10px] font-bold text-blue-600 hover:underline"
                            >Select All</button>
                            <button
                                onClick={() => setPermissions(prev => prev.map(p => ({
                                    ...p,
                                    read: p.read !== undefined ? false : p.read,
                                    write: p.write !== undefined ? false : p.write,
                                    value: p.value !== undefined ? false : p.value,
                                    add: p.add !== undefined ? false : p.add,
                                    modify: p.modify !== undefined ? false : p.modify
                                })))}
                                className="text-[10px] font-bold text-red-600 hover:underline border-l border-gray-200 pl-2"
                            >Deselect All</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[600px] bg-white dark:bg-gray-800">
                        {['Admin', 'Inventory', 'POS'].map(sectionName => (
                            <div key={sectionName} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                                <div className="px-6 py-3 bg-gray-50/50 dark:bg-gray-700/30">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{sectionName} Operations</h4>
                                </div>
                                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                                    {permissions.filter(p => p.section === sectionName).map((perm) => (
                                        <div key={perm.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center hover:bg-gray-50/50 transition-colors gap-3">
                                            <div className="flex-1">
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{perm.name}</span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                {perm.type === 'yes_no' ? (
                                                    <Checkbox label="Enable" checked={perm.value} onChange={() => handlePermissionChange(perm.id, 'value')} />
                                                ) : (
                                                    <>
                                                        <Checkbox label="View" checked={perm.read} onChange={() => handlePermissionChange(perm.id, 'read')} />
                                                        <Checkbox label="Control" checked={perm.write} onChange={() => handlePermissionChange(perm.id, 'write')} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Checkbox({ label, checked, onChange }) {
    return (
        <label
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={(e) => {
                e.preventDefault();
                onChange();
            }}
        >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white dark:bg-gray-700'}`}>
                {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">{label}</span>
        </label>
    );
}
