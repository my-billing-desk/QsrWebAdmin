import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, DollarSign, Search, ChevronRight, Zap, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, Layers } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function InventoryDashboard() {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockCount: 0,
        totalStockValue: 0,
        totalWastage: 0,
        marginGap: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await inventoryService.getStats();
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen p-2 font-dm-sans">
            {/* Dynamic background blobs for depth */}
            <div className="fixed top-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse"></div>
            <div className="fixed bottom-20 left-20 w-96 h-96 bg-rose-600/20 rounded-full blur-[128px] pointer-events-none -z-10 animate-pulse delay-700"></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8 px-2">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500 tracking-tighter">
                        Inventory<span className="text-rose-500">.AI</span>
                    </h1>
                    <p className="text-gray-400 font-bold tracking-wide text-xs uppercase mt-1 ml-1">Live Operations Center</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md border border-white/10 rounded-full text-sm font-bold shadow-lg hover:shadow-rose-500/20 hover:scale-105 transition-all text-gray-700 dark:text-white">
                        <Zap className="w-4 h-4 text-amber-400" />
                        AI Insights
                    </button>
                    <button onClick={loadStats} className="w-12 h-12 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-xl hover:rotate-180 transition-transform duration-700">
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 grid-rows-[auto_auto_auto]">

                {/* 1. HERO - Margin Analysis (Large: 4x2) */}
                <div className="col-span-1 md:col-span-4 lg:col-span-4 row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-2xl shadow-black/20 border border-white/5">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                    <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-rose-500/30 rounded-full blur-[100px] group-hover:bg-rose-500/40 transition-colors duration-500"></div>

                    <div className="relative z-10 p-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-widest mb-4">CRITICAL ALERT</span>
                                <h2 className="text-5xl font-black leading-tight mb-2 tracking-tight">Margin Analysis<br />Dashboard</h2>
                                <p className="text-gray-400 max-w-sm text-lg font-medium leading-relaxed">
                                    Your estimated margin gap is <span className="text-white font-bold">{stats.marginGap}%</span>.
                                    {stats.marginGap > 10 ? ' High variance detected.' : ' Operating within standard.'}
                                </p>
                            </div>
                            <div className="text-right">
                                <h3 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 tracking-tighter">{stats.marginGap}%</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Variance</p>
                            </div>
                        </div>

                        {/* Interactive Graph Area */}
                        <div className="w-full h-32 bg-white/5 rounded-3xl mt-8 border border-white/5 flex items-end justify-between px-2 pb-2 gap-1 group-hover:scale-[1.02] transition-transform duration-500">
                            {[30, 45, 25, 60, 40, 75, 50, 45, 65, 30, 55, 40, 60, 35, 80].map((h, i) => (
                                <div key={i} className={`w-full bg-gradient-to-t ${i > 10 ? 'from-rose-500/80 to-rose-400' : 'from-gray-700 to-gray-600'} rounded-t-lg transition-all duration-500 hover:opacity-100 opacity-80`} style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Stock Value (Tall: 2x2) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-white dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 dark:border-gray-700 shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
                    <div>
                        <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:rotate-12 transition-transform duration-300">
                            <DollarSign className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Stock Value</h3>
                        <p className="text-sm text-gray-500 font-medium">Total assets on hand.</p>
                    </div>
                    <div>
                        <h2 className="text-5xl font-black text-emerald-500 tracking-tight my-4">₹{stats.totalStockValue?.toLocaleString() || 0}</h2>
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl w-max">
                            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                            <span className="text-xs font-bold">Current</span>
                        </div>
                    </div>
                </div>

                {/* 3. QUICK ACTIONS (Square: 2x1) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-500/30 flex flex-col justify-between group overflow-hidden relative">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <Layers className="w-8 h-8 opacity-80 mb-4" />
                        <h3 className="text-3xl font-bold leading-none mb-1">{stats.totalItems} Items</h3>
                        <p className="text-indigo-200 text-sm font-medium">Active Inventory</p>
                    </div>
                    <div className="relative z-10 flex justify-end">
                        <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 4. LOW STOCK (Square: 2x1) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800/60 backdrop-blur-xl border border-rose-100 dark:border-rose-900/30 rounded-[2.5rem] p-8 shadow-xl flex flex-col justify-between group hover:border-rose-300 transition-all">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/50 rounded-full flex items-center justify-center text-rose-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black bg-rose-100 text-rose-600 px-3 py-1 rounded-full uppercase">Urgent</span>
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-rose-500">{stats.lowStockCount}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Items Low Stock</p>
                    </div>
                </div>

                {/* 5. WASTAGE (Square: 2x1) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-gray-50 dark:bg-gray-800/40 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-[2.5rem] p-8 flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 transition-all">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Wastage</p>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white">₹{stats.totalWastage?.toLocaleString() || 0}</h3>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <TrendingDown className="w-6 h-6 text-gray-500" />
                    </div>
                </div>

                {/* 6. AI INSIGHTS BAR (Wide: 6x1) */}
                <div className="col-span-1 md:col-span-4 lg:col-span-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 rounded-[2rem] p-1 shadow-2xl">
                    <div className="h-full w-full bg-gray-900 dark:bg-white rounded-[1.8rem] flex items-center justify-between px-8 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
                                <Zap className="w-5 h-5 text-white fill-white" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white dark:text-gray-900">AI Recommendation</h4>
                                <p className="text-xs text-gray-400 dark:text-gray-500">Based on consumption patterns</p>
                            </div>
                        </div>
                        <p className="hidden md:block text-sm text-gray-300 dark:text-gray-600 font-medium">
                            {stats.lowStockCount > 0 ? `Consider restocking ${stats.lowStockCount} critical items.` : "Inventory levels are healthy."}
                        </p>
                        <button className="px-5 py-2 bg-white/10 dark:bg-gray-100 rounded-xl text-xs font-bold text-white dark:text-gray-800 hover:bg-white/20 transition-colors">
                            View Details
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
