import React, { useState, useEffect } from 'react';
import {
    Gift, Users, Star, Wallet, Stamp, Settings, BarChart3,
    Search, Plus, ChevronRight, Info, AlertCircle, CheckCircle2,
    Smartphone, QrCode, MessageSquare, ShieldCheck, Trophy, UserPlus, Clock,
    Trash2, Edit2, X
} from 'lucide-react';
import { loyaltyService } from '../../services/api';
import { toast } from 'react-hot-toast';

const LoyaltyDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [config, setConfig] = useState(null);
    const [tiers, setTiers] = useState([]);
    const [rewards, setRewards] = useState([]);

    // Modal States
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
    const [editingTier, setEditingTier] = useState(null);
    const [editingReward, setEditingReward] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, configRes, tiersRes, rewardsRes] = await Promise.all([
                loyaltyService.getAnalytics(),
                loyaltyService.getConfig(),
                loyaltyService.getTiers(),
                loyaltyService.getRewards()
            ]);
            if (statsRes.data.success) setStats(statsRes.data.data);
            if (configRes.data.success) setConfig(configRes.data.data);
            if (tiersRes.data.success) setTiers(tiersRes.data.data);
            if (rewardsRes.data.success) setRewards(rewardsRes.data.data);
        } catch (error) {
            console.error('Error fetching loyalty data:', error);
            toast.error('Failed to load loyalty data');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTier = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const tierData = {
            id: editingTier?.id,
            name: formData.get('name'),
            minPoints: parseInt(formData.get('minPoints')),
            multiplier: parseFloat(formData.get('multiplier')),
            color: formData.get('color') || 'bg-blue-500'
        };

        try {
            await loyaltyService.saveTier(tierData);
            toast.success(editingTier ? 'Tier updated' : 'Tier created');
            setIsTierModalOpen(false);
            setEditingTier(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to save tier');
        }
    };

    const handleDeleteTier = async (id) => {
        if (!window.confirm('Are you sure you want to delete this tier?')) return;
        try {
            await loyaltyService.deleteTier(id);
            toast.success('Tier deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete tier');
        }
    };

    const handleSaveReward = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const rewardData = {
            id: editingReward?.id,
            name: formData.get('name'),
            description: formData.get('description'),
            minPoints: parseInt(formData.get('minPoints')),
            rewardType: formData.get('rewardType'),
            rewardValue: parseFloat(formData.get('rewardValue')),
            isActive: true
        };

        try {
            await loyaltyService.saveReward(rewardData);
            toast.success(editingReward ? 'Reward updated' : 'Reward created');
            setIsRewardModalOpen(false);
            setEditingReward(null);
            fetchData();
        } catch (error) {
            toast.error('Failed to save reward');
        }
    };

    const handleDeleteReward = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reward?')) return;
        try {
            await loyaltyService.deleteReward(id);
            toast.success('Reward deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete reward');
        }
    };

    const StatCard = ({ icon: Icon, label, value, subValue, color }) => (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Loyalty Program...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Trophy className="w-7 h-7 text-orange-500" />
                        Loyalty Program
                    </h1>
                    <p className="text-gray-500 mt-1">Reward your customers and drive repeat business</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all">
                        <QrCode className="w-4 h-4" /> QR Codes
                    </button>
                    <button
                        onClick={() => { setEditingReward(null); setIsRewardModalOpen(true); }}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2 shadow-sm transition-all"
                    >
                        <Plus className="w-4 h-4" /> New Reward
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={Users}
                    label="Total Customers"
                    value={stats?.totalCustomers || 0}
                    subValue="+12% from last month"
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Star}
                    label="Active Members"
                    value={stats?.activeLoyaltyMembers || 0}
                    subValue={`${((stats?.activeLoyaltyMembers / (stats?.totalCustomers || 1)) * 100).toFixed(1)}% adoption rate`}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={Gift}
                    label="Points Issued"
                    value={stats?.pointsIssued?.toLocaleString() || 0}
                    subValue="Lifetime points"
                    color="bg-purple-500"
                />
                <StatCard
                    icon={BarChart3}
                    label="Redemption Rate"
                    value={`${(stats?.redemptionRate || 0).toFixed(1)}%`}
                    subValue="Points redeemed vs issued"
                    color="bg-green-500"
                />
            </div>

            {/* Main Content Tabs */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                <div className="flex border-b overflow-x-auto">
                    {['overview', 'configuration', 'rewards', 'analytics'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 text-sm font-medium capitalize transition-colors relative whitespace-nowrap
                                ${activeTab === tab ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                            `}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600" />}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-white rounded-lg shadow-sm">
                                            <ShieldCheck className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Current Program: {config?.programType?.toUpperCase()}</h3>
                                            <p className="text-sm text-orange-700">Your loyalty program is active and tracking customer rewards.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/60 p-3 rounded-lg text-sm">
                                            <span className="text-gray-500">Points per Rupee:</span>
                                            <span className="ml-2 font-bold text-gray-900">{config?.pointsPerRupee} pts</span>
                                        </div>
                                        <div className="bg-white/60 p-3 rounded-lg text-sm">
                                            <span className="text-gray-500">Min. Redemption:</span>
                                            <span className="ml-2 font-bold text-gray-900">{config?.minRedemptionPoints} pts</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-5 border border-gray-100 rounded-xl hover:border-orange-200 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Smartphone className="w-5 h-5 text-blue-500" />
                                            <h4 className="font-bold text-gray-800">Mobile Engagement</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Customers can track points and redeem rewards via their mobile phones.</p>
                                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Configure Mobile View <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                    <div className="p-5 border border-gray-100 rounded-xl hover:border-orange-200 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3 mb-3">
                                            <MessageSquare className="w-5 h-5 text-green-500" />
                                            <h4 className="font-bold text-gray-800">Smart Notifications</h4>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-4">Automated SMS & WhatsApp alerts for points expiry and rewards.</p>
                                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Setup Automation <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4">Quick Actions</h4>
                                    <div className="space-y-2">
                                        <button className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-left hover:border-orange-500 flex items-center gap-3 transition-all">
                                            <UserPlus className="w-4 h-4 text-orange-500" />
                                            Enroll New Customer
                                        </button>
                                        <button className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-left hover:border-orange-500 flex items-center gap-3 transition-all">
                                            <Search className="w-4 h-4 text-orange-500" />
                                            Lookup Points
                                        </button>
                                        <button className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-left hover:border-orange-500 flex items-center gap-3 transition-all">
                                            <Gift className="w-4 h-4 text-orange-500" />
                                            Manual Points Credit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'configuration' && (
                        <div className="space-y-10">
                            <section>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 font-sans">
                                    <ShieldCheck className="w-4 h-4 text-orange-500" />
                                    1. Program Structure
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {[
                                        { id: 'points', icon: Star, title: 'Points Based', desc: 'Earn points per rupee' },
                                        { id: 'visit', icon: Users, title: 'Visit Based', desc: 'Reward frequency' },
                                        { id: 'tiered', icon: Trophy, title: 'Tiered VIP', desc: 'Silver, Gold, Platinum' },
                                        { id: 'cashback', icon: Wallet, title: 'Cashback', desc: 'Money to wallet' },
                                        { id: 'stamp', icon: Stamp, title: 'Stamp Card', desc: 'Digital punch cards' }
                                    ].map(type => (
                                        <div
                                            key={type.id}
                                            onClick={() => setConfig({ ...config, programType: type.id })}
                                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer group
                                                ${config?.programType === type.id ? 'border-orange-500 bg-orange-50/30' : 'border-gray-100 hover:border-orange-200'}
                                            `}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`p-2 rounded-lg ${config?.programType === type.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                    <type.icon className="w-4 h-4" />
                                                </div>
                                                {config?.programType === type.id && <CheckCircle2 className="w-4 h-4 text-orange-500" />}
                                            </div>
                                            <h4 className="font-bold text-gray-900 text-sm">{type.title}</h4>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{type.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="p-6 border border-gray-100 rounded-xl bg-gray-50/30">
                                <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-orange-500" />
                                    2. Core Program Rules
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Points per Rupee</label>
                                        <input
                                            type="number" step="0.1"
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                                            value={config?.pointsPerRupee}
                                            onChange={(e) => setConfig({ ...config, pointsPerRupee: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Min. Redemption</label>
                                        <input
                                            type="number"
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                                            value={config?.minRedemptionPoints}
                                            onChange={(e) => setConfig({ ...config, minRedemptionPoints: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Expiry (Days)</label>
                                        <input
                                            type="number"
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium"
                                            value={config?.pointExpiryDays}
                                            onChange={(e) => setConfig({ ...config, pointExpiryDays: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={async () => {
                                            try { await loyaltyService.updateConfig(config); toast.success('Saved'); } catch (e) { toast.error('Failed'); }
                                        }}
                                        className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 shadow-sm transition-all"
                                    >
                                        Save Configuration
                                    </button>
                                </div>
                            </section>

                            {(config?.programType === 'tiered' || config?.programType === 'points') && (
                                <section>
                                    <div className="flex items-center justify-between mb-6">
                                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <Trophy className="w-4 h-4 text-orange-500" />
                                            3. Membership Tiers
                                        </h4>
                                        <button
                                            onClick={() => { setEditingTier(null); setIsTierModalOpen(true); }}
                                            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                        >
                                            <Plus className="w-3 h-3" /> Add New Tier
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tiers.map(tier => (
                                            <div key={tier.id} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm relative group">
                                                <div className={`absolute top-0 left-0 w-1 h-full ${tier.color || 'bg-blue-500'}`} />
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h5 className="font-bold text-gray-900">{tier.name}</h5>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Entry: {tier.minPoints} pts</p>
                                                    </div>
                                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => { setEditingTier(tier); setIsTierModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                                                        <button onClick={() => handleDeleteTier(tier.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-500">Points Multiplier</span>
                                                    <span className="font-bold text-gray-900">{tier.multiplier}x</span>
                                                </div>
                                            </div>
                                        ))}
                                        {tiers.length === 0 && (
                                            <div className="col-span-full py-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400">
                                                <Trophy className="w-10 h-10 mb-2 opacity-20" />
                                                <p className="text-sm">No tiers configured yet</p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {activeTab === 'rewards' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-orange-500" />
                                    Active Rewards
                                </h4>
                                <button
                                    onClick={() => { setEditingReward(null); setIsRewardModalOpen(true); }}
                                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-bold hover:bg-orange-100 flex items-center gap-2 transition-all"
                                >
                                    <Plus className="w-4 h-4" /> Create Reward
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {rewards.map(reward => (
                                    <div key={reward.id} className="p-6 border border-gray-100 rounded-xl hover:border-orange-200 transition-all group relative bg-white shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                                                <Gift className="w-6 h-6" />
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => { setEditingReward(reward); setIsRewardModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteReward(reward.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <h5 className="font-bold text-gray-900 mb-1">{reward.name}</h5>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{reward.description}</p>
                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="text-xs">
                                                <span className="text-gray-400">Required:</span>
                                                <span className="ml-1 font-bold text-orange-600">{reward.minPoints} pts</span>
                                            </div>
                                            <div className="text-xs font-bold text-gray-900">
                                                {reward.rewardType === 'flat' ? `₹${reward.rewardValue} Off` : `${reward.rewardValue}% Off`}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {rewards.length === 0 && (
                                    <div className="col-span-full py-20 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-gray-400">
                                        <Gift className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="font-medium">No active rewards</p>
                                        <p className="text-xs">Create your first reward to start engaging customers</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Tier Modal */}
            {isTierModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">{editingTier ? 'Edit Tier' : 'New Tier'}</h3>
                            <button onClick={() => setIsTierModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSaveTier} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tier Name</label>
                                <input name="name" defaultValue={editingTier?.name} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="e.g. Gold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Points</label>
                                    <input name="minPoints" type="number" defaultValue={editingTier?.minPoints} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Multiplier</label>
                                    <input name="multiplier" type="number" step="0.1" defaultValue={editingTier?.multiplier || 1.0} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color Theme</label>
                                <select name="color" defaultValue={editingTier?.color || 'bg-blue-500'} className="w-full p-2.5 border rounded-lg outline-none text-sm">
                                    <option value="bg-slate-500">Slate (Silver)</option>
                                    <option value="bg-yellow-500">Yellow (Gold)</option>
                                    <option value="bg-blue-600">Blue (Platinum)</option>
                                    <option value="bg-purple-600">Purple</option>
                                    <option value="bg-emerald-600">Emerald</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 mt-4">
                                {editingTier ? 'Update Tier' : 'Create Tier'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reward Modal */}
            {isRewardModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900">{editingReward ? 'Edit Reward' : 'New Reward'}</h3>
                            <button onClick={() => setIsRewardModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleSaveReward} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reward Name</label>
                                <input name="name" defaultValue={editingReward?.name} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm" placeholder="e.g. 50% Off Dessert" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea name="description" defaultValue={editingReward?.description} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm h-20" placeholder="Redeem points for this sweet deal..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Points</label>
                                    <input name="minPoints" type="number" defaultValue={editingReward?.minPoints} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reward Type</label>
                                    <select name="rewardType" defaultValue={editingReward?.rewardType || 'percentage'} className="w-full p-2.5 border rounded-lg outline-none text-sm">
                                        <option value="percentage">Percentage Off</option>
                                        <option value="flat">Flat Amount Off</option>
                                        <option value="freebie">Free Item</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value (₹ or %)</label>
                                <input name="rewardValue" type="number" defaultValue={editingReward?.rewardValue} required className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-sm" />
                            </div>
                            <button type="submit" className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 mt-4">
                                {editingReward ? 'Update Reward' : 'Create Reward'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoyaltyDashboard;
