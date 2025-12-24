import React, { useState, useEffect } from 'react';
import { Search, Save, FileText, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { inventoryService } from '../../services/api';

export function OpeningStock() {
    const navigate = useNavigate();
    const location = useLocation();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const sidebarItems = [
        { name: 'Closing Stock', path: '/inventory/stock/closing' },
        { name: 'Opening Stock', path: '/inventory/stock/opening', icon: true },
        { name: 'Wastage', path: '/inventory/wastage' },
        { name: 'Indent', path: '/inventory/indent' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await inventoryService.getRawMaterials();
            setMaterials(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Opening Stock</h1>
                    {/* Actions */}
                </div>

                <div className="p-6 flex-1 overflow-auto">
                    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase text-gray-700">
                                <tr>
                                    <th className="p-4">Raw Material</th>
                                    <th className="p-4">Opening Stock</th>
                                    <th className="p-4">Unit</th>
                                    <th className="p-4">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {materials.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold">{m.name}</td>
                                        <td className="p-4">{m.currentStock}</td>
                                        <td className="p-4 text-gray-500">{m.consumptionUnit}</td>
                                        <td className="p-4">₹ {(m.currentStock * (m.purchasePrice || 0)).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
