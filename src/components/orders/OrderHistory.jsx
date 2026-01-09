import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Calendar, ChevronDown, Download, Grid, Filter, RefreshCcw, FileText, CheckSquare, Printer, Eye, Edit, Trash2, BarChart2 } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';
import { orderService } from '../../services/api';
import { getDateTimeLocalInput } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { GenerateInvoiceModal } from './GenerateInvoiceModal';

export function OrderHistory() {
    const [activeTab, setActiveTab] = useState('Order'); // 'Order' | 'Advance Order'
    const [viewMode, setViewMode] = useState('All'); // 'All' | 'Online'

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [showChart, setShowChart] = useState(true);
    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);

    // Filter State (Inputs)
    const [filters, setFilters] = useState({
        startDate: getDateTimeLocalInput(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)), // 15 days ago
        endDate: getDateTimeLocalInput(),
        orderId: '',
        customerName: '',
        customerPhone: '',
        allOrderType: 'All',
        subOrderType: '',
        allPaymentType: 'All',
        orderStatus: 'All',
        otherStatus: 'All',
        grandTotalOperator: '=',
        grandTotalValue: '',
        gstin: 'All'
    });

    // Applied Filters (Triggers Fetch)
    const [appliedFilters, setAppliedFilters] = useState(filters);

    useEffect(() => {
        fetchOrders();
    }, [appliedFilters, viewMode, activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            // Simulator delay
            await new Promise(resolve => setTimeout(resolve, 500));
            const params = {
                startDate: appliedFilters.startDate,
                endDate: appliedFilters.endDate,
                orderNumber: appliedFilters.orderId,
                customerName: appliedFilters.customerName,
                customerPhone: appliedFilters.customerPhone,
                type: appliedFilters.allOrderType,
                status: appliedFilters.orderStatus,
                paymentMode: appliedFilters.allPaymentType,
                tab: activeTab
            };

            if (viewMode === 'Online') {
                params.isOnline = true;
            }
            const response = await orderService.getAll(params);

            // Mock enhancement
            const enhanced = response.data.map(o => ({
                ...o,
                assignTo: '-',
                payment: 'Other [UPI]',
                statusLabel: 'Printed',
                createdAtFormatted: new Date(o.createdAt).toLocaleString(),
                // Ensure numbers for calculations
                totalAmount: parseFloat(o.totalAmount || 0),
                taxAmount: parseFloat(o.taxAmount || 0)
            }));
            setOrders(enhanced);
        } catch (e) {
            console.error(e);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setAppliedFilters(filters);
    };

    const handleExportExcel = () => {
        if (orders.length === 0) {
            toast.error("No data to export");
            return;
        }
        const csv = Papa.unparse(orders.map(o => ({
            'Order No': o.orderNumber,
            'Date': new Date(o.createdAt).toLocaleDateString(),
            'Time': new Date(o.createdAt).toLocaleTimeString(),
            'Customer': o.customerName || '-',
            'Type': o.type,
            'Total Amount': o.totalAmount,
            'Status': o.status
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Orders exported successfully");
    };

    const handleGenerateInvoice = () => {
        setShowGenerateInvoiceModal(true);
    };

    const handleAction = () => {
        toast('Action menu clicked (Not implemented)', { icon: 'ℹ️' });
    };

    // Chart Data Generation (Mock based on current date range)
    const getChartData = () => {
        const data = [];
        const today = new Date();
        for (let i = 14; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            // Random mock data
            data.push({
                name: dayStr,
                orders: Math.floor(Math.random() * 50) + 10,
                sales: Math.floor(Math.random() * 5000) + 1000
            });
        }
        return data;
    };
    const chartData = getChartData();

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
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
            {/* 1. Tabs & Actions */}
            <div className="bg-white px-4 pt-3 border-b flex flex-col md:flex-row justify-between items-end gap-4 md:gap-0">
                <div className="flex gap-6 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('Order')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Order' ? 'border-[#444ce7] text-[#444ce7]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Order
                    </button>
                    <button
                        onClick={() => setActiveTab('Advance Order')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Advance Order' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Advance Order
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
                <div className="flex gap-2 pb-2 w-full md:w-auto justify-end">
                    <button
                        onClick={handleGenerateInvoice}
                        className="px-3 py-1.5 border border-red-200 text-red-500 rounded text-xs font-semibold hover:bg-red-50"
                    >
                        Generate Invoice
                    </button>
                    <div className="text-xs font-bold text-gray-600 flex items-center px-2 whitespace-nowrap">
                        Grand Total : <span className="text-red-500 ml-1">₹ {orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(2)}</span>
                    </div>
                    <button onClick={handleAction} className="flex items-center gap-1 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50">
                        Action <ChevronDown className="w-3 h-3" />
                    </button>
                    <button onClick={handleExportExcel} className="flex items-center gap-1 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50">
                        <Download className="w-3 h-3" /> Export Excel <ChevronDown className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 2. Chart Section */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="w-full flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                                <BarChart2 className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-gray-800 text-sm">Last 15 Days Orders (View Chart)</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showChart ? 'rotate-180' : ''}`} />
                    </button>

                    {showChart && (
                        <div className="p-4 h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        cursor={{ fill: '#F3F4F6' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="sales" name="Sales (₹)" fill="#444ce7" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="orders" name="Orders" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* 3. Table with Filters */}
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
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#444ce7]" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">End Date</label>
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#444ce7]" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                                </div>

                                {/* Expanded Fields */}
                                {showAllFilters && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Order ID</label>
                                            <input
                                                type="text"
                                                value={filters.orderId}
                                                onChange={e => setFilters({ ...filters, orderId: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Customer Name</label>
                                            <input
                                                type="text"
                                                value={filters.customerName}
                                                onChange={e => setFilters({ ...filters, customerName: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Customer Phone</label>
                                            <input
                                                type="text"
                                                value={filters.customerPhone}
                                                onChange={e => setFilters({ ...filters, customerPhone: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">All Order Type</label>
                                            <select
                                                value={filters.allOrderType}
                                                onChange={e => setFilters({ ...filters, allOrderType: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="All">All</option>
                                                <option value="dine-in">Dine In</option>
                                                <option value="take-away">Take Away</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Sub Order Type</label>
                                            <select
                                                value={filters.subOrderType}
                                                onChange={e => setFilters({ ...filters, subOrderType: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="">All</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">All Payment Type</label>
                                            <select
                                                value={filters.allPaymentType}
                                                onChange={e => setFilters({ ...filters, allPaymentType: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="All">All</option>
                                                <option value="cash">Cash</option>
                                                <option value="card">Card</option>
                                                <option value="online">Online</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Order Status</label>
                                            <select
                                                value={filters.orderStatus}
                                                onChange={e => setFilters({ ...filters, orderStatus: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="All">All</option>
                                                <option value="completed">Completed</option>
                                                <option value="pending">Pending</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Other Status</label>
                                            <select
                                                value={filters.otherStatus}
                                                onChange={e => setFilters({ ...filters, otherStatus: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="All">All</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Grand Total</label>
                                            <select
                                                value={filters.grandTotalOperator}
                                                onChange={e => setFilters({ ...filters, grandTotalOperator: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="=">=</option>
                                                <option value=">">&gt;</option>
                                                <option value="<">&lt;</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600 opacity-0 select-none">Amount</label>
                                            <input
                                                type="number"
                                                value={filters.grandTotalValue}
                                                onChange={e => setFilters({ ...filters, grandTotalValue: e.target.value })}
                                                placeholder="Amount"
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">GSTIN</label>
                                            <select
                                                value={filters.gstin}
                                                onChange={e => setFilters({ ...filters, gstin: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="All">All</option>
                                            </select>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons - Always aligned at the end of the current flow */}
                                <div className="space-y-1 flex items-end">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full py-1.5 bg-[#444ce7] text-white rounded text-xs font-bold hover:bg-[#3538cd] shadow-sm transition-all active:scale-95"
                                    >
                                        Search
                                    </button>
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
            </div>


            {showGenerateInvoiceModal && (
                <GenerateInvoiceModal onClose={() => setShowGenerateInvoiceModal(false)} />
            )}
        </div>
    );
}
