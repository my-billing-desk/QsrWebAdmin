import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { inventoryService } from '../../services/api';

export function Indent() {
    const navigate = useNavigate();
    const location = useLocation();
    const [items, setItems] = useState([{ name: '', quantity: '', unit: '' }]);

    const sidebarItems = [
        { name: 'Closing Stock', path: '/inventory/stock/closing' },
        { name: 'Opening Stock', path: '/inventory/stock/opening' },
        { name: 'Wastage', path: '/inventory/wastage' },
        { name: 'Indent', path: '/inventory/indent', icon: true }
    ];

    const handleAddItem = () => {
        setItems([...items, { name: '', quantity: '', unit: '' }]);
    };

    const handleRemoveItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans text-sm">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 hidden md:flex">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-lg text-red-600">
                        <FileText size={20} />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200">Manage Stock</span>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {sidebarItems.map(item => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                        ? 'bg-red-50 text-red-700'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-red-500' : 'bg-gray-300'}`}></span>
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center shrink-0">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Indent / Purchase Request</h1>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow hover:bg-red-700 text-xs">
                        <Send className="w-4 h-4" /> Send Request
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-auto">
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 max-w-4xl mx-auto">
                        <h3 className="font-bold text-gray-700 mb-4">Create New Request</h3>
                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <input placeholder="Item Name" className="flex-1 p-2 border rounded" />
                                    <input placeholder="Qty" className="w-24 p-2 border rounded" type="number" />
                                    <input placeholder="Unit" className="w-24 p-2 border rounded" />
                                    <button onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-red-600 font-bold text-sm">
                            <Plus size={16} /> Add Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
