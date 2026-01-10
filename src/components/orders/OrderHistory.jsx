import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Calendar, ChevronDown, Download, Grid, Filter, RefreshCcw, FileText, CheckSquare, Printer, Eye, Edit, Trash2, BarChart2 } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';
import { orderService } from '../../services/api';
import { getDateTimeLocalInput } from '../../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import { GenerateInvoiceModal } from './GenerateInvoiceModal';
import { OrderViewModal } from '../ui/OrderViewModal';

export function OrderHistory() {
    const [activeTab, setActiveTab] = useState('Order'); // 'Order' | 'Advance Order'
    const [viewMode, setViewMode] = useState('All'); // 'All' | 'Online'

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [showChart, setShowChart] = useState(true);
    const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [ownerEmail, setOwnerEmail] = useState('');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [viewData, setViewData] = useState({ paginatedData: [], filteredData: [] });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

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

    const handleExportExcel = (mode = 'all') => {
        const dataToExport = mode === 'current' ? viewData.paginatedData : orders;

        if (dataToExport.length === 0) {
            toast.error("No data to export");
            return;
        }

        const csv = Papa.unparse(dataToExport.map(o => ({
            'Order No': o.orderNumber,
            'Date': new Date(o.createdAt).toLocaleDateString(),
            'Time': new Date(o.createdAt).toLocaleTimeString(),
            'Customer': o.customerName || '-',
            'Type': o.type,
            'Items': o.items?.map(i => `${i.itemName} (x${i.quantity})`).join(', ') || '-',
            'SubTotal': (o.totalAmount - (o.taxAmount || 0)).toFixed(2),
            'Tax': (o.taxAmount || 0).toFixed(2),
            'Total Amount': o.totalAmount.toFixed(2),
            'Status': o.status
        })));

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        const fileName = mode === 'current'
            ? `orders_page_${new Date().toISOString().slice(0, 10)}.csv`
            : `orders_all_${appliedFilters.startDate.split('T')[0]}_to_${appliedFilters.endDate.split('T')[0]}.csv`;

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`Orders exported (${mode === 'current' ? 'Current Page' : 'All'}) successfully`);
        setShowExportMenu(false);
    };

    const handleGenerateInvoice = () => {
        setShowGenerateInvoiceModal(true);
    };

    const handleDeleteSelected = async () => {
        if (selectedOrderIds.length === 0) return;
        setShowDeleteModal(true);
        setShowActionMenu(false);
    };

    const handleSendOTP = async () => {
        try {
            const res = await orderService.sendDeleteOTP();
            setOwnerEmail(res.data.ownerEmail);
            setIsOtpSent(true);
            toast.success("OTP sent to owner's email");
        } catch (error) {
            toast.error("Failed to send OTP");
        }
    };

    const handleConfirmDelete = async () => {
        if (!otp) {
            toast.error("Please enter OTP");
            return;
        }
        setIsDeleting(true);
        try {
            await orderService.deleteBulk(selectedOrderIds, otp);
            toast.success("Orders deleted successfully");
            setShowDeleteModal(false);
            setOtp('');
            setIsOtpSent(false);
            setSelectedOrderIds([]);
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete orders");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAction = () => {
        setShowActionMenu(!showActionMenu);
    };

    // Dynamic Chart Data Generation based on orders state
    const getChartData = () => {
        const data = [];
        const today = new Date();

        // Loop through last 15 days
        for (let i = 14; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const displayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            // Accumulate orders and sales for this specific day
            const dayStats = orders.reduce((acc, order) => {
                const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
                if (orderDate === dateStr) {
                    acc.orders += 1;
                    acc.sales += parseFloat(order.totalAmount || 0);
                }
                return acc;
            }, { orders: 0, sales: 0 });

            data.push({
                name: displayStr,
                orders: dayStats.orders,
                sales: Math.round(dayStats.sales)
            });
        }
        return data;
    };
    const chartData = getChartData();

    const columns = [
        {
            key: 'orderNumber',
            header: 'Order No.',
            render: (order) => (
                <button
                    onClick={() => { setSelectedOrder(order); setShowViewModal(true); }}
                    className="text-indigo-600 font-bold hover:underline"
                >
                    {order.orderNumber}
                </button>
            )
        },
        {
            key: 'type',
            header: 'Order Type',
            render: (order) => <div>{order.type === 'dine-in' ? 'Dine In' : 'Take Away'}</div>
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
            render: (order) => <span className="text-gray-800">{order.totalAmount?.toFixed(2)}</span>
        },
        {
            key: 'payment',
            header: 'Payment',
            render: (order) => (
                <div>
                    <div className="text-gray-800">Other</div>
                    <div className="text-[10px] text-gray-500">[UPI]</div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (order) => (
                <span className={`px-2 py-0.5 rounded ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
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
                    <button
                        onClick={() => { setSelectedOrder(order); setShowViewModal(true); }}
                        className="p-1.5 border rounded hover:bg-gray-100 text-gray-600 shadow-sm"
                        title="View Details"
                    >
                        <Eye className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600 shadow-sm"><Printer className="w-3 h-3" /></button>
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600 shadow-sm"><FileText className="w-3 h-3" /></button>
                    <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600 shadow-sm"><Edit className="w-3 h-3" /></button>
                </div>
            )
        }
    ];

    return (
        <div className="flex flex-col bg-gray-50 font-sans">
            {/* 1. Tabs & Actions */}
            <div className="bg-white px-4 pt-1 border-b flex flex-col md:flex-row justify-between items-end gap-2 md:gap-0 sticky top-0 z-20">
                <div className="flex gap-6 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('Order')}
                        className={`pb-1 text-sm transition-colors ${activeTab === 'Order' ? 'border-[#444ce7] text-[#444ce7] border-b-2' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Order
                    </button>
                    <button
                        onClick={() => setActiveTab('Advance Order')}
                        className={`pb-1 text-sm transition-colors ${activeTab === 'Advance Order' ? 'border-[#444ce7] text-[#444ce7] border-b-2' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
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
                <div className="flex gap-1 pb-1 w-full md:w-auto justify-end items-center">
                    <button
                        onClick={handleGenerateInvoice}
                        className="px-3 py-1.5 border border-indigo-200 text-[#444ce7] rounded text-xs font-semibold hover:bg-indigo-50"
                    >
                        Generate Invoice
                    </button>
                    <div className="text-xs text-gray-600 flex items-center px-1 whitespace-nowrap">
                        Grand Total : <span className="text-[#444ce7] ml-1">₹ {orders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0).toFixed(2)}</span>
                    </div>
                    <div className="relative">
                        <button onClick={handleAction} className="flex items-center gap-1 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50">
                            Action <ChevronDown className="w-3 h-3" />
                        </button>
                        {showActionMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border rounded shadow-lg z-30 py-1">
                                <button
                                    onClick={handleDeleteSelected}
                                    disabled={selectedOrderIds.length === 0}
                                    className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 ${selectedOrderIds.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-gray-50'}`}
                                >
                                    <Trash2 className="w-3 h-3" /> Remove Selected ({selectedOrderIds.length})
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowExportMenu(!showExportMenu)} className="flex items-center gap-1 px-3 py-1.5 border rounded text-xs text-gray-600 hover:bg-gray-50 transition-colors">
                            <Download className="w-3 h-3" /> Export Excel <ChevronDown className="w-3 h-3" />
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border rounded shadow-xl z-30 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => handleExportExcel('current')}
                                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                >
                                    <FileText className="w-3 h-3" /> Current Page
                                </button>
                                <button
                                    onClick={() => handleExportExcel('all')}
                                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center gap-2"
                                >
                                    <Grid className="w-3 h-3" /> All (Date Range)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col p-1 gap-1">
                {/* 2. Chart Section */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                    <button
                        onClick={() => setShowChart(!showChart)}
                        className="w-full flex items-center justify-between p-2 bg-blue-50/50 hover:bg-blue-50 transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-blue-100 rounded text-blue-600">
                                <BarChart2 className="w-4 h-4" />
                            </div>
                            <span className="text-gray-800 text-sm">Order Analytics</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showChart ? 'rotate-180' : ''}`} />
                    </button>

                    {showChart && (
                        <div className="p-2 h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6B7280' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#6B7280' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e5e7eb', fontSize: '10px' }}
                                        cursor={{ fill: '#F3F4F6' }}
                                    />
                                    <Bar dataKey="sales" name="Sales" fill="#444ce7" radius={[2, 2, 0, 0]} barSize={15} />
                                    <Bar dataKey="orders" name="Orders" fill="#818cf8" radius={[2, 2, 0, 0]} barSize={15} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* 3. Table with Filters */}
                <div className="mt-1">
                    <SmartTable
                        data={orders}
                        columns={columns}
                        title=""
                        isLoading={loading}
                        emptyMessage="No Orders Found"
                        selectedRows={selectedOrderIds}
                        onSelectionChange={setSelectedOrderIds}
                        onViewDataChange={setViewData}
                        filters={
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 p-1.5 bg-white rounded-lg">
                                {/* Always Visible: Start & End Date */}
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-600">Start Date</label>
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#444ce7]" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-600">End Date</label>
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#444ce7]" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                                </div>

                                {/* Expanded Fields */}
                                {showAllFilters && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Order ID</label>
                                            <input
                                                type="text"
                                                value={filters.orderId}
                                                onChange={e => setFilters({ ...filters, orderId: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Customer Name</label>
                                            <input
                                                type="text"
                                                value={filters.customerName}
                                                onChange={e => setFilters({ ...filters, customerName: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Customer Phone</label>
                                            <input
                                                type="text"
                                                value={filters.customerPhone}
                                                onChange={e => setFilters({ ...filters, customerPhone: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">All Order Type</label>
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
                                            <label className="text-xs text-gray-600">Sub Order Type</label>
                                            <select
                                                value={filters.subOrderType}
                                                onChange={e => setFilters({ ...filters, subOrderType: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="">All</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">All Payment Type</label>
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
                                            <label className="text-xs text-gray-600">Order Status</label>
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
                                            <label className="text-xs text-gray-600">Other Status</label>
                                            <select
                                                value={filters.otherStatus}
                                                onChange={e => setFilters({ ...filters, otherStatus: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-[#444ce7]"
                                            >
                                                <option value="All">All</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">Grand Total</label>
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
                                            <label className="text-xs text-gray-600 opacity-0 select-none">Amount</label>
                                            <input
                                                type="number"
                                                value={filters.grandTotalValue}
                                                onChange={e => setFilters({ ...filters, grandTotalValue: e.target.value })}
                                                placeholder="Amount"
                                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#444ce7]"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-600">GSTIN</label>
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

            </div>


            {showGenerateInvoiceModal && (
                <GenerateInvoiceModal onClose={() => setShowGenerateInvoiceModal(false)} />
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-3 text-red-600 mb-4">
                                <div className="p-2 bg-red-50 rounded-full">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold">Delete Orders</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-medium">
                                    Warning: This delete cannot be reversed. Are you sure you want to remove {selectedOrderIds.length} selected orders?
                                </div>

                                {!isOtpSent ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">
                                            To proceed, we need to send an OTP to the owner's registered email address for verification.
                                        </p>
                                        <button
                                            onClick={handleSendOTP}
                                            className="w-full py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200"
                                        >
                                            Send OTP to Owner's Mail
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <p className="text-xs text-center text-gray-500 mb-2">
                                                OTP sent to: <span className="font-bold text-gray-700">{ownerEmail || 'Registered Email'}</span>
                                            </p>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verification OTP</label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                placeholder="Enter 6-digit OTP"
                                                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] focus:border-red-500 focus:outline-none transition-colors"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            />
                                            <p className="text-[10px] text-gray-500 text-center mt-2">
                                                OTP has been sent to the owner's email. Please check and enter it above.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleConfirmDelete}
                                            disabled={isDeleting || otp.length !== 6}
                                            className="w-full py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200"
                                        >
                                            {isDeleting ? 'Deleting...' : 'Confirm Permanent Deletion'}
                                        </button>
                                        <button
                                            onClick={handleSendOTP}
                                            className="w-full text-xs text-[#444ce7] font-bold hover:underline"
                                        >
                                            Resend OTP
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setIsOtpSent(false);
                                    setOtp('');
                                }}
                                className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <OrderViewModal
                order={selectedOrder}
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
            />
        </div>
    );
}
