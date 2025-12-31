import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, Plus, Mail, Phone, MapPin,
    TrendingUp, Calendar, ArrowRight, Star, Tag, Download,
    ChevronLeft, ChevronRight, Edit, Trash2, MoreVertical,
    BarChart3, UserCheck, Heart
} from 'lucide-react';
import { customerService } from '../../services/api';
import toast from 'react-hot-toast';

export function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState('');
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {
        loadData();
    }, [searchTerm, filterTier, page]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [res, statsRes] = await Promise.all([
                customerService.getAll({
                    search: searchTerm,
                    tier: filterTier,
                    limit,
                    offset: page * limit
                }),
                customerService.getStats()
            ]);
            setCustomers(res.data.customers);
            setTotal(res.data.total);
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to load customers", error);
            toast.error("Failed to load customer data");
        } finally {
            setLoading(false);
        }
    };

    const getTierColor = (tier) => {
        switch (tier?.toLowerCase()) {
            case 'platinum': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'gold': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'silver': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-6 h-6 text-red-600" />
                        Customer Management
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your customer relationships and loyalty programs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200 dark:shadow-none">
                        <Plus className="w-4 h-4" /> Add Customer
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Customers"
                    value={stats?.totalCustomers || 0}
                    icon={Users}
                    color="blue"
                    trend="+12% from last month"
                />
                <StatCard
                    title="Active (Last 30d)"
                    value={stats?.activeCustomers || 0}
                    icon={UserCheck}
                    color="green"
                    trend="+5% from last month"
                />
                <StatCard
                    title="Loyalty Points"
                    value="42.5K"
                    icon={Star}
                    color="amber"
                    trend="Distributed to users"
                />
                <StatCard
                    title="Avg. Order Value"
                    value="₹840"
                    icon={TrendingUp}
                    color="purple"
                    trend="+₹42 today"
                />
            </div>

            {/* Filters and List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, phone, or email..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                            value={filterTier}
                            onChange={(e) => setFilterTier(e.target.value)}
                        >
                            <option value="">All Tiers</option>
                            <option value="platinum">Platinum</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="regular">Regular</option>
                        </select>
                        <button className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                            <Filter className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Status & Tier</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Total Spent</th>
                                <th className="px-6 py-4">Loyalty</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                [1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4 h-16 bg-gray-50/50 dark:bg-gray-800/50"></td>
                                    </tr>
                                ))
                            ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 flex items-center justify-center font-bold text-sm">
                                                    {(customer.name || 'C').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-gray-100">{customer.name || 'Walk-in Customer'}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                                                        <Phone className="w-3 h-3" /> {customer.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase w-fit ${getTierColor(customer.customerTier)}`}>
                                                    {customer.customerTier || 'Regular'}
                                                </span>
                                                <span className="flex items-center gap-1 text-[11px] text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{customer.totalOrders || 0}</div>
                                            <div className="text-[10px] text-gray-400 capitalize">visits</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{parseFloat(customer.totalSpent || 0).toLocaleString()}</div>
                                            <div className="text-[10px] text-green-500 font-medium">LTV</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                                <Star className="w-3 h-3 fill-amber-500" />
                                                {customer.loyaltyPoints || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-400 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-400 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-300">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <p className="text-gray-500">No customers found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{page * limit + 1}</span> to <span className="font-medium">{Math.min((page + 1) * limit, total)}</span> of <span className="font-medium">{total}</span> customers
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            disabled={(page + 1) * limit >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20',
        purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20'
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
        </div>
    );
}
