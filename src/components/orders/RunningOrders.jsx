import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Filter, Download } from 'lucide-react';
import { orderService } from '../../services/api';
import { KanbanBoard } from '../ui/KanbanBoard';
import { formatDateLocal } from '../../utils/dateUtils';

export function RunningOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Kanban Columns Configuration
    const columns = [
        { id: 'placed', title: 'To Do', color: 'bg-purple-500' },
        { id: 'preparing', title: 'Pending', color: 'bg-pink-500' },
        { id: 'served', title: 'Inprogress', color: 'bg-blue-400' },
        { id: 'completed', title: 'Completed', color: 'bg-green-500' }
    ];

    useEffect(() => {
        fetchRunningOrders();
        // Optional: Poll for updates every 30s
        const interval = setInterval(fetchRunningOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchRunningOrders = async () => {
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

            // Map API data to Kanban Items
            const mappedOrders = (response.data || []).map(order => ({
                id: order.id,
                status: order.status, // matches column ids: placed, preparing, served, completed
                title: order.customerName || `Table ${order.tableNumber || '?'}`, // Use Table number if customer name missing for Dine In
                type: order.type, // dine-in, takeaway, delivery
                subType: order.orderNumber,
                itemsCount: order.items?.length || 0,
                progress: calculateProgress(order.status),
                progressColor: getProgressColor(order.status),
                date: new Date(order.createdAt).toLocaleDateString() + ', ' + new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            // Filter out cancelled if needed, or add a Cancelled column
            const activeMapped = mappedOrders.filter(o => o.status !== 'cancelled');

            setOrders(activeMapped);

        } catch (error) {
            console.error("Error fetching running orders:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helpers for Visuals
    const calculateProgress = (status) => {
        switch (status) {
            case 'placed': return 10;
            case 'preparing': return 40;
            case 'served': return 80;
            case 'completed': return 100;
            default: return 0;
        }
    };

    const getProgressColor = (status) => {
        switch (status) {
            case 'placed': return '#a855f7'; // purple
            case 'preparing': return '#ec4899'; // pink
            case 'served': return '#3b82f6'; // blue
            case 'completed': return '#22c55e'; // green
            default: return '#ccc';
        }
    };

    // Filter Logic implies filtering the dataset passed to KanbanBoard
    const filteredOrders = orders.filter(o => {
        if (selectedFilter === 'all') return true;
        // Map UI filters to data types
        return o.type === selectedFilter; // simplistic matching for now
    });

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 gap-6 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            Total Task : <span className="font-bold text-indigo-600">{orders.length}</span>
                        </span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>Pending : {orders.filter(o => o.status === 'preparing').length}</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span>Completed : {orders.filter(o => o.status === 'completed').length}</span>
                    </div>
                </div>

                {/* Header Actions */}
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm">
                        <Plus className="w-4 h-4" /> Add Board
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Priority / Type Tabs */}
                <div className="flex items-center bg-gray-100/50 p-1 rounded-lg">
                    {['All', 'High', 'Medium', 'Low'].map(p => (
                        <button key={p} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${p === 'All' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}>
                            {p}
                        </button>
                    ))}
                </div>

                {/* Dropdowns */}
                <div className="flex flex-wrap items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50">
                        Clients <Filter className="w-3 h-3 opacity-50" />
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50">
                        <Calendar className="w-3 h-3 opacity-50" /> Created Date
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white text-gray-700 hover:bg-gray-50">
                        Select Status <Filter className="w-3 h-3 opacity-50" />
                    </button>
                    <div className="h-8 w-px bg-gray-200 mx-1"></div>
                    <button className="flex items-center gap-2 px-3 py-2 border-none text-sm text-gray-500 font-medium hover:text-indigo-600">
                        Sort By : Created Date
                    </button>
                </div>
            </div>

            {/* Kanban Board Area */}
            <div className="flex-1 overflow-hidden min-h-0">
                <KanbanBoard
                    columns={columns}
                    data={filteredOrders}
                    onStatusChange={(id, status) => console.log(`Move ${id} to ${status}`)}
                />
            </div>
        </div>
    );
}
