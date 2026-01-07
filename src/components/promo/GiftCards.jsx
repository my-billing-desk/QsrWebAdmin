import React, { useState, useEffect } from 'react';
import {
    Search, ChevronDown, Plus, FileSpreadsheet, FileText,
    RotateCcw, Eye, Edit, Trash2, Gift, Calendar, User, X,
    AlertCircle, CheckCircle2, CreditCard
} from 'lucide-react';
import { giftCardService, customerService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export function GiftCards() {
    const [giftCards, setGiftCards] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

    const [selectedCard, setSelectedCard] = useState(null);
    const [isReloadModalOpen, setIsReloadModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    // Form state for adding/editing
    const [formData, setFormData] = useState({
        cardNumber: '',
        customerId: '',
        initialAmount: '',
        pin: '',
        expiryDate: '',
        status: 'active',
        type: 'digital'
    });

    const [reloadAmount, setReloadAmount] = useState('');

    const [bulkData, setBulkData] = useState({
        count: 10,
        amount: 500,
        prefix: 'GC',
        expiryDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [cardsRes, customersRes] = await Promise.all([
                giftCardService.getAll(),
                customerService.getAll()
            ]);

            if (cardsRes.data.success) setGiftCards(cardsRes.data.data);
            if (customersRes.data.success) setCustomers(customersRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load gift cards');
        } finally {
            setLoading(false);
        }
    };

    const handleAddGiftCard = async (e) => {
        e.preventDefault();
        try {
            const res = await giftCardService.issue(formData);
            if (res.data.success) {
                toast.success('Gift card issued successfully');
                setIsAddModalOpen(false);
                resetForm();
                fetchData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue gift card');
        }
    };

    const handleBulkGenerate = async (e) => {
        e.preventDefault();
        try {
            const res = await giftCardService.bulkGenerate(bulkData);
            if (res.data.success) {
                toast.success(`${res.data.count} gift cards generated`);
                setIsBulkModalOpen(false);
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to generate cards');
        }
    };

    const handleReload = async (e) => {
        e.preventDefault();
        try {
            const res = await giftCardService.reload({
                cardNumber: selectedCard.cardNumber,
                amount: parseFloat(reloadAmount)
            });
            if (res.data.success) {
                toast.success('Card reloaded successfully');
                setIsReloadModalOpen(false);
                setReloadAmount('');
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to reload card');
        }
    };

    const handleViewDetails = async (card) => {
        try {
            const res = await giftCardService.getDetails(card.cardNumber);
            if (res.data.success) {
                setSelectedCard(res.data.data);
                setIsViewModalOpen(true);
            }
        } catch (error) {
            toast.error('Failed to load card details');
        }
    };

    const resetForm = () => {
        setFormData({
            cardNumber: '',
            customerId: '',
            initialAmount: '',
            pin: '',
            expiryDate: '',
            status: 'active',
            type: 'digital'
        });
    };

    const filteredCards = giftCards.filter(card =>
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gift Cards</h1>
                    <div className="text-sm text-gray-500">Manage your business gift cards and campaigns</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded font-medium shadow-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                        <FileSpreadsheet className="w-4 h-4 text-green-600" /> Bulk Generate
                    </button>
                    <button
                        onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Gift Card
                    </button>
                    <button onClick={fetchData} className="w-10 h-10 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm">
                        <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* 1.5 Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Cards</p>
                        <h3 className="text-xl font-bold text-gray-900">{giftCards.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Active Value</p>
                        <h3 className="text-xl font-bold text-gray-900">₹{giftCards.reduce((sum, c) => c.status === 'active' ? sum + parseFloat(c.balance) : sum, 0).toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Liability</p>
                        <h3 className="text-xl font-bold text-gray-900">₹{giftCards.reduce((sum, c) => sum + parseFloat(c.balance), 0).toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
                        <Gift className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Expiring Soon</p>
                        <h3 className="text-xl font-bold text-gray-900">
                            {giftCards.filter(c => {
                                if (!c.expiryDate) return false;
                                const diff = new Date(c.expiryDate) - new Date();
                                return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
                            }).length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* 2. Main Content Card */}
            <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* 2a. Filter Row */}
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search by card number or customer..."
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select className="px-3 py-2 border rounded-md text-sm font-medium bg-white focus:outline-none">
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                        <select className="px-3 py-2 border rounded-md text-sm font-medium bg-white focus:outline-none">
                            <option value="recent">Recently Added</option>
                            <option value="amount-high">Amount: High to Low</option>
                            <option value="amount-low">Amount: Low to High</option>
                        </select>
                    </div>
                </div>

                {/* 2b. Data Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-600 border-b sticky top-0 z-10">
                            <tr>
                                <th className="p-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4 uppercase tracking-wider">Gift Card</th>
                                <th className="p-4 uppercase tracking-wider">Customer</th>
                                <th className="p-4 uppercase tracking-wider">Issued Date</th>
                                <th className="p-4 uppercase tracking-wider">Expiry Date</th>
                                <th className="p-4 uppercase tracking-wider">Amount</th>
                                <th className="p-4 uppercase tracking-wider">Balance</th>
                                <th className="p-4 uppercase tracking-wider text-center">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {loading && giftCards.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-10 text-center text-gray-400">Loading gift cards...</td>
                                </tr>
                            ) : filteredCards.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="p-10 text-center text-gray-400">No gift cards found</td>
                                </tr>
                            ) : (
                                filteredCards.map((card) => (
                                    <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                        <td className="p-4 font-bold text-gray-800 font-mono">{card.cardNumber}</td>
                                        <td className="p-4">
                                            {card.customer ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                        {card.customer.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-gray-700">{card.customer.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">{format(new Date(card.createdAt), 'dd MMM yyyy')}</td>
                                        <td className="p-4 text-gray-600">
                                            {card.expiryDate ? format(new Date(card.expiryDate), 'dd MMM yyyy') : 'No Expiry'}
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">₹{parseFloat(card.initialAmount).toFixed(2)}</td>
                                        <td className="p-4 font-bold text-orange-600">₹{parseFloat(card.balance).toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${card.status === 'active' ? 'bg-green-100 text-green-700' :
                                                card.status === 'expired' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {card.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleViewDetails(card)} className="p-1.5 border rounded hover:bg-blue-50 text-blue-500 transition-colors" title="View Transactions"><Eye className="w-3.5 h-3.5" /></button>
                                                <button onClick={() => { setSelectedCard(card); setIsReloadModalOpen(true); }} className="p-1.5 border rounded hover:bg-green-50 text-green-600 transition-colors" title="Reload Balance"><Plus className="w-3.5 h-3.5" /></button>
                                                <button className="p-1.5 border rounded hover:bg-red-50 text-red-500 transition-colors" title="Delete Card"><Trash2 className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 2c. Pagination */}
                <div className="p-4 border-t flex items-center justify-between text-sm text-gray-500">
                    <p>Showing {filteredCards.length} of {giftCards.length} entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded font-bold">1</button>
                        <button className="px-3 py-1.5 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* 3. Add Gift Card Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Plus className="w-6 h-6 text-orange-500" />
                                Add New Gift Card
                            </h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleAddGiftCard}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="Auto-generated if blank"
                                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Security PIN</label>
                                        <input
                                            type="text"
                                            maxLength="4"
                                            placeholder="4 Digit PIN"
                                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.pin}
                                            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Customer</label>
                                    <select
                                        className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                        value={formData.customerId}
                                        onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select a customer</option>
                                        {customers.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Initial Amount (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.initialAmount}
                                            onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                        <select
                                            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="digital">Digital</option>
                                            <option value="physical">Physical</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date (Optional)</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 border rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all">Issue Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Generate Modal */}
            {isBulkModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FileSpreadsheet className="w-6 h-6 text-green-500" />
                                Bulk Generate
                            </h2>
                            <button onClick={() => setIsBulkModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleBulkGenerate}>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total Cards</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                            value={bulkData.count}
                                            onChange={(e) => setBulkData({ ...bulkData, count: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                            value={bulkData.amount}
                                            onChange={(e) => setBulkData({ ...bulkData, amount: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Number Prefix</label>
                                    <input
                                        type="text"
                                        className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        value={bulkData.prefix}
                                        onChange={(e) => setBulkData({ ...bulkData, prefix: e.target.value })}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Example: {bulkData.prefix}ABCD1234</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                        value={bulkData.expiryDate}
                                        onChange={(e) => setBulkData({ ...bulkData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                                <button type="button" onClick={() => setIsBulkModalOpen(false)} className="px-6 py-2.5 border rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all">Generate Now</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Reload Balance Modal */}
            {isReloadModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl animate-in font-sans">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Reload Card</h2>
                            <button onClick={() => setIsReloadModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleReload}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                                    <p className="text-sm font-bold font-mono text-gray-700">{selectedCard?.cardNumber}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reload Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        value={reloadAmount}
                                        onChange={(e) => setReloadAmount(e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="p-6 border-t flex justify-end gap-3 bg-gray-50">
                                <button type="button" onClick={() => setIsReloadModalOpen(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-orange-500 text-white rounded font-bold hover:bg-orange-600">Add Balance</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Transactions Modal */}
            {isViewModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-in font-sans overflow-hidden">
                        <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Card History</h2>
                                <p className="text-xs text-gray-500 font-mono mt-1">{selectedCard?.cardNumber}</p>
                            </div>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-[10px] text-blue-600 font-bold uppercase">Initial</p>
                                    <p className="text-lg font-bold text-blue-900">₹{parseFloat(selectedCard?.initialAmount).toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-[10px] text-green-600 font-bold uppercase">Balance</p>
                                    <p className="text-lg font-bold text-green-900">₹{parseFloat(selectedCard?.balance).toFixed(2)}</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <p className="text-[10px] text-red-600 font-bold uppercase">Status</p>
                                    <p className="text-lg font-bold text-red-900 capitalize">{selectedCard?.status}</p>
                                </div>
                            </div>

                            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" /> Transaction Log
                            </h4>
                            <div className="border rounded-xl overflow-hidden">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-2">Date</th>
                                            <th className="px-4 py-2">Activity</th>
                                            <th className="px-4 py-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedCard?.transactions?.length === 0 ? (
                                            <tr><td colSpan="3" className="p-4 text-center text-gray-400">No transactions yet</td></tr>
                                        ) : (
                                            selectedCard?.transactions?.map((t, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-600">{format(new Date(t.createdAt), 'dd MMM, HH:mm')}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${t.type === 'activation' ? 'bg-blue-100 text-blue-700' :
                                                                t.type === 'redemption' ? 'bg-red-100 text-red-700' :
                                                                    'bg-green-100 text-green-700'
                                                            }`}>
                                                            {t.type}
                                                        </span>
                                                    </td>
                                                    <td className={`px-4 py-3 text-right font-bold ${t.type === 'redemption' ? 'text-red-600' : 'text-green-600'}`}>
                                                        {t.type === 'redemption' ? '-' : '+'}₹{parseFloat(t.amount).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2 bg-gray-800 text-white rounded font-bold hover:bg-gray-900 transition-all shadow-lg">Close Details</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
