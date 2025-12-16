import React, { useState, useEffect } from 'react';
import { aggregatorService } from '../services/api';
import { RefreshCw, Search, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AggregatorCenter() {
    const [aggregators, setAggregators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAggregators();
    }, []);

    const fetchAggregators = async () => {
        try {
            setLoading(true);
            const res = await aggregatorService.getAll();
            setAggregators(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await aggregatorService.toggle(id);
            // Optimistic update
            setAggregators(prev => prev.map(agg =>
                agg.id === id ? { ...agg, isConnected: !agg.isConnected } : agg
            ));
        } catch (error) {
            console.error("Failed to toggle", error);
            alert("Failed to update status");
        }
    };

    return (
        <div className="p-6 bg-gray-50/50 min-h-screen font-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Aggregator Center</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your online ordering platform integrations</p>
                </div>
                <button
                    onClick={fetchAggregators}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {aggregators.map(agg => (
                    <div key={agg.id} className={`bg-white rounded-xl border p-6 transition-all duration-300 ${agg.isConnected ? 'border-green-200 shadow-md ring-1 ring-green-100' : 'border-gray-200 shadow-sm opacity-90'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 overflow-hidden">
                                {agg.icon ? (
                                    <img src={agg.icon} alt={agg.name} className="w-full h-full object-contain" />
                                ) : (
                                    <span className="text-xl font-bold text-gray-400">{agg.name[0]}</span>
                                )}
                            </div>
                            <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${agg.isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {agg.isConnected ? 'Connected' : 'Disconnected'}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{agg.name}</h3>
                            <p className="text-xs text-gray-500">
                                {agg.isConnected ? 'Receiving orders and syncing menu.' : 'Connect to start accepting orders.'}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            {agg.isConnected ? (
                                <Link to={`/marketplace/config/${agg.slug || agg.name}`} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <LinkIcon className="w-3 h-3" /> Configure
                                </Link>
                            ) : <span></span>}

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={agg.isConnected}
                                    onChange={() => handleToggle(agg.id)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {aggregators.length === 0 && !loading && (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-500 font-medium">No aggregators found</h3>
                </div>
            )}
        </div>
    );
}
