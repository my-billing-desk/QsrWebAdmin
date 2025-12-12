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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Main Revenue Card */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-5 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-start h-full flex-col">
                        <div>
                            <div className="flex items-center gap-2 text-red-500 mb-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-bold tracking-wide text-xs uppercase">Total Revenue</span>
                            </div>
                            <h2 className="text-3xl font-display font-bold mt-1 tracking-tight text-gray-900 dark:text-white">
                                ₹{(stats.totalSales || 0).toLocaleString()}
                            </h2>
                        </div>

                        <div className="w-full flex items-end justify-between mt-4">
                            <div>
                                <div className="text-gray-400 text-xs font-medium mb-0.5">Total Orders</div>
                                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{stats.totalOrders}</div>
                            </div>
                            <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-100">
                                <TrendingUp className="w-3 h-3" />
                                <span className="font-bold text-xs">+12.5%</span>
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

                {/* Active Staff */}
                <StatCard
                    title="Active Staff"
                    value="12"
                    icon={Users}
                    trend="Full"
                    trendUp={true}
                    color="blue"
                    subtitle="On Shift"
                />
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Activity Area */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Sales Channels */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 font-display">Sales by Channel</h3>
                            <button className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1 rounded-full transition-colors">View Report</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                color="bg-red-500"
                                icon={Truck}
                            />
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold font-display">Recent Activity</h3>
                        </div>

                        <div className="space-y-3">
                            {(!stats.recentOrders || stats.recentOrders.length === 0) ? (
                                <div className="text-center py-8 text-gray-400 text-sm font-medium">
                                    No recent activity
                                </div>
                            ) : (
                                stats.recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 text-sm">
                                                #{order.id.toString().slice(-3)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{order.customerName || 'Walk-in'}</h4>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5 flex items-center gap-1.5">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                                    {order.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">₹{order.totalAmount}</p>
                                            <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 text-gray-900 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Star className="w-24 h-24" />
                        </div>
                        <div className="flex items-center gap-2 mb-3 text-orange-500">
                            <Star className="w-5 h-5 fill-current" />
                            <span className="text-xs font-bold uppercase tracking-wider">Top Item</span>
                        </div>
                        <h3 className="text-xl font-display font-bold mb-1 leading-tight">Chicken Burger Deluxe</h3>
                        <p className="text-gray-400 font-medium text-xs mb-4">Trending today!</p>
                        <div className="bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-3 flex items-center gap-3 border border-orange-100 dark:border-orange-500/20">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">42</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Sold<br />Today</div>
                        </div>
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
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${colors[color] || 'bg-gray-100 text-gray-600'} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                </div>
                {trend && (
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div className="mt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{title}</p>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                {subtitle && <p className="text-[10px] text-gray-400 font-medium mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}

function ChannelMetric({ label, value, total, color, icon: Icon }) {
    const percentage = total > 0 ? Math.round(((typeof value === 'number' ? value : 0) / total) * 100) : 0;

    return (
        <div className="flex flex-col gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm ${color}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5">{label}</div>
            </div>
            <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden mt-1">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
}
