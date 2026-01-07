import React, { useState, useEffect } from 'react';
import {
    Users, Search, Filter, Download, Plus,
    User, Phone, Mail, Calendar, TrendingUp,
    ShoppingBag, Clock, ChevronRight, Star,
    ArrowUpRight, MoreVertical, MapPin, History
} from 'lucide-react';
import { customerService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export function Customers() {
    const [customers, setCustomers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [customerDetail, setCustomerDetail] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [custRes, statsRes] = await Promise.all([
                customerService.getAll(),
                customerService.getStats()
            ]);
            if (custRes.data.success) setCustomers(custRes.data.data);
            if (statsRes.data.success) setStats(statsRes.data.data);
        } catch (error) {
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    const fetchCustomerDetail = async (id) => {
        try {
            setDetailLoading(true);
            const res = await customerService.getDetail(id);
            if (res.data.success) {
                setCustomerDetail(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load customer details');
        } finally {
            setDetailLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const StatCard = ({ label, value, icon: Icon, color, subValue }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading && !selectedCustomer) return <div className="p-8 text-center">Loading Customers...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-7 h-7 text-blue-500" />
                        Customer Directory
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage relationships and track customer lifetime value</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-all">
                        <Plus className="w-4 h-4" /> Add Customer
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Total Customers"
                    value={stats?.totalCustomers || 0}
                    icon={Users}
                    color="bg-blue-500"
                    subValue="Lifetime database"
                />
                <StatCard
                    label="New This Month"
                    value={stats?.newThisMonth || 0}
                    icon={ArrowUpRight}
                    color="bg-green-500"
                    subValue="+12% vs last month"
                />
                <StatCard
                    label="Avg. Order Value"
                    value="₹840"
                    icon={TrendingUp}
                    color="bg-purple-500"
                    subValue="Per transaction"
                />
                <StatCard
                    label="Active Members"
                    value="84%"
                    icon={Star}
                    color="bg-yellow-500"
                    subValue="Ordered in last 90 days"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Customer List */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-full md:w-80">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Total Spend</th>
                                    <th className="px-6 py-4">Orders</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            fetchCustomerDetail(customer.id);
                                        }}
                                        className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer
                                            ${selectedCustomer?.id === customer.id ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                                        `}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{customer.name}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Member since {format(new Date(customer.createdAt), 'MMM yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                                    <Phone className="w-3 h-3" /> {customer.phone}
                                                </p>
                                                {customer.email && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                                        <Mail className="w-3 h-3" /> {customer.email}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{parseFloat(customer.totalSpend).toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400">Last: {customer.lastVisit ? format(new Date(customer.lastVisit), 'dd MMM') : 'Never'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold text-gray-600 dark:text-gray-300">
                                                {customer.totalOrders} Orders
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customer Detail Sidebar */}
                <div className="space-y-6">
                    {selectedCustomer ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-bold text-gray-900 dark:text-white">Customer Profile</h4>
                                    <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Edit Profile</button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none">
                                        {selectedCustomer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h3>
                                        <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {detailLoading ? (
                                <div className="p-10 text-center text-gray-500 text-sm">Loading details...</div>
                            ) : customerDetail ? (
                                <div className="p-6 space-y-8">
                                    {/* Quick Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Spend</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{parseFloat(customerDetail.profile.totalSpend).toLocaleString()}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Orders</p>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">{customerDetail.profile.totalOrders}</p>
                                        </div>
                                    </div>

                                    {/* Favorites */}
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Star className="w-3.5 h-3.5 text-yellow-500" />
                                            Customer Favorites
                                        </h5>
                                        <div className="space-y-3">
                                            {customerDetail.favorites.map((fav, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-bold text-xs">
                                                            {fav.itemName.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{fav.itemName}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                                        {fav.orderCount}x
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div>
                                        <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <History className="w-3.5 h-3.5 text-blue-500" />
                                            Recent Orders
                                        </h5>
                                        <div className="space-y-4">
                                            {customerDetail.recentOrders.map((order) => (
                                                <div key={order.id} className="relative pl-6 pb-4 border-l border-gray-100 dark:border-gray-700 last:pb-0">
                                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800" />
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-900 dark:text-white">Order #{order.orderNumber}</p>
                                                            <p className="text-[10px] text-gray-400">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                                                        </div>
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button className="w-full py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
                                        <Mail className="w-4 h-4" /> Send Marketing Message
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center">
                            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <User className="w-8 h-8 text-gray-300" />
                            </div>
                            <h4 className="text-sm font-bold text-gray-400">Select a customer to view details</h4>
                            <p className="text-xs text-gray-400 mt-1">Order history, favorites, and insights will appear here</p>
                        </div>
                    )}

                    {/* Marketing Insight */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold mb-2">
                            <TrendingUp className="w-4 h-4" />
                            Growth Insight
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-500 leading-relaxed">
                            Customers who order their "Favorites" more than 3 times are 65% more likely to become long-term loyal members.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
