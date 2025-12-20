import React, { useState, useEffect } from 'react';
import {
    RotateCcw, MoreVertical, AlertTriangle, TrendingUp, HelpCircle, Clock
} from 'lucide-react';
import { dashboardService, settingsService } from '../services/api';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalOrders: 0,
        totalCustomers: 0,
        avgPerCustomer: 0,
        dineInTotal: 0,
        takeAwayTotal: 0,
        deliveryTotal: 0,
        dineInCount: 0,
        takeAwayCount: 0,
        deliveryCount: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [chartsData, setChartsData] = useState({ revenue: { labels: [], data: [] }, topItems: [] });
    const [settings, setSettings] = useState({
        store_dinein_enabled: 'true',
        store_takeaway_enabled: 'true',
        store_delivery_enabled: 'true'
    });

    const [salesDateRange, setSalesDateRange] = useState(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { label: 'Today', start, end };
    });
    const [isSalesDropdownOpen, setIsSalesDropdownOpen] = useState(false);

    const [dateRange, setDateRange] = useState(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
        return { label: 'Today', start, end };
    });
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [dateRange]); // Fetch when range changes

    useEffect(() => {
        fetchSalesData();
    }, [salesDateRange]);

    const getRangeDates = (option) => {
        let start = new Date();
        let end = new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (option === 'Yesterday') {
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() - 1);
            end.setHours(23, 59, 59, 999);
        } else if (option === 'Last 7 Days') {
            start.setDate(start.getDate() - 6);
        } else if (option === 'Last 30 Days') {
            start.setDate(start.getDate() - 29);
        } else if (option === 'This Month') {
            start.setDate(1);
        } else if (option === 'Last Month') {
            start.setMonth(start.getMonth() - 1);
            start.setDate(1);
            end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
        }
        return { start, end };
    };

    const handleDateRangeSelect = (option) => {
        if (option === 'Custom Range') {
            // Placeholder for now, or just alert
            alert("Custom Range picker not implemented yet");
            setIsDateDropdownOpen(false);
            return;
        }
        const { start, end } = getRangeDates(option);
        setDateRange({ label: option, start, end });
        setIsDateDropdownOpen(false);
    };

    const handleSalesDateSelect = (option) => {
        const { start, end } = getRangeDates(option);
        setSalesDateRange({ label: option, start, end });
        setIsSalesDropdownOpen(false);
    };

    const fetchSalesData = async () => {
        try {
            const params = {
                startDate: salesDateRange.start.toISOString(),
                endDate: salesDateRange.end.toISOString()
            };
            const res = await dashboardService.getCharts(params);
            setChartsData(res.data);
        } catch (err) {
            console.error("Failed to load charts", err);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const params = {
                startDate: dateRange.start.toISOString(),
                endDate: dateRange.end.toISOString()
            };

            const [statsRes, recentRes, settingsRes] = await Promise.all([
                dashboardService.getStats(params), // Updated api.js needed? No, axios handles params if 2nd arg? Wait, my api wrapper needs check.
                dashboardService.getRecentOrders(),
                settingsService.getSettings()
            ]);

            setStats(statsRes.data);
            setRecentOrders(recentRes.data);
            if (settingsRes.data) {
                setSettings(prev => ({ ...prev, ...settingsRes.data }));
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50/50 min-h-full font-sans">
            {/* Top Sync Bar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between text-sm text-gray-500 mb-6 relative">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>Order synced {stats.syncStatus?.orderSynced || '...'} & POS synced {stats.syncStatus?.posSynced || '...'}.</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Date Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                            {dateRange.label === 'Today' || dateRange.label === 'Yesterday' ? dateRange.label :
                                `${dateRange.start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${dateRange.end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                            <span className="text-[10px] ml-1">▼</span>
                        </button>

                        {isDateDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleDateRangeSelect(opt)}
                                        className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors
                                            ${dateRange.label === opt ? 'bg-red-50 text-red-600' : 'text-gray-700'}
                                        `}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Refresh Button */}
                    <button onClick={fetchDashboardData} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Sales */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-500 text-sm font-medium">Total Sales</span>
                        <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats?.totalIncome?.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 font-medium">{stats.totalOrders} Orders</div>
                </div>

                {/* Dine In - Conditionally Rendered */}
                {settings.store_dinein_enabled !== 'false' && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-sm font-medium">Dine In</span>
                            <div className="w-8 h-8 bg-cyan-50 text-cyan-500 rounded-full flex items-center justify-center">
                                🍴
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.dineInTotal?.toLocaleString() || 0}</div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500 font-medium">{stats.dineInCount || 0} Orders</div>
                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}

                {/* Take Away - Conditionally Rendered */}
                {settings.store_takeaway_enabled !== 'false' && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-sm font-medium">Take Away</span>
                            <div className="w-8 h-8 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
                                🛍️
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.takeAwayTotal?.toLocaleString() || 0}</div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500 font-medium">{stats.takeAwayCount || 0} Orders</div>
                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}

                {/* Delivery - Conditionally Rendered */}
                {settings.store_delivery_enabled !== 'false' && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-gray-500 text-sm font-medium">Delivery</span>
                            <div className="w-8 h-8 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
                                🛵
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-800 mb-4">₹ {stats.deliveryTotal?.toLocaleString() || 0}</div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500 font-medium">{stats.deliveryCount || 0} Orders</div>
                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column (Sales Graph) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Sales</h3>
                        <div className="flex gap-2">
                            <div className="hidden md:flex items-center gap-4 text-[10px] mr-2">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Dine In</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Take Away</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Delivery</span>
                            </div>
                            <button className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 bg-white flex items-center gap-2">
                                📊 Bar Chart <span className="text-[10px]">▼</span>
                            </button>
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-bold shadow-sm">
                                Pi
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsSalesDropdownOpen(!isSalesDropdownOpen)}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-600 bg-white flex items-center gap-2"
                                >
                                    {salesDateRange.label} <span className="text-[10px]">▼</span>
                                </button>
                                {isSalesDropdownOpen && (
                                    <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                        {['Today', 'Yesterday', 'Last 7 Days', 'This Month', 'Last Month'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => handleSalesDateSelect(opt)}
                                                className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-gray-50 hover:text-red-600 transition-colors
                                                    ${salesDateRange.label === opt ? 'bg-red-50 text-red-600' : 'text-gray-700'}
                                                `}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="p-1.5 border border-gray-300 rounded hover:bg-gray-50"><RotateCcw className="w-3 h-3 text-gray-500" /></button>
                        </div>
                    </div>

                    {/* Simple Bar Chart Visualization based on Total Sales */}
                    <div className="h-64 flex flex-col justify-end relative">
                        {/* Dynamic Chart Area */}
                        <div className="flex items-end h-full relative" style={{ alignItems: 'flex-end', justifyContent: 'space-around' }}>
                            {chartsData && chartsData.revenue && chartsData.revenue.labels && chartsData.revenue.labels.length > 0 ? (
                                chartsData.revenue.labels.map((label, idx) => (
                                    <div key={idx} className="flex flex-col items-center group relative w-full">
                                        <div className="text-xs font-bold text-gray-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-white p-1 rounded shadow">₹ {chartsData.revenue.data[idx]}</div>
                                        <div
                                            className="w-12 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all duration-300 relative overflow-hidden"
                                            style={{ height: `${Math.min((chartsData.revenue.data[idx] / Math.max(...chartsData.revenue.data, 1)) * 200, 200)}px`, minHeight: '4px' }}
                                        >
                                            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-cyan-400"></div>
                                        </div>
                                        <div className="text-[10px] text-gray-400 mt-2 truncate w-full text-center px-1" title={label}>{label}</div>
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
                    {/* Google Business Widget */}
                    <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4 flex items-start gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-bl-full -mr-8 -mt-8"></div>
                        <div className="bg-white p-2 rounded-lg shadow-sm z-10">
                            <span className="text-xl">G</span>
                        </div>
                        <div className="flex-1 z-10">
                            <h4 className="font-bold text-gray-800 text-sm mb-1">Boost Your Outlet Visibility With Google Business</h4>
                            <p className="text-[10px] text-gray-500 mb-2">Complete your profile to...</p>
                        </div>
                        <button className="px-3 py-1 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded shadow-sm z-10 hover:bg-gray-50">
                            Update
                        </button>
                    </div>

                    {/* Order Statistics */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                                <span>📑</span> Order Statistics
                            </div>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 border border-gray-200 rounded text-[10px] font-medium text-gray-600 flex items-center gap-1">
                                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ▼
                                </button>
                                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><RotateCcw className="w-3 h-3 text-gray-400" /></button>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs text-center text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                            <div><div className="font-bold text-lg text-gray-800">{stats.orderStats?.successful || 0}</div> Successful</div>
                            <div className="w-px bg-gray-200"></div>
                            <div><div className="font-bold text-lg text-gray-800">{stats.orderStats?.cancelled || 0}</div> Cancel</div>
                            <div className="w-px bg-gray-200"></div>
                            <div><div className="font-bold text-lg text-gray-800">{stats.orderStats?.complimentary || 0}</div> Complimentary</div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>🕒</span> Table turn around time is 0 min Avg.
                        </div>
                    </div>

                    {/* Revenue Leakage */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                                <AlertTriangle className="w-4 h-4 text-orange-500" /> Revenue Leakage
                            </div>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 border border-gray-200 rounded text-[10px] font-medium text-gray-600 flex items-center gap-1">
                                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} ▼
                                </button>
                                <button className="p-1 border border-gray-200 rounded hover:bg-gray-50"><RotateCcw className="w-3 h-3 text-gray-400" /></button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-3">
                                <div className="text-sm font-bold text-gray-700">Bills:</div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{stats.leakage?.bills?.modified || 0} Modified</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{stats.leakage?.bills?.reprinted || 0} Re-Printed</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>₹ {stats.leakage?.bills?.waived || 0} Waived Off</span></div>
                            </div>
                            <div className="w-px bg-gray-100"></div>
                            <div className="flex-1 space-y-3">
                                <div className="text-sm font-bold text-gray-700">KOTs:</div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{stats.leakage?.kots?.cancelled || 0} Cancelled</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{stats.leakage?.kots?.modified || 0} Modified</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{stats.leakage?.kots?.notUsed || 0} Not Used In Bills</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{stats.leakage?.kots?.shifted || 0} Shifted</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings & Reviews */}
                    <div className="bg-green-50/50 rounded-xl border border-green-100 p-4">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                                <span>☺</span> Ratings & Reviews
                            </div>
                            <button className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-600 shadow-sm">
                                Yesterday ▼
                            </button>
                        </div>
                        <div className="flex justify-around items-center">
                            {/* Zomato Placeholder */}
                            <div className="flex items-center gap-2 opacity-60 grayscale">
                                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                                <span className="text-xs font-bold text-gray-700">Zomato</span>
                            </div>
                            {/* Swiggy Placeholder */}
                            <div className="flex items-center gap-2 opacity-60 grayscale">
                                <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                                <span className="text-xs font-bold text-gray-700">Swiggy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Online Orders */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 text-sm">Online Orders</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {stats.onlineStats?.map(item => (
                            <div key={item.name} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {item.name[0]}
                                    </div>
                                    <span className="text-xs font-bold text-gray-600">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-800">₹ {item.total?.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-400">{item.count} Orders</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Bifurcation */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 text-sm">Payment Bifurcation</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                        {stats.paymentStats && Object.entries(stats.paymentStats).map(([key, val]) => (
                            <div key={key} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold capitalize 
                                        ${key === 'cash' ? 'bg-green-50 text-green-600' :
                                            key === 'upi' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {key[0]}
                                    </div>
                                    <span className="text-xs font-bold text-gray-600 capitalize">{key}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-800">₹ {val.total?.toLocaleString()}</div>
                                    <div className="text-[10px] text-gray-400">{val.count} Orders</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expenses & Withdrawal */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 text-sm">Expenses & Withdrawal</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 gap-4">
                        <div className="bg-red-50 rounded-lg p-4 flex flex-col justify-center items-center border border-red-100">
                            <span className="text-xs font-bold text-red-500 mb-1">Total Expenses</span>
                            <span className="text-2xl font-bold text-gray-800">₹ {stats.expenseStats?.totalExpenses?.toLocaleString() || 0}</span>
                        </div>
                        <div className="bg-cyan-50 rounded-lg p-4 flex flex-col justify-center items-center border border-cyan-100">
                            <span className="text-xs font-bold text-cyan-600 mb-1">Total Withdrawal</span>
                            <span className="text-2xl font-bold text-gray-800">₹ {stats.expenseStats?.withdrawal?.toLocaleString() || 0}</span>
                        </div>
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
