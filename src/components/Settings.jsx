import React, { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function Settings() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        gst_mode: 'exclusive',
        gst_percentage: '5'
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/settings`);
            setSettings(res.data);
        } catch (error) {
            console.error("Failed to load settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post(`${API_URL}/settings`, settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-violet-100 text-violet-600 rounded-2xl">
                        <Save className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Store Tax Configuration</h2>
                        <p className="text-gray-500 text-sm">Manage how GST is calculated for your orders.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* GST Mode */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                GST Calculation Mode
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                Choose how tax is applied to item prices.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.gst_mode === 'exclusive' ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="gst_mode"
                                    value="exclusive"
                                    checked={settings.gst_mode === 'exclusive'}
                                    onChange={(e) => handleChange('gst_mode', e.target.value)}
                                    className="hidden"
                                />
                                <div className="font-bold text-gray-900 dark:text-gray-100">Forward (Exclusive)</div>
                                <div className="text-xs text-gray-500 mt-1">Price + Tax</div>
                                <div className="text-xs text-gray-400 mt-2">Example: ₹100 Item + 5% GST = ₹105 Total</div>
                            </label>

                            <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.gst_mode === 'inclusive' ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="gst_mode"
                                    value="inclusive"
                                    checked={settings.gst_mode === 'inclusive'}
                                    onChange={(e) => handleChange('gst_mode', e.target.value)}
                                    className="hidden"
                                />
                                <div className="font-bold text-gray-900 dark:text-gray-100">Backward (Inclusive)</div>
                                <div className="text-xs text-gray-500 mt-1">Tax included in Price</div>
                                <div className="text-xs text-gray-400 mt-2">Example: ₹105 Total (includes ₹5 Tax)</div>
                            </label>
                        </div>
                    </div>

                    {/* GST Percentage */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Default GST Percentage (%)
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                The tax rate applied to all items unless overrided.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={settings.gst_percentage}
                                onChange={(e) => handleChange('gst_percentage', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
                                placeholder="5"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 dark:shadow-none flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Saving...' : 'Save Configuration'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                        <AlertCircle className="w-6 h-6" /> {/* Using AlertCircle as placeholder icon */}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Store Operations</h2>
                        <p className="text-gray-500 text-sm">Enable or disable specific order types for the store.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.store_dinein_enabled !== 'false' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <input
                                type="checkbox"
                                checked={settings.store_dinein_enabled !== 'false'}
                                onChange={(e) => handleChange('store_dinein_enabled', e.target.checked.toString())}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-bold text-gray-900 dark:text-gray-100">Dine-In</span>
                        </div>
                        <div className="text-xs text-gray-500">Enable in-store dining orders.</div>
                    </label>

                    <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.store_takeaway_enabled !== 'false' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <input
                                type="checkbox"
                                checked={settings.store_takeaway_enabled !== 'false'}
                                onChange={(e) => handleChange('store_takeaway_enabled', e.target.checked.toString())}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-bold text-gray-900 dark:text-gray-100">Takeaway</span>
                        </div>
                        <div className="text-xs text-gray-500">Enable takeaway/pickup orders.</div>
                    </label>

                    <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.store_delivery_enabled !== 'false' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <input
                                type="checkbox"
                                checked={settings.store_delivery_enabled !== 'false'}
                                onChange={(e) => handleChange('store_delivery_enabled', e.target.checked.toString())}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-bold text-gray-900 dark:text-gray-100">Delivery</span>
                        </div>
                        <div className="text-xs text-gray-500">Enable home delivery orders.</div>
                    </label>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none flex items-center gap-2 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Note: Changing these settings will affect how new orders are calculated. Past orders will remain unchanged.</p>
            </div>
        </div>
    );
}
