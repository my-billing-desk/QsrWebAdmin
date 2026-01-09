import React, { useState } from 'react';
import { X, Search, RotateCcw } from 'lucide-react';
import { orderService } from '../../services/api';

export function GenerateInvoiceModal({ onClose }) {
    const [filters, setFilters] = useState({
        platform: 'All',
        recordType: 'Latest',
        orderIds: ''
    });
    const [results, setResults] = useState(null); // null = no search done/reset, [] = empty, [...] = results
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        // Simulator delay for "searching"
        setTimeout(() => {
            setResults([]); // Mocking "No Record Found" as per screenshot default state
            setLoading(false);
        }, 800);
    };

    const handleReset = () => {
        setFilters({ platform: 'All', recordType: 'Latest', orderIds: '' });
        setResults(null);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[85vh] overflow-hidden m-4">

                {/* Header */}
                <div className="flex justify-between items-start p-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-none">Generate Invoice</h2>
                        <p className="text-[11px] text-gray-500 mt-1">
                            Create invoices for online orders received but not previously invoiced.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto bg-gray-50 flex-1">

                    {/* Search Panel */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold border-b border-gray-100 pb-2 text-sm">
                            <Search className="w-3.5 h-3.5 text-[#444ce7]" /> Search Filters
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                            <div className="md:col-span-3">
                                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Platform</label>
                                <select
                                    value={filters.platform}
                                    onChange={e => setFilters({ ...filters, platform: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#444ce7] outline-none"
                                >
                                    <option value="All">All Platforms</option>
                                    <option value="Swiggy">Swiggy</option>
                                    <option value="Zomato">Zomato</option>
                                </select>
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Record Type</label>
                                <select
                                    value={filters.recordType}
                                    onChange={e => setFilters({ ...filters, recordType: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#444ce7] outline-none"
                                >
                                    <option value="Latest">Current Day</option>
                                    <option value="History">History Records</option>
                                </select>
                            </div>

                            <div className="md:col-span-4">
                                <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">Order Id(s)</label>
                                <input
                                    value={filters.orderIds}
                                    onChange={e => setFilters({ ...filters, orderIds: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#444ce7] outline-none"
                                    placeholder="e.g. 1234, 5678"
                                />
                                <span className="text-[9px] text-gray-400 mt-1 block italic text-right">Comma(,) separated</span>
                            </div>

                            <div className="md:col-span-2 flex gap-2 pt-5">
                                <button
                                    onClick={handleSearch}
                                    className="flex-1 bg-[#444ce7] hover:bg-[#3538cd] text-white font-bold py-2 rounded-lg text-[11px] transition-all shadow-sm active:scale-95"
                                >
                                    Search
                                </button>
                                <button
                                    onClick={handleReset}
                                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-lg text-[11px] transition-all border border-gray-200 shadow-sm active:scale-95"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Area - Default / Empty State */}
                    <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        {loading ? (
                            <div className="text-gray-500 flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#444ce7] mb-3"></div>
                                <span className="text-xs font-medium">Searching...</span>
                            </div>
                        ) : (
                            <div className="text-center max-w-xs">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <Search className="w-8 h-8 text-[#444ce7] opacity-80" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1">No Records Found</h3>
                                <p className="text-[11px] text-gray-400 leading-relaxed font-medium px-4">
                                    Great! All your orders have been invoiced already. No outstanding actions needed.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
