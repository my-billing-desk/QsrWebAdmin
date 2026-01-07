import React, { useState, useEffect } from 'react';
import {
    Gift, Plus, Search, Filter, Download, MoreVertical,
    CreditCard, RefreshCw, Calendar, User, Shield,
    CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft,
    ChevronRight, LayoutGrid, List as ListIcon, History
} from 'lucide-react';
import { giftCardService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export function GiftCard() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Form States
    const [issueForm, setIssueForm] = useState({
        cardNumber: '',
        initialAmount: '',
        expiryDate: '',
        type: 'digital',
        customerId: ''
    });

    const [bulkForm, setBulkForm] = useState({
        count: 10,
        amount: 500,
        prefix: 'GC',
        expiryDate: ''
    });

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        try {
            setLoading(true);
            const res = await giftCardService.getAll();
            if (res.data.success) {
                setCards(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load gift cards');
        } finally {
            setLoading(false);
        }
    };

    const handleIssueCard = async (e) => {
        e.preventDefault();
        try {
            const res = await giftCardService.issue(issueForm);
            if (res.data.success) {
                toast.success('Gift card issued successfully');
                setShowIssueModal(false);
                fetchCards();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to issue card');
        }
    };

    const handleBulkGenerate = async (e) => {
        e.preventDefault();
        try {
            const res = await giftCardService.bulkGenerate(bulkForm);
            if (res.data.success) {
                toast.success(`${res.data.count} gift cards generated`);
                setShowBulkModal(false);
                fetchCards();
            }
        } catch (error) {
            toast.error('Failed to generate cards');
        }
    };

    const stats = {
        total: cards.length,
        active: cards.filter(c => c.status === 'active').length,
        totalBalance: cards.reduce((sum, c) => sum + parseFloat(c.balance), 0),
        expiringSoon: cards.filter(c => {
            if (!c.expiryDate) return false;
            const diff = new Date(c.expiryDate) - new Date();
            return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
        }).length
    };

    const filteredCards = cards.filter(card =>
        card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StatCard = ({ icon: Icon, label, value, color, subValue }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Gift className="w-7 h-7 text-red-500" />
                        Gift Card Management
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Issue, track, and manage your business gift cards</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all"
                    >
                        <LayoutGrid className="w-4 h-4" /> Bulk Generate
                    </button>
                    <button
                        onClick={() => setShowIssueModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" /> Issue New Card
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={CreditCard}
                    label="Total Cards"
                    value={stats.total}
                    color="bg-blue-500"
                    subValue={`${stats.active} Active Cards`}
                />
                <StatCard
                    icon={Shield}
                    label="Total Liability"
                    value={`₹${stats.totalBalance.toLocaleString()}`}
                    color="bg-red-500"
                    subValue="Outstanding Balance"
                />
                <StatCard
                    icon={History}
                    label="Redemptions"
                    value="124"
                    color="bg-green-500"
                    subValue="Last 30 days"
                />
                <StatCard
                    icon={Calendar}
                    label="Expiring Soon"
                    value={stats.expiringSoon}
                    color="bg-orange-500"
                    subValue="Within 7 days"
                />
            </div>

            {/* Main Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 w-full md:w-96">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by card number or customer..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Card Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Balance</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Expiry</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">Loading cards...</td></tr>
                            ) : filteredCards.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-500">No gift cards found</td></tr>
                            ) : filteredCards.map((card) => (
                                <tr key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${card.type === 'physical' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">{card.cardNumber}</p>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold">{card.type}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {card.customer ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <User className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{card.customer.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">₹{parseFloat(card.balance).toLocaleString()}</p>
                                        <p className="text-[10px] text-gray-400">Initial: ₹{parseFloat(card.initialAmount).toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                            ${card.status === 'active' ? 'bg-green-50 text-green-600' :
                                                card.status === 'inactive' ? 'bg-gray-100 text-gray-500' :
                                                    'bg-red-50 text-red-600'}
                                        `}>
                                            {card.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {card.expiryDate ? format(new Date(card.expiryDate), 'dd MMM yyyy') : 'No Expiry'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all">
                                            <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Issue Modal */}
            {showIssueModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Plus className="w-5 h-5 text-red-500" />
                                Issue New Gift Card
                            </h3>
                            <button onClick={() => setShowIssueModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Search className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleIssueCard} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Card Number</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. GC12345678"
                                    value={issueForm.cardNumber}
                                    onChange={(e) => setIssueForm({ ...issueForm, cardNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="500"
                                        value={issueForm.initialAmount}
                                        onChange={(e) => setIssueForm({ ...issueForm, initialAmount: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Card Type</label>
                                    <select
                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                        value={issueForm.type}
                                        onChange={(e) => setIssueForm({ ...issueForm, type: e.target.value })}
                                    >
                                        <option value="digital">Digital</option>
                                        <option value="physical">Physical</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    value={issueForm.expiryDate}
                                    onChange={(e) => setIssueForm({ ...issueForm, expiryDate: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all mt-4">
                                Issue Card
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5 text-red-500" />
                                Bulk Generate Cards
                            </h3>
                            <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Search className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <form onSubmit={handleBulkGenerate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Number of Cards</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                        value={bulkForm.count}
                                        onChange={(e) => setBulkForm({ ...bulkForm, count: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Amount per Card</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                        value={bulkForm.amount}
                                        onChange={(e) => setBulkForm({ ...bulkForm, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Card Prefix</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
                                    value={bulkForm.prefix}
                                    onChange={(e) => setBulkForm({ ...bulkForm, prefix: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-all mt-4">
                                Generate Cards
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
