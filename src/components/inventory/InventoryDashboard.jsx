import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, DollarSign, Search, ChevronDown, RefreshCw, SlidersHorizontal, Settings, FileText, ArrowRight } from 'lucide-react';
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
        <div className="flex flex-col space-y-8 font-sans pb-10">
            {/* Header / Intro */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Inventory Overview</h1>
                    <p className="text-gray-500 font-medium mt-1">Real-time tracking of stock, recipes, and procurement.</p>
                </div>
                <button className="text-primary-600 font-bold text-sm bg-primary-50 px-4 py-2 rounded-xl border border-primary-100 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400">
                    Older Dashboard
                </button>
            </div>

            {/* Margin Insights */}
            <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50 to-primary-50 dark:from-indigo-900/20 dark:to-primary-900/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-50"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-bold font-display text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-primary-500" /> Margin Insights
                            </h2>
                            <p className="text-sm text-gray-500 font-medium mt-1 max-w-xl">Compare your current margins with industry standards to identify performance gaps.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="relative pt-8 md:col-span-1">
                            <div className="h-4 bg-gray-100 dark:bg-gray-700/50 rounded-full relative overflow-visible">
                                <div className="absolute top-0 left-0 h-full bg-primary-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" style={{ width: '0%' }}></div>

                                {/* Markers */}
                                <div className="absolute -top-10 left-[45%] -translate-x-1/2 flex flex-col items-center group cursor-help">
                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shadow-sm whitespace-nowrap z-10">Industry: 45%</span>
                                    <div className="w-0.5 h-4 bg-emerald-500 mt-1"></div>
                                </div>

                                <div className="absolute -bottom-10 left-0 flex flex-col items-center">
                                    <div className="w-0.5 h-3 bg-gray-300 mb-1"></div>
                                    <div className="text-xs font-bold text-gray-400">0%</div>
                                </div>
                                <div className="absolute -bottom-10 right-0 flex flex-col items-center">
                                    <div className="w-0.5 h-3 bg-gray-300 mb-1"></div>
                                    <div className="text-xs font-bold text-gray-400">100%</div>
                                </div>
                            </div>
                            <div className="mt-8 text-center">
                                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> Your Actual Margin: 0%
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 md:col-span-2">
                            <div className="bg-gray-50/80 dark:bg-gray-800/50 p-6 rounded-3xl text-center border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                <h3 className="text-4xl font-display font-bold text-gray-900 dark:text-gray-100">{actualMargin}%</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-2">Actual Margin</p>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800/50 p-6 rounded-3xl text-center border border-indigo-100 dark:border-indigo-800/30 hover:shadow-md transition-shadow">
                                <h3 className="text-4xl font-display font-bold text-primary-600 dark:text-primary-400">36%</h3>
                                <p className="text-xs font-bold text-primary-800/60 dark:text-primary-300 uppercase tracking-wide mt-2">Estimated Margin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/20 flex flex-col justify-between group">
                    <div>
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-display font-bold text-lg leading-tight mb-2">
                            {stats.totalItems} Items & 42 Recipes Ready
                        </h4>
                        <p className="text-indigo-100 text-sm opacity-80">AI-generated recipes pending approval.</p>
                    </div>
                    <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 w-max mt-6">
                        Review Now <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <StatCard count={stats.totalItems} label="Raw Materials" icon={Package} />
                <StatCard count={42} label="Recipes" icon={FileText} />
            </div>

            {/* Inventory Status Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold font-display ml-1">Current Status</h3>
                    <StatusCard label="Total Stock Value" value={`₹ ${stats.totalStockValue}`} />
                    <StatusCard label="Potentially Wasted" value="₹ 0" color="text-rose-500" />
                    <StatusCard label="Below Par Level" value="0" />
                    <StatusCard label="Below Min. Level" value={stats.lowStockCount} color="text-orange-500" />
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold font-display text-lg">Low Stock Alerts</h4>
                        <button className="text-xs font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-300">All Categories</button>
                    </div>

                    <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center mb-3">
                            <Search className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="font-bold text-gray-400 text-sm">No critical alerts found</p>
                        <p className="text-xs text-gray-400 mt-1">Everything looks good!</p>
                    </div>
                </div>
            </div>

            {/* COGS & Purchase - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InsightCard
                    title="COGS Breakdown"
                    desc="Analyze ingredient-level cost drivers."
                    action="Update Master"
                    color="blue"
                />
                <InsightCard
                    title="Purchase Insights"
                    desc="Track purchase trends and supplier performance."
                    action="View Report"
                    color="green"
                />
            </div>
        </div>
    );
}

function StatCard({ count, label, icon: Icon }) {
    return (
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-center items-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary-50 group-hover:text-primary-600">
                {Icon && <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary-600 transition-colors" />}
            </div>
            <h4 className="text-4xl font-display font-bold text-gray-900 dark:text-gray-100 mb-1">{count}</h4>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function StatusCard({ label, value, color = 'text-gray-900 dark:text-gray-100' }) {
    return (
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 p-5 rounded-2xl flex justify-between items-center shadow-sm hover:translate-x-1 transition-transform cursor-pointer group">
            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors">{label}</span>
            <span className={`font-bold text-lg ${color}`}>{value}</span>
        </div>
    );
}

function InsightCard({ title, desc, action, color }) {
    const colors = {
        blue: 'bg-blue-50/50 border-blue-100',
        green: 'bg-emerald-50/50 border-emerald-100'
    };

    return (
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur border border-gray-100 dark:border-gray-800 p-8 rounded-[2.5rem] shadow-sm">
            <h3 className="font-bold font-display text-lg mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{desc}</p>

            <div className={`p-8 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${colors[color] || 'bg-gray-50'}`}>
                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Detailed Analysis Required</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-4">Please update your records to generate this report.</p>
                <button className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {action}
                </button>
            </div>
        </div>
    );
}
