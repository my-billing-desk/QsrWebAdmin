import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function IntegrationRequestModal({ type, integrationName, onClose, onSubmit }) {
    // type: 'restaurant' | 'cloud'
    const [formData, setFormData] = useState({
        isTiedUp: true,
        restaurantName: '',
        vendorCode: '',
        contactNo: '',
        email: '',
        ordersPerDay: '',
        copyMenuFrom: '',
        copyTaxesFrom: '',
        packagingCharge: 'none',
        groupCategory: '',
        comments: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-opacity animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform scale-100 transition-transform animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Are You Sure You Want To Activate {integrationName}?</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-6">
                    {/* Header Note */}
                    <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded border border-blue-100 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Now Operate another brand from the same Kitchen and Operate its online orders from the same POS
                    </div>

                    {/* Tie Up Status */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Already tie up with {integrationName}?</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tieup"
                                    checked={formData.isTiedUp}
                                    onChange={() => setFormData({ ...formData, isTiedUp: true })}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tieup"
                                    checked={!formData.isTiedUp}
                                    onChange={() => setFormData({ ...formData, isTiedUp: false })}
                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm">No</span>
                            </label>
                        </div>
                    </div>

                    {/* Dynamic Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {type === 'cloud' ? 'Cloud Kitchen Restaurant Name' : 'Brand Name / Identifier'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.restaurantName}
                                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                            />
                            <p className="text-[10px] text-blue-500 mt-1">Note:- Please provide identifier if you are already tied up with {integrationName}.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Vendor Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                value={formData.vendorCode}
                                onChange={(e) => setFormData({ ...formData, vendorCode: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                            />
                            <p className="text-[10px] text-blue-500 mt-1">Note:- Please provide vendor code if you are already tied up with {integrationName}.</p>
                        </div>

                        {/* Restaurant Specific Fields */}
                        {type === 'restaurant' && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Copy menu from</label>
                                    <select
                                        value={formData.copyMenuFrom}
                                        onChange={(e) => setFormData({ ...formData, copyMenuFrom: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    >
                                        <option value="">Select</option>
                                        <option value="main">Main Menu</option>
                                    </select>
                                    <p className="text-[10px] text-blue-500 mt-1">Note:- Please provide identifier if you are already tied up with {integrationName}.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Copy taxes from</label>
                                    <select
                                        value={formData.copyTaxesFrom}
                                        onChange={(e) => setFormData({ ...formData, copyTaxesFrom: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    >
                                        <option value="">Select</option>
                                        <option value="main">Standard Tax</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-gray-700">Packaging charge applicable on</label>
                                    <div className="flex gap-6">
                                        {['Item', 'Order', 'None'].map((option) => (
                                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="packaging"
                                                    checked={formData.packagingCharge === option.toLowerCase()}
                                                    onChange={() => setFormData({ ...formData, packagingCharge: option.toLowerCase() })}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <span className="text-sm">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Group Category</label>
                                    <select
                                        value={formData.groupCategory}
                                        onChange={(e) => setFormData({ ...formData, groupCategory: e.target.value })}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                    >
                                        <option value="">Select Group Category</option>
                                        <option value="default">Default Group</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Common Contact Fields (Restaurant + Cloud) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Reachable Contact No. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.contactNo}
                                    onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                />
                            </div>
                            {/* Cloud typically asks for email, Restaurant might or might not, but safe to include or make conditional if needed. 
                                Screenshot for Activate Zinggr didn't explicitly show Email, but it had "Reachable Contact No.".
                                I will add Email only for Cloud to match screenshot explicitly if needed, but usually it's good to have.
                                User request: "Request for resturant form modla not showing".
                                I will include Email for both to be safe, or just cloud. 
                                Let's include for both as it's standard contact info.
                            */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Reachable Email ID. <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {type === 'cloud' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Number of Orders Per Day (Approx.)
                                </label>
                                <input
                                    type="number"
                                    value={formData.ordersPerDay}
                                    onChange={(e) => setFormData({ ...formData, ordersPerDay: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                />
                                <p className="text-[10px] text-blue-500 mt-1">Note:- Number of Orders Restaurant Receiving from {integrationName}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Comments</label>
                            <textarea
                                rows={3}
                                value={formData.comments}
                                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                            />
                        </div>

                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}
