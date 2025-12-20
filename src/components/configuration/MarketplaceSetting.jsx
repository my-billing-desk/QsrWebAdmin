import React, { useState } from 'react';

import IntegrationDetail from './IntegrationDetail';

export function MarketplaceSetting() {
    const [activeTab, setActiveTab] = useState('POS Subscription');
    const [selectedIntegration, setSelectedIntegration] = useState(null);

    // Mock Aggregators
    const aggregators = [
        {
            id: 1,
            name: 'Zomato',
            icon: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zomato_Logo.svg',
            category: 'Food Aggregator',
            isConnected: true, // Mock logic: Zomato is connected
            requestStatus: 'received'
        },
        {
            id: 2,
            name: 'Swiggy',
            icon: 'https://upload.wikimedia.org/wikipedia/en/1/12/Swiggy_logo.svg',
            category: 'Food Aggregator',
            isConnected: false,
            requestStatus: 'none'
        }
    ];

    if (selectedIntegration) {
        return <IntegrationDetail integration={selectedIntegration} onBack={() => setSelectedIntegration(null)} />;
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans flex gap-6">

            {/* Left Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 h-fit overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="font-bold text-gray-800 dark:text-gray-200">Services Configurations</h2>
                </div>
                <div>
                    <button
                        onClick={() => setActiveTab('POS Subscription')}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'POS Subscription'
                            ? 'border-red-600 bg-red-50 text-red-600 dark:bg-red-900/10'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                    >
                        POS Subscription
                    </button>
                    <button
                        onClick={() => setActiveTab('Online Orders Integration')}
                        className={`w-full text-left px-4 py-3 text-sm font-medium border-l-4 transition-colors ${activeTab === 'Online Orders Integration'
                            ? 'border-red-600 bg-red-50 text-red-600 dark:bg-red-900/10'
                            : 'border-transparent text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'
                            }`}
                    >
                        Online Orders Integration
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {activeTab === 'POS Subscription' && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <h2 className="font-bold text-gray-800 dark:text-gray-200">POS Subscription</h2>
                        </div>

                        <div className="p-8 space-y-8 max-w-3xl">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    How Would You Like To Send The Ebill Messages To You Customers?
                                </label>
                                <div>
                                    <div className="flex gap-4 items-center mb-2">
                                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                            <input type="radio" name="ebill" className="text-red-500 focus:ring-red-500" />
                                            Text message
                                        </label>
                                        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                            <input type="radio" name="ebill" defaultChecked className="text-red-500 focus:ring-red-500" />
                                            WhatsApp Message
                                        </label>
                                    </div>
                                    <p className="text-xs text-blue-500 leading-relaxed">
                                        [Note: This configuration would not work if you have an active WhatsApp campaign or Green Receipt to send the ebill to customers.]
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    Provide No. Of Days To Set As POS Subscription Link Expiry Time.
                                </label>
                                <div>
                                    <input type="number" defaultValue="2" className="w-20 p-2 border border-gray-300 rounded text-sm outline-none focus:border-red-500" />
                                    <p className="text-xs text-blue-500 mt-2 leading-relaxed">
                                        [Mentioning " 0 " days will consider as Link will not to expire ever.]
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 pt-2">
                                    Sender ID
                                </label>
                                <div>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:border-red-500 mb-2" />
                                    <p className="text-xs text-blue-500 leading-relaxed">
                                        [Enter your 6 characters Sender ID. The sender ID is the name of the eBill sender which will display on the customer's phone eg. DM-PPOOJA or MD-PTPOOJ.]
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="bg-red-50/50 p-4 flex justify-end">
                            <button className="px-6 py-2 bg-red-700 text-white font-bold rounded shadow-sm hover:bg-red-800 text-sm">
                                Save
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'Online Orders Integration' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aggregators.map(agg => (
                            <div
                                key={agg.id}
                                onClick={() => setSelectedIntegration(agg)}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center p-2 border border-gray-100 dark:border-gray-600">
                                        <img src={agg.icon} alt={agg.name} className="w-full h-full object-contain" />
                                    </div>
                                    {agg.isConnected ? (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">Connected</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold">Connect</span>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{agg.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{agg.category}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
