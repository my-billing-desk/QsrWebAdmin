import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, Calendar, ArrowLeft } from 'lucide-react';
import { financialService } from '../../services/api';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export function CashTopUpListing() {
    const [topUps, setTopUps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Add Top-Up Flow State
    const [isAddFlow, setIsAddFlow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [entries, setEntries] = useState([
        { id: 1, title: '', amount: '', explanation: '', receivedFrom: '', receivedTo: 'Cash' }
    ]);

    useEffect(() => {
        if (!isAddFlow) {
            fetchTopUps();
        } else {
            fetchCategories();
        }
    }, [isAddFlow]);

    const fetchTopUps = async () => {
        try {
            setLoading(true);
            const res = await financialService.getCashTopUps();
            setTopUps(res.data.data);
        } catch (error) {
            console.error('Error fetching cash top-ups:', error);
            toast.error('Failed to load cash top-ups');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await financialService.getCashTopUpCategories();
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddRow = () => {
        setEntries([...entries, { id: Date.now(), title: '', amount: '', explanation: '', receivedFrom: '', receivedTo: 'Cash' }]);
    };

    const handleClearRow = (id) => {
        setEntries(entries.map(e => e.id === id ? { ...e, title: '', amount: '', explanation: '', receivedFrom: '', receivedTo: 'Cash' } : e));
    };

    const handleEntryChange = (id, field, value) => {
        setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleSave = async () => {
        const validEntries = entries.filter(e => e.title && e.amount);
        if (validEntries.length === 0) {
            toast.error('Please add at least one valid top-up (Title and Amount required)');
            return;
        }

        try {
            for (const entry of validEntries) {
                await financialService.createCashTopUp({
                    date: selectedDate,
                    title: entry.title,
                    amount: parseFloat(entry.amount),
                    explanation: entry.explanation,
                    receivedFrom: entry.receivedFrom,
                    receivedTo: entry.receivedTo
                });
            }

            toast.success('Cash Top-Ups saved successfully');
            setIsAddFlow(false);
            setEntries([{ id: 1, title: '', amount: '', explanation: '', receivedFrom: '', receivedTo: 'Cash' }]);
            fetchTopUps();
        } catch (error) {
            console.error('Error saving cash top-ups:', error);
            toast.error('Failed to save cash top-ups');
        }
    };

    // Chart Data
    const chartData = topUps.slice(0, 10).map(e => ({
        name: e.title,
        amount: parseFloat(e.amount)
    }));

    if (isAddFlow) {
        return (
            <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setIsAddFlow(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Add Cash Top-Ups</h1>
                </div>

                <div className="bg-white border rounded-lg shadow-sm p-6 flex-1 overflow-auto">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date :</label>
                        <div className="relative w-64">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500 pl-10"
                            />
                            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
                        </div>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4 w-1/6">Title</th>
                                <th className="p-4 w-24">Amount</th>
                                <th className="p-4 w-1/4">Explanation</th>
                                <th className="p-4 w-1/6">Received From</th>
                                <th className="p-4 w-1/6">Received To</th>
                                <th className="p-4 text-center w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {entries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50">
                                    <td className="p-2">
                                        <select
                                            className="w-full border rounded p-2 bg-white focus:outline-none focus:border-orange-500"
                                            value={entry.title}
                                            onChange={(e) => handleEntryChange(entry.id, 'title', e.target.value)}
                                        >
                                            <option value="">Select Title</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.title}>{cat.title}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            className="w-full border rounded p-2 focus:outline-none focus:border-orange-500"
                                            placeholder="0"
                                            value={entry.amount}
                                            onChange={(e) => handleEntryChange(entry.id, 'amount', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-full border rounded p-2 focus:outline-none focus:border-orange-500"
                                            placeholder="Description"
                                            value={entry.explanation}
                                            onChange={(e) => handleEntryChange(entry.id, 'explanation', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <input
                                            type="text"
                                            className="w-full border rounded p-2 focus:outline-none focus:border-orange-500"
                                            placeholder="Received From"
                                            value={entry.receivedFrom}
                                            onChange={(e) => handleEntryChange(entry.id, 'receivedFrom', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full border rounded p-2 bg-white focus:outline-none focus:border-orange-500"
                                            value={entry.receivedTo}
                                            onChange={(e) => handleEntryChange(entry.id, 'receivedTo', e.target.value)}
                                        >
                                            <option value="Cash">To Cash</option>
                                            <option value="Bank">To Bank</option>
                                        </select>
                                    </td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => handleClearRow(entry.id)} className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-600 text-xs font-medium">Clear</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <button onClick={handleAddRow} className="text-orange-500 font-medium text-sm hover:underline flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add More Rows
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={() => setIsAddFlow(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded font-bold hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow-sm">Save Changes</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap items-end gap-4">
                <div className="w-full">
                    <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Search className="w-4 h-4" /> Search
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                    <div className="relative">
                        <input type="date" className="border rounded p-2 text-sm w-40 pl-8" defaultValue="2025-12-01" />
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-2 top-2.5 pointer-events-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                    <div className="relative">
                        <input type="date" className="border rounded p-2 text-sm w-40 pl-8" defaultValue="2026-01-04" />
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-2 top-2.5 pointer-events-none" />
                    </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                    <input type="text" className="border rounded p-2 text-sm w-full" />
                </div>
                <button className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-sm">Search</button>
                <button className="px-6 py-2 bg-white border text-gray-700 rounded font-bold hover:bg-gray-50 text-sm">Show All</button>
                <button onClick={() => setIsAddFlow(true)} className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-sm ml-auto">Add Cash Top-Up</button>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white p-6 rounded-lg shadow-sm border min-h-[200px] flex flex-col justify-center">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    Top 10 Cash Top-Ups(View Chart) <ChevronDown className="w-4 h-4" />
                </h3>
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <Tooltip />
                            <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border rounded-lg shadow-sm flex-1 overflow-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-blue-50/50 text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Total Top-Up (₹)</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {topUps.length === 0 ? (
                                <tr><td colSpan="3" className="p-4 text-center text-gray-500">No top-ups found</td></tr>
                            ) : (
                                topUps.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">{item.title}</td>
                                        <td className="p-4 text-gray-600">{parseFloat(item.amount).toFixed(2)}</td>
                                        <td className="p-4 text-right">
                                            <button className="text-xs text-gray-500 hover:text-blue-600 underline">View details</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="text-xs font-bold text-gray-500">
                Showing 1 to {topUps.length} of {topUps.length} records
            </div>
        </div>
    );
}
