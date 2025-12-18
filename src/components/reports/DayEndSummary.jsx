import React, { useState } from 'react';
import { Search, Calendar, ChevronRight } from 'lucide-react';

export function DayEndSummary() {
    const [dates, setDates] = useState({
        start: '2025-11-16',
        end: '2025-12-17'
    });

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Day End Summary</h1>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="hover:text-gray-700 cursor-pointer">Reports</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="font-semibold text-red-600">Day End Summary</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-300 bg-white rounded text-gray-700 hover:bg-gray-50 text-sm font-medium">
                        Action
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Search</span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">Start Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full p-2 pl-3 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                                value={dates.start}
                                onChange={(e) => setDates({ ...dates, start: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500 mb-1">End Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                className="w-full p-2 pl-3 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-red-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                                value={dates.end}
                                onChange={(e) => setDates({ ...dates, end: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-8 py-2 bg-red-700 text-white font-bold rounded hover:bg-red-800 text-sm">
                            Search
                        </button>
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-50 text-sm bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                            Show All
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">No Record Found</h3>
                <p className="text-sm text-gray-500">We could not find what you searched for Try searching again</p>
            </div>
        </div>
    );
}
