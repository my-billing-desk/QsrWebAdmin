import React, { useState } from 'react';
import { Truck, MapPin, Plus, Edit, Trash2, Save, Search, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export function AreaDeliveryCharges() {
    const [areas, setAreas] = useState([
        { id: 1, name: 'Kormangala', distance: '2km', charge: 30, minOrder: 200, status: 'active' },
        { id: 2, name: 'HSR Layout', distance: '5km', charge: 50, minOrder: 500, status: 'active' },
        { id: 3, name: 'Indiranagar', distance: '8km', charge: 80, minOrder: 800, status: 'inactive' },
    ]);

    const handleToggleStatus = (id) => {
        setAreas(areas.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a));
        toast.success("Status updated");
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Truck className="w-6 h-6 text-red-600" />
                        Area Wise Delivery Charges
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage delivery charges based on customer location/area.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-none">
                    <Plus className="w-4 h-4" /> Add New Area
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 bg-gray-50/50 dark:bg-gray-700/30">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search area or pincode..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Global Sync</span>
                            <div className="flex items-center gap-2">
                                <Globe className="w-3 h-3 text-blue-500" />
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Synchronized</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                <th className="px-6 py-4">Area / Locality Name</th>
                                <th className="px-6 py-4">Est. Distance</th>
                                <th className="px-6 py-4">Delivery Charge</th>
                                <th className="px-6 py-4">Min. Order Value</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {areas.map((area) => (
                                <tr key={area.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-gray-100">{area.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 italic">{area.distance}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">₹{area.charge}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Min. ₹{area.minOrder}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(area.id)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${area.status === 'active'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}
                                        >
                                            {area.status}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Pricing Tool */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Distance Based Automatic Rules</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">0 - 2 KM</span>
                            <span className="font-bold">Free</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">2 - 5 KM</span>
                            <span className="font-bold text-red-600">₹30</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                            <span className="text-sm text-gray-600 dark:text-gray-400">5 - 10 KM</span>
                            <span className="font-bold text-red-600">₹60</span>
                        </div>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-900/20">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg flex items-center justify-center mb-4">
                        <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-red-900 dark:text-red-100 mb-2">Delivery Strategy</h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4 opacity-80">
                        Setting higher minimum order values for distant areas helps maintain profitability.
                        Consider offering free delivery for orders above ₹1,000 regardless of area.
                    </p>
                    <button className="text-sm font-bold text-red-600 dark:text-red-400 hover:underline">
                        Configure Thresholds →
                    </button>
                </div>
            </div>
        </div>
    );
}
