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
        <div className="min-h-screen p-4 bg-[#f8f9fa] font-sans">
            {/* Header Area - Ultra Compact */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-2">
                        Inventory<span className="text-red-600">.AI</span>
                        <span className="px-2 py-0.5 bg-red-50 text-[10px] text-red-600 rounded-lg border border-red-100 uppercase tracking-widest font-black">Live</span>
                    </h1>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Live Operations Center</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-sm">
                        <Search className="w-3.5 h-3.5 text-gray-400 mr-2" />
                        <input type="text" placeholder="Search operations..." className="bg-transparent border-none outline-none text-xs font-bold text-gray-600 w-40" />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-gray-700">
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> AI Insights
                    </button>
                    <button onClick={loadStats} className={`w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full shadow-lg transition-all ${loading ? 'animate-spin' : 'hover:scale-110 active:scale-95'}`}>
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* HIGH-DENSITY GRID */}
            <div className="grid grid-cols-12 gap-5">

                {/* 1. Margin & Analysis - Left Large Card */}
                <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[2.5rem] p-1 shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                    <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 bg-gray-950/40 backdrop-blur-3xl rounded-[2.3rem] p-8 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[9px] font-black uppercase tracking-widest">Critical Alert</span>
                                <h2 className="text-4xl font-black text-white leading-tight tracking-tighter">Margin Analysis<br />Dashboard</h2>
                                <p className="text-gray-400 text-sm font-medium max-w-xs leading-relaxed">
                                    Your estimated margin gap is <span className="text-white font-black">{stats.marginGap}%</span>. Operating within standard protocol.
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-6xl font-black text-white tracking-tighter italic">{stats.marginGap}%</div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2">Variance Prob.</div>
                            </div>
                        </div>

                        {/* Visual Graph Area */}
                        <div className="mt-8 flex items-end gap-1.5 h-32 px-2">
                            {[40, 55, 30, 65, 45, 80, 50, 45, 70, 40, 90, 60, 55, 75, 50, 65, 45, 85, 40, 30].map((h, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-t-lg transition-all duration-700 hover:opacity-100 cursor-help ${i > 15 ? 'bg-gradient-to-t from-red-600 to-red-400 opacity-100 shadow-[0_0_15px_rgba(220,38,38,0.4)]' : 'bg-white/10 opacity-40 hover:bg-white/20'}`}
                                    style={{ height: `${h}%` }}
                                    title={`Interval ${i}: ${h}%`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Stock Value Card */}
                <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between group hover:border-red-100 transition-all cursor-pointer">
                    <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <DollarSign className="w-7 h-7" />
                        </div>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <ArrowUpRight className="w-3 h-3" /> Current
                        </span>
                    </div>
                    <div className="mt-10">
                        <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest leading-none">Stock Value</h3>
                        <p className="text-[10px] font-bold text-gray-400 mt-2">Total assets and inventory on hand.</p>
                        <h2 className="text-5xl font-black text-emerald-600 tracking-tighter mt-6 italic">₹{stats.totalStockValue?.toLocaleString()}</h2>
                    </div>
                </div>

                {/* 3. Operational Stats Trio */}
                <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Active Items */}
                    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-6 text-white shadow-xl shadow-indigo-500/20 flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Layers className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black leading-none">{stats.totalItems}</h3>
                            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Active Materials</p>
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-xl flex items-center gap-6 group hover:border-red-200 transition-all">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-50 text-gray-400'}`}>
                            <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className={`text-3xl font-black leading-none ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.lowStockCount}</h3>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Need Restocking</p>
                        </div>
                    </div>

                    {/* Monthly Wastage */}
                    <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-xl flex items-center gap-6 group hover:border-orange-200 transition-all">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <TrendingDown className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 leading-none">₹{stats.totalWastage}</h3>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monthly Wastage</p>
                        </div>
                    </div>
                </div>

                {/* 4. RECENT ACTIVITY LIST (Compact) */}
                <div className="col-span-12 md:col-span-8 bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <History className="w-4 h-4 text-red-500" /> Recent Inventory Movement
                        </h3>
                        <button className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline transition-all">View All History</button>
                    </div>
                    <div className="space-y-4">
                        {(stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity : [
                            { name: 'No Recent Activity', type: 'System', qty: '---', time: new Date() }
                        ]).map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.qty?.toString().startsWith('+') ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                        <Activity className={`w-5 h-5 ${item.qty?.toString().startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-gray-800">{item.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.type} {item.notes ? `• ${item.notes}` : ''}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs font-black ${item.qty?.toString().startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>{item.qty}</div>
                                    <div className="text-[10px] text-gray-300 font-black flex items-center justify-end gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. PROCUREMENT OVERVIEW */}
                <div className="col-span-12 md:col-span-4 bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-red-600/30 blur-[60px]"></div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-white" /> Procurement AI
                    </h3>

                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending Orders</span>
                                <span className="px-2 py-0.5 bg-white/10 rounded-md text-xs font-black">{stats.pendingOrders?.toString().padStart(2, '0') || '00'}</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (stats.pendingOrders || 0) * 20)}%` }}></div>
                            </div>
                        </div>

                        <div className="p-5 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                            <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />
                            <h4 className="text-sm font-bold leading-snug">
                                {stats.lowStockCount > 0
                                    ? `Restock required for ${stats.lowStockCount} items to maintain service levels.`
                                    : "Inventory levels are currently within safe operational limits."}
                            </h4>
                            <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Generate POs</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

