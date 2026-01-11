import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, FileText, RotateCcw, Eye, Edit, Trash2, X, Calendar, ArrowLeft } from 'lucide-react';
import { ExpenseCategory } from './ExpenseCategory';
import { WithdrawalListing } from './WithdrawalListing';
import { WithdrawalMaster } from './WithdrawalMaster';
import { CashTopUpListing } from './CashTopUpListing';
import { CashTopUpMaster } from './CashTopUpMaster';
import { financialService } from '../../services/api';

import toast from 'react-hot-toast';

export function Expenses() {
    const [activeTab, setActiveTab] = useState('expense_listing');
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // Add Expense Flow State
    const [isAddExpenseFlow, setIsAddExpenseFlow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [expenseEntries, setExpenseEntries] = useState([
        { id: 1, reason: '', amount: '', explanation: '', employee: 'Admin', paidFrom: 'Cash' }
    ]);

    const [filters, setFilters] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        title: ''
    });

    const [rawExpenses, setRawExpenses] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const tabs = [
        { id: 'expense_listing', label: 'Expense Listing' },
        { id: 'expense_master', label: 'Expense Master' },
        { id: 'withdrawal_listing', label: 'Withdrawal Listing' },
        { id: 'withdrawal_master', label: 'Withdrawal Master' },
        { id: 'cash_topup_listing', label: 'Cash Top-Up Listing' },
        { id: 'cash_topup_master', label: 'Cash Top-Up Master' },
    ];

    useEffect(() => {
        if (activeTab === 'expense_listing') {
            fetchExpenses();
        }
    }, [activeTab]);

    useEffect(() => {
        if (isAddExpenseFlow) {
            fetchMasterReasons();
        }
    }, [isAddExpenseFlow]);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const res = await financialService.getExpenses(filters);

            // Store raw expenses for editing
            const rawData = res.data.data;
            setRawExpenses(rawData);

            // Aggregate by Reason
            const aggregated = rawData.reduce((acc, curr) => {
                const reason = curr.reason || 'Other';
                if (!acc[reason]) {
                    acc[reason] = {
                        reason: reason,
                        amount: 0,
                        count: 0,
                        entries: []
                    };
                }
                acc[reason].amount += parseFloat(curr.amount);
                acc[reason].count += 1;
                acc[reason].entries.push(curr);
                return acc;
            }, {});

            setExpenses(Object.values(aggregated).sort((a, b) => b.amount - a.amount));
        } catch (error) {
            console.error('Error fetching expenses:', error);
            toast.error('Failed to load expenses');
        } finally {
            setLoading(false);
        }
    };

    const fetchMasterReasons = async () => {
        try {
            const res = await financialService.getExpenseMaster();
            setCategories(res.data.data);
        } catch (error) {
            console.error('Error fetching master reasons:', error);
        }
    };


    const handleAddExpenseClick = () => {
        setIsEditing(false);
        setIsAddExpenseFlow(true);
        setExpenseEntries([{ id: 1, reason: '', amount: '', explanation: '', employee: 'Admin', paidFrom: 'Cash' }]);
    };

    const handleEditDayClick = () => {
        if (filters.startDate !== filters.endDate) return;

        setSelectedDate(filters.startDate);
        const entries = rawExpenses.map(exp => ({
            id: exp.id,
            reason: exp.reason,
            amount: exp.amount,
            explanation: exp.explanation || '',
            employee: exp.employee || '',
            paidFrom: exp.paidFrom || 'Cash',
            isExisting: true
        }));

        if (entries.length === 0) {
            setExpenseEntries([{ id: Date.now(), reason: '', amount: '', explanation: '', employee: 'Admin', paidFrom: 'Cash' }]);
        } else {
            setExpenseEntries(entries);
        }

        setIsEditing(true);
        setIsAddExpenseFlow(true);
    };

    const setDatePreset = (preset) => {
        const today = new Date();
        let start = new Date();
        let end = new Date();

        switch (preset) {
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'this_week':
                start.setDate(today.getDate() - today.getDay());
                break;
            case 'last_7':
                start.setDate(today.getDate() - 7);
                break;
            case 'this_month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'last_30':
                start.setDate(today.getDate() - 30);
                break;
            default:
                break;
        }

        const newFilters = {
            ...filters,
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
        setFilters(newFilters);
        // We need to trigger fetch manually or rely on useEffect if we add filters to dep
    };

    // Update useEffect to watch filters
    useEffect(() => {
        if (activeTab === 'expense_listing') {
            fetchExpenses();
        }
    }, [activeTab, filters.startDate, filters.endDate]);

    const handleAddEntryRow = () => {
        setExpenseEntries([...expenseEntries, { id: Date.now(), reason: '', amount: '', explanation: '', employee: '', paidFrom: 'Cash' }]);
    };

    const handleRemoveEntryRow = (id) => {
        setExpenseEntries(expenseEntries.filter(e => e.id !== id));
    };

    const handleClearEntryRow = (id) => {
        setExpenseEntries(expenseEntries.map(e => e.id === id ? { ...e, reason: '', amount: '', explanation: '', employee: '', paidFrom: 'Cash' } : e));
    };

    const handleEntryChange = (id, field, value) => {
        setExpenseEntries(expenseEntries.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const handleSaveExpenses = async () => {
        const validEntries = expenseEntries.filter(e => e.reason && e.amount);
        if (validEntries.length === 0) {
            toast.error('Please add at least one valid expense (Reason and Amount required)');
            return;
        }

        try {
            if (isEditing) {
                // To "Edit" a day, we clear all existing entries for that date and rebuild from UI list
                await financialService.deleteExpensesByDate(selectedDate);
            }

            const payload = validEntries.map(e => ({
                date: selectedDate,
                reason: e.reason,
                amount: parseFloat(e.amount),
                explanation: e.explanation,
                employee: e.employee,
                paidFrom: e.paidFrom
            }));

            await financialService.createExpense(payload);
            toast.success(isEditing ? 'Expenses for the day updated successfully' : 'Expenses saved successfully');
            setIsAddExpenseFlow(false);
            setExpenseEntries([{ id: 1, reason: '', amount: '', explanation: '', employee: 'Admin', paidFrom: 'Cash' }]);
            fetchExpenses();
        } catch (error) {
            console.error('Error saving expenses:', error);
            toast.error('Failed to save expenses');
        }
    };

    const grandTotal = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

    if (isAddExpenseFlow) {
        return (
            <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => setIsAddExpenseFlow(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Add Expenses</h1>
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
                        <p className="text-xs text-gray-500 mt-2">Note: Only rows with reason & amount will get saved.</p>
                        <p className="text-xs text-gray-500">Note: Record added from the web dashboard would not be visible in PoS</p>
                    </div>

                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4 w-1/6">Reason</th>
                                <th className="p-4 w-24">Amount</th>
                                <th className="p-4 w-1/4">Explanation</th>
                                <th className="p-4 w-1/6">Employee</th>
                                <th className="p-4 w-1/6">Paid From</th>
                                <th className="p-4 text-center w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {expenseEntries.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50">
                                    <td className="p-2">
                                        <div className="relative">
                                            <input
                                                list={`master-reasons-${entry.id}`}
                                                className="w-full border rounded p-2 focus:outline-none focus:border-red-500"
                                                placeholder="Type or select reason"
                                                value={entry.reason}
                                                onChange={(e) => handleEntryChange(entry.id, 'reason', e.target.value)}
                                            />
                                            <datalist id={`master-reasons-${entry.id}`}>
                                                {categories.map((reason, idx) => (
                                                    <option key={idx} value={reason.get ? reason.get('title') : reason.title} />
                                                ))}
                                            </datalist>
                                        </div>
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
                                            className="w-full border rounded p-2 focus:outline-none focus:border-red-500"
                                            placeholder="Enter name"
                                            value={entry.employee}
                                            onChange={(e) => handleEntryChange(entry.id, 'employee', e.target.value)}
                                        />
                                    </td>
                                    <td className="p-2">
                                        <select
                                            className="w-full border rounded p-2 bg-white focus:outline-none focus:border-orange-500"
                                            value={entry.paidFrom}
                                            onChange={(e) => handleEntryChange(entry.id, 'paidFrom', e.target.value)}
                                        >
                                            <option value="Cash">From Cash</option>
                                            <option value="Bank">From Bank</option>
                                        </select>
                                    </td>
                                    <td className="p-2 text-center">
                                        <button onClick={() => handleClearEntryRow(entry.id)} className="px-3 py-1 border rounded hover:bg-gray-100 text-gray-600 text-xs font-medium">Clear</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <button onClick={handleAddEntryRow} className="text-orange-500 font-medium text-sm hover:underline flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add More Rows
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <button onClick={() => setIsAddExpenseFlow(false)} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded font-bold hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSaveExpenses} className="px-6 py-2 bg-red-700 text-white rounded font-bold hover:bg-red-800 shadow-sm">Save Changes</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* Header */}
            <div className="flex justify-between items-center">
                {/* Tabs */}
                <div className="flex gap-6 border-b w-full overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? 'text-gray-900 border-b-2 border-red-500'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                    {activeTab === 'expense_listing' && (
                        <button onClick={handleAddExpenseClick} className="px-4 py-2 bg-red-600 text-white rounded font-bold shadow-sm hover:bg-red-700 flex items-center gap-2 text-sm">
                            Add Expense
                        </button>
                    )}
                    <div className="text-sm font-bold text-gray-700 whitespace-nowrap">
                        Grand Total : <span className="text-red-600">₹ {grandTotal.toLocaleString()}</span>
                    </div>
                    <button className="px-3 py-2 bg-white border rounded text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        Export Excel <ChevronDown className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'expense_listing' && (
                    <div className="flex flex-col h-full gap-4">
                        {/* Date Presets */}
                        <div className="bg-white p-3 rounded-lg shadow-sm border flex flex-wrap gap-2 items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase mr-2">Quick Filters:</span>
                            {[
                                { id: 'today', label: 'Today' },
                                { id: 'yesterday', label: 'Yesterday' },
                                { id: 'this_week', label: 'This Week' },
                                { id: 'last_7', label: 'Last 7 Days' },
                                { id: 'this_month', label: 'This Month' },
                                { id: 'last_30', label: 'Last 30 Days' }
                            ].map(preset => (
                                <button
                                    key={preset.id}
                                    onClick={() => setDatePreset(preset.id)}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${(preset.id === 'today' && filters.startDate === filters.endDate && filters.startDate === new Date().toISOString().split('T')[0])
                                        ? 'bg-red-50 border-red-200 text-red-600'
                                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    {preset.label}
                                </button>
                            ))}

                            {filters.startDate === filters.endDate && (
                                <button
                                    onClick={handleEditDayClick}
                                    className="ml-auto px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full hover:bg-orange-600 shadow-sm flex items-center gap-1.5"
                                >
                                    <Edit className="w-3 h-3" /> Manage This Day
                                </button>
                            )}
                        </div>

                        {/* Filters */}
                        <div
                            className="bg-white p-3 rounded-lg shadow-sm border flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        >
                            <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-500" /> Custom Search
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSearchExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        {isSearchExpanded && (
                            <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-wrap items-end gap-4 animate-in slide-in-from-top-2 duration-200">
                                <div className="w-full">
                                    <div className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <Search className="w-4 h-4" /> Refine Selection
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="border rounded p-2 text-sm w-40 pl-8"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                        />
                                        <Calendar className="w-4 h-4 text-gray-400 absolute left-2 top-2.5 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="border rounded p-2 text-sm w-40 pl-8"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                        />
                                        <Calendar className="w-4 h-4 text-gray-400 absolute left-2 top-2.5 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                                    <input
                                        type="text"
                                        className="border rounded p-2 text-sm w-full"
                                        value={filters.title}
                                        onChange={(e) => setFilters({ ...filters, title: e.target.value })}
                                    />
                                </div>
                                <button onClick={fetchExpenses} className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-sm">Search</button>
                            </div>
                        )}

                        {/* Table */}
                        <div className="bg-white border rounded-lg shadow-sm flex-1 overflow-auto min-h-0">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading...</div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-blue-50/50 text-xs font-bold text-gray-800 border-b">
                                        <tr>
                                            <th className="p-4">Title</th>
                                            <th className="p-4">Total Expense Reported (₹)</th>
                                            <th className="p-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y">
                                        {expenses.length === 0 ? (
                                            <tr><td colSpan="3" className="p-4 text-center text-gray-500">No expenses found</td></tr>
                                        ) : (
                                            expenses.map((exp) => (
                                                <tr key={exp.id} className="hover:bg-gray-50">
                                                    <td className="p-4 font-medium text-gray-800">{exp.reason}</td>
                                                    <td className="p-4 text-gray-600">{parseFloat(exp.amount).toFixed(2)}</td>
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
                            Showing 1 to {expenses.length} of {expenses.length} records
                        </div>
                    </div>
                )}
                {activeTab === 'expense_master' && <ExpenseCategory />}
                {activeTab === 'withdrawal_listing' && <WithdrawalListing />}
                {activeTab === 'withdrawal_master' && <WithdrawalMaster />}
                {activeTab === 'cash_topup_listing' && <CashTopUpListing />}
                {activeTab === 'cash_topup_master' && <CashTopUpMaster />}
            </div>
        </div>
    );
}
