import React, { useState } from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';

export function AreaDeliveryCharges() {
    const [status, setStatus] = useState(true);

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <span className="hover:text-gray-700 cursor-pointer">Configuration</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-gray-700 cursor-pointer">Area/Locality Wise Delivery Charges</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-red-600">Add Area/Locality Wise Delivery Charges</span>
            </div>

            <div className="flex justify-end mb-4">
                <button className="px-4 py-1.5 border border-gray-300 bg-white rounded flex items-center gap-2 hover:bg-gray-50 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-4xl mx-auto">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-6 border-b pb-4 border-gray-100 dark:border-gray-700">
                    Add Area/Locality Wise Delivery Charges
                </h2>

                <div className="space-y-6 max-w-2xl">
                    <div className="flex items-center">
                        <label className="w-48 text-sm font-bold text-gray-700 dark:text-gray-300">
                            Area/Locality Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="flex-1 p-2 border border-blue-400 rounded focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-blue-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <div className="flex items-center">
                            <label className="w-48 text-sm font-bold text-gray-700 dark:text-gray-300">
                                Delivery Charge
                            </label>
                            <input
                                type="text"
                                className="flex-1 p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div className="ml-48 pl-2 mt-1 text-xs text-cyan-600">
                            Note: Only for Delivery Order Type
                        </div>
                    </div>

                    <div className="flex items-center">
                        <label className="w-48 text-sm font-bold text-gray-700 dark:text-gray-300">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <button
                            onClick={() => setStatus(!status)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 relative ${status ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${status ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="mt-12 flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700 bg-red-50/30 -mx-8 -mb-8 p-4">
                    <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                        Cancel
                    </button>
                    <button className="px-6 py-2 bg-red-700 text-white font-medium rounded hover:bg-red-800 text-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
