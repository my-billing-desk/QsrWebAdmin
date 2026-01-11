import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Plus, FileText, Download, RotateCcw } from 'lucide-react';
import { inventoryService } from '../../services/api';
import { getTodayLocal } from '../../utils/dateUtils';

export function AvailableStock() {
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [filters, setFilters] = useState({
        rawMaterial: '',
        category: 'All',
        date: getTodayLocal() // Default to today
    });
    const [hasLoaded, setHasLoaded] = useState(false);

    // Mock Categories (should come from API)
    const categories = ['All', 'Dairy', 'Vegetable', 'Bakery', 'Frozen', 'Spices'];

    const handleLoad = async () => {
        setLoading(true);
        try {
            // Fetch logic
            const res = await inventoryService.getRawMaterials();
            let data = res.data;

            // Apply filters client side for now
            if (filters.category !== 'All') {
                data = data.filter(m => m.category === filters.category);
            }
            if (filters.rawMaterial) {
                data = data.filter(m => m.name.toLowerCase().includes(filters.rawMaterial.toLowerCase()));
            }

            setMaterials(data);
            setHasLoaded(true);
        } catch (error) {
            console.error("Failed to load stock:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFilters({
            rawMaterial: '',
            category: 'All',
            date: getTodayLocal()
        });
        setMaterials([]);
        setHasLoaded(false);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">Available Stock</h1>
                    <p className="text-sm text-gray-500 mt-1">Real-time inventory levels</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-secondary">
                        <FileText className="w-4 h-4" /> Export
                    </button>
                    <button className="btn-primary">
                        <Plus className="w-4 h-4" /> Add Stock
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 shadow-sm border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="form-label">Raw Material</label>
                        <input
                            type="text"
                            value={filters.rawMaterial}
                            onChange={(e) => setFilters(prev => ({ ...prev, rawMaterial: e.target.value }))}
                            className="input-field"
                            placeholder="Search Material"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="form-label">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="input-field"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            value={filters.date}
                            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                            className="input-field"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleLoad}
                            className="flex-1 btn-primary bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Load
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex-1 btn-secondary"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                {!hasLoaded ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="mb-6 opacity-80">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-600">Available Stock Report Not Found</h3>
                        <p className="text-gray-400 text-sm mt-2">Apply filters and click Load to view data</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="table-standard">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Raw Material</th>
                                    <th className="table-th">Category</th>
                                    <th className="table-th text-right">Current Stock</th>
                                    <th className="table-th text-right">Unit Price</th>
                                    <th className="table-th text-right">Stock Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {materials.length > 0 ? materials.map(item => (
                                    <tr key={item.id} className="table-row">
                                        <td className="table-td font-medium text-gray-900">{item.name}</td>
                                        <td className="table-td text-gray-500">{item.category || '-'}</td>
                                        <td className="table-td text-right font-medium text-blue-600">
                                            {item.currentStock} {item.consumptionUnit}
                                        </td>
                                        <td className="table-td text-right">₹ {item.purchasePrice} / {item.purchaseUnit}</td>
                                        <td className="table-td text-right font-bold text-gray-800">
                                            ₹ {((item.currentStock / item.conversionFactor) * item.purchasePrice).toFixed(2)}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">No items found matching criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AvailableStock;
