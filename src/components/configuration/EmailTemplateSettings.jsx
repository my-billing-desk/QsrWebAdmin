import React, { useState } from 'react';
import { ChevronRight, Image as ImageIcon, Edit2 } from 'lucide-react';

export function EmailTemplateSettings() {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <span className="hover:text-gray-700 cursor-pointer">Configuration</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-red-600">Email Settings</span>
            </div>

            <p className="text-xs text-blue-500 mb-6">[This Email Template Configured Would Be Utilised In Emails Sent For Ebill And Gift Card Service Only.]</p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Config Panel */}
                <div className="w-full md:w-1/3 p-6 border-r border-gray-100 dark:border-gray-700 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Add Logo</label>
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 flex flex-col items-center justify-center text-blue-400 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors">
                            <ImageIcon className="w-8 h-8 mb-2" />
                        </div>
                        <p className="text-[10px] text-blue-400 mt-1 italic">
                            Note: Please upload file in JPEG/PNG/JPG format. Maximum file size: 500 KB
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Header Color</label>
                        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded">
                            <div className="w-6 h-6 bg-[#C52031] rounded shadow-sm border border-gray-200"></div>
                            <input type="text" value="#C52031" className="flex-1 text-sm outline-none bg-transparent" readOnly />
                            <Edit2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Outlet Address</label>
                        <textarea className="w-full p-2 border border-gray-300 rounded h-24 text-sm outline-none resize-none focus:border-blue-500"></textarea>
                        <p className="text-[10px] text-blue-400 mt-1 italic">Note: Must be under 750 characters.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Outlet Contact No.</label>
                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-blue-500" />
                    </div>
                </div>

                {/* Right Preview Panel */}
                <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
                    <div className="w-full max-w-lg space-y-8">
                        {/* Header card */}
                        <div className="bg-[#C52031] text-white p-6 rounded-lg h-32 flex items-center justify-between shadow-md relative overflow-hidden">
                            <div className="text-xl font-bold tracking-wider z-10">PETPOOJA</div>
                            {/* Decorative icons mock */}
                            <div className="flex gap-4 opacity-50 z-10">
                                <span className="text-xs">❄️</span>
                                <span className="text-xs">🍛</span>
                                <span className="text-xs">👤</span>
                            </div>
                            {/* Background pattern mask overlay mock */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
                        </div>

                        {/* Body Text */}
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
                            <p>Hello,</p>
                            <p>Greetings of the day.</p>
                            <p>Payment of Rs. 560 has been done successfully at Android Live from the gift card 1234567890.</p>
                            <p>Remaining balance: Rs. 9082</p>
                        </div>

                        {/* Footer */}
                        <div className="bg-[#2D3748] text-gray-300 p-6 rounded-lg text-xs space-y-2 shadow-md">
                            <div className="flex items-start gap-2">
                                <span className="mt-0.5">📍</span>
                                <span>3rd Floor, Tower-A, Gopal Palace, Nehrunagar, Ambawadi, Ahmedabad, Gujarat - 380015.</span>
                            </div>
                            <div className="flex flex-wrap gap-4 pl-6">
                                <span className="flex items-center gap-1">📞 07969 223344</span>
                                <span className="flex items-center gap-1">📧 support@petpooja.com</span>
                                <span className="flex items-center gap-1">🌐 https://petpooja.com/</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex justify-end gap-2 z-10">
                <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 text-sm">
                    Cancel
                </button>
                <button className="px-6 py-2 bg-red-700 text-white font-medium rounded hover:bg-red-800 text-sm">
                    Save
                </button>
            </div>
        </div>
    );
}
