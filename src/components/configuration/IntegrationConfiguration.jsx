import React, { useState } from 'react';
import { Save, AlertTriangle, MessageSquare, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function IntegrationConfiguration({ integrationName, onClose }) {
    const { user } = useAuth();
    const [config, setConfig] = useState({
        notRegisteredGst: true,
        gstNote: '',
        printBill: true,
        printKot: false,
        printEcommerce: false,
        orderType: integrationName,
        itemTagsWait: true,
        commission: 10,
        markFoodReady: false,
        packagingApplicableOn: 'order', // item, order, none
        packagingType: 'percentage', // fixed, percentage
        packagingValue: 5,
        autoAccept: 'on', // on, on_no_print, off
    });

    const [timeSlots, setTimeSlots] = useState([
        { id: 1, from: '00:00', to: '23:55' }
    ]);

    const statusActions = [
        { label: `Change Status On ${integrationName}`, action: 'Check Status' },
        { label: `Check Outlet Logistics Status On ${integrationName}`, action: 'Check Status' },
        { label: `Change Outlet Takeaway Status On ${integrationName}`, action: 'Check Status' },
        { label: `Change Outlet Delivery Timings On ${integrationName}`, action: 'Check Status' },
        { label: `Change Outlet Self Delivery Timings On ${integrationName}`, action: 'Check Status' },
        { label: `Change Outlet Takeaway Timings On ${integrationName}`, action: 'Check Status' },
    ];

    const [outletId, setOutletId] = useState(
        integrationName === 'Zomato' ? (user?.tenantName || 'Store Name') :
            integrationName === 'Swiggy' ? 'SWIGGY STORE 1' :
                `${integrationName} OUTLET`
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-gray-800">Outlet Code : InDn54655</span>
                        </div>
                        <span className="text-xs text-blue-500">Unique code for each outlet registered on {integrationName}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Identifier :</span>
                    <input
                        type="text"
                        value={outletId}
                        onChange={(e) => setOutletId(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm font-bold w-48 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

                {/* GST Section */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <label className="flex items-center gap-2 mb-4 font-semibold text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={config.notRegisteredGst}
                            onChange={(e) => setConfig({ ...config, notRegisteredGst: e.target.checked })}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        Restaurant is not registered under GST
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">GST Information note on Bill Print</label>
                            <textarea
                                value="Tax to be paid under section 9(5) by Eco"
                                readOnly
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50 h-24 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Print & Order Settings */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-red-600 rounded" checked={!config.printBill} onChange={() => setConfig({ ...config, printBill: !config.printBill })} />
                            <span className="text-sm text-gray-700">Do not print Bill</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-red-600 rounded" checked={!config.printKot} onChange={() => setConfig({ ...config, printKot: !config.printKot })} />
                            <span className="text-sm text-gray-700">Do not print Kot</span>
                        </label>
                        <div className="flex flex-col">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 text-red-600 rounded" checked={config.printEcommerce} onChange={() => setConfig({ ...config, printEcommerce: !config.printEcommerce })} />
                                <span className="text-sm text-gray-700">Do not print e-Commerce operators. GST levied on the bills printed</span>
                            </label>
                            <span className="text-xs text-blue-500 ml-6">Note: If enabled, the GST amount deducted by e-commerce operators will not be included in the invoices generated.</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <label className="text-sm font-semibold text-gray-700">Order Type <span className="text-red-500">*</span></label>
                        <select
                            value={config.orderType}
                            onChange={(e) => setConfig({ ...config, orderType: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded shadow-sm outline-none focus:border-red-500"
                        >
                            <option value={integrationName}>{integrationName}</option>
                            {integrationName !== 'Zomato' && <option value="Zomato">Zomato</option>}
                            {integrationName !== 'Swiggy' && <option value="Swiggy">Swiggy</option>}
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.itemTagsWait}
                                onChange={(e) => setConfig({ ...config, itemTagsWait: e.target.checked })}
                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Allow Item tags to participate in {integrationName} Campaign</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <label className="text-sm font-semibold text-gray-700">Commission Rate %</label>
                        <input
                            type="number"
                            value={config.commission}
                            onChange={(e) => setConfig({ ...config, commission: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded shadow-sm outline-none focus:border-red-500"
                        />
                    </div>
                </div>

                {/* Packaging & Auto Accept */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
                    {/* Alert */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                        <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                        <div>
                            <p className="text-sm text-gray-700">Recommended specifically for restaurants with pre-packed or fast-packing items only.</p>
                            <label className="flex items-center gap-2 mt-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.markFoodReady}
                                    onChange={(e) => setConfig({ ...config, markFoodReady: e.target.checked })}
                                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                />
                                <span className="text-sm font-semibold text-gray-700">Enable auto mark food ready</span>
                            </label>
                        </div>
                        <div className="ml-auto">
                            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white shadow">
                                <MessageSquare size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                            <label className="text-sm text-gray-700 font-semibold">Packaging charge applicable on</label>
                            <div className="flex gap-4">
                                {['Item', 'Order', 'None'].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="packApp" checked={config.packagingApplicableOn === opt.toLowerCase()} onChange={() => setConfig({ ...config, packagingApplicableOn: opt.toLowerCase() })} className="text-red-600 focus:ring-red-500" />
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                            <label className="text-sm text-gray-700 font-semibold">Packaging Charge Type</label>
                            <div className="flex gap-4">
                                {['Fixed', 'Percentage'].map(opt => (
                                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="packType" checked={config.packagingType === opt.toLowerCase()} onChange={() => setConfig({ ...config, packagingType: opt.toLowerCase() })} className="text-red-600 focus:ring-red-500" />
                                        <span className="text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                            <label className="text-sm font-semibold text-gray-700">Packaging charge value <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                value={config.packagingValue}
                                onChange={(e) => setConfig({ ...config, packagingValue: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded shadow-sm outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center pt-4">
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-700 font-semibold">Auto accept orders once arrived</label>
                                <p className="text-[10px] text-blue-500 mt-1 leading-tight w-3/4">
                                    Note : Make sure, your KOT printer is assigned properly while enabling auto accept flag. If not, this will result into queuing of the KOT print. Change in auto accept flag will take a minute to get reflect once changed.
                                </p>
                            </div>

                            <div className="flex gap-4">
                                {[
                                    { label: 'On', val: 'on' },
                                    { label: 'On but without print', val: 'on_no_print' },
                                    { label: 'Off', val: 'off' }
                                ].map(opt => (
                                    <label key={opt.val} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="autoAccept" checked={config.autoAccept === opt.val} onChange={() => setConfig({ ...config, autoAccept: opt.val })} className="text-red-600 focus:ring-red-500" />
                                        <span className="text-sm whitespace-nowrap">{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Time Slots */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-end mb-4">
                        <button className="px-3 py-1.5 border border-red-200 text-red-600 text-sm font-bold rounded flex items-center gap-1 hover:bg-red-50">
                            <Plus size={16} /> Add New
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-[1fr_1fr_50px] bg-gray-100 border-b border-gray-200 px-4 py-2 text-xs font-bold text-gray-600">
                            <div>From <span className="text-red-500">*</span></div>
                            <div>To <span className="text-red-500">*</span></div>
                            <div></div>
                        </div>
                        {timeSlots.map(slot => (
                            <div key={slot.id} className="grid grid-cols-[1fr_1fr_50px] px-4 py-3 items-center border-b last:border-0 border-gray-100">
                                <div className="pr-4">
                                    <select className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
                                        <option>{slot.from}</option>
                                    </select>
                                </div>
                                <div className="pr-4">
                                    <select className="w-full p-2 border border-gray-300 rounded text-sm bg-white">
                                        <option>{slot.to}</option>
                                    </select>
                                </div>
                                <div className="flex justify-center">
                                    <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Actions List */}
                <div className="space-y-3">
                    {statusActions.map((item, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                            <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
                            <button className="px-4 py-1.5 border border-gray-300 rounded text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                                {item.action}
                            </button>
                        </div>
                    ))}
                </div>

            </div>

            {/* Footer Sticky */}
            <div className="fixed bottom-0 left-0 right-0 bg-red-50 border-t border-red-100 p-4 flex justify-end gap-3 z-30">
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-white border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                    Cancel
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 shadow-lg shadow-red-500/30">
                    Save Changes
                </button>
            </div>

            {/* Floating Chat Icon (as in screenshot) */}
            <div className="fixed bottom-24 right-6 pointer-events-none">
                <div className="bg-red-800 text-white p-3 rounded-full shadow-xl pointer-events-auto cursor-pointer hover:bg-red-900 transition-colors">
                    <MessageSquare size={24} />
                </div>
            </div>

        </div>
    );
}
