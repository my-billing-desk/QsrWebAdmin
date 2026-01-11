import React, { useState, useEffect } from 'react';
import { Search, Save, FileText, Calendar, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { inventoryService, menuService } from '../../services/api';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTodayLocal } from '../../utils/dateUtils';

export function ClosingStock() {
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDate, setSelectedDate] = useState(getTodayLocal());
    const [updateFrequency, setUpdateFrequency] = useState('Daily');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Inputs
    const [inputData, setInputData] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    // Mapping for sidebar items
    const sidebarItems = [
        { name: 'Closing Stock', path: '/inventory/stock/closing', icon: true },
        { name: 'Opening Stock', path: '/inventory/stock/opening' },
        { name: 'Wastage', path: '/inventory/wastage' },
        { name: 'Indent', path: '/inventory/indent' }
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [matRes, catRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                inventoryService.getCategories()
            ]);
            setMaterials(matRes.data || []);
            // Extract unique categories from materials or use the fetched categories if available
            const uniqueCats = catRes.data ? catRes.data.map(c => c.name) : [...new Set((matRes.data || []).map(m => m.category || 'Uncategorized'))];
            setCategories(uniqueCats);
        } catch (error) {
            console.error("Failed to load data", error);
            // toast.error("Failed to load stock data"); // Optional: suppress if it's just initial load noise
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (id, field, value) => {
        setInputData(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        const updates = Object.entries(inputData).map(([idStr, data]) => {
            const id = parseInt(idStr);
            const item = materials.find(m => m.id === id);
            if (!item) return null;

            const pQty = parseFloat(data.purchaseQty || 0);
            const cQty = parseFloat(data.consumptionQty || 0);

            const hasPurchase = data.hasOwnProperty('purchaseQty') && data.purchaseQty !== '';
            const hasConsumption = data.hasOwnProperty('consumptionQty') && data.consumptionQty !== '';

            if (!hasPurchase && !hasConsumption && !data.comments) return null;

            const conversion = item.conversionFactor || 1;
            const totalStock = (pQty * conversion) + cQty;

            return {
                id: item.id,
                closingStock: totalStock,
                unit: item.consumptionUnit,
                comments: data.comments,
                date: selectedDate
            };
        }).filter(u => u !== null);

        if (updates.length === 0) {
            toast('No changes to save');
            return;
        }

        try {
            await inventoryService.updateClosingStock({ updates });
            toast.success("Closing stock updated successfully");
            loadData();
            setInputData({});
        } catch (error) {
            console.error(error);
            toast.error("Failed to save stock");
        }
    };

    // Filter Logic
    const filteredMaterials = (materials || []).filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMaterials.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const currentPath = location.pathname;

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 font-sans text-sm">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex">
                <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                        <FileText size={20} />
                    </div>
                    <span className="font-bold text-gray-800">Manage Stock</span>
                </div>
                <div className="p-2 space-y-1 overflow-y-auto flex-1">
                    {sidebarItems.map(item => {
                        const isActive = currentPath === item.path || (item.name === 'Closing Stock' && currentPath.includes('/closing'));
                        return (
                            <button
                                key={item.name}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                                {item.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Title */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
                    <h1 className="text-xl font-bold text-gray-800">Closing Stock</h1>
                    <div className="flex gap-3">
                        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" /> Add Stock
                        </button>
                        <button className="btn-secondary flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Files
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shrink-0">
                    <div className="space-y-1">
                        <label className="form-label">Raw Material</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="input-field pl-9"
                                placeholder="Search..."
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="form-label">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="input-field"
                        >
                            <option value="All">All</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="form-label">Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={e => setSelectedDate(e.target.value)}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="form-label">Frequency</label>
                        <select
                            value={updateFrequency}
                            onChange={e => setUpdateFrequency(e.target.value)}
                            className="input-field"
                        >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-bold text-xs" onClick={loadData}>
                            Load
                        </button>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedDate(getTodayLocal()); }}
                            className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-xs"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto bg-gray-50 p-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="table-standard">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">Category</th>
                                    <th className="table-th">Raw Material</th>
                                    <th className="table-th">Closing Stock ({selectedDate})</th>
                                    <th className="table-th w-96">Update Your Closing Stock</th>
                                    <th className="table-th">Comments</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td>
                                    </tr>
                                ) : currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">No items found matching your filters.</td>
                                    </tr>
                                ) : (
                                    currentItems.map(item => (
                                        <tr key={item.id} className="table-row">
                                            <td className="table-td text-gray-500 font-medium">
                                                {item.category}
                                            </td>
                                            <td className="table-td">
                                                <div className="font-bold text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-400 mt-1">[ Unit: {item.consumptionUnit} ]</div>
                                            </td>
                                            <td className="table-td font-bold text-gray-700">
                                                {(() => {
                                                    const stock = item.currentStock || 0;
                                                    const factor = item.conversionFactor || 1;

                                                    if (factor > 1 && item.purchaseUnit !== item.consumptionUnit) {
                                                        const pQty = Math.floor(stock / factor);
                                                        const cQty = stock % factor;

                                                        let display = `${pQty} ${item.purchaseUnit}`;
                                                        if (cQty > 0) {
                                                            display += ` (${cQty % 1 === 0 ? cQty : cQty.toFixed(2)} ${item.consumptionUnit})`;
                                                        }
                                                        if (pQty === 0) {
                                                            display = `${cQty % 1 === 0 ? cQty : cQty.toFixed(2)} ${item.consumptionUnit}`;
                                                        }
                                                        return display;
                                                    }
                                                    return `${stock} ${item.consumptionUnit}`;
                                                })()}
                                            </td>
                                            <td className="table-td">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative flex-1">
                                                            <input
                                                                type="number"
                                                                value={inputData[item.id]?.purchaseQty || ''}
                                                                onChange={e => handleInputChange(item.id, 'purchaseQty', e.target.value)}
                                                                className="input-field pr-12"
                                                                placeholder="0"
                                                            />
                                                            <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">
                                                                / {item.purchaseUnit}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {item.purchaseUnit !== item.consumptionUnit && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative flex-1">
                                                                <input
                                                                    type="number"
                                                                    value={inputData[item.id]?.consumptionQty || ''}
                                                                    onChange={e => handleInputChange(item.id, 'consumptionQty', e.target.value)}
                                                                    className="input-field pr-12"
                                                                    placeholder="0"
                                                                />
                                                                <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">
                                                                    / {item.consumptionUnit}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="table-td">
                                                <input
                                                    type="text"
                                                    value={inputData[item.id]?.comments || ''}
                                                    onChange={e => handleInputChange(item.id, 'comments', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Comments"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center shrink-0">
                    <div className="text-xs text-gray-500 font-medium">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMaterials.length)} of {filteredMaterials.length} items
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex mr-4">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-1 border border-gray-200 rounded-l-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                                const page = currentPage > 2 && totalPages > 3 ? currentPage - 1 + i : i + 1;
                                if (page > totalPages) return null;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => changePage(page)}
                                        className={`px-3 py-1 border-t border-b border-r border-gray-200 text-xs font-bold hover:bg-gray-50 ${currentPage === page ? 'bg-blue-50 text-blue-600' : ''}`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-1 border border-gray-200 rounded-r-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={handleSave}
                            className="btn-primary"
                        >
                            <Save className="w-4 h-4" /> Save Closing Stock
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ClosingStock;
