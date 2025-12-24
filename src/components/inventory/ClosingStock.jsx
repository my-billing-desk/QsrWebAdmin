import React, { useState, useEffect } from 'react';
import { Search, Save, ChevronLeft, ChevronRight, Calculator, FileText, Calendar, Filter, RotateCcw } from 'lucide-react';
import { inventoryService, menuService } from '../../services/api';
import toast from 'react-hot-toast';

export function ClosingStock() {
    const [materials, setMaterials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [updateFrequency, setUpdateFrequency] = useState('Daily');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Inputs: { [itemId]: { closingStock: val, unit: unit, comments: text } }
    // We'll store keyed by ID.
    const [inputData, setInputData] = useState({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [matRes, catRes] = await Promise.all([
                inventoryService.getRawMaterials(),
                menuService.getCategories() // or relevant category service if RawMaterial has specific categories
            ]);

            // RawMaterial categories might be simple strings or IDs. 
            // The mock data previously had strings like 'Dairy'. 
            // In DB they are linked. Let's assume we fetch them correctly.
            setMaterials(matRes.data);

            // Extract unique categories from materials if they are strings, or use fetched
            // For now, let's extract from materials to be safe if they drift from Menu categories
            const uniqueCats = [...new Set(matRes.data.map(m => m.category || 'Uncategorized'))];
            setCategories(uniqueCats);
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load stock data");
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

            // Gather inputs
            const pQty = parseFloat(data.purchaseQty || 0);
            const cQty = parseFloat(data.consumptionQty || 0);

            // If user hasn't touched either input or comments, skip? 
            // Better to check if keys exist or if value is not empty string, 
            // but for mass save, let's assume we only send what's typed.
            // However, 0 is a valid value.
            const hasPurchase = data.hasOwnProperty('purchaseQty') && data.purchaseQty !== '';
            const hasConsumption = data.hasOwnProperty('consumptionQty') && data.consumptionQty !== '';

            if (!hasPurchase && !hasConsumption && !data.comments) return null;

            const conversion = item.conversionFactor || 1;
            const totalStock = (pQty * conversion) + cQty;

            return {
                id: item.id,
                closingStock: totalStock,
                unit: item.consumptionUnit, // Always store in base consumption unit
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
            loadData(); // Refresh to see updated current stock
            setInputData({}); // Clear inputs
        } catch (error) {
            console.error(error);
            toast.error("Failed to save stock");
        }
    };

    const navigate = useNavigate();
    const location = useLocation();

    // Mapping for sidebar items
    const sidebarItems = [
        { name: 'Closing Stock', path: '/inventory/stock/closing', icon: true },
        { name: 'Opening Stock', path: '/inventory/stock/opening' },
        { name: 'Wastage', path: '/inventory/wastage' },
        { name: 'Indent', path: '/inventory/indent' }
    ];

    const currentPath = location.pathname;

    // Filter Logic
    const filteredMaterials = materials.filter(m => {
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

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 font-sans text-sm">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Closing Stock</h1>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2 font-bold hover:bg-red-700 shadow-lg shadow-red-600/20 text-xs">
                    <Save className="w-4 h-4" /> Add Stock
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center gap-2 font-medium hover:bg-gray-50 text-xs text-gray-600">
                    <FileText className="w-4 h-4" /> Files
                </button>
            </div>
        </div>

        {/* Filter Bar (Matching Screenshot) */ }
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 grid grid-cols-1 md:grid-cols-5 gap-4 items-end shrink-0">
        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Raw Material</label>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Search..."
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
            <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
                <option value="All">All</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Date</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
        </div>

        <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Closing Stock Updated On</label>
            <select
                value={updateFrequency}
                onChange={e => setUpdateFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 text-xs bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
            >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
        </div>

        <div className="flex gap-2">
            <button className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 font-bold text-xs">
                Load
            </button>
            <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-xs"
            >
                Clear
            </button>
        </div>
    </div>

    {/* Table Content */ }
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-purple-50/50 dark:bg-gray-700/50 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                    <tr>
                        <th className="p-4">Category</th>
                        <th className="p-4">Raw Material</th>
                        <th className="p-4">Closing Stock ({selectedDate})</th>
                        <th className="p-4 w-96">Update Your Closing Stock</th>
                        <th className="p-4">Comments</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                    {loading ? (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">Loading...</td>
                        </tr>
                    ) : currentItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="p-4 text-gray-500 font-medium">
                                {item.category}
                            </td>
                            <td className="p-4">
                                <div className="font-bold text-gray-800 dark:text-white">{item.name}</div>
                                <div className="text-xs text-gray-400 mt-1">[ Unit: {item.consumptionUnit} ]</div>
                            </td>
                            <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                                {(() => {
                                    const stock = item.currentStock || 0;
                                    const factor = item.conversionFactor || 1;

                                    if (factor > 1 && item.purchaseUnit !== item.consumptionUnit) {
                                        const pQty = Math.floor(stock / factor);
                                        const cQty = stock % factor;

                                        // Display: "2 Pkts" or "2 Pkts (5 Pcs)"
                                        let display = `${pQty} ${item.purchaseUnit}`;
                                        if (cQty > 0) {
                                            display += ` (${cQty % 1 === 0 ? cQty : cQty.toFixed(2)} ${item.consumptionUnit})`;
                                        }
                                        // If stock is less than 1 purchase unit
                                        if (pQty === 0) {
                                            display = `${cQty % 1 === 0 ? cQty : cQty.toFixed(2)} ${item.consumptionUnit}`;
                                        }
                                        return display;
                                    }
                                    return `${stock} ${item.consumptionUnit}`;
                                })()}
                            </td>
                            <td className="p-4">
                                <div className="flex flex-col gap-2">
                                    {/* Purchase Unit Input */}
                                    <div className="flex items-center gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                value={inputData[item.id]?.purchaseQty || ''}
                                                onChange={e => handleInputChange(item.id, 'purchaseQty', e.target.value)}
                                                className="w-full pr-12 pl-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                                / {item.purchaseUnit}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Consumption Unit Input - Only if different */}
                                    {item.purchaseUnit !== item.consumptionUnit && (
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    type="number"
                                                    value={inputData[item.id]?.consumptionQty || ''}
                                                    onChange={e => handleInputChange(item.id, 'consumptionQty', e.target.value)}
                                                    className="w-full pr-12 pl-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm"
                                                    placeholder="0"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                                    / {item.consumptionUnit}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <input
                                    type="text"
                                    value={inputData[item.id]?.comments || ''}
                                    onChange={e => handleInputChange(item.id, 'comments', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm placeholder-gray-300"
                                    placeholder="Comments"
                                />
                            </td>
                        </tr>
                    ))}
                    {!loading && currentItems.length === 0 && (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">No items found matching your filters.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>

    {/* Footer / Pagination */ }
    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center shrink-0">
        <div className="text-xs text-gray-500 font-medium">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMaterials.length)} of {filteredMaterials.length} items
        </div>

        <div className="flex items-center gap-2">
            <div className="flex mr-4">
                <button
                    onClick={() => changePage(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-200 rounded-l-lg hover:bg-gray-50 text-xs font-bold disabled:opacity-50"
                >
                    First
                </button>
                <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border-t border-b border-gray-200 hover:bg-gray-50 text-xs font-bold disabled:opacity-50"
                >
                    Prev
                </button>
                {/* Mock Page Numbers */}
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const page = currentPage > 2 && totalPages > 3 ? currentPage - 1 + i : i + 1;
                    if (page > totalPages) return null;
                    return (
                        <button
                            key={page}
                            onClick={() => changePage(page)}
                            className={`px-3 py-1.5 border border-gray-200 text-xs font-bold hover:bg-gray-50 ${currentPage === page ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
                        >
                            {page}
                        </button>
                    );
                })}
                {totalPages > 3 && <span className="px-2 text-gray-400">...</span>}
                <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border-t border-b border-gray-200 hover:bg-gray-50 text-xs font-bold disabled:opacity-50"
                >
                    Next
                </button>
                <button
                    onClick={() => changePage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-200 rounded-r-lg hover:bg-gray-50 text-xs font-bold disabled:opacity-50"
                >
                    Last
                </button>
            </div>

            <button
                onClick={handleSave}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
            >
                <Save className="w-4 h-4" /> Save Closing Stock
            </button>
        </div>
    </div>
                </div >

        {/* FAB for Support - keeping if desired or removing if conflicting. Screenshot showed Save button at bottom right, so I placed Save there. I will keep FAB hidden unless needed or move it. Screenshot didn't show FAB. */ }
        < div className = "fixed bottom-6 right-6" >
            <button className="w-12 h-12 bg-red-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-800 transition-colors">
                <FileText className="w-5 h-5" />
            </button>
                </div >
            </div >
            );
}
