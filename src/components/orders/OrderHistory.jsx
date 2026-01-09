import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Download, Grid, Filter, RefreshCcw, FileText, CheckSquare, Printer, Eye, Edit, Trash2 } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';
import { orderService } from '../../services/api';
import { getDateTimeLocalInput } from '../../utils/dateUtils';

export function OrderHistory() {
    const [activeTab, setActiveTab] = useState('Order'); // 'Order' | 'Scheduled Order'
    const [viewMode, setViewMode] = useState('All'); // 'All' | 'Online'

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllFilters, setShowAllFilters] = useState(false);

    const [filters, setFilters] = useState({
        startDate: getDateTimeLocalInput(),
        endDate: getDateTimeLocalInput(),
        orderId: '',
        customerName: '',
        customerPhone: '',
        allOrderType: 'All',
        subOrderType: '',
        allPaymentType: 'All',
        orderStatus: 'All',
        otherStatus: 'All',
        grandTotal: '=',
        gstin: 'All'
    });

    useEffect(() => {
        // Mock fetch - replaced with actual service call
        const fetchOrders = async () => {
            setLoading(true);
            try {
                // Simulator delay
                await new Promise(resolve => setTimeout(resolve, 500));
                const params = { ...filters, tab: activeTab };
                if (viewMode === 'Online') {
                    params.isOnline = true;
                }
                const response = await orderService.getAll(params);
                // Enhanced mock data to match columns if API response is simple
                const enhanced = response.data.map(o => ({
                    ...o,
                    assignTo: '-', // Placeholder
                    payment: 'Other [UPI]', // Mock
                    statusLabel: 'Printed', // Mock
                    createdAtFormatted: new Date(o.createdAt).toLocaleString()
                }));
                setOrders(enhanced);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [filters, viewMode, activeTab]);

    const columns = [
        {
            key: 'orderNumber',
            header: 'Order No.',
            render: (order) => <span className="font-semibold text-gray-800">{order.orderNumber}</span>
        },
        {
            key: 'type',
            header: 'Order Type',
            render: (order) => <div className="font-bold">{order.type === 'dine-in' ? 'Dine In' : 'Take Away'}</div>
        },
        {
            key: 'customerName',
            header: 'Customer Name',
            render: (order) => <span className="text-gray-600">{order.customerName || '-'}</span>
        },
        {
            key: 'assignTo',
            header: 'Assign To',
            render: (order) => <span className="text-gray-600">{order.assignTo || '-'}</span>
        },
        {
            key: 'items',
            header: 'Items',
            render: (order) => <span className="text-gray-600 truncate max-w-xs block" title={order.items?.map(i => i.itemName).join(', ')}>{order.items?.map(i => i.itemName).join(', ')}</span>
        },
        {
            key: 'myAmount',
            header: 'My Amount (₹)',
            align: 'right',
            render: (order) => <span className="text-gray-600">{(order.totalAmount - (order.taxAmount || 0)).toFixed(2)}</span>
        },
        {
            key: 'tax',
            header: 'Tax (₹)',
            align: 'right',
            render: (order) => <span className="text-gray-600">{(order.taxAmount || 0).toFixed(2)}</span>
        },
        {
            key: 'discount',
            header: 'Discount (₹)',
            align: 'right',
            render: (order) => <span className="text-gray-600">0.00</span>
        },
        {
            key: 'grandTotal',
            header: 'Grand Total [Round Off] (₹)',
            align: 'right',
            render: (order) => <span className="font-bold text-gray-800">{order.totalAmount?.toFixed(2)}</span>
        },
        {
            key: 'payment',
            header: 'Payment',
            render: (order) => (
                <div>
                    <div className="font-bold text-gray-800">Other</div>
                    <div className="text-[10px] text-gray-500">[UPI]</div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (order) => (
                <span className={`px-2 py-0.5 rounded ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} font-bold`}>
                    {order.status === 'completed' ? 'Printed' : order.status}
                </span>
            )
        },
        {
            key: 'created',
            header: 'Created',
            render: (order) => (
                <div className="font-medium text-gray-700">
                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                </div>
            )
        },
        {
            key: 'actions',
            header: 'Actions',
            align: 'center',
            render: (order) => (
                <div className="flex justify-center gap-1">
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><Printer className="w-3 h-3" /></button>
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><FileText className="w-3 h-3" /></button>
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><Edit className="w-3 h-3" /></button>
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><Filter className="w-3 h-3" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
            {/* Header / Top Bar (if excluding Main Header) - Assuming Main Header is present */}

            {/* 1. Tabs & Actions */}
            <div className="bg-white px-4 pt-3 border-b flex justify-between items-end">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('Order')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Order' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Order
                    </button>
                    <button
                        onClick={() => setActiveTab('Scheduled Order')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Scheduled Order' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Scheduled Orders
                    </button>
                </div>

                <div className="flex bg-gray-100 rounded p-1 mx-4">
                    <button
                        onClick={() => setViewMode('All')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'All' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All Orders
                    </button>
                    <button
                        onClick={() => setViewMode('Online')}
                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${viewMode === 'Online' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Online Only
                    </button>
                </div>
                <div className="flex gap-2 pb-2">
                    <button className="px-3 py-1.5 border border-red-200 text-red-500 rounded text-xs font-semibold hover:bg-red-50">
                        Generate Invoice
                    </button>
                    <div className="text-xs font-bold text-gray-600 flex items-center px-2">
                        Grand Total : <span className="text-red-500 ml-1">₹ {orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(2)}</span>
                    </div>
                    <button className="flex items-center gap-1 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50">
                        Action <ChevronDown className="w-3 h-3" />
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50">
                        <Download className="w-3 h-3" /> Export Excel <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">


                <div className="flex-1 overflow-hidden">
                    <SmartTable
                        data={orders}
                        columns={columns}
                        title="Order History"
                        isLoading={loading}
                        emptyMessage="No Orders Found"
                        filters={
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-lg">
                                {/* Always Visible: Start & End Date */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">Start Date</label>
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-red-500" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">End Date</label>
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-red-500" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                                </div>

                                {/* Expanded Fields */}
                                {showAllFilters && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Order ID</label>
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Customer Name</label>
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Customer Phone</label>
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                                        </div>

                                        {/* Row 2 */}
                                        {['All Order Type', 'Sub Order Type', 'All Payment Type', 'Order Status', 'Other Status'].map((label, i) => (
                                            <div key={i} className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-600">{label}</label>
                                                <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-red-500">
                                                    <option>{label === 'All Order Type' ? 'Select' : 'All'}</option>
                                                </select>
                                            </div>
                                        ))}

                                        {/* Row 3 */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Grand Total</label>
                                            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-red-500">
                                                <option>=</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 opacity-0 select-none">Amount</label>
                                            <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">GSTIN</label>
                                            <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-red-500">
                                                <option>All</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons - Always aligned at the end of the current flow */}
                                <div className="space-y-1 flex items-end">
                                    <button className="w-full py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 shadow-sm transition-colors">Search</button>
                                </div>
                                <div className="space-y-1 flex items-end">
                                    <button
                                        onClick={() => setShowAllFilters(!showAllFilters)}
                                        className="w-full py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        {showAllFilters ? 'Hide All' : 'Show All'}
                                    </button>
                                </div>
                            </div>
                        }
                    />
                </div>

                {/* 7. Footer */}
                <div className="flex justify-between items-center text-xs text-gray-600 pt-2">
                    <div className="font-bold">Showing 1 to {orders.length} of {orders.length} records</div>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> Settlement Amount</div>
                        <div className="flex items-center gap-1"><Printer className="w-3 h-3" /> Updated After Save & Print</div>
                        <div className="flex items-center gap-1"><Grid className="w-3 h-3" /> Online Order</div>
                        <div className="flex items-center gap-1 text-orange-500 font-bold">S Scheduled Order</div>
                    </div>
                </div>

                {/* Floating Chat Icon Mock */}
                <div className="fixed bottom-6 right-6 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-red-900 z-50">
                    <div className="font-bold text-lg">💬</div>
                </div>
            </div>
        </div>
    );
}
