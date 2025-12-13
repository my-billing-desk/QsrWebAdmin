import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { orderService } from '../../services/api';

const ZomatoLogo = () => <span className="font-bold text-red-600 text-xl italic bg-black px-2 rounded-sm border border-white">zomato</span>;
const SwiggyLogo = () => <span className="font-bold text-orange-500 text-xl font-sans tracking-tight">Swiggy</span>;
const MagicpinLogo = () => <span className="font-bold text-purple-600 text-xl font-serif">magicpin</span>;

export function OnlineOrders() {
    const [activeTab, setActiveTab] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'All', label: 'All', icon: null },
        { id: 'Zomato', label: 'Zomato', icon: ZomatoLogo },
        { id: 'Swiggy', label: 'Swiggy', icon: SwiggyLogo },
        { id: 'Magicpin', label: 'Magicpin', icon: MagicpinLogo },
        { id: 'Eksecond', label: 'Eksecond', icon: null },
        { id: 'Gintaa Food', label: 'Gintaa Food', icon: null },
    ];

    useEffect(() => {
        const fetchOnlineOrders = async () => {
            setLoading(true);
            try {
                const today = new Date().toISOString().split('T')[0];
                const params = {
                    startDate: today + ' 00:00:00',
                    endDate: today + ' 23:59:59',
                    type: 'delivery', // Usually online orders are delivery
                    source: activeTab !== 'All' ? activeTab : undefined
                };

                const response = await orderService.getAll(params);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching online orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOnlineOrders();
    }, [activeTab]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 font-sans">
            <div className="p-4 border-b border-gray-200">
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-red-600 text-white border-red-600'
                                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon && <tab.icon />}
                            {!tab.icon && tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart/Stats Banner - Placeholder */}
            <div className="bg-blue-50/50 p-6 border-b border-gray-200">
                <div className=" h-40 flex items-center justify-center text-gray-400">
                    Chart Placeholder (No data to display)
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Record Type</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500">
                            <option>Latest current days records</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Other Order Status</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500">
                            <option>All</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-500">Order No(s)</label>
                        <input type="text" placeholder="Order id(s) must be comma(,) separated." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-red-500" />
                    </div>
                    <div className="flex items-end gap-2">
                        <button className="px-6 py-2 bg-red-700 text-white rounded font-medium shadow-sm hover:bg-red-800 transition-colors text-sm h-[38px]">Search</button>
                        <button className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-600 bg-white hover:bg-gray-50 transition-colors text-sm h-[38px]">Reset</button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-gray-500 bg-white">
                {loading ? <p>Loading...</p> :
                    orders.length > 0 ? (
                        <div className="w-full overflow-auto self-start">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3">Order No</th>
                                        <th className="p-3">Source</th>
                                        <th className="p-3">Amount</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => (
                                        <tr key={o.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{o.orderNumber}</td>
                                            <td className="p-3">{o.source || activeTab}</td>
                                            <td className="p-3">{o.totalAmount}</td>
                                            <td className="p-3"><span className="px-2 py-1 rounded bg-gray-100 text-xs">{o.status}</span></td>
                                            <td className="p-3 text-xs">{o.items.map(i => i.itemName).join(', ')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No Record Found</h3>
                            <p className="text-gray-400">Great! All your orders have invoices</p>
                        </div>
                    )
                }
            </div>

            {/* FAB */}
            <div className="fixed bottom-6 right-6">
                <button className="w-12 h-12 bg-red-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-900 transition-colors">
                    <span className="text-xl">💬</span>
                </button>
            </div>
        </div>
    );
}
