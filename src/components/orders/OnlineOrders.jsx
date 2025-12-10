import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, LayoutGrid, Activity } from 'lucide-react';

export function OnlineOrders() {
    const [activeTab, setActiveTab] = useState('All');
    const [timeRange, setTimeRange] = useState('Last 5 Days Orders');

    const aggregators = [
        { name: 'All', icon: LayoutGrid, color: 'text-gray-600' },
        { name: 'Zomato', color: 'text-red-600', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg' }, // Using text/placeholder if no image
        { name: 'Swiggy', color: 'text-orange-500', logo: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg' },
        { name: 'Magicpin', color: 'text-pink-600' },
        { name: 'Eksecond', color: 'text-red-500' },
        { name: 'Gintaa Food', color: 'text-red-700' }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-6">Online Orders Activity</h1>

            {/* Aggregator Tabs */}
            <div className="flex gap-4 overflow-x-auto pb-2 mb-6">
                {aggregators.map(agg => (
                    <button
                        key={agg.name}
                        onClick={() => setActiveTab(agg.name)}
                        className={`
                            flex items-center gap-3 px-6 py-3 rounded-lg border min-w-[140px]
                            transition-all duration-200
                            ${activeTab === agg.name
                                ? 'bg-white border-red-500 shadow-sm ring-1 ring-red-100'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                        `}
                    >
                        {agg.icon ? (
                            <agg.icon className={`w-6 h-6 ${agg.color}`} />
                        ) : (
                            <div className={`w-6 h-6 rounded-full bg-current ${agg.color} opacity-20 flex items-center justify-center`}>
                                <span className={`text-xs font-bold ${agg.color} opacity-100`}>{agg.name[0]}</span>
                            </div>
                        )}
                        <span className={`font-bold ${activeTab === agg.name ? 'text-gray-800' : 'text-gray-500'}`}>
                            {agg.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                        <Activity className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded transition-colors">
                        <span className="font-bold text-lg text-gray-800">{timeRange}</span>
                        <span className="text-gray-500 text-sm font-medium">(View Chart)</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>
                {/* Placeholder Chart */}
                <div className="h-40 bg-gradient-to-b from-blue-50/50 to-transparent rounded flex items-end justify-between px-10 pb-4">
                    {[40, 65, 45, 80, 55].map((h, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-16 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-t-lg transition-all" style={{ height: `${h}%` }}></div>
                            <span className="text-xs font-bold text-gray-400">Day {i + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-wrap gap-4 items-end shadow-sm">
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <label className="text-xs font-bold text-gray-600">Record Type</label>
                    <div className="relative">
                        <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 appearance-none font-medium text-gray-700 outline-none focus:border-red-500">
                            <option>Last 2 days records</option>
                            <option>This Week</option>
                            <option>This Month</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-600">Status</label>
                    <div className="relative">
                        <select className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 appearance-none font-medium text-gray-700 outline-none focus:border-red-500">
                            <option>All</option>
                            <option>Pending</option>
                            <option>Accepted</option>
                            <option>Delivered</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-bold text-gray-600">Order No.</label>
                    <input
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-red-500 transition-colors"
                        placeholder="Search by Order ID"
                    />
                </div>

                <div className="flex gap-2">
                    <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold text-sm shadow hover:bg-red-700 transition-colors">Apply</button>
                    <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">Show All</button>
                    <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Custom Report
                    </button>
                </div>
            </div>

            {/* Table / Empty State */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-blue-50/50 border-b border-gray-200 text-xs font-bold uppercase text-gray-700">
                            <tr>
                                <th className="p-4 min-w-[120px]">Order No.</th>
                                <th className="p-4 min-w-[150px]">
                                    <div className="flex flex-col">
                                        <span>Outlet Name</span>
                                        <span className="text-blue-500 font-normal normal-case pt-0.5">Order From</span>
                                    </div>
                                </th>
                                <th className="p-4 min-w-[150px]">
                                    <div className="flex flex-col">
                                        <span>Order Type</span>
                                        <span className="text-blue-500 font-normal normal-case pt-0.5">Rider Details</span>
                                    </div>
                                </th>
                                <th className="p-4">Customer Details</th>
                                <th className="p-4">OTP</th>
                                <th className="p-4">Date Time</th>
                                <th className="p-4 bg-green-50/50 w-24 text-right">Total</th>
                                <th className="p-4 w-24">Status</th>
                                <th className="p-4 w-16">At</th>
                                <th className="p-4 w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* Empty State */}
                            <tr>
                                <td colSpan="10" className="p-20 text-center">
                                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-red-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">No Record Found</h3>
                                        <p className="text-sm text-gray-500">We could not find what you searched for. Try searching again.</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
