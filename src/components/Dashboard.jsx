import React, { useState, useEffect } from 'react';
import {
    TrendingUp, Utensils, ShoppingBag, Truck, ShoppingCart, Clock,
    ArrowUpRight, ArrowDownRight, Users, Calendar, DollarSign,
    Activity, Star, AlertCircle, ChevronRight, ChevronDown, Zap, Trash2
} from 'lucide-react';
import { dashboardService } from '../services/api';

export function Dashboard() {
    const [dateRange, setDateRange] = useState('Today');
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        dineIn: 0,
        takeaway: 0,
        delivery: 0
    });

    const fetchStats = async () => {
        try {
            const response = await dashboardService.getStats();
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8 font-sans">

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                        Good Evening, Admin
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">
                        Here's what's happening in your restaurant today.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-2xl text-sm font-bold text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{dateRange}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="px-5 py-2.5 bg-primary-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-current" /> Live View
                    </button>
                </div>
            </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Main Revenue Card - Spans 2 cols */}
                <div className="md:col-span-2 bg-gradient-to-br from-primary-900 to-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-900/20 group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="relative z-10 flex justify-between items-start h-full flex-col">
                        <div>
                            <div className="flex items-center gap-2 text-primary-200 mb-1">
                                <DollarSign className="w-5 h-5" />
                                <span className="font-bold tracking-wide text-sm uppercase">Total Revenue</span>
                            </div>
                            <h2 className="text-5xl font-display font-bold mt-2 tracking-tight">
                                ₹{(stats.totalSales || 0).toLocaleString()}
                            </h2>
                        </div>

                        <div className="w-full flex items-end justify-between mt-8">
                            <div>
                                <div className="text-primary-200 text-sm font-medium mb-1">Total Orders</div>
                                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10 group-hover:bg-white/20 transition-colors">
                                <TrendingUp className="w-4 h-4 text-emerald-300" />
                                <span className="font-bold text-emerald-300">+12.5%</span>
                                <span className="text-xs text-primary-200">vs yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avg Order Value */}
                <StatCard
                    title="Avg. Order Value"
                    value={`₹${Math.round(stats.totalOrders > 0 ? stats.totalSales / stats.totalOrders : 0)}`}
                    icon={TrendingUp}
                    trend="-2.4%"
                    trendUp={false}
                    color="orange"
                />

                {/* Active Staff (Mock) */}
                <StatCard
                    title="Active Staff"
                    value="12"
                    icon={Users}
                    trend="Full Strength"
                    trendUp={true}
                    color="blue"
                    subtitle="Currently Shift"
                />
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Activity Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Sales Channels */}
                    <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-display">Sales by Channel</h3>
                            <button className="text-primary-600 text-sm font-bold hover:bg-primary-50 px-3 py-1 rounded-lg transition-colors">View Report</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <ChannelMetric
                                label="Dine-In"
                                value={stats.dineIn}
                                total={stats.totalOrders}
                                color="bg-emerald-500"
                                icon={Utensils}
                            />
                            <ChannelMetric
                                label="Takeaway"
                                value={stats.takeaway}
                                total={stats.totalOrders}
                                color="bg-blue-500"
                                icon={ShoppingBag}
                            />
                            <ChannelMetric
                                label="Delivery"
                                value={stats.delivery}
                                total={stats.totalOrders}
                                color="bg-primary-500"
                                icon={Truck}
                            />
                        </div>
                    </div>

                    {/* Recent Orders - Modern List */}
                    <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold font-display">Recent Activity</h3>
                        </div>

                        <div className="space-y-4">
                            {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
                                <div className="text-center py-10 text-gray-400 font-medium">
                                    No recent activity to show
                                </div>
                            ) : (
                                stats.recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-500">
                                                #{order.id.toString().slice(-3)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-gray-100">{order.customerName || 'Walk-in Customer'}</h4>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5 flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                    {order.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-gray-100">₹{order.totalAmount}</p>
                                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Placeholders for now */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-secondary-500 to-rose-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-secondary-500/20">
                        <Star className="w-8 h-8 text-white/80 mb-4" />
                        <h3 className="text-2xl font-display font-bold mb-2">Popular Item</h3>
                        <p className="text-secondary-100 font-medium text-sm mb-6">Chicken Burger Deluxe is trending today!</p>
                        <div className="bg-white/20 backdrop-blur rounded-xl p-4 flex items-center gap-3">
                            <div className="text-3xl font-bold">42</div>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-80">Sold<br />Today</div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 h-64 flex flex-col items-center justify-center text-center">
                        <Activity className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium">More insights loading...</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, color }) {
    const colors = {
        orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    };

    return (
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className={`p-3.5 rounded-2xl ${colors[color] || 'bg-gray-100 text-gray-600'} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">{title}</p>
                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</h3>
                {subtitle && <p className="text-xs text-gray-400 font-medium mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}

function ChannelMetric({ label, value, total, color, icon: Icon }) {
    const percentage = total > 0 ? Math.round(((typeof value === 'number' ? value : 0) / total) * 100) : 0;

    return (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
