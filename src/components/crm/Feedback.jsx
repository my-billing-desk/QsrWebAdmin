import React, { useState, useEffect } from 'react';
import {
    MessageSquare, Star, TrendingUp, AlertCircle,
    CheckCircle2, Search, Filter, Download,
    Utensils, User, Clock, ChevronRight,
    BarChart3, ThumbsUp, ThumbsDown, MoreVertical
} from 'lucide-react';
import { feedbackService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export function Feedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [feedbackRes, analyticsRes] = await Promise.all([
                feedbackService.getAll(),
                feedbackService.getAnalytics()
            ]);
            if (feedbackRes.data.success) setFeedbacks(feedbackRes.data.data);
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
        } catch (error) {
            toast.error('Failed to load feedback data');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const res = await feedbackService.updateStatus(id, status);
            if (res.data.success) {
                toast.success(`Feedback marked as ${status}`);
                fetchData();
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const StatCard = ({ label, value, icon: Icon, color, trend }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {typeof value === 'number' ? value.toFixed(1) : value}
                        {label.includes('Rating') && <span className="text-sm text-gray-400 ml-1">/ 5.0</span>}
                    </h3>
                    {trend && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                            {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    const RatingStars = ({ rating, size = "w-4 h-4" }) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={`${size} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`}
                />
            ))}
        </div>
    );

    const filteredFeedback = feedbacks.filter(f => {
        const matchesSearch = f.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'critical') return matchesSearch && f.overallRating <= 2;
        if (activeTab === 'pending') return matchesSearch && f.status === 'pending';
        return matchesSearch;
    });

    if (loading && !analytics) return <div className="p-8 text-center">Loading Feedback...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-7 h-7 text-orange-500" />
                        Customer Feedback
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor customer satisfaction and item performance</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-all">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    label="Overall Rating"
                    value={parseFloat(analytics?.summary?.avgOverall || 0)}
                    icon={Star}
                    color="bg-yellow-500"
                    trend={5.2}
                />
                <StatCard
                    label="Food Quality"
                    value={parseFloat(analytics?.summary?.avgFood || 0)}
                    icon={Utensils}
                    color="bg-orange-500"
                    trend={2.1}
                />
                <StatCard
                    label="Service Rating"
                    value={parseFloat(analytics?.summary?.avgService || 0)}
                    icon={User}
                    color="bg-blue-500"
                    trend={-1.4}
                />
                <StatCard
                    label="Total Reviews"
                    value={analytics?.summary?.totalFeedback || 0}
                    icon={MessageSquare}
                    color="bg-purple-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Feedback List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex gap-2">
                                {['all', 'pending', 'critical'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                                            ${activeTab === tab
                                                ? 'bg-orange-500 text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}
                                        `}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search reviews..."
                                    className="bg-transparent border-none outline-none text-xs w-40 text-gray-700 dark:text-gray-200"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="divide-y divide-gray-50 dark:divide-gray-700">
                            {filteredFeedback.length === 0 ? (
                                <div className="p-10 text-center text-gray-500">No feedback found</div>
                            ) : filteredFeedback.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                {item.customer?.name?.charAt(0) || 'G'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {item.customer?.name || 'Guest Customer'}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <RatingStars rating={item.overallRating} size="w-3 h-3" />
                                                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {format(new Date(item.createdAt), 'MMM dd, hh:mm a')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                                                ${item.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}
                                            `}>
                                                {item.status}
                                            </span>
                                            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                        "{item.comment || 'No written comment provided.'}"
                                    </p>

                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Food</p>
                                            <RatingStars rating={item.foodRating} size="w-2.5 h-2.5" />
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Service</p>
                                            <RatingStars rating={item.serviceRating} size="w-2.5 h-2.5" />
                                        </div>
                                        <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Ambiance</p>
                                            <RatingStars rating={item.ambianceRating} size="w-2.5 h-2.5" />
                                        </div>
                                    </div>

                                    {item.itemFeedback && (
                                        <div className="mb-4">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Item-wise Feedback</p>
                                            <div className="flex flex-wrap gap-2">
                                                {(typeof item.itemFeedback === 'string' ? JSON.parse(item.itemFeedback) : item.itemFeedback).map((ifb, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-100 dark:border-orange-800">
                                                        <span className="text-[10px] font-medium text-orange-700 dark:text-orange-300">{ifb.itemName}</span>
                                                        <RatingStars rating={ifb.rating} size="w-2 h-2" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                                            Order #{item.order?.orderNumber || 'N/A'}
                                            <ChevronRight className="w-3 h-3" />
                                        </div>
                                        {item.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleStatusUpdate(item.id, 'resolved')}
                                                    className="px-3 py-1 bg-green-600 text-white text-[10px] font-bold rounded-lg hover:bg-green-700 transition-all flex items-center gap-1"
                                                >
                                                    <CheckCircle2 className="w-3 h-3" /> Mark Resolved
                                                </button>
                                                <button className="px-3 py-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-gray-50 transition-all">
                                                    Reply to Customer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Analytics */}
                <div className="space-y-6">
                    {/* Item Performance */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-orange-500" />
                            Top Rated Items
                        </h4>
                        <div className="space-y-4">
                            {analytics?.topItems?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-xs font-bold text-gray-500">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.name}</p>
                                            <p className="text-[10px] text-gray-400">{item.count} reviews</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                        <Star className="w-3 h-3 fill-current" />
                                        {item.avgRating}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 p-6">
                        <h4 className="font-bold text-red-800 dark:text-red-400 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Critical Alerts
                        </h4>
                        <p className="text-xs text-red-600 dark:text-red-500 mb-4">
                            You have {feedbacks.filter(f => f.overallRating <= 2 && f.status === 'pending').length} unresolved poor reviews.
                        </p>
                        <button
                            onClick={() => setActiveTab('critical')}
                            className="w-full py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-all"
                        >
                            Take Action Now
                        </button>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 p-6">
                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold mb-2">
                            <ThumbsUp className="w-4 h-4" />
                            Pro Tip
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-500 leading-relaxed">
                            Responding to negative feedback within 2 hours increases customer retention by up to 40%.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
