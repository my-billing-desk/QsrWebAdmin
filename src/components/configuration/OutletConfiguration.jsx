import React, { useState, useEffect } from 'react';
import {
    Store, MapPin, Clock, CreditCard, FileText, Layout,
    Monitor, Printer, Users, Settings, Smartphone, Truck, MessageSquare, ChevronRight, Search, Activity, Wifi, WifiOff, Palette
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { posDeviceService } from '../../services/api';

export function OutletConfiguration() {
    const { user } = useAuth();
    console.log('OutletConfiguration user:', user);
    const [deviceStats, setDeviceStats] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeviceInfo();
    }, []);

    const fetchDeviceInfo = async () => {
        try {
            const [statsRes, devicesRes] = await Promise.all([
                posDeviceService.getStats(),
                posDeviceService.getAll()
            ]);
            setDeviceStats(statsRes.data);
            setDevices(devicesRes.data.devices || []);
        } catch (error) {
            console.error('Error fetching device info:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyTenantId = () => {
        const id = user?.tenantId || user?.Tenant?.id;
        if (id) {
            navigator.clipboard.writeText(id.toString());
            toast.success('Restaurant ID copied to clipboard!');
        }
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <span className="text-red-600">|</span>
                    Below are the configuration to manage your outlet information.
                </h1>

                <div className="flex justify-end gap-2 mt-4 text-xs font-semibold">
                    <div className="px-3 py-1 bg-white border rounded shadow-sm text-gray-700 flex items-center gap-2">
                        Restaurant: ID - <span className="text-red-600 font-bold">{user?.tenantId || user?.Tenant?.id || 'N/A'}</span>
                        <button
                            onClick={copyTenantId}
                            className="ml-2 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded border text-[10px] uppercase"
                        >
                            Copy
                        </button>
                    </div>
                    <div className="px-3 py-1 bg-white border rounded shadow-sm">Desktop Version : <span className="text-red-600">119.0.2</span></div>
                    <button className="px-4 py-1 bg-red-600 text-white rounded flex items-center gap-1">Search <Search className="w-3 h-3" /></button>
                </div>
            </div>

            {/* POS Device Statistics */}
            <Section title="Active POS Systems">
                <div className="col-span-full mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-6 h-6 text-purple-600" />
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Installed POS Devices</h3>
                            </div>
                            <button
                                onClick={fetchDeviceInfo}
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg flex items-center gap-2"
                            >
                                <Activity className="w-4 h-4" />
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading device information...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{deviceStats?.total || 0}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Total Devices</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
                                        <div className="flex items-center gap-2">
                                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{deviceStats?.active || 0}</div>
                                            <Wifi className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Active (Online)</div>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{deviceStats?.inactive || 0}</div>
                                            <WifiOff className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Offline</div>
                                    </div>
                                </div>

                                {/* Device List */}
                                {devices.length > 0 ? (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">Device Information</h4>
                                        {devices.map((device, index) => (
                                            <div
                                                key={device.id}
                                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-full ${device.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-100">{device.deviceName}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {device.platform || 'Unknown'} • {device.deviceType || 'Desktop'} • v{device.appVersion || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Last active: {device.lastActiveAt ? new Date(device.lastActiveAt).toLocaleString() : 'Never'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${device.isOnline
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                                        }`}>
                                                        {device.isOnline ? 'Online' : 'Offline'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No POS devices registered yet. Install and activate a POS system to see it here.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </Section>

            <Section title="Appearance & Branding">
                <ConfigCard
                    icon={Palette}
                    title="Theme Configuration"
                    desc="Choose your brand color theme. This color will be applied across all connected apps — POS, Kitchen Display, and Mobile."
                    to="/config/theme"
                />
            </Section>

            <Section title="Outlet Information">
                <ConfigCard icon={FileText} title="Outlet Details" desc="Configure email id, address, Logo of an Outlet." to="/config/outlet-details" />
                <ConfigCard icon={Smartphone} title="Contact Details" desc="Configure contact details of your's and your staff details to reach by mybill team." />
                <ConfigCard icon={Clock} title="Outlet Timings" desc="Configure Closing hours, lunch & dinner timings, timing information to display on various places." />
                <ConfigCard icon={CreditCard} title="Payment" desc="Configure Currency and Payment Types available." to="/accounting/payments" />
                <ConfigCard icon={FileText} title="Invoice Sequence" desc="Configure multiple invoice sequence" />
                <ConfigCard icon={Layout} title="Floor Plan" desc="create your own floor plan using tables" to="/config/floor-plan" />
            </Section>

            <Section title="Billing Screen">
                <ConfigCard icon={Monitor} title="Display" desc="Configure the billing screen display, look & values." />
                <ConfigCard icon={Monitor} title="Set Your Print Logo" desc="Logo to print at your desktop point of sale." />
                <ConfigCard icon={Layout} title="Calculations" desc="Configure how invoice gets calculate." />
                <ConfigCard icon={Settings} title="Connected Services" desc="Configure how different services gets connects." to="/config/marketplace" />
                <ConfigCard icon={Printer} title="Print" desc="Configure the print settings of the Bill and KOT." to="/config/email-template" />
                <ConfigCard icon={Users} title="Customer" desc="Configure the billing screen and it's component." />
            </Section>

            <Section title="Online/Advance Order">
                <ConfigCard icon={Smartphone} title="Online/Advance Order Configuration" desc="Configure auto accept, Duration, Cancel timings etc. of Online Orders." to="/config/sub-order" />
            </Section>

            <Section title="System Setting">
                <ConfigCard icon={Monitor} title="Billing System" desc="Configure Billing screen internal settings." />
            </Section>

            <Section title="Notification Setting">
                <ConfigCard icon={Monitor} title="SMS Configuration" desc="Configure the option to receive SMS from mybill." />
            </Section>

            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-red-900 transition-colors">
                    <MessageSquare className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 ml-1">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {children}
            </div>
        </div>
    );
}

function ConfigCard({ icon: Icon, title, desc, to }) {
    const CardContent = (
        <div className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer h-full">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 text-gray-500">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
        </div>
    );

    if (to) {
        return <Link to={to} className="block h-full">{CardContent}</Link>;
    }

    return CardContent;
}

