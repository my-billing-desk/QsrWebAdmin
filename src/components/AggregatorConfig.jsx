import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronLeft, Home, ChevronRight, Play, Info, AlertTriangle,
    FileText, Check, Save, Trash2, Plus
} from 'lucide-react';
import { aggregatorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AggregatorConfig() {
    const { user } = useAuth();
    const { slug } = useParams();
    const navigate = useNavigate();
    const [view, setView] = useState('overview'); // overview | settings
    const [aggregator, setAggregator] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        isGstNotRegistered: false,
        gstNote: 'Tax to be paid under section 9(5) by Eco',
        noPrintBill: false,
        noPrintKot: false,
        noPrintEcommerce: false,
        orderType: 'Zomato',
        allowItemTags: true,
        commissionRate: 10,
        enableAutoMarkFoodReady: false,
        pkgChargeType: 'Order', // Item, Order, None
        pkgChargeCalc: 'Percentage', // Fixed, Percentage
        pkgChargeValue: 5,
        autoAccept: 'On',
        timeSlots: [{ from: '00:00', to: '23:55' }]
    });

    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (idx) => {
        setActiveAccordion(activeAccordion === idx ? null : idx);
    };

    useEffect(() => {
        // Fetch aggregator details (mock or real)
        async function fetchDetails() {
            setLoading(true);
            try {
                const res = await aggregatorService.getAll();
                const found = res.data.find(a => a.slug === slug || a.name.toLowerCase() === slug.toLowerCase());
                if (found) {
                    setAggregator(found);
                } else {
                    // Fallback mock if not found in DB or valid slug
                    setAggregator({ name: slug, icon: null, isConnected: true });
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        }
        fetchDetails();
    }, [slug]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!aggregator) return <div className="p-8">Aggregator not found</div>;

    const handleSave = () => {
        // Save logic here (mock)
        toast.success("Configuration Saved!");
        setView('overview');
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans pb-10">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/" className="hover:text-gray-700"><Home size={16} /></Link>
                    <ChevronRight size={14} />
                    <Link to="/marketplace" className="hover:text-gray-700">Marketplace</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-900 font-medium">Online Orders | {aggregator.name}</span>
                </div>
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <ChevronLeft size={16} /> Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {view === 'overview' && (
                    <div className="space-y-6">
                        {/* Header Card */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-20 h-20 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                {aggregator.icon ? <img src={aggregator.icon} className="w-full h-full object-contain rounded-lg" /> : aggregator.name}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{aggregator.name}</h1>
                                        <p className="text-gray-600 text-sm max-w-2xl">
                                            Customize the ordering experience with {aggregator.name}. One click order on your POS with menu synchronization. (Only for existing {aggregator.name} enabled restaurants)
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded border border-green-200 mb-1">
                                            <Check size={12} /> Activated
                                        </div>
                                        <p className="text-[10px] text-gray-500">Service is expiring on: 6 Apr 2026</p>
                                        <p className="text-[10px] text-red-500">113 days left</p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <button className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                                        Request For Cloud Kitchen Integration
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Settings Section */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="section-title text-gray-800 font-bold mb-4 bg-gray-100 inline-block px-3 py-1 rounded text-sm">Settings:</h3>
                            <div
                                onClick={() => setView('settings')}
                                className="border border-gray-200 rounded-lg p-4 w-64 hover:border-red-500 cursor-pointer transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 bg-green-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-br">Activated</div>
                                <div className="mt-4 font-bold text-center text-gray-700 group-hover:text-red-600">[{user?.tenantName || 'Store Name'}]</div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h3 className="section-title text-gray-800 font-bold mb-4 bg-gray-100 inline-block px-3 py-1 rounded text-sm">Description</h3>

                            <h4 className="font-bold text-sm text-gray-800 mb-2">Process Flow</h4>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                For outlets that are currently online in {aggregator.name}, the outlets have to share their link or ID. Once the integration is live, all orders from the application lands on the POS and then the whole journey from accepting it to marking the order ready to dispatching it can be done in the POS itself rather than jumping between dashboards.
                            </p>

                            <h4 className="font-bold text-sm text-gray-800 mb-2">Key Features</h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
                                <li>Single click updates on {aggregator.name}.</li>
                                <li>Hassle free multiple App handling.</li>
                                <li>Simplest execution of the Online Orders for accepting and rejecting order.</li>
                                <li>Create different menus along with Prices just for {aggregator.name}.</li>
                                <li>No need for the extra reporting for the business done on {aggregator.name}.</li>
                                <li>Get 6 months free integration.</li>
                                <li>Get instant order straight from PoS.</li>
                            </ul>
                        </div>

                        {/* Video Section */}
                        <div className="bg-white p-8 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                            <p className="text-sm font-medium text-gray-700 mb-6">Watch this video to know more.</p>
                            <div className="w-full max-w-2xl bg-gray-100 rounded-xl overflow-hidden relative aspect-video flex items-center justify-center group cursor-pointer shadow-lg hover:shadow-xl transition-all">
                                {/* Placeholder Illustration */}
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                    <div className="text-6xl pt-10 opacity-20">🎥</div>
                                </div>
                                {/* Play Button */}
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform z-10">
                                    <Play fill="white" className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === 'settings' && (
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-gray-800">Edit {aggregator.name} Setting</h2>
                            <div className="text-xs text-gray-500">Identifier : <span className="font-mono">Default</span></div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Outlet Info */}
                            <div className="bg-blue-50 px-4 py-2 rounded text-sm text-blue-800 mb-4">
                                <span className="font-bold">Outlet Code : </span> in6h94d35b
                                <div className="text-xs text-blue-600 mt-1">Unique code for each outlet registered on {aggregator.name}</div>
                            </div>

                            {/* GST Checkbox */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-red-600 focus:ring-red-500"
                                        checked={formData.isGstNotRegistered}
                                        onChange={e => setFormData({ ...formData, isGstNotRegistered: e.target.checked })}
                                    />
                                    <span className="text-sm font-medium text-gray-700">Restaurant is not registered under GST</span>
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                    <label className="text-sm font-medium text-gray-700 mt-2">GST Information note on Bill Print</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:border-red-500 outline-none"
                                        rows={2}
                                        value={formData.gstNote}
                                        onChange={e => setFormData({ ...formData, gstNote: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Print Options */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-red-600" checked={formData.noPrintBill} onChange={e => setFormData({ ...formData, noPrintBill: e.target.checked })} />
                                    <span className="text-sm text-gray-700">Do not print Bill</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-red-600" checked={formData.noPrintKot} onChange={e => setFormData({ ...formData, noPrintKot: e.target.checked })} />
                                    <span className="text-sm text-gray-700">Do not print Kot</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded text-red-600" checked={formData.noPrintEcommerce} onChange={e => setFormData({ ...formData, noPrintEcommerce: e.target.checked })} />
                                    <div className="text-sm text-gray-700">
                                        Do not print e-Commerce operators. GST levied on the bills printed
                                        <p className="text-[10px] text-blue-500">Note: If enabled, the GST amount deducted by e-commerce operators will not be included in the invoices generated.</p>
                                    </div>
                                </label>
                            </div>

                            {/* Order Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-t border-gray-100 pt-4">
                                <label className="text-sm font-medium text-gray-700">Order Type <span className="text-red-500">*</span></label>
                                <select
                                    className="w-full border border-gray-300 rounded p-2 text-sm outline-none"
                                    value={formData.orderType}
                                    onChange={e => setFormData({ ...formData, orderType: e.target.value })}
                                >
                                    <option>Zomato</option>
                                    <option>Swiggy</option>
                                    <option>ONDC</option>
                                    <option>Delivery</option>
                                    <option>Takeaway</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-red-600" checked={formData.allowItemTags} onChange={e => setFormData({ ...formData, allowItemTags: e.target.checked })} />
                                <span className="text-sm text-gray-700">Allow Item tags to participate in {aggregator.name} Campaign</span>
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                <label className="text-sm font-medium text-gray-700">Commission Rate %</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded p-2 text-sm outline-none"
                                    value={formData.commissionRate}
                                    onChange={e => setFormData({ ...formData, commissionRate: e.target.value })}
                                />
                            </div>

                            {/* Warning Box */}
                            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start gap-3">
                                <AlertTriangle size={18} className="text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Recommended specifically for restaurants with pre-packed or fast-packing items only.</p>
                                    <label className="flex items-center gap-2 mt-1 cursor-pointer">
                                        <input type="checkbox" className="rounded text-red-600" checked={formData.enableAutoMarkFoodReady} onChange={e => setFormData({ ...formData, enableAutoMarkFoodReady: e.target.checked })} />
                                        <span className="text-xs text-gray-700">Enable auto mark food ready</span>
                                    </label>
                                </div>
                            </div>

                            {/* Packaging Charge */}
                            <div className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm text-gray-700">Packaging charge applicable on</label>
                                    <div className="md:col-span-2 flex gap-4">
                                        {['Item', 'Order', 'None'].map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input type="radio" name="pkgApp" checked={formData.pkgChargeType === opt} onChange={() => setFormData({ ...formData, pkgChargeType: opt })} />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm text-gray-700">Packaging Charge Type</label>
                                    <div className="md:col-span-2 flex gap-4">
                                        {['Fixed', 'Percentage'].map(opt => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                                                <input type="radio" name="pkgType" checked={formData.pkgChargeCalc === opt} onChange={() => setFormData({ ...formData, pkgChargeCalc: opt })} />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <label className="text-sm text-gray-700">Packaging charge value <span className="text-red-500">*</span></label>
                                    <div className="md:col-span-2">
                                        <input
                                            type="number"
                                            className="w-full border border-gray-300 rounded p-2 text-sm outline-none"
                                            value={formData.pkgChargeValue}
                                            onChange={e => setFormData({ ...formData, pkgChargeValue: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Auto Accept */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
                                <div className="text-sm text-gray-700">
                                    Auto accept orders once arrived
                                    <p className="text-[10px] text-blue-500 mt-1 leading-tight">Note: Make sure your KOT printer is assigned properly...</p>
                                </div>
                                <div className="md:col-span-2 flex gap-4">
                                    {['On', 'On but without print', 'Off'].map(opt => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm">
                                            <input type="radio" name="autoAccept" checked={formData.autoAccept === opt} onChange={() => setFormData({ ...formData, autoAccept: opt })} />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="border border-gray-200 rounded p-4 bg-gray-50">
                                <div className="flex justify-end mb-2">
                                    <button className="flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-white px-2 py-1 rounded hover:bg-red-50">
                                        <Plus size={12} /> Add New
                                    </button>
                                </div>
                                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 mb-2 px-2">
                                    <div className="col-span-5">From <span className="text-red-500">*</span></div>
                                    <div className="col-span-6">To <span className="text-red-500">*</span></div>
                                    <div className="col-span-1"></div>
                                </div>
                                {formData.timeSlots.map((slot, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-4 mb-2 items-center">
                                        <div className="col-span-5">
                                            <select className="w-full border border-gray-300 rounded p-2 text-sm bg-white"><option>{slot.from}</option></select>
                                        </div>
                                        <div className="col-span-6">
                                            <select className="w-full border border-gray-300 rounded p-2 text-sm bg-white"><option>{slot.to}</option></select>
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons Accordion */}
                            <div className="space-y-3 pt-4">
                                {[
                                    { title: `Change Status On ${aggregator.name}`, type: 'status' },
                                    { title: `Check Outlet Logistics Status On ${aggregator.name}`, type: 'logistics' },
                                    { title: `Change Outlet Delivery Timings On ${aggregator.name}`, type: 'timings' },
                                    { title: `Change Outlet Takeaway Status On ${aggregator.name}`, type: 'takeaway_status' },
                                    { title: `Change Outlet Self Delivery Timings On ${aggregator.name}`, type: 'self_delivery_timings' },
                                    { title: `Change Outlet Takeaway Timings On ${aggregator.name}`, type: 'takeaway_timings' }
                                ].map((section, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200">
                                        <div
                                            className="flex justify-between items-center p-4 bg-white cursor-pointer hover:bg-gray-50 border-b border-transparent"
                                            onClick={() => toggleAccordion(idx)}
                                        >
                                            <span className="text-sm font-bold text-gray-800">{section.title}</span>
                                            <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium text-gray-600 hover:text-red-600 hover:border-red-200">
                                                {activeAccordion === idx ? 'Close' : 'Check Status'}
                                            </button>
                                        </div>

                                        {activeAccordion === idx && (
                                            <div className="p-6 bg-gray-50 border-t border-gray-100 text-sm animate-in fade-in slide-in-from-top-1 duration-200">

                                                {/* SECTION 1: STATUS */}
                                                {section.type === 'status' && (
                                                    <div className="space-y-6">
                                                        <p className="text-green-600 font-medium">Restaurant Delivery Status fetched successfully</p>
                                                        <div><button className="px-3 py-1.5 border border-gray-300 rounded bg-white text-xs font-medium">Update Status</button></div>

                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                            <span className="font-medium text-gray-700">{aggregator.name} Delivery Status</span>
                                                            <div className="flex gap-4 md:col-span-3">
                                                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="delStatus" defaultChecked /> Open for Delivery</label>
                                                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="delStatus" /> Closed for Delivery</label>
                                                            </div>
                                                        </div>
                                                        <p className="text-[10px] text-blue-500 italic max-w-2xl">
                                                            Note: Select the above option to change the availability for {aggregator.name}. Other items will appear as they reflect "Check for Delivery" and change it accordingly.
                                                        </p>

                                                        <div className="flex justify-between items-center pt-2">
                                                            <span className="font-medium text-gray-700">{aggregator.name} Store Status</span>
                                                            <span className="text-green-600 font-medium">Your outlet is open for delivery</span>
                                                        </div>
                                                        <div className="text-right"><button className="text-xs text-gray-500 hover:underline">Show Less</button></div>
                                                    </div>
                                                )}

                                                {/* SECTION 2: LOGISTICS */}
                                                {section.type === 'logistics' && (
                                                    <div className="space-y-6">
                                                        <div className="flex justify-between">
                                                            <span className="font-bold text-gray-700">{aggregator.name} Logistics Status : Enabled</span>
                                                            <span className="text-xs text-green-600 font-bold">29 Oct 2025</span>
                                                        </div>
                                                        <p className="text-[10px] text-blue-500">Note: This flag will be true when restaurant is mapped in any logistics service on {aggregator.name}</p>

                                                        <div className="font-medium text-gray-700">Current serviceability Status: <span className="text-green-600">Active</span></div>
                                                        <p className="text-[10px] text-blue-500">Note: When restaurant is responsive in logistics orders, then this flag provides the current serviceability status.</p>

                                                        <div className="font-medium text-gray-700">Self delivery service: <span className="text-red-500">Disabled</span></div>
                                                        <p className="text-[10px] text-blue-500">Note: This flag will be true when restaurant is enabled for self delivery.</p>

                                                        <div className="font-medium text-gray-700">Current serviceability Status: <span className="text-green-600">Active</span></div>
                                                        <p className="text-[10px] text-blue-500">Note: When restaurant is enabled for self delivery, then this flag provides the current serviceability status for self delivery.</p>

                                                        <div><button className="px-3 py-1.5 border border-gray-300 rounded bg-white text-xs font-medium">Update Status</button></div>

                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-2">
                                                            <span className="font-medium text-gray-700 col-span-2">Update outlet self delivery serviceability status</span>
                                                            <div className="flex gap-4 col-span-2">
                                                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="selfDel" defaultChecked /> Open for Self Delivery Service</label>
                                                                <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="selfDel" /> Closed for Self Delivery Service</label>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1">
                                                            <label className="text-sm font-bold text-gray-700">Success after which status needs to be reverted.</label>
                                                            <textarea className="w-full border border-gray-300 rounded p-2 text-sm h-20 bg-white" placeholder="Reason"></textarea>
                                                        </div>
                                                        <div className="text-right"><button className="text-xs text-gray-500 hover:underline">Show Less</button></div>
                                                    </div>
                                                )}

                                                {/* SECTION 3: TIMINGS */}
                                                {section.type === 'timings' && (
                                                    <div className="space-y-4">
                                                        <p className="text-green-600 font-medium">{aggregator.name} delivery timings fetched successfully</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[10px] text-blue-500">Please click here to Update Delivery Timings On The {aggregator.name} Platform.</span>
                                                            <button className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Update Timing</button>
                                                        </div>

                                                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                                            <div className="grid grid-cols-12 bg-gray-100 p-2 text-[10px] font-bold text-gray-500 text-center items-center">
                                                                <div className="col-span-2 text-left px-2">Day</div>
                                                                <div className="col-span-6">Update Timings</div>
                                                                <div className="col-span-2">Active / Inactive</div>
                                                                <div className="col-span-2"></div>
                                                            </div>
                                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                                <div key={day} className="grid grid-cols-12 border-t border-gray-100 p-3 items-center text-sm hover:bg-gray-50">
                                                                    <div className="col-span-2 font-medium text-gray-700">{day}</div>
                                                                    <div className="col-span-6 flex gap-2 justify-center items-center">
                                                                        <input type="text" defaultValue="12:00 PM" className="w-24 border border-gray-300 rounded px-2 py-1 text-xs" />
                                                                        <span className="text-gray-400">-</span>
                                                                        <input type="text" defaultValue="11:55 PM" className="w-24 border border-gray-300 rounded px-2 py-1 text-xs" />
                                                                        <button className="text-gray-400 hover:text-black"><Trash2 size={12} /></button>
                                                                    </div>
                                                                    <div className="col-span-2 text-center">
                                                                        <select className="border border-gray-300 rounded px-2 py-1 text-xs bg-white w-full">
                                                                            <option>Active</option>
                                                                            <option>Inactive</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-span-2 flex justify-center gap-2">
                                                                        <button className="px-3 py-1 bg-gray-600 text-white text-[10px] rounded hover:bg-gray-700">Add Slots</button>
                                                                        {day === 'Monday' && <button className="text-gray-500 hover:text-blue-500"><FileText size={14} /></button>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="text-right"><button className="text-xs text-gray-500 hover:underline">Show Less</button></div>
                                                    </div>
                                                )}

                                                {/* Fallback for others */}
                                                {['takeaway_status', 'self_delivery_timings', 'takeaway_timings'].includes(section.type) && (
                                                    <div className="text-center py-4 text-gray-400 italic">No details available for this section yet.</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="bg-red-50 p-4 border-t border-red-100 flex justify-end gap-4 rounded-b-lg">
                            <button onClick={() => setView('overview')} className="px-6 py-2 bg-white border border-gray-300 rounded text-sm font-bold text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-red-800 text-white rounded text-sm font-bold shadow hover:bg-red-900">Save Changes</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
