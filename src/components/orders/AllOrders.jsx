import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Download, Eye, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { orderService } from '../../services/api';

export function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        orderNumber: '',
        type: 'All',
        status: 'All',
        customerName: '',
        customerPhone: '',
        paymentMode: 'All'
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            // Remove empty filters
            const params = Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'All')
            );
            const res = await orderService.getAll(params);
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        loadOrders();
    };

    const handleClear = () => {
        setFilters({
            startDate: '',
            endDate: '',
            orderNumber: '',
            type: 'All',
            status: 'All',
            customerName: '',
            customerPhone: '',
            paymentMode: 'All'
        });
        // Ideally trigger loadOrders after state update, or use a separate effect. 
        // For simplicity, we just reset state and user clicks search, or we can auto-search:
        // But setState is async. Let's just reset UI for now.
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* Filters Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                value={filters.startDate}
                                onChange={e => handleFilterChange('startDate', e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                            <input
                                type="date"
                                value={filters.endDate}
                                onChange={e => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Search Inputs */}
                    <div className="relative">
                        <input
                            placeholder="Order ID"
                            value={filters.orderNumber}
                            onChange={e => handleFilterChange('orderNumber', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="relative">
                        <input
                            placeholder="Customer Name / Phone"
                            value={filters.customerName} // Using customerName for both just for UI simplicity or split them
                            onChange={e => handleFilterChange('customerName', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={filters.status}
                            onChange={e => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none"
                        >
                            <option value="All">All Status</option>
                            <option value="placed">Placed</option>
                            <option value="preparing">Preparing</option>
                            <option value="served">Served</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={handleSearch} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                            Search
                        </button>
                        <button onClick={handleClear} className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
                            Clear All
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-200 bg-green-50 rounded-lg text-sm font-medium hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 transition-colors">
                        <Download className="w-4 h-4" /> Export
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="flex-1 overflow-auto p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="p-4">Order No.</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Created</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="8" className="p-8 text-center text-gray-500">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="8" className="p-8 text-center text-gray-500">No orders found.</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900 dark:text-gray-200">#{order.orderNumber}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize 
                                                ${order.type === 'dine-in' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                    order.type === 'delivery' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                                                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}
                                            >
                                                {order.type.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300">
                                            {order.customerName ? (
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{order.customerName}</span>
                                                    <span className="text-xs text-gray-500">{order.customerPhone}</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                                            {order.items?.map(i => `${i.itemName} (${i.quantity})`).join(', ')}
                                        </td>
                                        <td className="p-4 font-medium text-gray-900 dark:text-gray-200">₹{order.totalAmount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize 
                                                ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {/* <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors" title="Print Bill">
                                                    <Printer className="w-4 h-4" />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>Showing {orders.length} records</span>
                    <div className="flex gap-2">
                        <button disabled className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
                        <button disabled className="p-1 border rounded hover:bg-gray-50 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
                {/* ... table content ... */}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order #{selectedOrder.orderNumber}</h2>
                                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                                ✕
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Customer & Info Grid */}
                            <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Customer Details</h4>
                                    <p className="font-medium">{selectedOrder.customerName || 'Walk-in Customer'}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.customerPhone || 'No Phone'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Order Info</h4>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Type:</span>
                                        <span className="font-medium capitalize">{selectedOrder.type}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`font-medium capitalize ${selectedOrder.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>{selectedOrder.status}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Payment:</span>
                                        <span className="font-medium">{selectedOrder.paymentMode || 'Cash'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table */}
                            <div>
                                <h4 className="font-bold mb-3">Items Ordered</h4>
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500">
                                            <tr>
                                                <th className="p-3">Item</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Price</th>
                                                <th className="p-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {selectedOrder.items?.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 font-medium">{item.itemName}</td>
                                                    <td className="p-3 text-center">{item.quantity}</td>
                                                    <td className="p-3 text-right">₹{item.price}</td>
                                                    <td className="p-3 text-right font-medium">₹{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col items-end space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between w-48 text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                                    {/* Note: logic for subtotal vs total might need adjustment if taxes are separate in backend */}
                                </div>
                                <div className="flex justify-between w-48 text-sm">
                                    <span className="text-gray-500">Tax</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="flex justify-between w-48 text-lg font-bold text-orange-600 pt-2 border-t border-dashed border-gray-200">
                                    <span>Total</span>
                                    <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                            <button onClick={() => window.print()} className="px-4 py-2 bg-gray-900 text-white rounded-lg flex items-center gap-2 hover:bg-black transition-colors">
                                <Printer className="w-4 h-4" /> Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
