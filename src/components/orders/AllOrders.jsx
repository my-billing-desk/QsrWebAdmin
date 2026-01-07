import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Download, Grid, Filter, RefreshCcw, FileText, CheckSquare, Printer, Eye, Edit, Trash2 } from 'lucide-react';
import { orderService } from '../../services/api';
import { getDateTimeLocalInput } from '../../utils/dateUtils';

export function AllOrders() {
    const [activeTab, setActiveTab] = useState('Order'); // 'Order' | 'Advance Order'
    const [showChart, setShowChart] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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
                const response = await orderService.getAll({});
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
    }, [filters]);

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
                        onClick={() => setActiveTab('Advance Order')}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'Advance Order' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Advance Order
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
                {/* 2. Summary Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <Grid className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 text-sm flex items-center gap-2 cursor-pointer" onClick={() => setShowChart(!showChart)}>
                            Last 15 Days Orders(View Chart) <ChevronDown className={`w-4 h-4 transition-transform ${showChart ? 'rotate-180' : ''}`} />
                        </div>
                    </div>
                </div>
                {/* Chart placeholder */}
                {showChart && <div className="h-40 bg-white border rounded p-4 flex items-center justify-center text-muted">Chart Area</div>}

                {/* 3. Search / Collapse Filter Toggle */}
                <div
                    className="flex justify-between items-center cursor-pointer select-none bg-white p-3 rounded-lg border shadow-sm hover:bg-gray-50 transition-colors"
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                >
                    <div className="font-bold text-sm flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-500" />
                        <span>Search</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSearchExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* 4. Filter Panel */}
                {isSearchExpanded && (
                    <div className="bg-white border rounded-lg p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Start Date</label>
                                <div className="relative">
                                    <input type="datetime-local" className="w-full border rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500" value={filters.startDate} onChange={e => setFilters({ ...filters, startDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">End Date</label>
                                <div className="relative">
                                    <input type="datetime-local" className="w-full border rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500" value={filters.endDate} onChange={e => setFilters({ ...filters, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Order ID</label>
                                <input type="text" className="w-full border rounded px-2 py-1.5 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Customer Name</label>
                                <input type="text" className="w-full border rounded px-2 py-1.5 text-xs" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Customer Phone</label>
                                <input type="text" className="w-full border rounded px-2 py-1.5 text-xs" />
                            </div>
                        </div>
                        {/* Row 2 Selects */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            {['All Order Type', 'Sub Order Type', 'All Payment Type', 'Order Status', 'Other Status'].map((label, i) => (
                                <div key={i} className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-600">{label}</label>
                                    <select className="w-full border rounded px-2 py-1.5 text-xs bg-white">
                                        <option>{label === 'All Order Type' ? 'Select' : 'All'}</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        {/* Row 3  */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Grand Total</label>
                                <select className="w-full border rounded px-2 py-1.5 text-xs bg-white">
                                    <option>=</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <select className="w-full border rounded px-2 py-1.5 text-xs bg-white">
                                    <option></option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">GSTIN</label>
                                <select className="w-full border rounded px-2 py-1.5 text-xs bg-white">
                                    <option>All</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-4 py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 shadow-sm">Search</button>
                                <button className="px-4 py-1.5 border text-gray-600 rounded text-xs font-bold hover:bg-gray-50">Show All</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 5. Date Range Tag Mockup */}
                <div className="flex items-center gap-2">
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-500 font-medium">
                        Start Date : <span className="text-gray-800 font-bold">29 Dec 2025 01:30:00</span>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-500 font-medium">
                        End Date : <span className="text-gray-800 font-bold">30 Dec 2025 01:30:00</span>
                    </div>
                    <div className="ml-auto">
                        <button className="px-3 py-1 border rounded text-xs font-bold text-gray-600 hover:bg-gray-50">Clear All</button>
                    </div>
                </div>

                {/* 6. Data Table */}
                <div className="bg-white border rounded shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-700 border-b">
                            <tr>
                                <th className="p-3 w-10 text-center"><input type="checkbox" /></th>
                                <th className="p-3">Order No.</th>
                                <th className="p-3">Order Type</th>
                                <th className="p-3">Customer Name</th>
                                <th className="p-3">Assign To</th>
                                <th className="p-3 w-1/4">Items</th>
                                <th className="p-3 text-right">My Amount (₹)</th>
                                <th className="p-3 text-right">Tax (₹)</th>
                                <th className="p-3 text-right">Discount (₹)</th>
                                <th className="p-3 text-right">Grand Total [Round Off] (₹)</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 cursor-pointer flex items-center gap-1">Created <ChevronDown className="w-3 h-3" /></th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs divide-y">
                            {orders.map((order, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-3 text-center"><input type="checkbox" /></td>
                                    <td className="p-3 font-semibold text-gray-800">{order.orderNumber}</td>
                                    <td className="p-3">
                                        <div className="font-bold">{order.type === 'dine-in' ? 'Dine In' : 'Take Away'}</div>
                                    </td>
                                    <td className="p-3 text-gray-600">{order.customerName || '-'}</td>
                                    <td className="p-3 text-gray-600">{order.assignTo || '-'}</td>
                                    <td className="p-3 text-gray-600 truncate max-w-xs">{order.items?.map(i => i.itemName).join(', ')}</td>
                                    <td className="p-3 text-right text-gray-600">{(order.totalAmount - (order.taxAmount || 0)).toFixed(2)}</td>
                                    <td className="p-3 text-right text-gray-600">{(order.taxAmount || 0).toFixed(2)}</td>
                                    <td className="p-3 text-right text-gray-600">0.00</td>
                                    <td className="p-3 text-right font-bold text-gray-800">{order.totalAmount?.toFixed(2)}</td>
                                    <td className="p-3">
                                        <div className="font-bold text-gray-800">Other</div>
                                        <div className="text-[10px] text-gray-500">[UPI]</div>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} font-bold`}>
                                            {order.status === 'completed' ? 'Printed' : order.status}
                                        </span>
                                    </td>
                                    <td className="p-3 font-medium text-gray-700">
                                        <div>29 Dec 2025</div>
                                        <div className="text-gray-500">21:43:25</div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-1">
                                            <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><Printer className="w-3 h-3" /></button>
                                            <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><FileText className="w-3 h-3" /></button>
                                            <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><Edit className="w-3 h-3" /></button>
                                            <button className="p-1.5 border rounded hover:bg-gray-100 text-gray-600"><Filter className="w-3 h-3" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="14" className="p-8 text-center text-gray-500">No Orders Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 7. Footer */}
                <div className="flex justify-between items-center text-xs text-gray-600 pt-2">
                    <div className="font-bold">Showing 1 to {orders.length} of {orders.length} records</div>
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1"><RefreshCcw className="w-3 h-3" /> Settlement Amount</div>
                        <div className="flex items-center gap-1"><Printer className="w-3 h-3" /> Updated After Save & Print</div>
                        <div className="flex items-center gap-1"><Grid className="w-3 h-3" /> Online Order</div>
                        <div className="flex items-center gap-1 text-orange-500 font-bold">A Advance Order</div>
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
