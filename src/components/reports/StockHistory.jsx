import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Calendar, Filter, Printer } from 'lucide-react';

export function StockHistory() {
    const [activeTab, setActiveTab] = useState('Stock History');

    // Mock Data based on reference
    const [stockHistory] = useState([
        { id: 1, sku: 'PT001', product: 'Lenovo IdeaPad 3', img: 'lp', initial: 6000, added: 100, sold: 100, defective: 100, final: 100 },
        { id: 2, sku: 'PT002', product: 'Beats Pro', img: 'hp', initial: 10, added: 140, sold: 140, defective: 140, final: 140 },
        { id: 3, sku: 'PT003', product: 'Nike Jordan', img: 'shoe', initial: 8, added: 300, sold: 300, defective: 300, final: 300 },
        { id: 4, sku: 'PT004', product: 'Apple Series 5 Watch', img: 'watch', initial: 10, added: 450, sold: 450, defective: 450, final: 450 },
        { id: 5, sku: 'PT005', product: 'Amazon Echo Dot', img: 'echo', initial: 5, added: 320, sold: 320, defective: 320, final: 320 },
        { id: 6, sku: 'PT006', product: 'Sanford Chair Sofa', img: 'sofa', initial: 7, added: 650, sold: 650, defective: 650, final: 650 },
        { id: 7, sku: 'PT007', product: 'Red Premium Satchel', img: 'bag', initial: 15, added: 700, sold: 700, defective: 700, final: 700 },
        { id: 8, sku: 'PT008', product: 'Iphone 14 Pro', img: 'ph', initial: 12, added: 630, sold: 630, defective: 630, final: 630 },
        { id: 9, sku: 'PT009', product: 'Gaming Chair', img: 'ch', initial: 10, added: 410, sold: 410, defective: 410, final: 410 },
        { id: 10, sku: 'PT010', product: 'Borealis Backpack', img: 'bp', initial: 20, added: 550, sold: 550, defective: 550, final: 550 },
    ]);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                {/* Tabs - Styled like buttons in header area or just below title if standard */}
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
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>
                </div>
            </div>


            {/* 2. Filters Card */}
            <div className="bg-white border rounded-lg shadow-sm p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1 relative">
                        <label className="text-sm font-semibold text-gray-700">Choose Date</label>
                        <div className="relative">
                            <input type="text" defaultValue="12/24/2025 - 12/30/2025" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1 relative">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <div className="relative">
                            <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                <option>All</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-1 relative">
                        <label className="text-sm font-semibold text-gray-700">Products</label>
                        <div className="relative">
                            <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                <option>All</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <button className="w-full py-2.5 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Main Content Card - Table */}
            <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="font-bold text-gray-800 text-lg">Customer Report</h2> {/* Reference says Customer Report in body? Might be a typo in design, likely Stock Report */}
                    <div className="flex gap-2">
                        <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                        <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                        <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><Printer className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-xs font-bold text-gray-800 border-b text-gray-600">
                            <tr>
                                <th className="p-4">SKU</th>
                                <th className="p-4">Product</th>
                                <th className="p-4">Initial Quantity</th>
                                <th className="p-4">Added Quantity</th>
                                <th className="p-4">Sold Quantity</th>
                                <th className="p-4">Defective Quantity</th>
                                <th className="p-4">Final Quantity</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {stockHistory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-600">{item.sku}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center border text-xs text-gray-400">img</div>
                                            <span className="font-bold text-gray-700">{item.product}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{item.initial}</td>
                                    <td className="p-4 text-gray-600">{item.added}</td>
                                    <td className="p-4 text-gray-600">{item.sold}</td>
                                    <td className="p-4 text-gray-600">{item.defective}</td>
                                    <td className="p-4 text-gray-600">{item.final}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        Row Per Page
                        <select className="border rounded px-2 py-1 bg-white">
                            <option>10</option>
                        </select>
                        Entries
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">&lt;</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-200">1</button>
                        <button className="p-1 rounded hover:bg-gray-100 text-gray-500">&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
