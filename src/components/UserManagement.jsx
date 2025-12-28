import React, { useState, useEffect } from 'react';
import { Save, X, Check, ChevronDown, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function UserManagement() {
    const { user: currentUser } = useAuth();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [users, setUsers] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        userType: 'cashier',
        username: '',
        userCode: '',
        password: '',
        phone: '',
        passcode: '',
        swipeCode: '',
        discountCapping: 'No Capping',
        discountValue: '',
        userGroup: 'CASHIER'
    });

    const [permissions, setPermissions] = useState([
        { id: 1, name: 'Dashboard & Analytics', read: true, write: false },
        { id: 2, name: 'Item Master (Menu Items)', read: true, write: true },
        { id: 3, name: 'Category Management', read: true, write: true },
        { id: 4, name: 'Addon & Variations Management', read: true, write: true },
        { id: 5, name: 'Tax Configuration', read: true, write: true },
        { id: 6, name: 'Customer Management', read: true, write: true },
        { id: 7, name: 'KOT Management', read: true, write: true },
        { id: 8, name: 'Billing & Settlement', read: true, write: true },
        { id: 9, name: 'Online Orders (Swiggy/Zomato)', read: true, write: true },
        { id: 10, name: 'Reports & Exports', type: 'yes_no', value: true },
        { id: 11, name: 'Discount Configuration', read: true, write: true },
        { id: 12, name: 'Point of Sale Configuration Details', read: true, write: true },
        { id: 13, name: 'After Print Modification', type: 'custom', add: true, modify: false },
        { id: 14, name: 'Raw Materials [Inventory]', read: true, write: true },
        { id: 15, name: 'Recipe Management [Inventory]', read: true, write: true },
        { id: 16, name: 'Supplier Management [Inventory]', read: true, write: true },
        { id: 17, name: 'Purchase [Inventory]', read: true, write: true },
        { id: 18, name: 'Stock Adjustment / Wastage [Inventory]', read: true, write: true },
        { id: 19, name: 'Indent Management', read: true, write: true },
        { id: 20, name: 'Internal Transfer/Sales [Inventory]', read: true, write: true },
        { id: 21, name: 'Area & Table Management', read: true, write: true },
        { id: 22, name: 'Expense Management', read: true, write: true },
        { id: 23, name: 'Loyalty & Rewards Management', read: true, write: true },
        { id: 24, name: 'Marketplace & Integrations', read: true, write: true },
        { id: 25, name: 'User & Staff Management', read: true, write: true },
        { id: 26, name: 'Terminal & Printer Configuration', read: true, write: true },
        { id: 27, name: 'Day End / Shift Management', type: 'yes_no', value: true },
        { id: 28, name: 'Special Note Management', type: 'yes_no', value: true },
        { id: 29, name: 'Manual Finalize Order', type: 'yes_no', value: false },
    ]);

    useEffect(() => {
        if (view === 'list') {
            loadUsers();
        }
    }, [view]);

    const loadUsers = async () => {
        try {
            const res = await userService.getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    const handleSave = async () => {
        try {
            await userService.register({
                ...formData,
                displayName: formData.name,
                role: formData.userType,
                permissions: permissions // Send permissions array
            });
            setView('list');
        } catch (error) {
            console.error("Failed to save user", error);
            alert("Failed to save user");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">User Management</h2>
                    <button
                        onClick={() => {
                            setFormData({
                                name: '', userType: 'Billing User', username: '', userCode: '',
                                password: '', phone: '', passcode: '', swipeCode: '',
                                discountCapping: 'No Capping', discountValue: '', userGroup: 'CASHIER'
                            });
                            setView('form');
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
                    >
                        <Plus className="w-4 h-4" /> Add User
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Role</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="p-4 font-medium">{user.displayName || user.name}</td>
                                    <td className="p-4 text-gray-500">{user.username}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="text-gray-400 hover:text-blue-600 mx-1"><Edit className="w-4 h-4" /></button>
                                        <button className="text-gray-400 hover:text-red-600 mx-1"><Trash2 className="w-4 h-4" /></button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 font-sans overflow-y-auto">
            <div className="p-6 max-w-5xl mx-auto w-full space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-200 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add/Edit User</h2>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

                    {/* Left Column */}
                    <div className="space-y-4">
                        <InputGroup label="Name" required>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>
                        <InputGroup label="User Name" required>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>
                        <InputGroup label="Password" required>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="•••••••"
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>
                        <InputGroup label="User Passcode" required>
                            <input
                                type="text"
                                name="passcode"
                                value={formData.passcode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Discount Capping</label>
                            <div className="flex gap-4 items-center">
                                {['No Capping', 'Percentage', 'Fixed'].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.discountCapping === opt ? 'border-green-600' : 'border-gray-300'}`}>
                                            {formData.discountCapping === opt && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                                        </div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <InputGroup label="User Type" required>
                            <select
                                name="userType"
                                value={formData.userType}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            >
                                <option value="cashier">Cashier</option>
                                <option value="manager">Restaurant Manager</option>
                                {currentUser?.role === 'super_admin' && <option value="admin">Admin</option>}
                            </select>
                        </InputGroup>
                        <InputGroup label="User Code" required>
                            <input
                                type="text"
                                name="userCode"
                                value={formData.userCode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                                disabled
                            />
                        </InputGroup>
                        <InputGroup label="Phone">
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>
                        <InputGroup label="Swipe Code">
                            <input
                                type="text"
                                name="swipeCode"
                                value={formData.swipeCode}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>
                        <InputGroup label="Discount Value">
                            <input
                                type="text"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-violet-500 outline-none"
                            />
                        </InputGroup>
                    </div>
                </div>

                {/* User Group Details */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4">User Group Details</h3>
                    <div className="flex gap-6 items-center flex-wrap">
                        {['No Group', 'CASHIER', 'OWNER', 'MANAGER'].map(group => (
                            <label key={group} className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.userGroup === group ? 'border-green-600' : 'border-gray-300'}`}>
                                    {formData.userGroup === group && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                                </div>
                                <span className={`text-sm ${formData.userGroup === group ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {group}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Rights Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Rights <span className="text-red-500">*</span></h3>
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
                                className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold transition-colors"
                            >
                                Select All
                            </button>
                            <button
                                onClick={() => setPermissions(prev => prev.map(p => ({
                                    ...p,
                                    read: p.read !== undefined ? false : p.read,
                                    write: p.write !== undefined ? false : p.write,
                                    value: p.value !== undefined ? false : p.value,
                                    add: p.add !== undefined ? false : p.add,
                                    modify: p.modify !== undefined ? false : p.modify
                                })))}
                                className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 px-2 py-1 rounded font-bold transition-colors"
                            >
                                Deselect All
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {permissions.map((perm) => (
                            <div key={perm.id} className="flex flex-col md:flex-row items-start md:items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <div className="w-full md:w-1/3 mb-2 md:mb-0">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{perm.name}</span>
                                </div>
                                <div className="flex-1 flex flex-wrap gap-8">
                                    {perm.type === 'yes_no' ? (
                                        <Checkbox label="Yes" checked={perm.value} onChange={() => handlePermissionChange(perm.id, 'value')} />
                                    ) : perm.type === 'custom' ? (
                                        <>
                                            <Checkbox label="Add item" checked={perm.add} onChange={() => handlePermissionChange(perm.id, 'add')} />
                                            <Checkbox label="Modify quantity & delete item" checked={perm.modify} onChange={() => handlePermissionChange(perm.id, 'modify')} />
                                        </>
                                    ) : (
                                        <>
                                            <Checkbox label="Read" checked={perm.read} onChange={() => handlePermissionChange(perm.id, 'read')} />
                                            <Checkbox label="Write" checked={perm.write} onChange={() => handlePermissionChange(perm.id, 'write')} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 rounded-b-xl shadow-lg">
                    <button onClick={() => setView('list')} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium shadow-md transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" /> Save Changes
                    </button>
                </div>

            </div>
        </div>
    );
}

function InputGroup({ label, required, children }) {
    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function Checkbox({ label, checked, onChange }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white dark:bg-gray-700'}`}>
                {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
        </label>
    );
}
