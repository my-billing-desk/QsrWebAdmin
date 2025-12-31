import React, { useState, useEffect } from 'react';
import {
    Calendar, Bell, ShoppingBag, RefreshCcw, FileText, TrendingUp, Users, Box, ArrowUpRight, ArrowDownRight,
    MoreHorizontal, Filter, Download, Plus, ChevronDown, Monitor, Search, UtensilsCrossed, AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { dashboardService, inventoryService } from '../services/api';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalOrders: 0,
        totalCustomers: 0,
        dineInTotal: 0,
        takeAwayTotal: 0,
        onlineStats: [],
        customerStats: { firstTime: 0, returning: 0 }
    });

    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);

    // Date Filtering State
    const [dateFilter, setDateFilter] = useState('Today');
    const [customRange, setCustomRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const calculateDateRange = (filter) => {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);

        // Helper to format YYYY-MM-DD (local time approximation)
        // Note: toISOString() uses UTC. If user is in +5:30, and it's 1AM, UTC is previous day.
        // Better to use manual formatting or handle timezone offset.
        // Simple fix: offset date before ISO string?
        const fmt = (d) => {
            const offset = d.getTimezoneOffset() * 60000;
            const localISODate = new Date(d.getTime() - offset);
            return localISODate.toISOString().split('T')[0];
        };

        switch (filter) {
            case 'Today':
                // start/end are now
                break;
            case 'Yesterday':
                start.setDate(now.getDate() - 1);
                end.setDate(now.getDate() - 1);
                break;
            case 'This Week':
                // Assuming Week starts on Monday
                const day = now.getDay() || 7; // Get current day number, converting Sun (0) to 7
                start.setDate(now.getDate() - (day - 1));
                break;
            case 'This Month':
                start.setDate(1);
                break;
            case 'Custom':
                return { startDate: customRange.start, endDate: customRange.end };
            default:
                break;
        }

        return {
            startDate: fmt(start),
            endDate: fmt(end)
        };
    };

    useEffect(() => {
        loadData();
    }, [dateFilter, customRange]);

    const loadData = async () => {
        try {
            const { startDate, endDate } = calculateDateRange(dateFilter);
            const params = { startDate, endDate };

            // Only fetch if we have valid dates (mainly for custom)
            if (!startDate || !endDate) return;

            const [statsRes, chartsRes, recentRes, topRes, matRes] = await Promise.all([
                dashboardService.getStats(params),
                dashboardService.getCharts(params),
                dashboardService.getRecentOrders(params), // Updated to accept params
                dashboardService.getTopItems(params),      // Updated to accept params
                inventoryService.getRawMaterials()         // Inventory usually current state, rarely filtered by date for alerts
            ]);

            setStats(statsRes.data);

            // Format Chart Data
            const revenueData = chartsRes.data.revenue.labels.map((label, i) => ({
                name: label,
                revenue: chartsRes.data.revenue.data[i] || 0
            }));
            setChartData(revenueData);

            setRecentOrders(recentRes.data);
            setTopItems(topRes.data);

            // Filter Low Stock
            const low = (matRes.data || []).filter(m => m.currentStock <= m.minStockLevel).slice(0, 5);
            setLowStockItems(low);

        } catch (error) {
            console.error("Dashboard Load Error:", error);
        }
    };

    const customerTypeData = [
        { name: 'First Time', value: stats.customerStats?.firstTime || 0, color: '#FF9F43' },
        { name: 'Returning', value: stats.customerStats?.returning || 0, color: '#28C76F' },
    ];

    // Fallback if no data to avoid empty charts
    const safeChartData = chartData.length > 0 ? chartData : [{ name: 'No Data', revenue: 0 }];

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-y-auto w-full">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500">Overview of your business performance</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <div className="relative">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <option>Today</option>
                            <option>Yesterday</option>
                            <option>This Week</option>
                            <option>This Month</option>
                            <option>Custom</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                    </div>

                    {dateFilter === 'Custom' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                value={customRange.start}
                                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                                className="border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                value={customRange.end}
                                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                                className="border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    )}

                    <button
                        onClick={loadData}
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Sales */}
                <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]">
                    <div>
                        <div className="text-orange-100 text-sm font-medium mb-1">Total Sales</div>
                        <div className="text-2xl font-bold mb-1">₹{stats.totalIncome.toLocaleString()}</div>
                        <div className="text-sm font-medium opacity-90">{stats.totalOrders} Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Online Orders - Sum of delivery/online */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-blue-200 transition-transform hover:scale-[1.02]">
                    <div>
                        <div className="text-blue-100 text-sm font-medium mb-1">Online Orders</div>
                        <div className="text-2xl font-bold mb-1">₹{stats.deliveryTotal?.toLocaleString() || 0}</div>
                        <div className="text-sm font-medium opacity-90">{stats.deliveryCount || 0} Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Monitor className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Takeaway */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-teal-200 transition-transform hover:scale-[1.02]">
                    <div>
                        <div className="text-teal-100 text-sm font-medium mb-1">Takeaway</div>
                        <div className="text-2xl font-bold mb-1">₹{stats.takeAwayTotal?.toLocaleString() || 0}</div>
                        <div className="text-sm font-medium opacity-90">{stats.takeAwayCount || 0} Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Dine-In */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white flex justify-between items-center shadow-lg shadow-purple-200 transition-transform hover:scale-[1.02]">
                    <div>
                        <div className="text-purple-100 text-sm font-medium mb-1">Dine-In</div>
                        <div className="text-2xl font-bold mb-1">₹{stats.dineInTotal?.toLocaleString() || 0}</div>
                        <div className="text-sm font-medium opacity-90">{stats.dineInCount || 0} Orders</div>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <UtensilsCrossed className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Revenue Analytics</h3>
                            <p className="text-sm text-gray-500">Sales performance over time</p>
                        </div>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={safeChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="revenue" fill="#F97316" radius={[4, 4, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Customer Type Doughnut */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Customer Type</h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={customerTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {customerTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none pb-8">
                            <div className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</div>
                            <div className="text-xs text-gray-500">Customers</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders & Top Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
                        <button className="text-sm text-orange-500 font-semibold hover:text-orange-600">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-xs text-gray-400 uppercase font-semibold border-b border-gray-100 dark:border-gray-700">
                                <tr>
                                    <th className="pb-3 pl-2">Source & Type</th>
                                    <th className="pb-3">Order No.</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                {recentOrders.map((order, idx) => {
                                    const source = (order.source || 'POS').toLowerCase();
                                    const type = (order.type || 'Takeaway').toLowerCase();

                                    return (
                                        <tr key={order.id || idx} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="py-3 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm ${source.includes('swiggy') ? 'bg-orange-100 text-orange-600' :
                                                            source.includes('zomato') ? 'bg-red-100 text-red-600' :
                                                                source.includes('online') ? 'bg-blue-100 text-blue-600' :
                                                                    'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {source.includes('swiggy') ? 'SWI' :
                                                            source.includes('zomato') ? 'ZOM' :
                                                                source.includes('online') ? 'ONL' : 'POS'}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-200 text-sm capitalize">{order.customerName || 'Guest'}</div>
                                                        <div className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold">{type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{order.orderNumber}</div>
                                                <div className="text-[10px] text-gray-400 font-medium">
                                                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <div className="font-black text-gray-900 dark:text-gray-100 text-sm">₹{parseFloat(order.totalAmount).toLocaleString()}</div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                                                            order.status === 'preparing' || order.status === 'placed' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {recentOrders.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-gray-400 text-sm font-medium italic">No recent transactions found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Selling Items */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Items</h3>
                    <div className="space-y-4">
                        {topItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-800 text-sm">{item.itemName}</h4>
                                    <div className="text-xs text-gray-500">{item.count} sold</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800 text-sm">₹{parseFloat(item.totalValue).toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                        {topItems.length === 0 && <div className="text-center text-gray-500 text-sm">No sales data yet</div>}
                    </div>
                </div>
            </div>

            {/* Low Stock Alert Section */}
            {lowStockItems.length > 0 && (
                <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-red-100 rounded-full text-red-600"><AlertTriangle className="w-5 h-5" /></div>
                        <h3 className="text-lg font-bold text-gray-800">Low Stock Alerts</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {lowStockItems.map(item => (
                            <div key={item.id} className="p-3 border border-red-100 bg-red-50/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                                    <div className="text-xs text-gray-500">Min: {item.minStockLevel} {item.unit}</div>
                                </div>
                                <div className="text-red-600 font-bold text-lg">{item.currentStock}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
