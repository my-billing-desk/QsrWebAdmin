import React, { useState, useEffect } from 'react';
import {
    LayoutGrid, Link2, FileCheck, Search, Filter, ChevronRight,
    ShoppingCart, Truck, Calculator, Users, CreditCard, Monitor, Award,
    Zap, Share2, Layers
} from 'lucide-react';
import { aggregatorService } from '../services/api';

import { QRCodeSVG } from 'qrcode.react';

export default function Marketplace() {
    const [activeTab, setActiveTab] = useState('integration'); // Default to integration as it matches the detailed screenshot
    const [integrations, setIntegrations] = useState([]);

    // QR Code Modal State
    const [showQRModal, setShowQRModal] = useState(false);
    const [qrType, setQrType] = useState('dine-in'); // 'dine-in' | 'take-away'
    const [tableNo, setTableNo] = useState('1');

    // Mock Data for Services Tab
    const servicesCategories = [
        {
            title: 'POS Plans', items: [
                { id: 1, title: 'POS Subscription - Renewal', icon: Monitor, label: 'Renewal' },
                { id: 2, title: ' - Growth Plan', icon: Layers, label: 'Explore Now' },
                { id: 3, title: ' - Scale Plan', icon: Layers, label: 'Explore Now' },
            ]
        },
        {
            title: 'Easy Operations', items: [
                { id: 4, title: 'Kitchen Display System (KDS)', icon: Monitor, label: 'Free Trial', badge: '7 Days Free' },
                { id: 5, title: 'Inventory Application', icon: Layers, label: 'Activated', badge: 'Active' },
                { id: 6, title: 'Captain Application', icon: Users, label: 'Explore Now' },
            ]
        }
    ];

    // Mock Data for Active Subscription Tab
    const subscriptions = [
        { id: 1, title: ' Scan & Order', expiry: '05 Oct 2025', price: '4,500', tax: '+ Taxes', status: 'Active', isScanOrder: true },
        { id: 2, title: 'WhatsApp Alerts', expiry: '14 Dec 2025', price: '1000', tax: '+ Taxes', status: 'Active' },
        { id: 3, title: 'POS Subscription', expiry: '20 Feb 2026', price: '7000', tax: '+ Taxes', status: 'Active' },
    ];

    useEffect(() => {
        // Fetch real aggregators for the "Online Orders" section
        async function loadAggregators() {
            try {
                const res = await aggregatorService.getAll();
                const onlineOrders = res.data.map(agg => ({
                    id: agg.id,
                    name: agg.name,
                    icon: agg.icon,
                    category: 'Online Orders',
                    status: agg.isConnected ? 'Connected' : 'Explore Now',
                    isConnected: agg.isConnected
                }));
                // Add mocked other integrations
                const otherIntegrations = [
                    { id: 101, name: 'Shadowfax', category: 'Order Delivery', icon: null, status: 'Explore Now' },
                    { id: 102, name: 'Dunzo', category: 'Order Delivery', icon: null, status: 'Explore Now' },
                    { id: 103, name: 'Tally', category: 'Accounting', icon: null, status: 'Explore Now' },
                    { id: 104, name: 'Zoho Books', category: 'Accounting', icon: null, status: 'Explore Now' },
                    { id: 105, name: 'Bingage', category: 'Loyalty Programs', icon: null, status: 'Explore Now' },
                    { id: 106, name: 'Reelo', category: 'Loyalty Programs', icon: null, status: 'Explore Now' },
                    { id: 107, name: 'Razorpay', category: 'Payments', icon: null, status: 'Explore Now' },
                    { id: 108, name: 'Paytm', category: 'Payments', icon: null, status: 'Explore Now' },
                ];
                setIntegrations([...onlineOrders, ...otherIntegrations]);
            } catch (e) { console.error(e); }
        }
        loadAggregators();
    }, []);

    // Helper to group integrations by category
    const groupedIntegrations = integrations.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const getQRValue = () => {
        const baseUrl = window.location.origin + '/scan-order';
        if (qrType === 'take-away') {
            return `${baseUrl}?type=take-away`;
        }
        return `${baseUrl}?type=dine-in&table=${tableNo}`;
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-10 relative">
            {/* Find Next-Gen Tools Banner */}
            <div className="bg-gradient-to-r from-red-50 to-pink-100 p-8 mb-6 border-b border-pink-100 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Next-Gen Tools To Revolutionalize</h1>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Restaurant Business</h2>
                    <div className="bg-black text-white text-xs inline-flex items-center px-3 py-1.5 rounded uppercase tracking-wider font-semibold">
                        Explore 23+ Services & 40+ Integrations
                    </div>
                </div>
                {/* Illustration placeholder */}
                <div className="absolute right-10 bottom-0 opacity-80 pointer-events-none">
                    <Users size={200} className="text-red-200 opacity-20" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
                <div className="flex space-x-12">
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors font-medium ${activeTab === 'services' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <LayoutGrid size={18} /> Services
                    </button>
                    <button
                        onClick={() => setActiveTab('integration')}
                        className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors font-medium ${activeTab === 'integration' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <Link2 size={18} /> Integration
                    </button>
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors font-medium ${activeTab === 'subscription' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        <FileCheck size={18} /> Active Subscription
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Content */}
                {activeTab === 'services' && (
                    <div className="space-y-10">
                        {servicesCategories.map((cat, idx) => (
                            <div key={idx}>
                                <h3 className="text-lg font-bold text-gray-800 mb-4">{cat.title}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {cat.items.map(item => (
                                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center hover:shadow-lg transition-shadow relative">
                                            {item.badge && (
                                                <span className={`absolute top-0 left-0 text-[10px] font-bold px-2 py-1 rounded-br-lg ${item.badge === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                                                <item.icon size={24} />
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 text-center mb-6 h-10 flex items-center">{item.title}</h4>
                                            <button className={`text-xs font-bold flex items-center gap-1 ${item.label === 'Activated' ? 'text-green-600' : 'text-orange-500'}`}>
                                                {item.label} <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'integration' && (
                    <div className="space-y-12">
                        {/* Category Filter Bar (Visual Only) */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                            {['Online Orders', 'Order Delivery', 'Accounting', 'Loyalty Programs', 'Payments', 'Hardware'].map(cat => (
                                <button key={cat} className="px-4 py-2 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 whitespace-nowrap shadow-sm">
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Render Groups */}
                        {Object.entries(groupedIntegrations).map(([category, items]) => (
                            <div key={category}>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    {category === 'Online Orders' && <ShoppingCart size={18} className="text-red-500" />}
                                    {category === 'Order Delivery' && <Truck size={18} className="text-blue-500" />}
                                    {category === 'Accounting' && <Calculator size={18} className="text-green-500" />}
                                    {category === 'Loyalty Programs' && <Award size={18} className="text-purple-500" />}
                                    {category === 'Payments' && <CreditCard size={18} className="text-orange-500" />}
                                    {category}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {items.map(item => (
                                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center hover:shadow-md transition-shadow">
                                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-2 mb-3 shadow-inner">
                                                {item.icon ? (
                                                    <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-400">{item.name[0]}</span>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 mb-1">{item.name}</h4>

                                            <div className="mt-auto pt-3 w-full text-center">
                                                {item.isConnected ? (
                                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Connected</span>
                                                ) : (
                                                    <button className="text-xs font-bold text-orange-500 flex items-center justify-center gap-1 w-full hover:underline">
                                                        Explore Now <ChevronRight size={12} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'subscription' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center hover:shadow-lg transition-transform hover:-translate-y-1">
                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded flex items-center justify-center mb-6">
                                    <FileCheck size={24} />
                                </div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">{sub.title}</h3>
                                <p className="text-xs text-gray-500 mb-6 font-medium">Expired on : {sub.expiry}</p>

                                <div className="flex items-end gap-1 mb-8">
                                    <span className="text-3xl font-bold text-gray-800">₹ {sub.price}</span>
                                    <span className="text-xs text-gray-400 mb-1">{sub.tax}</span>
                                </div>

                                <div className="text-xs text-gray-400 mb-4">Activate this service for 1 Year</div>

                                {sub.isScanOrder ? (
                                    <button
                                        onClick={() => setShowQRModal(true)}
                                        className="w-full py-2.5 border border-red-500 bg-red-50 text-red-600 font-bold rounded hover:bg-red-100 transition-colors">
                                        Generate QR Code
                                    </button>
                                ) : (
                                    <button className="w-full py-2.5 border border-red-500 text-red-600 font-bold rounded hover:bg-red-50 transition-colors">
                                        Renew Existing Plan
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* QR Code Modal */}
            {showQRModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
                        {/* Close Button */}
                        <button onClick={() => setShowQRModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <span className="text-2xl">&times;</span>
                        </button>

                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Scan & Order QR Code</h2>
                            <p className="text-sm text-gray-500 text-center mb-6">Generate QR code for customers to scan and order.</p>

                            {/* Tabs */}
                            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                                <button
                                    onClick={() => setQrType('dine-in')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${qrType === 'dine-in' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Dine-In
                                </button>
                                <button
                                    onClick={() => setQrType('take-away')}
                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${qrType === 'take-away' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Take-Away
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-4">
                                {qrType === 'dine-in' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                                        <input
                                            type="text"
                                            value={tableNo}
                                            onChange={(e) => setTableNo(e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-xl border border-gray-100">
                                    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mb-4">
                                        <QRCodeSVG value={getQRValue()} size={180} />
                                    </div>
                                    <p className="text-xs font-mono text-gray-500 text-center break-all">{getQRValue()}</p>
                                </div>

                                <button
                                    className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
                                    onClick={() => window.print()}
                                >
                                    Print QR Code
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
