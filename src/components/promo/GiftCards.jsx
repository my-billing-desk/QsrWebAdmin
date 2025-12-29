import React, { useState } from 'react';
import { Search, ChevronDown, Plus, FileSpreadsheet, FileText, RotateCcw, Eye, Edit, Trash2, Gift, Calendar, User, X } from 'lucide-react';

export function GiftCards() {
    // Mock Data based on reference
    const [giftCards] = useState([
        { id: 1, cardNo: 'GFT1110', customer: 'Daniel Jude', customerImg: 'https://randomuser.me/api/portraits/men/32.jpg', issued: '14 Oct 2024', expiry: '14 Nov 2024', amount: '$220', balance: '$100', status: 'Active' },
        { id: 2, cardNo: 'GFT1109', customer: 'Emma Bates', customerImg: 'https://randomuser.me/api/portraits/women/44.jpg', issued: '03 Oct 2024', expiry: '03 Nov 2024', amount: '$260', balance: '$200', status: 'Active' },
        { id: 3, cardNo: 'GFT1108', customer: 'Malissa', customerImg: 'https://randomuser.me/api/portraits/women/65.jpg', issued: '17 Sep 2024', expiry: '17 Oct 2024', amount: '$150', balance: '$150', status: 'Active' },
        { id: 4, cardNo: 'GFT1107', customer: 'Danny', customerImg: 'https://randomuser.me/api/portraits/men/88.jpg', issued: '02 Sep 2024', expiry: '02 Oct 2024', amount: '$120', balance: '$0', status: 'Redeemed' },
        { id: 5, cardNo: 'GFT1106', customer: 'Mitchum', customerImg: 'https://randomuser.me/api/portraits/men/54.jpg', issued: '15 Aug 2024', expiry: '15 Sep 2024', amount: '$450', balance: '$300', status: 'Active' },
        { id: 6, cardNo: 'GFT1105', customer: 'Rolands', customerImg: 'https://randomuser.me/api/portraits/men/22.jpg', issued: '26 Jul 2024', expiry: '26 Aug 2024', amount: '$420', balance: '$400', status: 'Active' },
        { id: 7, cardNo: 'GFT1104', customer: 'Daniel Jude', customerImg: 'https://randomuser.me/api/portraits/men/32.jpg', issued: '14 Oct 2024', expiry: '14 Nov 2024', amount: '$220', balance: '$150', status: 'Active' },
        { id: 8, cardNo: 'GFT1103', customer: 'Emma Bates', customerImg: 'https://randomuser.me/api/portraits/women/44.jpg', issued: '03 Oct 2024', expiry: '03 Nov 2024', amount: '$260', balance: '$220', status: 'Inactive' },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans p-6 gap-6 overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gift Cards</h1>
                    <div className="text-sm text-gray-500">Manage your gift cards</div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Action Icons */}
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-red-500 shadow-sm"><FileText className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-green-600 shadow-sm"><FileSpreadsheet className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><RotateCcw className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center bg-white border rounded hover:bg-gray-50 text-gray-600 shadow-sm"><ChevronDown className="w-4 h-4" /></button>

                    {/* Main Action */}
                    <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-orange-500 text-white rounded font-bold shadow-sm hover:bg-orange-600 flex items-center gap-2 ml-2">
                        <Plus className="w-4 h-4" /> Add Gift Card
                    </button>
                </div>
            </div>

            {/* 2. Main Content Card */}
            <div className="bg-white border rounded-lg shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* 2a. Filter Row */}
                <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 min-w-[90px] justify-between">
                                Status <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="relative">
                            <button className="px-3 py-2 border rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50 w-48 justify-between">
                                Sort By : Last 7 Days <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2b. Data Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white text-xs font-bold text-gray-800 border-b">
                            <tr>
                                <th className="p-4 w-10 text-center"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4">Gift Card</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Issued Date</th>
                                <th className="p-4">Expiry Date</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Balance</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y">
                            {giftCards.map((card) => (
                                <tr key={card.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-center"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 font-bold text-gray-800">{card.cardNo}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <img src={card.customerImg} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="" />
                                            <span className="font-medium text-gray-700">{card.customer}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{card.issued}</td>
                                    <td className="p-4 text-gray-600">{card.expiry}</td>
                                    <td className="p-4 font-bold text-gray-800">{card.amount}</td>
                                    <td className="p-4 text-gray-600">{card.balance}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold text-white ${card.status === 'Active' ? 'bg-green-500' :
                                                card.status === 'Redeemed' ? 'bg-pink-600' :
                                                    'bg-red-500'
                                            }`}>
                                            {card.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-gray-500"><Eye className="w-3 h-3" /></button>
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-green-600"><Edit className="w-3 h-3" /></button>
                                            <button className="p-1.5 border rounded hover:bg-gray-50 text-red-500"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 2c. Pagination */}
                <div className="p-4 border-t flex justify-end gap-2">
                    <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm">Previous</button>
                    <button className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white rounded text-sm font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center border hover:bg-gray-50 rounded text-sm">2</button>
                    <button className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm">Next</button>
                </div>
            </div>

            {/* 3. Add Gift Card Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-[600px] shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800">Add Gift Card</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 grid grid-cols-2 gap-6">
                            <div className="col-span-2 space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Gift Card <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            </div>

                            <div className="col-span-2 space-y-1">
                                <div className="flex justify-between">
                                    <label className="text-sm font-semibold text-gray-700">Customer <span className="text-red-500">*</span></label>
                                    <button className="text-sm font-bold text-orange-500 flex items-center gap-1"><Plus className="w-3 h-3" /> Add New</button>
                                </div>
                                <div className="relative">
                                    <select className="w-full border rounded p-2.5 text-sm appearance-none bg-white focus:outline-none focus:border-orange-500">
                                        <option>Select</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-sm font-semibold text-gray-700">Issued Date <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="dd/mm/yyyy" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
                            </div>

                            <div className="space-y-1 relative">
                                <label className="text-sm font-semibold text-gray-700">Expiry Date <span className="text-red-500">*</span></label>
                                <input type="text" placeholder="dd/mm/yyyy" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                                <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-9 pointer-events-none" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Amount <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700">Balance <span className="text-red-500">*</span></label>
                                <input type="text" className="w-full border rounded p-2.5 text-sm focus:outline-none focus:border-orange-500" />
                            </div>

                            <div className="col-span-2 flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-700">Status</label>
                                <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t flex justify-end gap-4">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-2.5 bg-gray-800 text-white rounded font-bold hover:bg-gray-900">Cancel</button>
                            <button className="px-6 py-2.5 bg-orange-500 text-white rounded font-bold hover:bg-orange-600 shadow-lg shadow-orange-200">Add Gift Card</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
