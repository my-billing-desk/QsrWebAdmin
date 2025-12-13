import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag, Truck, Bike, Package } from 'lucide-react';
import { orderService } from '../../services/api';

export function RunningOrders() {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'tables'
    const [stats, setStats] = useState({
        dine_in: { count: 0, total: 0 },
        pick_up: { count: 0, total: 0 },
        delivery: { count: 0, total: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRunningOrders = async () => {
            setLoading(true);
            try {
                // Fetch active orders (not cancelled or completed)
                // We might need a status filter 'active' in API or just fetch recent and filter
                // For MVP, fetching all today's orders and filtering client side
                const today = new Date().toISOString().split('T')[0];
                const params = {
                    startDate: today + ' 00:00:00',
                    endDate: today + ' 23:59:59'
                };
                const response = await orderService.getAll(params);
                const orders = response.data; // access array from response

                const newStats = {
                    dine_in: { count: 0, total: 0 },
                    pick_up: { count: 0, total: 0 },
                    delivery: { count: 0, total: 0 }
                };

                orders.forEach(order => {
                    if (['placed', 'preparing', 'served'].includes(order.status)) { // Active statuses
                        const amount = order.totalAmount || 0;
                        if (order.type === 'dine-in') {
                            newStats.dine_in.count++;
                            newStats.dine_in.total += amount;
                        } else if (order.type === 'takeaway') {
                            newStats.pick_up.count++;
                            newStats.pick_up.total += amount;
                        } else if (order.type === 'delivery') {
                            newStats.delivery.count++;
                            newStats.delivery.total += amount;
                        }
                    }
                });
                setStats(newStats);

            } catch (error) {
                console.error("Error fetching running orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRunningOrders();
    }, []);

    const orderCategories = [
        {
            id: 'dine_in',
            title: 'Dine In',
            subtitle: 'Orders / KOTS',
            count: stats.dine_in.count,
            estimatedTotal: stats.dine_in.total,
            color: 'bg-green-500',
        },
        {
            id: 'pick_up',
            title: 'Pick Up',
            subtitle: 'Orders',
            count: stats.pick_up.count,
            estimatedTotal: stats.pick_up.total,
            color: 'bg-yellow-400',
        },
        {
            id: 'delivery',
            title: 'Delivery',
            subtitle: 'Orders',
            count: stats.delivery.count,
            estimatedTotal: stats.delivery.total,
            color: 'bg-blue-400',
        },
        {
            id: 'ready',
            title: 'Order yet to be marked ready',
            subtitle: 'Orders',
            count: 0,
            estimatedTotal: 0.00,
            color: 'bg-red-400',
        },
        {
            id: 'picked_up',
            title: 'Order yet to be picked up',
            subtitle: 'Orders',
            count: 0,
            estimatedTotal: 0.00,
            color: 'bg-purple-300',
        },
        {
            id: 'delivered',
            title: 'Order yet to be delivered',
            subtitle: 'Orders',
            count: 0,
            estimatedTotal: 0.00,
            color: 'bg-green-300',
        }
    ];

    const grandTotalOrders = orderCategories.reduce((acc, cat) => acc + cat.count, 0);
    const grandTotalAmount = orderCategories.reduce((acc, cat) => acc + cat.estimatedTotal, 0);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 font-sans">
            {/* Tabs Header */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-4 font-bold text-sm transition-colors relative ${activeTab === 'orders' ? 'text-gray-900 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Running Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('tables')}
                        className={`px-6 py-4 font-bold text-sm transition-colors relative ${activeTab === 'tables' ? 'text-gray-900 border-b-2 border-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Running Tables
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">

                {/* Summary Strip */}
                <div className="bg-blue-50/50 rounded-lg p-6 mb-8 flex justify-center gap-16 border border-blue-100">
                    <div className="text-center">
                        <div className="text-gray-500 text-sm font-medium mb-1">{activeTab === 'orders' ? 'Order' : 'Estimated Total'}</div>
                        <div className="text-2xl font-bold text-gray-800">{activeTab === 'orders' ? grandTotalOrders : '₹ 0'}</div>
                    </div>
                    {/* Vertical Divider */}
                    <div className="w-px bg-blue-200 h-12"></div>
                    <div className="text-center">
                        <div className="text-gray-500 text-sm font-medium mb-1">{activeTab === 'orders' ? '₹' : 'Total Running Tables'}</div>
                        <div className="text-2xl font-bold text-gray-800">{activeTab === 'orders' ? grandTotalAmount.toFixed(2) : '0'}</div>
                    </div>
                </div>

                {activeTab === 'orders' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {orderCategories.map((cat, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                                {/* Bottom Wave Decoration - Simplified as gradient overlay/shape */}
                                <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-${cat.color.replace('bg-', '')}/10 to-transparent pointer-events-none`}></div>
                                <div className={`absolute bottom-[-20px] left-0 right-0 h-10 ${cat.color} opacity-20 blur-xl rounded-[50%]`}></div>

                                <div className="text-gray-500 font-medium text-sm mb-0.5">{cat.title}</div>
                                <div className="text-gray-300 text-xs mb-4">{cat.subtitle}</div>

                                <div className="text-3xl font-bold text-gray-800 mb-2">{loading ? '-' : cat.count}</div>
                                <div className="text-gray-400 text-xs mb-1">Estimated Total Amount</div>
                                <div className="text-lg font-bold text-gray-800">₹ {cat.estimatedTotal.toFixed(2)}</div>

                                {idx === 5 && <div className="absolute bottom-2 left-2 text-xs text-gray-300">Delivery</div>} {/* Just mimicing the 'Delivery' label in screenshot if needed */}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Running Tables Tab - Empty State
                    <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
                        {/* Placeholder Graphic */}
                        <div className="mb-4">
                            <svg className="w-24 h-24 text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                <path d="M12 21a9 9 0 1 0 0 -18 9 9 0 0 0 0 18z" />
                                <path d="M9 10h6" />
                                <path d="M12 10v4" />
                            </svg>
                            {/* Simple Table Icon Representation */}
                            <div className="flex justify-center -mt-20 opacity-30">
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="black" strokeWidth="2">
                                    {/* Simple Umbrella/Table drawing */}
                                    <path d="M50 20 L80 40 H20 L50 20 Z" />
                                    <line x1="50" y1="40" x2="50" y2="80" />
                                    <line x1="20" y1="80" x2="80" y2="80" />
                                    <rect x="30" y="50" width="10" height="30" />
                                    <rect x="60" y="50" width="10" height="30" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-gray-400 font-medium">No Running Table Found</p>
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
