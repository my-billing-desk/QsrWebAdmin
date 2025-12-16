import React, { useState, useEffect } from 'react';
import { Clock, Search, MoreVertical, Printer, ChevronRight } from 'lucide-react';
import { orderService } from '../../services/api';

export function RunningOrders() {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'tables'
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        dine_in: 0,
        pick_up: 0,
        delivery: 0,
        due_payment: 0
    });

    useEffect(() => {
        fetchRunningOrders();
    }, []);

    const fetchRunningOrders = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const params = {
                startDate: yesterday.toISOString().split('T')[0] + ' 00:00:00',
                endDate: today.toISOString().split('T')[0] + ' 23:59:59'
            };
            const response = await orderService.getAll(params);
            const allOrders = response.data || [];

            // Filter active orders
            const activeOrders = allOrders.filter(o => ['placed', 'preparing', 'served', 'completed'].includes(o.status)); // Including completed for demo if needed, usually just active

            setOrders(activeOrders);

            // Calculate stats
            const newStats = {
                total: activeOrders.length,
                dine_in: activeOrders.filter(o => o.type === 'dine-in').length,
                pick_up: activeOrders.filter(o => o.type === 'takeaway').length,
                delivery: activeOrders.filter(o => o.type === 'delivery').length,
                due_payment: 0 // Mock for now
            };
            setStats(newStats);

        } catch (error) {
            console.error("Error fetching running orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const activeOrders = orders.filter(order => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'dine_in') return order.type === 'dine-in';
        if (selectedFilter === 'pick_up') return order.type === 'takeaway';
        if (selectedFilter === 'delivery') return order.type === 'delivery';
        return true;
    });

    const getFilterClass = (filterKey) => {
        const isActive = selectedFilter === filterKey;
        if (isActive) {
            return "bg-white text-red-600 border border-red-200 shadow-sm font-bold";
        }
        return "bg-gray-100/50 text-gray-500 border border-transparent hover:bg-gray-100 font-medium";
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Tabs Header */}
            <div className="border-b border-gray-200 px-6">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`py-4 font-bold text-sm transition-colors relative border-b-2 ${activeTab === 'orders' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        Running Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('tables')}
                        className={`py-4 font-bold text-sm transition-colors relative border-b-2 ${activeTab === 'tables' ? 'text-red-600 border-red-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        Running Tables
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                {activeTab === 'orders' ? (
                    <div className="space-y-6">
                        {/* Summary Strip */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                            <div className="font-bold text-gray-700">Running Orders ({stats.total})</div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div>Dine In ({stats.dine_in})</div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div>Pick Up ({stats.pick_up})</div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div>Delivery ({stats.delivery})</div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div>Due Payment ({stats.due_payment})</div>
                        </div>

                        {/* Search and Filter */}
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Order No., Mobile, vehicle no"
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-red-300 focus:ring-1 focus:ring-red-100"
                                />
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                <button onClick={() => setSelectedFilter('all')} className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${getFilterClass('all')}`}>
                                    All {stats.total}
                                </button>
                                <button onClick={() => setSelectedFilter('dine_in')} className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${getFilterClass('dine_in')}`}>
                                    Dine In {stats.dine_in}
                                </button>
                                <button onClick={() => setSelectedFilter('pick_up')} className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${getFilterClass('pick_up')}`}>
                                    Pick Up {stats.pick_up}
                                </button>
                                <button onClick={() => setSelectedFilter('delivery')} className={`px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${getFilterClass('delivery')}`}>
                                    Delivery {stats.delivery}
                                </button>
                            </div>
                        </div>

                        {/* Orders Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {activeOrders.map((order) => (
                                <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-start p-3 bg-gray-50 border-b border-gray-100">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.type === 'dine-in' ? 'bg-blue-100 text-blue-700' :
                                                    order.type === 'takeaway' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {order.type.replace('-', ' ')}
                                                </span>
                                                <span className="text-xs font-bold text-gray-700">#{order.orderNumber}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="p-1 hover:bg-white rounded text-gray-400 hover:text-gray-600"><Printer className="w-3 h-3" /></button>
                                            <button className="p-1 hover:bg-white rounded text-gray-400 hover:text-gray-600"><MoreVertical className="w-3 h-3" /></button>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-3">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="text-xs">
                                                <div className="text-gray-500">Items</div>
                                                <div className="font-bold text-gray-800">2</div> {/* Mock Count */}
                                            </div>
                                            <div className="text-right text-xs">
                                                <div className="text-gray-500">Amount</div>
                                                <div className="font-bold text-gray-800">₹ {order.totalAmount}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-[10px] text-gray-500 bg-gray-50 p-2 rounded">
                                            <span>{order.customerName || 'Guest'}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> 00:00
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                                        <button className="flex-1 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">KOT</button>
                                        <button className="flex-1 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center justify-center gap-1 group-hover:gap-2 transition-all">
                                            Settle <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Running Tables Tab - Empty State
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="bg-white p-8 rounded-full shadow-sm mb-6 relative">
                            <div className="absolute inset-0 bg-red-50 rounded-full animate-pulse opacity-50"></div>
                            <svg className="w-20 h-20 text-red-200 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Running Tables</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Active dine-in orders will appear here. Start a new order to see it in action.</p>
                    </div>
                )}
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-900 transition-colors">
                    <span className="text-xl">💬</span>
                </button>
            </div>
        </div>
    );
}
