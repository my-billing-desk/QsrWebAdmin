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
                        const isActive = currentPath === item.path || (item.name === 'Opening Stock' && currentPath.includes('/opening'));
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
                    <h1 className="text-xl font-bold text-gray-800">Opening Stock</h1>
                    {/* Actions */}
                </div>

                <div className="p-6 flex-1 overflow-auto bg-gray-50">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="table-standard">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Raw Material</th>
                                    <th className="table-th">Opening Stock</th>
                                    <th className="table-th">Unit</th>
                                    <th className="table-th">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">Loading...</td>
                                    </tr>
                                ) : materials.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">No materials found.</td>
                                    </tr>
                                ) : (
                                    materials.map(m => (
                                        <tr key={m.id} className="table-row">
                                            <td className="table-td font-bold text-gray-800">{m.name}</td>
                                            <td className="table-td text-gray-700">{m.currentStock}</td>
                                            <td className="table-td text-gray-500">{m.consumptionUnit}</td>
                                            <td className="table-td font-bold text-gray-800">₹ {(m.currentStock * (m.purchasePrice || 0)).toFixed(2)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OpeningStock;
