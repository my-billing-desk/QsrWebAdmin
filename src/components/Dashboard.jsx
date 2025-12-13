import React, { useState, useEffect } from 'react';
import {
    RotateCcw, MoreVertical, AlertTriangle, TrendingUp, HelpCircle
} from 'lucide-react';
import { dashboardService } from '../services/api';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgPerCustomer: 0,
        dineInTotal: 0,
        takeAwayTotal: 0,
        deliveryTotal: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [chartsData, setChartsData] = useState({ revenue: { labels: [], data: [] }, topItems: [] });
    // Using placeholder/hardcoded values for things we don't have endpoints for yet
    // like "Dine In" split in the stats object, though logic exists in controller to expand.

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const statsRes = await dashboardService.getStats();
            setStats(statsRes.data);

            const chartsRes = await dashboardService.getCharts();
            setChartsData(chartsRes.data);

            const recentRes = await dashboardService.getRecentOrders();
            setRecentOrders(recentRes.data);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full font-sans">
            {/* Top Sync Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px]">🕒</span>
                    <span>Order synced recently & POS synced recently.</span>
                </div>
                <div className="flex items-center gap-2">
                    <select className="bg-transparent border-none text-gray-600 font-medium outline-none">
                        <option>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</option>
                    </select>
                    <button onClick={fetchDashboardData} className="p-1 hover:bg-gray-100 rounded-full"><RotateCcw className="w-4 h-4" /></button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Sales */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 text-sm font-medium">Total Sales</span>
                        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                            📊
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.totalIncome}</div>
                    <div className="text-xs text-gray-500 font-medium">{stats.totalOrders} Orders</div>
                </div>

                {/* Dine In */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 text-sm font-medium">Dine In</span>
                        <div className="w-8 h-8 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center">
                            🍴
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.dineInTotal || 0}</div>
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">Actual</div>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* Take Away */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 text-sm font-medium">Take Away</span>
                        <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
                            🛍️
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.takeAwayTotal || 0}</div>
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">Actual</div>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                </div>

                {/* Delivery */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 text-sm font-medium">Delivery</span>
                        <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                            🛵
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.deliveryTotal || 0}</div>
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500 font-medium">Actual</div>
                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column (Sales Graph) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Sales</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 bg-white flex items-center gap-2">
                                📊 Bar Chart <span className="text-[10px]">▼</span>
                            </button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">
                                Pi
                            </button>
                            <button className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 bg-white flex items-center gap-2">
                                Today <span className="text-[10px]">▼</span>
                            </button>
                            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50"><RotateCcw className="w-3 h-3 text-gray-500" /></button>
                        </div>
                    </div>

                    {/* Simple Bar Chart Visualization based on Total Sales */}
                    <div className="h-64 flex flex-col justify-end relative">
                        <div className="absolute top-0 right-0 flex gap-4 text-xs">
                            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Sales</div>
                        </div>

                        <div className="flex items-end h-full relative" style={{ alignItems: 'flex-end', justifyContent: 'space-around' }}>
                            {chartsData.revenue.labels.length > 0 ? (
                                chartsData.revenue.labels.map((label, idx) => (
                                    <div key={idx} className="flex flex-col items-center group relative w-full">
                                        <div className="text-xs font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-white p-1 rounded shadow">₹ {chartsData.revenue.data[idx]}</div>
                                        <div
                                            className="w-8 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-300"
                                            style={{ height: `${Math.min((chartsData.revenue.data[idx] / Math.max(...chartsData.revenue.data, 1)) * 200, 200)}px`, minHeight: '4px' }}
                                        ></div>
                                        <div className="text-[10px] text-gray-400 mt-2 truncate max-w-full">{new Date(label).toLocaleDateString(undefined, { weekday: 'short' })}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 flex items-center justify-center w-full h-full pb-8">No recent sales data</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="space-y-4">
                    {/* Order Statistics */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                                <span>📑</span> Order Statistics
                            </div>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 border border-gray-200 rounded text-[10px] font-medium text-gray-600 flex items-center gap-1">
                                    Today ▼
                                </button>
                                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><RotateCcw className="w-3 h-3 text-gray-400" /></button>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                            <div><span className="font-bold text-gray-800">{stats.totalOrders}</span> Successful</div>
                            <div><span className="font-bold text-gray-800">0</span> Cancel</div>
                            <div><span className="font-bold text-gray-800">0</span> Complimentary</div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>🕒</span> Table turn around time is -- min Avg.
                        </div>
                    </div>

                    {/* Revenue Leakage */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                                <AlertTriangle className="w-4 h-4 text-gray-500" /> Revenue Leakage
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <div className="text-xs font-bold text-gray-700 mb-2">Bills:</div>
                                <div className="flex justify-between text-xs text-gray-500"><span>0 Modified</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>0 Re-Printed</span></div>
                            </div>
                            <div className="w-px bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="text-xs font-bold text-gray-700 mb-2">KOTs:</div>
                                <div className="flex justify-between text-xs text-gray-500"><span>0 Cancelled</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>0 Modified</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Google Business Widget */}
                </div>

                {/* Recent Orders List - replacing Google widget for now or adding above it */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                            <span>📦</span> Recent Orders
                        </div>
                    </div>
                    <div className="space-y-3">
                        {recentOrders.map(order => (
                            <div key={order.id} className="flex justify-between items-center text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                <div>
                                    <div className="font-bold text-gray-800">#{order.orderNumber}</div>
                                    <div className="text-gray-500">{order.customerName || 'Guest'}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-800">₹ {order.totalAmount}</div>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentOrders.length === 0 && <div className="text-gray-400 text-xs text-center">No recent orders</div>}
                    </div>
                </div>
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-900 transition-colors">
                    <span className="text-xl">💬</span>
                </button>
            </div>
        </div >
    );
}
