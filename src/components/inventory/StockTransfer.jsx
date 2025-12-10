import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft, Store } from 'lucide-react';

export function StockTransfer() {
    const [transfers, setTransfers] = useState([]);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 h-full flex flex-col">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Stock Transfers</h1>
                <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4" /> New Transfer
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Stock Transfers Yet</h3>
                <p className="text-gray-500 text-sm mt-2">Transfer stock between outlets or kitchen.</p>
            </div>
        </div>
    );
}
