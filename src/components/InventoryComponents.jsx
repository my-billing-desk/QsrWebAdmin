import React, { useState } from 'react';
import {
    Package, Plus, Search, Filter, Save, Truck,
    Calendar, FileText, ChevronDown, MoreVertical
} from 'lucide-react';

export function InventoryComponents({ activeView }) {
    switch (activeView) {
        case 'inventory_item': return <InventoryItemMaster />;
        case 'stock_purchase': return <StockPurchaseOld />;
        case 'available_stock': return <StockStatus />;
        default: return <InventoryItemMaster />;
    }
}

// --- 1. Inventory Item Master ---
export function InventoryItemMaster() {
    const [items, setItems] = useState([
        { id: 1, name: 'Burger Bun', category: 'Bakery', unit: 'Pcs', cost: 5.00, stock: 150 },
        { id: 2, name: 'Chicken Patty', category: 'Frozen', unit: 'Pcs', cost: 25.00, stock: 80 },
        { id: 3, name: 'Cheese Slice', category: 'Dairy', unit: 'Slice', cost: 8.00, stock: 200 },
        { id: 4, name: 'Tomato', category: 'Vegetable', unit: 'Kg', cost: 40.00, stock: 5.5 },
    ]);

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Package className="w-6 h-6 text-orange-500" /> Inventory Items
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage raw materials and ingredients</p>
                </div>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Item
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full pl-9 pr-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <button className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-sm font-medium sticky top-0">
                            <tr>
                                <th className="p-4">Item Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Unit</th>
                                <th className="p-4">Cost Price</th>
                                <th className="p-4">Current Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                            {items.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.name}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">
                                        <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-xs font-semibold">{item.category}</span>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">{item.unit}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-300">₹{item.cost.toFixed(2)}</td>
                                    <td className="p-4 font-bold text-gray-900 dark:text-gray-100">{item.stock} {item.unit}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// --- 2. Stock Purchase ---
export function StockPurchaseOld() {
    return (
        <div className="p-6 h-full bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-green-600" /> New Stock Purchase
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold mb-4">Supplier & Invoice Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                <select className="w-full p-2 border rounded-lg bg-gray-50">
                                    <option>Select Supplier</option>
                                    <option>Metro Cash & Carry</option>
                                    <option>Local Vendor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                                <div className="relative">
                                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="date" className="w-full pl-9 p-2 border rounded-lg bg-gray-50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                                <input type="text" placeholder="INV-2023-001" className="w-full p-2 border rounded-lg bg-gray-50" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold mb-4">Add Items</h3>
                        <div className="flex gap-2 mb-4">
                            <input type="text" placeholder="Search Item to add..." className="flex-1 p-2 border rounded-lg bg-gray-50" />
                            <input type="number" placeholder="Qty" className="w-24 p-2 border rounded-lg bg-gray-50" />
                            <input type="number" placeholder="Rate" className="w-24 p-2 border rounded-lg bg-gray-50" />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 font-medium text-gray-500">
                                    <tr>
                                        <th className="p-3">Item</th>
                                        <th className="p-3">Qty</th>
                                        <th className="p-3">Rate</th>
                                        <th className="p-3 text-right">Amount</th>
                                        <th className="p-3"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="p-3">Burger Bun</td>
                                        <td className="p-3">50</td>
                                        <td className="p-3">₹5.00</td>
                                        <td className="p-3 text-right">₹250.00</td>
                                        <td className="p-3 text-red-500 cursor-pointer text-right">Remove</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
                    <h3 className="font-bold mb-4">Purchase Summary</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="font-medium">₹250.00</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tax (5%)</span>
                            <span className="font-medium">₹12.50</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Discount</span>
                            <span className="text-green-600">- ₹0.00</span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹262.50</span>
                        </div>
                    </div>
                    <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" /> Save Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- 3. Stock Status ---
export function StockStatus() {
    return (
        <div className="p-6 h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-500" /> Current Stock Status
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Real-time inventory levels</p>
                </div>
                <button className="border border-gray-300 bg-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                    <ChevronDown className="w-4 h-4" /> Export Report
                </button>
            </div>
            {/* Same table as Master but read-only with value calc */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center text-gray-400">
                <Package className="w-16 h-16 mb-4 text-gray-200" />
                <h3 className="text-lg font-semibold text-gray-600">Stock Report Generation</h3>
                <p>Select date range to view detailed stock movement.</p>
            </div>
        </div>
    );
}
