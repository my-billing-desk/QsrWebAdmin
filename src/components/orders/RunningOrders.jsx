import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Filter, Download, LayoutGrid, List, Utensils, RefreshCw, Clock, Eye } from 'lucide-react';
import { orderService, outletService, configService } from '../../services/api';
import { RunningOrderBoard } from '../ui/RunningOrderBoard';
import { formatDateLocal } from '../../utils/dateUtils';
import { OrderViewModal } from '../ui/OrderViewModal';

export function RunningOrders() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('orders'); // 'orders' | 'tables'
    const [ordersView, setOrdersView] = useState('kanban'); // 'kanban' | 'list'
    const [enableTablesConfig, setEnableTablesConfig] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Filters
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Kanban Columns Configuration - Revised
    const columns = [
        { id: 'placed', title: 'Placed', color: 'bg-purple-500' },
        { id: 'preparing', title: 'Preparing', color: 'bg-pink-500' },
        { id: 'ready', title: 'Dispatched / Served', color: 'bg-blue-400' }, // Mapping 'served'/'dispatched' here
        { id: 'completed', title: 'Completed', color: 'bg-green-500' }
    ];

    useEffect(() => {
        checkConfig();
        fetchData();
        // Poll for updates every 30s
        const interval = setInterval(fetchData, 30000);

        // Update current time every second for timers
        const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timeInterval);
        };
    }, []);

    const checkConfig = async () => {
        try {
            const res = await outletService.getConfig();
            const isEnabled = res.data?.enableTables !== false; // Default to true if missing? or false? Usually boolean.
            // Check usage in POS: outletConfig.enableTables !== false
            setEnableTablesConfig(isEnabled);

            if (isEnabled) {
                const tableRes = await configService.getTables();
                setTables(tableRes.data || []);
            }
        } catch (err) {
            console.error("Config check failed", err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetching last 24 hours or "Today"
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            const params = {
                startDate: formatDateLocal(yesterday) + ' 00:00:00',
                endDate: formatDateLocal(today) + ' 23:59:59'
            };
            const response = await orderService.getAll(params);

            // Map API data to Kanban Items & Table Status
            const rawOrders = response.data || [];

            const mappedOrders = rawOrders.map(order => {
                // Normalize Status for Kanban Column ID
                let kanbanStatus = order.status;
                if (order.status === 'dispatched' || order.status === 'served') {
                    kanbanStatus = 'ready';
                }

                return {
                    id: order.id,
                    status: kanbanStatus,
                    originalStatus: order.status,
                    title: order.customerName || (order.tableNumber ? `Table ${order.tableNumber}` : `Guest`),
                    type: order.type, // dine-in, takeaway, delivery
                    isOnline: order.source !== 'POS',
                    subType: order.orderNumber,
                    tableNumber: order.tableNumber,
                    itemsCount: order.items?.length || 0,
                    totalAmount: order.totalAmount,
                    createdAt: order.createdAt,
                    items: order.items,
                    progress: calculateProgress(kanbanStatus),
                    progressColor: getProgressColor(kanbanStatus),
                    date: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    onView: (o) => { setSelectedOrder(order); setShowViewModal(true); }
                };
            });

            // Filter active orders
            // For running orders view, we might want to see Completed too? usually yes.
            // Filter out cancelled
            const activeMapped = mappedOrders.filter(o => o.originalStatus !== 'cancelled');

            setOrders(activeMapped);

        } catch (error) {
            console.error("Error fetching running orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await orderService.updateStatus(orderId, newStatus);
            // Local update for immediate feedback
            setOrders(prev => prev.map(o =>
                o.id === orderId ? {
                    ...o,
                    status: newStatus === 'served' || newStatus === 'dispatched' ? 'ready' : newStatus,
                    originalStatus: newStatus,
                    progress: calculateProgress(newStatus === 'served' || newStatus === 'dispatched' ? 'ready' : newStatus),
                    progressColor: getProgressColor(newStatus === 'served' || newStatus === 'dispatched' ? 'ready' : newStatus)
                } : o
            ));
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    // Helpers
    const calculateProgress = (status) => {
        switch (status) {
            case 'placed': return 25;
            case 'preparing': return 50;
            case 'ready': return 75;
            case 'completed': return 100;
            default: return 0;
        }
    };

    const getProgressColor = (status) => {
        switch (status) {
            case 'placed': return '#a855f7'; // purple
            case 'preparing': return '#ec4899'; // pink
            case 'ready': return '#3b82f6'; // blue
            case 'completed': return '#22c55e'; // green
            default: return '#ccc';
        }
    };

    const formatDuration = (dateString) => {
        const diff = currentTime.getTime() - new Date(dateString).getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ago`;
    };

    const getTimeLeft = (dateString) => {
        const target = new Date(new Date(dateString).getTime() + 40 * 60 * 1000); // 40 mins target
        const diff = target.getTime() - currentTime.getTime();
        if (diff <= 0) return 'DISPATCH OVERDUE';
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s left to dispatch`;
    };

    const filteredOrders = orders.filter(o => {
        if (selectedFilter === 'all') return true;
        return o.type === selectedFilter.toLowerCase() || (selectedFilter === 'High' && o.totalAmount > 1000); // Dummy logic for high
    });

    const getTableStatus = (table) => {
        // Find active order for this table
        // Active = Not completed, not cancelled
        const activeOrder = orders.find(o =>
            o.tableNumber === table.name &&
            o.status !== 'completed' &&
            o.originalStatus !== 'cancelled'
        );
        return activeOrder;
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 gap-6 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Running Operations</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Updates
                        </span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>Active Orders: <span className="font-bold text-indigo-600">{orders.filter(o => o.status !== 'completed').length}</span></span>
                    </div>
                </div>

                {/* View Toggle & Actions */}
                <div className="flex bg-white rounded-lg border p-1 shadow-sm">
                    <button
                        onClick={() => setOrdersView('kanban')}
                        className={`p-1.5 rounded-md transition-colors ${ordersView === 'kanban' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Kanban View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setOrdersView('list')}
                        className={`p-1.5 rounded-md transition-colors ${ordersView === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
                        title="Compact View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm" onClick={fetchData}>
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
            </div>

            {/* Content Area */}
            {viewMode === 'orders' ? (
                <>
                    {/* Filters */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center bg-gray-100/50 p-1 rounded-lg">
                            {['All', 'Dine-in', 'Delivery', 'Takeaway'].map(p => (
                                <button key={p}
                                    onClick={() => setSelectedFilter(p === 'All' ? 'all' : p)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${selectedFilter === (p === 'All' ? 'all' : p) ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden min-h-0">
                        {ordersView === 'kanban' ? (
                            <RunningOrderBoard
                                columns={columns}
                                data={filteredOrders}
                                onStatusChange={updateOrderStatus}
                                currentTime={currentTime}
                            />
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="overflow-auto">
                                    <table className="w-full text-left text-sm border-separate border-spacing-0">
                                        <thead className="bg-gray-50 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-3 font-bold text-gray-600 border-b">Order Detail</th>
                                                <th className="px-4 py-3 font-bold text-gray-600 border-b">Type</th>
                                                <th className="px-4 py-3 font-bold text-gray-600 border-b">Time</th>
                                                <th className="px-4 py-3 font-bold text-gray-600 border-b">Amount</th>
                                                <th className="px-4 py-3 font-bold text-gray-600 border-b">Status</th>
                                                <th className="px-4 py-3 font-bold text-gray-600 border-b text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredOrders.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Clock className="w-8 h-8 text-gray-300" />
                                                            <p>No running orders found</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredOrders.map(order => (
                                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="font-bold text-gray-900">{order.title}</div>
                                                            <button
                                                                onClick={() => { setSelectedOrder(order); setShowViewModal(true); }}
                                                                className="text-[11px] text-indigo-600 font-mono hover:underline block"
                                                            >
                                                                #{order.subType}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.type === 'dine-in' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                                {order.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600">
                                                            <div className="flex flex-col">
                                                                <div className="flex items-center gap-1.5 text-[11px] font-medium">
                                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                                    {formatDuration(order.createdAt)}
                                                                </div>
                                                                {order.isOnline && (
                                                                    <div className={`text-[10px] font-bold mt-0.5 tracking-tight ${getTimeLeft(order.createdAt).includes('OVERDUE') ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`}>
                                                                        {getTimeLeft(order.createdAt)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 font-bold text-gray-900">₹{order.totalAmount}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {order.originalStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => { setSelectedOrder(order); setShowViewModal(true); }}
                                                                    className="p-1.5 border rounded hover:bg-gray-100 text-gray-500 transition-colors"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                                <select
                                                                    value={order.originalStatus}
                                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                                    className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-bold bg-white hover:border-indigo-300 transition-colors cursor-pointer outline-none"
                                                                >
                                                                    <option value="placed">Placed</option>
                                                                    <option value="preparing">Preparing</option>
                                                                    <option value="served">Served</option>
                                                                    <option value="completed">Completed</option>
                                                                    <option value="cancelled">Cancelled</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto min-h-0 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    {/* Tables Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {tables.map(table => {
                            const activeOrder = getTableStatus(table);
                            return (
                                <div
                                    key={table.id}
                                    className={`relative flex flex-col items-center justify-center aspect-square rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${activeOrder
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-green-50 border-green-200 hover:bg-green-100'
                                        }`}
                                >
                                    {/* Status Badge */}
                                    <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${activeOrder ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>

                                    <Utensils className={`w-8 h-8 mb-2 ${activeOrder ? 'text-red-400' : 'text-green-400'}`} />

                                    <h3 className="font-bold text-gray-700 text-lg">{table.name}</h3>

                                    <div className="mt-2 text-center">
                                        {activeOrder ? (
                                            <>
                                                <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Occupied</p>
                                                <div className="flex items-center justify-center gap-1 text-xs text-red-500 mt-1 font-mono">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDuration(activeOrder.createdAt)}
                                                </div>
                                                <p className="text-xs font-bold text-gray-800 mt-1">₹{activeOrder.totalAmount}</p>
                                            </>
                                        ) : (
                                            <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Vacant</p>
                                        )}
                                    </div>

                                    {/* Capacity Badge (Optional) */}
                                    {table.capacity && (
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/50 px-2 py-0.5 rounded text-[10px] text-gray-500 font-medium">
                                            {table.capacity} Seater
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )
            }

            <OrderViewModal
                order={selectedOrder}
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
            />
        </div >
    );
}

