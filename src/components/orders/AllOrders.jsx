import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, Eye, RotateCcw, Filter, FileText, Printer, FileSpreadsheet, Trash2, Edit2, X, ChevronRight } from 'lucide-react';
import { orderService } from '../../services/api';

export function AllOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        startDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
        endDate: new Date().toISOString().split('T')[0] + ' 23:59:59',
        orderId: '',
        customerName: '',
        customerPhone: '',
        allOrderType: 'All',
        source: 'All',
        status: 'All'
    });
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {
                startDate: filters.startDate,
                endDate: filters.endDate,
                orderNumber: filters.orderId,
                customerName: filters.customerName,
                customerPhone: filters.customerPhone,
                type: filters.allOrderType !== 'All' ? filters.allOrderType : undefined,
                status: filters.status !== 'All' ? filters.status : undefined,
                source: filters.source !== 'All' ? filters.source : undefined
            };
            const response = await orderService.getAll(params);
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchOrders();
    };

    const handleResetFilters = () => {
        setFilters({
            startDate: new Date().toISOString().split('T')[0] + ' 00:00:00',
            endDate: new Date().toISOString().split('T')[0] + ' 23:59:59',
            orderId: '',
            customerName: '',
            customerPhone: '',
            allOrderType: 'All',
            source: 'All',
            status: 'All'
        });
    };

    useEffect(() => {
        fetchOrders();
    }, [filters.startDate, filters.endDate]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
            {/* Top Bar Actions */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 shrink-0">
                <div className="flex gap-4">
                    <button className="relative pb-2 border-b-2 border-red-600 text-red-600 font-medium text-sm">
                        Order
                    </button>
                    <button className="relative pb-2 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
                        Advance Order
                    </button>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => alert("Invoice Generation will be implemented via PDF generator or Print view.")}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded text-sm font-medium hover:bg-red-100"
                    >
                        Generate Invoice
                    </button>
                    <div className="flex items-center gap-2 text-red-600 font-medium text-sm px-3">
                        Grand Total : ₹ {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toFixed(2)}
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50">
                        Action
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50">
                        <FileSpreadsheet className="w-4 h-4" /> Export Excel
                    </button>
                </div>
            </div>

            {/* Filters Section - Always Visible */}
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                    <Search className="w-4 h-4" /> Search
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                    {/* Start Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                                value={filters.startDate.split(' ')[0]}
                                onChange={(e) => handleFilterChange('startDate', e.target.value + ' 00:00:00')}
                            />
                        </div>
                    </div>
                    {/* End Date */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                                value={filters.endDate.split(' ')[0]}
                                onChange={(e) => handleFilterChange('endDate', e.target.value + ' 23:59:59')}
                            />
                        </div>
                    </div>
                    {/* Order No. */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Order No.</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.orderNumber}
                            onChange={(e) => handleFilterChange('orderNumber', e.target.value)}
                        />
                    </div>
                    {/* Customer Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Customer Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.customerName}
                            onChange={(e) => handleFilterChange('customerName', e.target.value)}
                        />
                    </div>
                    {/* Customer Phone */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Customer Phone</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.customerPhone}
                            onChange={(e) => handleFilterChange('customerPhone', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* All Order Type */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">All Order Type</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.allOrderType}
                            onChange={(e) => handleFilterChange('allOrderType', e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="dine-in">Dine In</option>
                            <option value="takeaway">Take Away</option>
                            <option value="delivery">Delivery</option>
                        </select>
                    </div>
                    {/* Order Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Order Status</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="placed">Placed</option>
                            <option value="preparing">Preparing</option>
                            <option value="served">Served</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    {/* Source */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Source</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-red-500 transition-colors"
                            value={filters.source}
                            onChange={(e) => handleFilterChange('source', e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="POS">POS</option>
                            <option value="Zomato">Zomato</option>
                            <option value="Swiggy">Swiggy</option>
                        </select>
                    </div>
                    <div className="flex items-end gap-2">
                        <button onClick={fetchOrders} className="px-6 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 font-medium text-sm">Apply</button>
                        <button onClick={handleResetFilters} className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors text-sm">Reset</button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative bg-white">
                {/* Order List Table */}
                {!selectedOrder && (
                    <div className="absolute inset-0 overflow-auto p-4">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-blue-50 text-gray-700 font-bold border-y border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3">Source</th>
                                    <th className="p-3">Order No</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3 text-right">Amount</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.length > 0 ? orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50 group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${order.source === 'Zomato' ? 'bg-black text-white border-black' : order.source === 'Swiggy' ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                                                {order.source || 'POS'}
                                            </span>
                                        </td>
                                        <td className="p-3 font-medium text-red-600">#{order.orderNumber}</td>
                                        <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="p-3">
                                            <div className="font-medium text-gray-800">{order.customerName || 'Walk-in'}</div>
                                            <div className="text-xs text-gray-500">{order.customerPhone}</div>
                                        </td>
                                        <td className="p-3 text-right font-bold text-gray-700">₹{order.totalAmount}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>{order.status}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 bg-blue-50 px-2 py-1 rounded">View</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <Search className="w-12 h-12 mb-4 text-gray-200" />
                                                <p>No orders found matching criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Selected Order Detail Form - Shows when an order is selected */}
                {selectedOrder && (
                    <div className="absolute inset-0 overflow-auto bg-gray-50 p-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-4xl mx-auto">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    Edit Order <span className="text-red-600">#{selectedOrder.orderNumber}</span>
                                </h3>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                        <span className="font-bold text-gray-700">Payment Type:</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded text-sm">{selectedOrder.paymentMode || 'Cash'}</span>
                                    </div>
                                    <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                        <span className="font-bold text-gray-700">Order Status:</span>
                                        <span className="capitalize">{selectedOrder.status}</span>
                                    </div>
                                    <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                        <span className="font-bold text-gray-700">Order Type:</span>
                                        <span className="capitalize">{selectedOrder.orderType}</span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                        <span className="font-bold text-gray-700">Customer:</span>
                                        <span>{selectedOrder.customerName || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-[140px_1fr] gap-2 items-center">
                                        <span className="font-bold text-gray-700">Phone:</span>
                                        <span>{selectedOrder.customerPhone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 mb-6">
                                <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Order Items</h4>
                                <table className="w-full text-sm border bg-white">
                                    <thead className="bg-gray-50 text-gray-700 font-bold">
                                        <tr>
                                            <th className="p-3 text-left w-10"></th>
                                            <th className="p-3 text-left">Item Name</th>
                                            <th className="p-3 text-center w-24">Qty</th>
                                            <th className="p-3 text-right">Unit Price</th>
                                            <th className="p-3 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                            <tr key={idx} className="group hover:bg-gray-50">
                                                <td className="p-3 text-center"><button className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></td>
                                                <td className="p-3 font-medium text-gray-800">{item.itemName}</td>
                                                <td className="p-3 text-center">
                                                    <input type="number" defaultValue={item.quantity} className="w-16 border border-gray-300 rounded px-2 py-1 text-center" />
                                                </td>
                                                <td className="p-3 text-right">₹{item.price}</td>
                                                <td className="p-3 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
                                <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 shadow-sm">Save Changes</button>
                            </div>
                        </div>
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
