import React, { useState } from 'react';
import { Calculator, Save, Plus, Trash2, History } from 'lucide-react';
import toast from 'react-hot-toast';

export function Denomination() {
    const [entries, setEntries] = useState([
        { id: 1, note: 2000, count: 0 },
        { id: 2, note: 500, count: 0 },
        { id: 3, note: 200, count: 0 },
        { id: 4, note: 100, count: 0 },
        { id: 5, note: 50, count: 0 },
        { id: 6, note: 20, count: 0 },
        { id: 7, note: 10, count: 0 },
        { id: 8, note: 5, count: 0 },
        { id: 9, note: 2, count: 0 },
        { id: 10, note: 1, count: 0 },
    ]);

    const handleCountChange = (id, count) => {
        setEntries(entries.map(e => e.id === id ? { ...e, count: parseInt(count) || 0 } : e));
    };

    const totalAmount = entries.reduce((acc, curr) => acc + (curr.note * curr.count), 0);

    const handleSave = () => {
        toast.success("Denomination record saved successfully");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-red-600" />
                        Cash Denomination
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Record cash counting for shift closing or day end.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <History className="w-4 h-4" /> History
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Denomination Details</span>
                        <span className="text-xs text-gray-400">Date: {new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {entries.map((entry) => (
                            <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4 w-1/3">
                                    <div className="w-12 h-8 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded flex items-center justify-center font-bold border border-green-200 dark:border-green-800">
                                        ₹{entry.note}
                                    </div>
                                    <span className="text-gray-400">×</span>
                                </div>
                                <div className="flex-1 px-4">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-center font-bold focus:ring-2 focus:ring-red-500 outline-none"
                                        value={entry.count || ''}
                                        onChange={(e) => handleCountChange(entry.id, e.target.value)}
                                    />
                                </div>
                                <div className="w-1/3 text-right">
                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                        ₹{(entry.note * entry.count).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-red-600 rounded-xl p-6 text-white shadow-xl shadow-red-200 dark:shadow-none">
                        <p className="text-sm opacity-80 font-medium">Total Cash Amount</p>
                        <h2 className="text-4xl font-extrabold mt-2">₹{totalAmount.toLocaleString()}</h2>
                        <div className="mt-6 pt-6 border-t border-white/20">
                            <div className="flex justify-between text-sm">
                                <span className="opacity-80">Total Notes</span>
                                <span className="font-bold">{entries.reduce((acc, c) => acc + c.count, 0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Remarks</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                            rows="4"
                            placeholder="Add any notes about this cash count..."
                        ></textarea>
                        <button
                            onClick={handleSave}
                            className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-red-600 text-white rounded-lg font-bold hover:opacity-90 transition-all"
                        >
                            <Save className="w-4 h-4" /> Save Record
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
