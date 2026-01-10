import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, Download, Eye, RotateCcw, Filter, Printer, ChevronDown } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';
import { orderService } from '../../services/api';
import { getDateTimeLocalInput } from '../../utils/dateUtils';
import { OrderViewModal } from '../ui/OrderViewModal';
import toast from 'react-hot-toast';

export function KOT() {
    const [kots, setKots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        startDate: getDateTimeLocalInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 7 days ago
        endDate: getDateTimeLocalInput(),
        kotId: '',
        orderNumber: '',
        customerName: '',
        orderType: 'All',
        status: 'All'
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    const fetchKots = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                startDate: appliedFilters.startDate,
                endDate: appliedFilters.endDate,
                orderNumber: appliedFilters.orderNumber,
                customerName: appliedFilters.customerName,
                type: appliedFilters.orderType !== 'All' ? appliedFilters.orderType : undefined,
                status: appliedFilters.status !== 'All' ? appliedFilters.status : undefined,
            };

            const response = await orderService.getAll(params);

            // Map orders to KOT view
            const mapped = response.data.map(order => ({
                id: order.id,
                orderId: order.id,
                orderNumber: order.orderNumber,
                type: order.type === 'dine-in' ? 'Dine In' : order.type === 'takeaway' ? 'Take Away' : 'Delivery',
                subType: order.tableNumber ? `Table ${order.tableNumber}` : '-',
                customerName: order.customerName || '-',
                assignTo: '-', // Could be waiter if we had that field
                items: order.items || [],
                status: order.status === 'completed' ? 'Used In Bill' : order.status,
                createdAt: order.createdAt
            }));

            // Filter by KOT ID (Order ID) if provided (since we don't have a separate KOT ID)
            const finalData = appliedFilters.kotId
                ? mapped.filter(k => k.id.toString().includes(appliedFilters.kotId))
                : mapped;

            setKots(finalData);
        } catch (error) {
            console.error('Fetch KOT Error:', error);
            toast.error("Failed to load KOT data");
        } finally {
            setLoading(false);
        }
    }, [appliedFilters]);

    useEffect(() => {
        fetchKots();
    }, [fetchKots]);

    const handleSearch = () => {
        setAppliedFilters(filters);
    };

    const handleReset = () => {
        const reset = {
            startDate: getDateTimeLocalInput(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            endDate: getDateTimeLocalInput(),
            kotId: '',
            orderNumber: '',
            customerName: '',
            orderType: 'All',
            status: 'All'
        };
        setFilters(reset);
        setAppliedFilters(reset);
    };

    const columns = [
        {
            key: 'id',
            header: 'KOT ID',
            render: (row) => (
                <button
                    onClick={() => { setSelectedOrder(row); setShowViewModal(true); }}
                    className="text-indigo-600 font-bold hover:underline"
                >
                    {row.id}
                </button>
            )
        },
        {
            key: 'orderNumber',
            header: 'Order No.',
            render: (row) => (
                <button
                    onClick={() => { setSelectedOrder(row); setShowViewModal(true); }}
                    className="font-medium text-blue-600 hover:underline"
                >
                    {row.orderNumber}
                </button>
            )
        },
        {
            key: 'type',
            header: 'Order Type',
            render: (row) => (
                <div>
                    <div className="font-semibold">{row.type}</div>
                    <div className="text-xs text-gray-500">({row.subType})</div>
                </div>
            )
        },
        {
            key: 'customerName',
            header: 'Customer Name',
            render: (row) => <span>{row.customerName || '-'}</span>
        },
        {
            key: 'assignTo',
            header: 'Assign To',
            render: (row) => <span>{row.assignTo || '-'}</span>
        },
        {
            key: 'items',
            header: 'Items',
            render: (row) => (
                <div className="text-sm font-medium text-gray-800 line-clamp-2" title={row.items?.map(i => i.itemName).join(', ')}>
                    {row.items?.length > 0 ? row.items.map(i => i.itemName).join(', ') : 'No items'}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${row.status === 'Used In Bill'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                    {row.status}
                </span>
            )
        },
        {
            key: 'created',
            header: 'Created',
            render: (row) => (
                <div className="text-xs text-gray-500">
                    <div>{new Date(row.createdAt).toLocaleDateString()}</div>
                    <div>{new Date(row.createdAt).toLocaleTimeString()}</div>
                </div>
            )
        },
        {
            key: 'action',
            header: 'Action',
            render: (row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => { setSelectedOrder(row); setShowViewModal(true); }}
                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                        title="View Details"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
                        <Printer className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const filterForm = (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-2 bg-white rounded-lg">
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Start Date</label>
                <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-red-500"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">End Date</label>
                <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-red-500"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
            </div>

            {showAllFilters && (
                <>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">KOT ID</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500"
                            value={filters.kotId}
                            onChange={(e) => setFilters({ ...filters, kotId: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Order No.</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500"
                            value={filters.orderNumber}
                            onChange={(e) => setFilters({ ...filters, orderNumber: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Customer Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500"
                            value={filters.customerName}
                            onChange={(e) => setFilters({ ...filters, customerName: e.target.value })}
                        />
                    </div>
                </>
            )}

            <div className="flex gap-2 justify-end items-end md:col-start-4 md:col-span-2">
                <button
                    onClick={handleSearch}
                    className="flex-1 py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 shadow-sm transition-colors"
                >
                    Search
                </button>
                <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                    Reset
                </button>
                <button
                    onClick={() => setShowAllFilters(!showAllFilters)}
                    className="p-1.5 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                    title={showAllFilters ? 'Hide Filters' : 'More Filters'}
                >
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
            <div className="flex-1 overflow-hidden p-1">
                <SmartTable
                    data={kots}
                    columns={columns}
                    title=""
                    isLoading={loading}
                    emptyMessage="No KOTs Found"
                    filters={filterForm}
                    actionButtons={
                        <div className="flex gap-1 items-center">
                            <button className="px-3 py-1 bg-white border-b-2 border-red-600 text-red-600 font-bold text-xs">
                                KOT
                            </button>
                            <button className="px-3 py-1 text-gray-500 font-medium text-xs hover:text-gray-700">
                                Consolidated KOT
                            </button>
                            <button className="px-3 py-1 text-gray-500 font-medium text-xs hover:text-gray-700">
                                Item Wise KOT
                            </button>
                            <div className="w-px h-4 bg-gray-200 mx-2" />
                            <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 rounded text-gray-600 text-xs hover:bg-gray-50 bg-white">
                                Action <ChevronDown className="w-3 h-3" />
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 rounded text-gray-600 text-xs hover:bg-gray-50 bg-white shadow-sm">
                                <Download className="w-3 h-3" /> Export Excel
                            </button>
                        </div>
                    }
                />
            </div>
            <OrderViewModal
                order={selectedOrder}
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
            />
        </div>
    );
}
