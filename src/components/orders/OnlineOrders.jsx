import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Grid, LayoutGrid, HelpCircle, Download } from 'lucide-react';
import { aggregatorService } from '../../services/api';

export function OnlineOrders() {
    const [activeTab, setActiveTab] = useState('All');
    const [showChart, setShowChart] = useState(false);
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAggregators() {
            try {
                setLoading(true);
                const res = await aggregatorService.getAll();
                // Filter only connected and verified ones
                const activeOnes = res.data.filter(item => item.isConnected && item.verificationStatus === 'verified');
                setIntegrations(activeOnes);
            } catch (err) {
                console.error("Failed to load aggregators in online activity", err);
            } finally {
                setLoading(false);
            }
        }
        loadAggregators();
    }, []);

    // Prepare the list for tabs: "All" + active integrations
    const aggregators = [
        { id: 'All', label: 'All', logo: LayoutGrid, color: 'text-gray-600' },
        ...integrations.map(agg => ({
            id: agg.slug,
            label: agg.name,
            logo: null,
            img: agg.icon || (agg.slug === 'ondc' ? 'https://upload.wikimedia.org/wikipedia/commons/2/29/ONDC_Official_Logo.svg' :
                agg.slug === 'zomato' ? 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg' :
                    agg.slug === 'swiggy' ? 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg' : null),
            iconText: agg.name[0]
        }))
    ];

    const [orders, setOrders] = useState([]);
    const [fetchingOrders, setFetchingOrders] = useState(false);

    useEffect(() => {
        async function fetchOrders() {
            try {
                setFetchingOrders(true);
                const params = {};
                if (activeTab !== 'All') {
                    // Normalize slug to match source in DB (e.g. 'ondc' -> 'ONDC')
                    params.source = activeTab.toUpperCase();
                }
                const res = await orderService.getAll(params);
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setFetchingOrders(false);
            }
        }
        fetchOrders();
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
            {/* 1. Header Row */}
            <div className="flex justify-between items-center px-4 py-3 border-b">
                <h1 className="text-lg font-bold text-gray-800">Online Orders Activity</h1>
                <button className="flex items-center gap-2 px-3 py-1.5 border rounded text-xs font-medium hover:bg-gray-50 text-gray-700">
                    <HelpCircle className="w-4 h-4" /> Aggregator Help Center
                </button>
            </div>

            {/* 2. Aggregator Tabs */}
            <div className="flex items-center gap-6 px-4 py-3 border-b overflow-x-auto">
                {aggregators.map((agg) => (
                    <button
                        key={agg.id}
                        onClick={() => setActiveTab(agg.id)}
                        className={`flex items-center gap-2 pb-2 border-b-2 transition-all min-w-max ${activeTab === agg.id ? 'border-red-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                        {agg.logo ? (
                            <agg.logo className={`w-8 h-8 ${agg.color}`} />
                        ) : agg.img ? (
                            <img src={agg.img} alt={agg.label} className="w-8 h-8 object-contain rounded-full bg-gray-100 p-1" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-lg">{agg.iconText}</div>
                        )}
                        <span className="font-bold text-gray-800 text-sm">{agg.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 3. Summary Banner (Blue) */}
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <Grid className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 text-sm flex items-center gap-2 cursor-pointer" onClick={() => setShowChart(!showChart)}>
                            Last 5 Days Orders (View Chart) <ChevronDown className={`w-4 h-4 transition-transform ${showChart ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* 4. Filter Row */}
                <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50/50 rounded-lg border">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Record Type</label>
                        <select className="w-48 border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-red-500">
                            <option>Last 2 days records</option>
                            <option>Last 7 days records</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Status</label>
                        <select className="w-40 border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-red-500">
                            <option>All</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-700">Order No.</label>
                        <input type="text" className="w-40 border rounded px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-red-500" />
                    </div>
                    <button className="px-6 py-1.5 bg-red-700 text-white font-bold rounded text-sm hover:bg-red-800 transition-colors">Apply</button>
                    <button className="px-4 py-1.5 border rounded bg-white text-sm font-medium hover:bg-gray-50">Show All</button>
                    <div className="ml-auto">
                        <button className="px-4 py-1.5 border rounded bg-white text-sm font-medium hover:bg-gray-50">Export Custom Report</button>
                    </div>
                </div>

                {/* 5. Data Table Header */}
                <div className="border rounded-lg overflow-hidden bg-white min-h-[400px]">
                    <div className="grid grid-cols-12 bg-blue-50/50 text-xs font-bold text-gray-800 border-b p-3">
                        <div className="col-span-1">Order No.</div>
                        <div className="col-span-2">
                            <div>Outlet Name</div>
                            <div className="text-blue-500 font-normal">Order From</div>
                        </div>
                        <div className="col-span-2">
                            <div>Order Type</div>
                            <div className="text-blue-500 font-normal">Rider Details</div>
                        </div>
                        <div className="col-span-2 font-bold">Customer Details</div>
                        <div className="col-span-1 text-center">OTP</div>
                        <div className="col-span-1">Date Time</div>
                        <div className="col-span-1 bg-green-50 text-center py-1 -my-1 flex items-center justify-center border-x border-green-100">Total</div>
                        <div className="col-span-1 text-center">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Data Rows */}
                    {fetchingOrders ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="divide-y">
                            {orders.map(order => (
                                <div key={order.id} className="grid grid-cols-12 p-3 text-xs text-gray-700 hover:bg-gray-50 items-center">
                                    <div className="col-span-1 font-bold">#{order.orderNumber.split('-').pop()}</div>
                                    <div className="col-span-2">
                                        <div className="font-bold text-gray-800">Sunburst Stack</div>
                                        <div className="text-blue-500">{order.source}</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div>{order.orderType}</div>
                                        <div className="text-gray-400">Not Assigned</div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="font-bold">{order.customerName}</div>
                                        <div>{order.customerPhone || '-'}</div>
                                    </div>
                                    <div className="col-span-1 text-center font-mono">1234</div>
                                    <div className="col-span-1">
                                        {new Date(order.createdAt).toLocaleDateString()}<br />
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="col-span-1 text-center font-bold bg-green-50/30 py-4 border-x border-green-100/50">
                                        ₹{parseFloat(order.totalAmount).toFixed(2)}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status === 'placed' ? 'bg-blue-100 text-blue-700' :
                                                order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button className="text-blue-600 font-bold hover:underline">Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 h-64">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-gray-600 mb-1">No Record Found</h3>
                            <p className="text-sm text-gray-500">We could not find what you searched for Try searching again</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
