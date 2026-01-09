import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, DollarSign, Search, ChevronRight, Zap, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Layers, History, ShoppingCart, Clock } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function InventoryDashboard() {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockCount: 0,
        totalStockValue: 0,
        totalWastage: 0,
        marginGap: 2.4, // Default/Dummy for visual
        transactions: [],
        pendingOrders: 5
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const res = await inventoryService.getStats();
            setStats(prev => ({ ...prev, ...res.data }));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50 font-sans">
            {/* Header Area */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Inventory Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Live Operations Center</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none text-sm text-gray-700 w-48" />
                    </div>
                    <button onClick={loadStats} className={`flex items-center justify-center border border-gray-200 rounded-lg transition-all ${loading ? 'animate-spin' : ''}`}>
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="flex items-center gap-2 rounded-lg font-medium shadow-sm transition-all">
                        <Zap className="w-4 h-4" /> AI Insights
                    </button>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-12 gap-6">

                {/* 1. Margin & Analysis */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                            <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-xs font-semibold border border-red-100">Critical Alert</span>
                            <h2 className="text-xl font-bold text-gray-900">Margin Analysis Dashboard</h2>
                            <p className="text-gray-500 text-sm">
                                Your estimated margin gap is <span className="text-gray-900 font-bold">{stats.marginGap}%</span>. Operating within standard protocol.
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-gray-900">{stats.marginGap}%</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase font-semibold">Variance Prob.</div>
                        </div>
                    </div>

                    {/* Visual Graph Area used to be here, keeping simplified or removing if too custom. Keeping basic bars but simplified styles */}
                    <div className="mt-4 flex items-end gap-1 h-32">
                        {[40, 55, 30, 65, 45, 80, 50, 45, 70, 40, 90, 60, 55, 75, 50, 65, 45, 85, 40, 30].map((h, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-t-sm transition-all ${i > 15 ? 'bg-red-500' : 'bg-gray-200'}`}
                                style={{ height: `${h}%` }}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* 2. Stock Value Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-lg p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-semibold">
                            <ArrowUpRight className="w-3 h-3" /> Current
                        </span>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase">Stock Value</h3>
                        <p className="text-xs text-gray-400 mt-1">Total assets and inventory on hand.</p>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalStockValue?.toLocaleString()}</h2>
                    </div>
                </div>

                {/* 3. Operational Stats Trio */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Items */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalItems}</h3>
                            <p className="text-gray-500 text-xs font-semibold uppercase mt-0.5">Active Materials</p>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.lowStockCount}</h3>
                            <p className="text-gray-500 text-xs font-semibold uppercase mt-0.5">Need Restocking</p>
                        </div>
                    </div>

                    {/* Monthly Wastage */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                            <TrendingDown className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalWastage}</h3>
                            <p className="text-gray-500 text-xs font-semibold uppercase mt-0.5">Monthly Wastage</p>
                        </div>
                    </div>
                </div>

                {/* 4. RECENT ACTIVITY LIST */}
                <div className="col-span-12 md:col-span-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase flex items-center gap-2">
                            <History className="w-4 h-4 text-gray-500" /> Recent Inventory Movement
                        </h3>
                        <button className="font-semibold hover:underline">View All History</button>
                    </div>
                    <div className="space-y-3">
                        {(stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity : [
                            { name: 'No Recent Activity', type: 'System', qty: '---', time: new Date() }
                        ]).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.qty?.toString().startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                                        <p className="text-xs text-gray-500">{item.type} {item.notes ? `• ${item.notes}` : ''}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold ${item.qty?.toString().startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>{item.qty}</div>
                                    <div className="text-xs text-gray-400 flex items-center justify-end gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. PROCUREMENT OVERVIEW */}
                <div className="col-span-12 md:col-span-4 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-6 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-500" /> Procurement Status
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Pending Orders</span>
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-bold text-gray-700">{stats.pendingOrders?.toString().padStart(2, '0') || '00'}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (stats.pendingOrders || 0) * 20)}%` }}></div>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg space-y-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            <h4 className="text-sm text-gray-800 leading-snug">
                                {stats.lowStockCount > 0
                                    ? `Restock required for ${stats.lowStockCount} items.`
                                    : "Inventory levels are good."}
                            </h4>
                            <button className="border border-amber-200 rounded-lg font-bold uppercase transition-colors">Generate POs</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

