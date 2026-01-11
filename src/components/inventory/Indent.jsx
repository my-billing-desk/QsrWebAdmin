import React, { useState } from 'react';
import { Plus, Trash2, FileText, Send } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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

    const currentPath = location.pathname;

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans text-sm">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
                <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <FileText size={20} />
                    </div>
                    <span className="font-bold text-gray-800">Manage Stock</span>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {sidebarItems.map(item => {
                        const isActive = currentPath === item.path || (item.name === 'Indent' && currentPath.includes('/indent'));
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">Indent / Purchase Request</h1>
                    <button className="btn-primary">
                        <Send className="w-4 h-4" /> Send Request
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-auto bg-gray-50">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
                        <h3 className="font-bold text-gray-800 mb-4">Create New Request</h3>
                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center">
                                    <input placeholder="Item Name" className="input-field flex-1" />
                                    <input placeholder="Qty" className="input-field w-24" type="number" />
                                    <input placeholder="Unit" className="input-field w-24" />
                                    <button onClick={() => handleRemoveItem(idx)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded transition-colors"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddItem} className="mt-6 btn-secondary text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 w-full justify-center">
                            <Plus size={16} /> Add Another Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
