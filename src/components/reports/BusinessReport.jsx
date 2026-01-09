import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/api';
import { FileText, TrendingUp, DollarSign, AlertTriangle, AlertCircle, ShoppingBag, CreditCard, PieChart as PieIcon, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

export function BusinessReport() {
    const [dates, setDates] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    const [stats, setStats] = useState(null);
    const [salesBreakdown, setSalesBreakdown] = useState({
        saleAction: [],
        itemAction: [],
        categoryAction: [],
        quantityAction: []
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('sale'); // sale, item, category, quantity

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = { startDate: dates.start, endDate: dates.end };

            // 1. Get Main Stats
            const statsRes = await dashboardService.getStats(params);
            setStats(statsRes.data);

            // 2. Get Sales Breakdowns
            // We need 4 calls or 1 call with varying params?
            // The backend `getSalesBreakdown` handles `type` (item/category) and `sort` (quantity/value).

            const [saleRes, itemRes, catRes, qtyRes] = await Promise.all([
                dashboardService.getSalesBreakdown({ ...params, type: 'item', sort: 'value' }),     // Sale Wise (Value)
                dashboardService.getSalesBreakdown({ ...params, type: 'item', sort: 'value' }),     // Item Wise (Value - user might mean Item Name)
                dashboardService.getSalesBreakdown({ ...params, type: 'category' }),                // Category Wise
                dashboardService.getSalesBreakdown({ ...params, type: 'item', sort: 'quantity' })   // Quantity Wise
            ]);

            setSalesBreakdown({
                saleAction: saleRes.data,
                itemAction: itemRes.data, // Same as sale (item wise by value)
                categoryAction: catRes.data,
                quantityAction: qtyRes.data
            });

        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !stats) return <div className="p-10 text-center">Loading Report...</div>;
    if (!stats) return <div className="p-10 text-center">No Data</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-indigo-600" />
                    Business Summary Report
                </h1>

                <div className="flex gap-4 items-center mt-4 md:mt-0">
                    <input
                        type="date"
                        value={dates.start}
                        onChange={(e) => setDates({ ...dates, start: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={dates.end}
                        onChange={(e) => setDates({ ...dates, end: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                    />
                    <button
                        onClick={fetchData}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors"
                    >
                        Generates
                    </button>
                </div>
            </div>

            {/* Row 1: Wastage, Revenue Leakage, Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Yield Wastage / Normal Loss */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Yield Wastage / Normal Loss
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Yield Wastage</span>
                            <span className="font-bold text-red-600">₹{(stats.wastageStats?.yieldWastage || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Normal Loss</span>
                            <span className="font-bold text-orange-600">₹{(stats.wastageStats?.normalLoss || 0).toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t flex justify-between">
                            <span className="font-bold text-gray-800">Total</span>
                            <span className="font-bold text-gray-900">₹{(stats.wastageStats?.total || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Revenue Leakage */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Revenue Leakage
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-500 text-xs">Bills Modified</div>
                            <div className="font-bold">0</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-500 text-xs">Bills Re-Printed</div>
                            <div className="font-bold">0</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-500 text-xs">Waived Off</div>
                            <div className="font-bold">0</div>
                        </div>
                        <div className="p-2 bg-red-50 rounded border border-red-100">
                            <div className="text-red-500 text-xs">Cancelled KOTs</div>
                            <div className="font-bold text-red-700">{stats.leakage?.kots?.cancelled || 0}</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-500 text-xs">Not Used in Bills</div>
                            <div className="font-bold">0</div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-500 text-xs">Shifted KOTs</div>
                            <div className="font-bold">0</div>
                        </div>
                    </div>
                </div>

                {/* Expenses */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Expenses & Withdrawals
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Expenses</span>
                            <span className="font-bold">₹{(stats.expenseStats?.totalExpenses || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                            <span className="text-sm font-medium text-green-800">Bank Deposit (Cash Withdrawal)</span>
                            <span className="font-bold text-green-700">₹{(stats.expenseStats?.withdrawal || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2: Sales Summary & Taxes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Total Sale Summary */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        Total Sale Summary
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Payment Details */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Payment Details</h4>
                            <div className="space-y-2">
                                {Object.entries(stats.paymentStats || {}).map(([mode, data]) => (
                                    <div key={mode} className="flex justify-between text-sm">
                                        <span className="capitalize text-gray-600">{mode}</span>
                                        <span className="font-medium">₹{data.total.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Order Stats */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Order Statistics</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-green-600">Success Orders</span>
                                    <span className="font-bold">{stats.orderStats.successful}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-red-600">Cancelled Orders</span>
                                    <span className="font-bold red-600">{stats.orderStats.cancelled}</span>
                                </div>
                                <div className="border-t my-2"></div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-600">Online Orders</span>
                                    <span className="font-bold">{stats.deliveryCount}</span>
                                </div>
                                {stats.onlineStats.map(stat => (
                                    <div key={stat.name} className="flex justify-between text-sm pl-2 border-l-2 border-gray-100">
                                        <span className="text-gray-500">{stat.name}</span>
                                        <span className="font-medium">{stat.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Taxes & Discounts */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-500" />
                        Taxes & Discounts
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                            <span className="font-bold text-purple-900">Total Discounts Given</span>
                            <span className="font-bold text-purple-700">₹{(stats.totalDiscount || 0).toLocaleString()}</span>
                        </div>

                        <div className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between text-sm font-bold text-gray-700">
                                <span>GST Collected</span>
                                <span>₹{(stats.taxStats?.gst || 0).toLocaleString()}</span>
                            </div>
                            <div className="border-t"></div>
                            <div className="text-xs text-gray-400 uppercase font-bold mt-2">Transaction Charges</div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Card Payment (1.8%)</span>
                                <span>₹{(stats.taxStats?.charges?.card || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Debit (1.5%)</span>
                                <span>₹{(stats.taxStats?.charges?.debit || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">UPI (&gt;1.5%)</span>
                                <span>₹{(stats.taxStats?.charges?.upi || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Sales Numbers (Top Selling) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-4">
                    <ShoppingBag className="w-4 h-4 text-indigo-500" />
                    Top Selling Sales Numbers
                </h3>

                {/* Tabs */}
                <div className="flex gap-2 border-b mb-6">
                    {['Sale Wise', 'Item Wise', 'Category Wise', 'Quantity Wise'].map(tab => {
                        const key = tab.split(' ')[0].toLowerCase();
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-gray-400 uppercase font-semibold bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-3">Rank</th>
                                <th className="p-3">{activeTab === 'category' ? 'Category Name' : 'Item Name'}</th>
                                <th className="p-3 text-right">Quantity Sold</th>
                                <th className="p-3 text-right">Total Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {salesBreakdown[`${activeTab}Action`]?.length > 0 ? (
                                salesBreakdown[`${activeTab}Action`].slice(0, 50).map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="p-3 text-gray-500 font-medium">#{idx + 1}</td>
                                        <td className="p-3 font-bold text-gray-700">
                                            {activeTab === 'category' ? item.categoryName : item.itemName}
                                        </td>
                                        <td className="p-3 text-right text-gray-600">{item.totalQuantity}</td>
                                        <td className="p-3 text-right font-bold text-gray-800">₹{parseFloat(item.totalValue).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No data available for this selection</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default BusinessReport;
