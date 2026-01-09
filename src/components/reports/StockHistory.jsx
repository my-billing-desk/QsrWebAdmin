import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Calendar, Filter, Printer } from 'lucide-react';
import { SmartTable } from '../ui/SmartTable';
import { inventoryService } from '../../services/api';
import { getTodayLocal, formatDateDisplay } from '../../utils/dateUtils';

export function StockHistory() {
    const [activeTab, setActiveTab] = useState('Stock History');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [filters, setFilters] = useState({
        fromDate: getTodayLocal(),
        toDate: getTodayLocal(),
        category: 'All',
        product: 'All'
    });

    const fetchReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await inventoryService.getStockSummaryReport({
                fromDate: filters.fromDate,
                toDate: filters.toDate
            });
            setReportData(res.data);
        } catch (err) {
            console.error('Failed to fetch stock history:', err);
            setError('Failed to load report data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleGenerateReport = () => {
        fetchReport();
    };

    const handleReset = () => {
        setFilters({
            fromDate: getTodayLocal(),
            toDate: getTodayLocal(),
            category: 'All',
            product: 'All'
        });
    };

    const columns = [
        {
            key: 'sku',
            header: 'SKU',
            render: (item) => <span className="text-gray-600 font-mono text-xs">{item.sku}</span>
        },
        {
            key: 'name',
            header: 'Product',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-orange-50 flex items-center justify-center border border-orange-100 text-[10px] text-orange-400 font-bold uppercase">
                        {item.name.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-700">{item.name}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{item.unit}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'opening',
            header: 'Initial Qty',
            align: 'center',
            render: (item) => <span className="font-medium text-gray-600">{(item.opening || 0).toFixed(2)}</span>
        },
        {
            key: 'purchase',
            header: 'Added Qty (+)',
            align: 'center',
            render: (item) => <span className="font-medium text-green-600">{(item.purchase || 0).toFixed(2)}</span>
        },
        {
            key: 'consumed',
            header: 'Sold Qty (-)',
            align: 'center',
            render: (item) => <span className="font-medium text-red-500">{(item.consumed || 0).toFixed(2)}</span>
        },
        {
            key: 'wastage',
            header: 'Defective (-)',
            align: 'center',
            render: (item) => <span className="font-medium text-orange-500">{(item.wastage || 0).toFixed(2)}</span>
        },
        {
            key: 'closingStock',
            header: 'Final Qty',
            align: 'center',
            render: (item) => <span className="font-bold text-gray-800 bg-orange-50/20 px-2 py-1 rounded">{(item.closingStock || 0).toFixed(2)}</span>
        }
    ];

    const actionButtons = (
        <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><Printer className="w-4 h-4" /></button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    {['Inventory Report', 'Stock History', 'Sold Stock'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Stock History</h1>
                    <div className="text-sm text-gray-500">View Reports of Stock History</div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"
                        title="Reset Filters"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>
                </div>
            </div>

            {/* 2. Filters Card */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1 relative">
                        <label className="text-sm font-semibold text-gray-700">From Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                                className="w-full border rounded p-2 text-sm focus:outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-1 relative">
                        <label className="text-sm font-semibold text-gray-700">To Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                                className="w-full border rounded p-2 text-sm focus:outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-1 relative">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <div className="relative">
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500"
                            >
                                <option>All</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full py-2.5 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 disabled:bg-orange-300"
                        >
                            {loading ? 'Generating...' : 'Generate Report'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Card - Table */}
            <div className="flex-1 overflow-hidden">
                <SmartTable
                    data={reportData}
                    columns={columns}
                    title="Stock Summary Report"
                    actionButtons={actionButtons}
                    isLoading={loading}
                    emptyMessage="No records found for the selected period."
                />
            </div>
        </div>
    );
}
