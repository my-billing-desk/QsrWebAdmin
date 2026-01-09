import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, Eye, RotateCcw, Filter, Printer } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';

export function KOT() {
    const [kots, setKots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAllFilters, setShowAllFilters] = useState(false);
    const [filters, setFilters] = useState({
        startDate: '2025-12-13 01:30:00',
        endDate: '2025-12-14 01:30:00',
        kotId: '',
        customerName: '',
        customerPhone: '',
        tableNo: '',
        orderType: 'All',
        status: 'All'
    });

    useEffect(() => {
        setLoading(true);
        // Mock data loading with delay
        setTimeout(() => {
            setKots([
                {
                    id: 2,
                    orderNumber: '102',
                    type: 'Dine In',
                    subType: 'Table 1',
                    customerName: '-',
                    assignTo: 'Waiter A',
                    items: [{ itemName: 'Blue Curco Mojito' }, { itemName: 'Lemon Mint Mojito' }, { itemName: 'Oreo Shake' }, { itemName: 'Spicy Paneer Wrap' }],
                    status: 'Used In Bill',
                    createdAt: '2025-12-13T14:41:48'
                },
                {
                    id: 1,
                    orderNumber: '101',
                    type: 'Take Away',
                    subType: '-',
                    customerName: 'John Doe',
                    assignTo: '-',
                    items: [{ itemName: 'Aloo Tikki Burger Combos' }],
                    status: 'Used In Bill',
                    createdAt: '2025-12-13T14:30:49'
                }
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const columns = [
        {
            key: 'id',
            header: 'KOT ID',
            render: (row) => <span className="font-medium text-gray-900">{row.id}</span>
        },
        {
            key: 'orderNumber',
            header: 'Order No.',
            render: (row) => <span className="font-medium text-blue-600">{row.orderNumber}</span>
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
                    {row.items?.map(i => i.itemName).join(', ')}
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row) => (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                    {row.status}
                </span>
            )
        },
        {
            key: 'created',
            header: 'Created',
            render: (row) => (
                <div className="text-xs text-gray-500">
                    {new Date(row.createdAt).toLocaleString()}
                </div>
            )
        },
        {
            key: 'action',
            header: 'Action',
            render: () => (
                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors">
                    <Printer className="w-4 h-4" />
                </button>
            )
        }
    ];

    const filterForm = (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-lg">
            {/* Always Visible */}
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">Start Date</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-red-500"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-600">End Date</label>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-red-500"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
            </div>

            {/* Collapsible */}
            {showAllFilters && (
                <>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">KOT ID</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Order No.</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Customer Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-red-500" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">Order Type</label>
                        <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-red-500">
                            <option>All</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-gray-600">KOT Status</label>
                        <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:outline-none focus:border-red-500">
                            <option>All</option>
                        </select>
                    </div>
                </>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-1 justify-end">
                <button className="w-full py-1.5 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 shadow-sm transition-colors">
                    Search
                </button>
            </div>
            <div className="flex flex-col gap-1 justify-end">
                <button
                    onClick={() => setShowAllFilters(!showAllFilters)}
                    className="w-full py-1.5 border border-gray-300 text-gray-600 rounded text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                    {showAllFilters ? 'Hide All' : 'Show All'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans overflow-hidden">
            <div className="flex-1 overflow-hidden p-4">
                <SmartTable
                    data={kots}
                    columns={columns}
                    title="KOT"
                    isLoading={loading}
                    emptyMessage="No KOTs Found"
                    filters={filterForm}
                    actionButtons={
                        <div className="flex gap-2">
                            <button className="relative pb-2 border-b-2 border-red-600 text-red-600 font-bold text-sm">
                                KOT
                            </button>
                            <button className="relative pb-2 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
                                Consolidated KOT
                            </button>
                            <button className="relative pb-2 border-b-2 border-transparent text-gray-500 font-medium text-sm hover:text-gray-700">
                                Item Wise KOT
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50 bg-white shadow-sm ml-4">
                                Action
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-gray-600 text-sm hover:bg-gray-50 bg-white shadow-sm">
                                <Download className="w-4 h-4" /> Export Excel
                            </button>
                        </div>
                    }
                />
            </div>
            {/* FAB */}
            <div className="fixed bottom-6 right-6 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-red-900 z-50">
                <div className="font-bold text-lg">💬</div>
            </div>
        </div>
    );
}
