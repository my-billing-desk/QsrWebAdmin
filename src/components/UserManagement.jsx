import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit, Trash2, ArrowLeft, UserCircle, Briefcase, Shield } from 'lucide-react';
import { userService, roleService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function UserManagement() {
    const { user: currentUser } = useAuth();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        userType: 'cashier',
        username: '',
        email: '',
        userCode: '',
        password: '',
        phone: '',
        passcode: '',
        swipeCode: '',
        discountCapping: 'No Capping',
        discountValue: '',
        roleId: ''
    });

    useEffect(() => {
        if (view === 'list') {
            loadUsers();
        }
        loadRoles();
    }, [view]);

    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            const res = await roleService.getAll();
            setRoles(res.data);
        } catch (error) {
            console.error("Failed to load roles", error);
        } finally {
            setLoadingRoles(false);
        }
    };

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
            const payload = {
                ...formData,
                displayName: formData.name,
                role: formData.userType
            };

            if (editingUser) {
                await userService.updateUser(editingUser.id, payload);
                toast.success("User updated successfully");
            } else {
                await userService.register(payload);
                toast.success("User registered successfully");
            }
            setView('list');
            setEditingUser(null);
        } catch (error) {
            console.error("Failed to save user", error);
            toast.error(error.response?.data?.error || "Failed to save user");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.displayName || user.name || '',
            userType: user.role || 'cashier',
            username: user.username || '',
            email: user.email || '',
            userCode: user.userCode || '',
            password: '', // Don't show password
            phone: user.phone || '',
            passcode: '', // Don't show passcode
            swipeCode: user.swipeCode || '',
            discountCapping: user.discountCapping || 'No Capping',
            discountValue: user.discountValue || '',
            roleId: user.roleId || ''
        });
        setView('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await userService.deleteUser(id);
            toast.success("User deleted");
            loadUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
            toast.error(error.response?.data?.error || "Failed to delete user");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (view === 'list') {
        return (
            <div className="p-6 space-y-6 text-gray-800 dark:text-gray-100">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <UserCircle className="w-6 h-6 text-red-600" />
                            User Directory
                        </h2>
                        <p className="text-sm text-gray-500">Manage access and account details for all staff members.</p>
                    </div>
                    {['super_admin', 'admin'].includes(currentUser?.role) && (
                        <button
                            onClick={() => {
                                setEditingUser(null);
                                setFormData({
                                    name: '', email: '', userType: 'cashier', username: '', userCode: '',
                                    password: '', phone: '', passcode: '', swipeCode: '',
                                    discountCapping: 'No Capping', discountValue: '',
                                    roleId: ''
                                });
                                setView('form');
                            }}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                        >
                            <Plus className="w-4 h-4" /> Add Member
                        </button>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold">
                            <tr>
                                <th className="p-4 text-left">Staff Name</th>
                                <th className="p-4 text-left">Username</th>
                                <th className="p-4 text-left">Assigned Role</th>
                                {['super_admin', 'admin'].includes(currentUser?.role) && <th className="p-4 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900 dark:text-gray-100">{user.displayName || user.name}</td>
                                    <td className="p-4 text-gray-500 font-medium">{user.username}</td>
                                    <td className="p-4">
                                        {user.roleData ? (
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${user.roleData.name === 'super_admin' ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight text-xs">
                                                        {user.roleData.name}
                                                    </span>
                                                    {user.roleData.name === 'super_admin' && (
                                                        <span className="text-[10px] text-orange-600 font-extrabold flex items-center gap-0.5">
                                                            <Shield className="w-2.5 h-2.5" /> SYSTEM OWNER
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No Role Assigned</span>
                                        )}
                                    </td>
                                    {['super_admin', 'admin'].includes(currentUser?.role) && (
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {user.id !== currentUser.id && user.roleData?.name !== 'super_admin' && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">No users found in directory.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 font-sans overflow-y-auto text-gray-800 dark:text-gray-100">
            <div className="p-6 max-w-5xl mx-auto w-full space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold">{editingUser ? 'Update Staff Member' : 'Register Member'}</h2>
                            <p className="text-sm text-gray-500">Assign roles and configure system access.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                    >
                        <Save className="w-4 h-4" /> Save Member
                    </button>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">

                    {/* Left Column - Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Personal Identity</span>
                        </div>

                        <InputGroup label="Full Display Name" required>
                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </InputGroup>

                        <InputGroup label="System Username" required>
                            <input
                                type="text"
                                name="username"
                                placeholder="john_doe"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </InputGroup>

                        <InputGroup label="Email Address">
                            <input
                                type="email"
                                name="email"
                                placeholder="owner@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                title={editingUser?.roleData?.name === 'super_admin' ? "Changing owner email requires care" : ""}
                            />
                        </InputGroup>

                        <InputGroup label="Contact Phone">
                            <input
                                type="text"
                                name="phone"
                                placeholder="+91 00000 00000"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </InputGroup>
                    </div>

                    {/* Right Column - Access */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Role & Access</span>
                        </div>

                        <InputGroup label="Assigned Role" required>
                            <select
                                name="roleId"
                                value={formData.roleId}
                                onChange={handleInputChange}
                                className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none font-bold"
                            >
                                <option value="">-- Choose a Role --</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name.toUpperCase()}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 mt-1">This determines the user's permissions across the app.</p>
                        </InputGroup>

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label={editingUser ? "Change Password" : "Password"} required={!editingUser}>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                />
                            </InputGroup>
                            <InputGroup label="Login Passcode" required>
                                <input
                                    type="text"
                                    name="passcode"
                                    placeholder="4-digit"
                                    value={formData.passcode}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none font-mono"
                                />
                            </InputGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, required, children }) {
    return (
        <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-tight">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}
