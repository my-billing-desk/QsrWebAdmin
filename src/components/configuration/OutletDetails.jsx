import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { outletService } from '../../services/api';
import toast from 'react-hot-toast';

export function OutletDetails() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [outlet, setOutlet] = useState({
        name: '',
        address: '',
        enableTables: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await outletService.getConfig();
            if (res.data) {
                setOutlet(res.data);
            }
        } catch (error) {
            console.error("Failed to load outlet config", error);
            toast.error("Failed to load configuration");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await outletService.updateConfig(outlet);
            toast.success("Outlet details updated successfully");
        } catch (error) {
            console.error("Failed to update config", error);
            toast.error("Failed to update configuration");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Outlet Details</h1>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

                {/* General Info */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Outlet Name</label>
                            <input
                                type="text"
                                value={outlet.name || ''}
                                onChange={e => setOutlet({ ...outlet, name: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={outlet.address || ''}
                                onChange={e => setOutlet({ ...outlet, address: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License Number</label>
                            <input
                                type="text"
                                value={outlet.fssaiLicNo || ''}
                                onChange={e => setOutlet({ ...outlet, fssaiLicNo: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter FSSAI License No."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                            <input
                                type="text"
                                value={outlet.gstNumber || ''}
                                onChange={e => setOutlet({ ...outlet, gstNumber: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter GST Number"
                            />
                        </div>
                    </div>
                </div>

                {/* Operations */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Operations</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <h3 className="font-medium text-gray-900">Table Management</h3>
                                <p className="text-sm text-gray-500">Enable if you have dine-in tables and want to track orders by table number.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={outlet.enableTables || false}
                                    onChange={e => setOutlet({ ...outlet, enableTables: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
