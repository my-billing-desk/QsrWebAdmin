import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Clock, FileText, Printer, Monitor, Utensils, Mail, ShoppingBag, Palette } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ThemeSettings } from './ThemeSettings';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ToggleItem = ({ icon: Icon, title, description, isChecked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <div className="flex items-start gap-4">
            <div className="mt-1 text-gray-400">
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-500 max-w-sm">{description}</p>
            </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isChecked === 'true'}
                onChange={(e) => onChange(e.target.checked.toString())}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
        </label>
    </div>
);

export function Settings() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        gst_mode: 'exclusive',
        gst_percentage: '5',
        shifts_enabled: 'false',
        open_tickets_enabled: 'false',
        kitchen_printers_enabled: 'false',
        customer_displays_enabled: 'false',
        dining_options_enabled: 'false',
        low_stock_notifications_enabled: 'false',
        negative_stock_alerts_enabled: 'false',
        theme_config: null
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
            toast.error("Failed to load settings");
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
            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            toast.error("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto pb-24">
            {/* Header Actions */}
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Store Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-600/20"
                >
                    {saving ? 'Saving...' : 'SAVE'}
                </button>
            </div>

            {/* General Settings List (Matching Screenshot) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                <ToggleItem
                    icon={Clock}
                    title="Shifts"
                    description="Track cash that goes in and out of your drawer."
                    isChecked={settings.shifts_enabled}
                    onChange={(val) => handleChange('shifts_enabled', val)}
                />
                <ToggleItem
                    icon={FileText}
                    title="Open tickets"
                    description="Allow to save and edit orders before completing a payment."
                    isChecked={settings.open_tickets_enabled}
                    onChange={(val) => handleChange('open_tickets_enabled', val)}
                />
                <ToggleItem
                    icon={Printer}
                    title="Kitchen printers"
                    description="Send orders to kitchen printer or display."
                    isChecked={settings.kitchen_printers_enabled}
                    onChange={(val) => handleChange('kitchen_printers_enabled', val)}
                />
                <ToggleItem
                    icon={Monitor}
                    title="Customer displays"
                    description="Display order information to customers at the time of purchase."
                    isChecked={settings.customer_displays_enabled}
                    onChange={(val) => handleChange('customer_displays_enabled', val)}
                />
                <ToggleItem
                    icon={Utensils}
                    title="Dining options"
                    description="Mark orders as dine in, takeout or for delivery."
                    isChecked={settings.dining_options_enabled}
                    onChange={(val) => handleChange('dining_options_enabled', val)}
                />
                <ToggleItem
                    icon={Mail}
                    title="Low stock notifications"
                    description="Get daily email on items that are low or out of stock."
                    isChecked={settings.low_stock_notifications_enabled}
                    onChange={(val) => handleChange('low_stock_notifications_enabled', val)}
                />
                <ToggleItem
                    icon={ShoppingBag}
                    title="Negative stock alerts"
                    description="Warn cashiers attempting to sell more inventory than available in stock."
                    isChecked={settings.negative_stock_alerts_enabled}
                    onChange={(val) => handleChange('negative_stock_alerts_enabled', val)}
                />
            </div>

            {/* Existing Tax Configuration */}
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

                    {/* Round Off Setting */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Accept Decimal in Total?
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                If 'No', the final total amount will be rounded to the nearest integer.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.accept_decimal === 'true' ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="accept_decimal"
                                    value="true"
                                    checked={settings.accept_decimal === 'true'}
                                    onChange={(e) => handleChange('accept_decimal', e.target.value)}
                                    className="hidden"
                                />
                                <div className="font-bold text-gray-900 dark:text-gray-100">Yes</div>
                                <div className="text-xs text-gray-500 mt-1">Exact Total (e.g. ₹105.50)</div>
                            </label>

                            <label className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.accept_decimal !== 'true' ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                                <input
                                    type="radio"
                                    name="accept_decimal"
                                    value="false"
                                    checked={settings.accept_decimal !== 'true'}
                                    onChange={(e) => handleChange('accept_decimal', e.target.value)}
                                    className="hidden"
                                />
                                <div className="font-bold text-gray-900 dark:text-gray-100">No</div>
                                <div className="text-xs text-gray-500 mt-1">Round Off (e.g. ₹106)</div>
                            </label>
                        </div>
                    </div>

                    {/* Container Charge Setting */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Container Charge (Per Item)
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                                Amount to charge per item for Takeaway/Delivery orders.
                            </p>
                        </div>
                        <div className="flex items-center">
                            <span className="px-4 py-3 bg-gray-100 dark:bg-gray-600 border border-r-0 border-gray-200 dark:border-gray-500 rounded-l-xl text-gray-500">₹</span>
                            <input
                                type="number"
                                value={settings.container_charge || 0}
                                onChange={(e) => handleChange('container_charge', e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow"
                                placeholder="0"
                            />
                        </div>
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
            </div>

            {/* Theme Settings Section */}
            <ThemeSettings
                theme={settings.theme_config ? JSON.parse(settings.theme_config) : {}}
                onChange={(newTheme) => handleChange('theme_config', JSON.stringify(newTheme))}
            />

            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>Note: Changing these settings will affect how new orders are calculated. Past orders will remain unchanged.</p>
            </div>
        </div>
    );
}
