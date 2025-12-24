import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, DollarSign, Search, ChevronDown, RefreshCw, SlidersHorizontal, Settings, FileText, ArrowRight, TrendingUp } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function InventoryDashboard() {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockCount: 0,
        totalStockValue: 0,
        totalWastage: 0
    });
    const [industryMargin] = useState(45);
    const [actualMargin] = useState(0);

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
        <div className="flex flex-col space-y-8 font-sans pb-10 relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-400/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

            {/* Header / Intro */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 tracking-tight">
                        Inventory Overview
                    </h1>
                    <p className="text-gray-500 font-medium mt-2 text-lg">Real-time tracking of stock, recipes, and procurement.</p>
                </div>
                <button className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 shadow-lg shadow-gray-200/20 hover:bg-white/80 transition-all font-bold text-gray-700 dark:bg-gray-800/50 dark:text-gray-200 dark:border-gray-700">
                    <RefreshCw className="w-4 h-4" /> Refresh Data
                </button>
            </div>

            {/* Margin Insights Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-800/40 dark:to-gray-900/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-violet-500/5 dark:from-rose-500/10 dark:to-violet-500/10"></div>

                <div className="relative bg-white/60 dark:bg-gray-900/60 rounded-[2.3rem] p-8 md:p-10">
                    <div className="flex flex-col md:flex-row justify-between gap-12">
                        {/* Left: Text & Progress */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-white">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    Margin Insights
                                </h2>
                                <p className="text-gray-500 mt-2 font-medium leading-relaxed max-w-lg">
                                    Your current margin is significantly lower than the industry standard of 45%.
                                    Optimize recipes to improve profitability.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm font-bold text-gray-600 dark:text-gray-300 px-1">
                                    <span>Actual: {actualMargin}%</span>
                                    <span>Target: {industryMargin}%</span>
                                </div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative shadow-inner">
                                    {/* Actual Margin Bar */}
                                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full transition-all duration-1000" style={{ width: `${Math.max(5, actualMargin)}%` }}></div>

                                    {/* Target Marker */}
                                    <div className="absolute top-0 bottom-0 w-1 bg-gray-800 dark:bg-white/50 backdrop-blur" style={{ left: `${industryMargin}%` }}></div>
                                </div>
                                <p className="text-xs font-bold text-gray-400 text-right uppercase tracking-wider">Gap: {industryMargin - actualMargin}%</p>
                            </div>
                        </div>

                        {/* Right: Stats Cards */}
                        <div className="flex gap-6">
                            <div className="flex-1 min-w-[180px] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-xl flex flex-col justify-center items-center text-center">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Current</span>
                                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-500 dark:from-white dark:to-gray-400">{actualMargin}%</span>
                            </div>
                            <div className="flex-1 min-w-[180px] bg-gradient-to-br from-rose-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl shadow-rose-500/20 flex flex-col justify-center items-center text-center">
                                <span className="text-sm font-bold text-white/70 uppercase tracking-widest mb-2">Projected</span>
                                <span className="text-5xl font-black text-white">36%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main CTA Card */}
                <div className="md:col-span-1 bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                                <Package className="w-7 h-7 text-rose-400" />
                            </div>
                            <h3 className="text-3xl font-bold leading-tight mb-2">
                                <span className="text-rose-400">{stats.totalItems}</span> Items<br />in Inventory
                            </h3>
                            <p className="text-gray-400 font-medium">42 recipes pending approval.</p>
                        </div>
                        <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm mt-8 hover:bg-gray-100 transition-colors flex items-center gap-2 w-max">
                            Review Actions <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Glassy Stat Cards */}
                <GlassAnalysisCard
                    title="Stock Value"
                    value={`₹ ${stats.totalStockValue.toLocaleString()}`}
                    trend="+12% from last month"
                    icon={DollarSign}
                    color="text-emerald-600"
                    bg="bg-emerald-100"
                />
                <GlassAnalysisCard
                    title="Low Stock"
                    value={stats.lowStockCount}
                    trend="Requires attention"
                    icon={AlertTriangle}
                    color="text-rose-600"
                    bg="bg-rose-100"
                />
            </div>

            {/* Detailed Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Stock Health */}
                <div className="lg:col-span-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Stock Health</h3>
                            <p className="text-sm text-gray-500 font-medium">Overview of inventory levels and wastage.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-white dark:bg-gray-700 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">Daily</button>
                            <button className="px-4 py-2 bg-transparent text-gray-500 font-bold rounded-xl text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">Weekly</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <HealthMetric label="Total Items" value={stats.totalItems} sub="Active SKUs" />
                        <HealthMetric label="Wastage" value={`₹ ${stats.totalWastage}`} sub="See breakdown" color="text-rose-600" />
                        <HealthMetric label="Below Par" value="0" sub="Items" />
                        <HealthMetric label="Out of Stock" value="0" sub="Urgent" color="text-orange-500" />
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800/30">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl text-rose-500 shadow-sm">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-rose-700 dark:text-rose-400">Critical Alerts</h4>
                                    <p className="text-xs text-rose-600/80 dark:text-rose-400/80">You have no critical alerts at this time.</p>
                                </div>
                            </div>
                            <button className="text-xs font-bold text-rose-600 hover:text-rose-700">View All</button>
                        </div>
                    </div>
                </div>

                {/* Insight Columns */}
                <div className="space-y-6">
                    <InsightActionCard
                        title="COGS Breakdown"
                        desc="Analyze ingredient-level cost drivers to optimize spend."
                        label="Update Master"
                        gradient="from-blue-500 to-cyan-500"
                    />
                    <InsightActionCard
                        title="Supplier Performance"
                        desc="Track fulfillment rates and delivery times."
                        label="View Report"
                        gradient="from-violet-500 to-purple-500"
                    />
                </div>
            </div>
        </div>
    );
}

function GlassAnalysisCard({ title, value, trend, icon: Icon, color, bg }) {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700 p-8 rounded-[2.5rem] shadow-xl hover:-translate-y-1 transition-transform duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/50 border border-white/20 ${color.replace('text', 'text')}`}>
                    Live
                </span>
            </div>
            <div>
                <p className="text-gray-500 font-bold text-sm tracking-wide uppercase mb-1">{title}</p>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{value}</h3>
                <p className="text-sm font-medium text-gray-400">{trend}</p>
            </div>
        </div>
    );
}

function HealthMetric({ label, value, sub, color = "text-gray-900 dark:text-white" }) {
    return (
        <div className="bg-white/50 dark:bg-gray-700/30 p-4 rounded-3xl border border-gray-100 dark:border-gray-600 text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <h4 className={`text-2xl font-black ${color} mb-1`}>{value}</h4>
            <p className="text-[10px] font-bold text-gray-400">{sub}</p>
        </div>
    );
}

function InsightActionCard({ title, desc, label, gradient }) {
    return (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-white/40 dark:border-gray-700 p-6 rounded-[2rem] shadow-lg flex flex-col justify-between h-auto">
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{desc}</p>
            </div>
            <button className={`w-full py-3 rounded-xl bg-gradient-to-r ${gradient} text-white font-bold text-sm shadow-lg opacity-90 hover:opacity-100 transition-opacity`}>
                {label}
            </button>
        </div>
    );
}
