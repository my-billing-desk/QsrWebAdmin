import React, { useState } from 'react';
import { ChevronLeft, Check, Clock, PlayCircle, Star, ShieldCheck, Zap, Settings } from 'lucide-react';
import IntegrationRequestModal from './IntegrationRequestModal';
import IntegrationConfiguration from './IntegrationConfiguration';
import IntegrationStatusModal from './IntegrationStatusModal';

export default function IntegrationDetail({ integration, onBack }) {
    const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'description'
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [requestType, setRequestType] = useState(null); // 'restaurant' | 'cloud'
    const [requestStatus, setRequestStatus] = useState(integration.requestStatus || 'none'); // 'none', 'received', 'menu_updated', 'qc_done', 'initiated', 'live'

    // Mock progress steps
    const steps = [
        { id: 'received', label: 'Request received', date: '20-12-2025 18:33:27', desc: 'Request received for the integration. An executive will be assigned soon to process the request.' },
        { id: 'menu_updated', label: 'Menu Updated', date: null, desc: 'A catalog agent is working on your outlet menu to publish it on your online order platform.' },
        { id: 'qc_done', label: 'QC Done', date: null, desc: 'An agent has been assigned to check the quality of the menu for final initiation.' },
        { id: 'initiated', label: 'Request Initiated', date: null, desc: 'Our executive will raise a request to integration partner for the final mapping.' },
        { id: 'live', label: 'Integration is Live', date: null, desc: 'Once the mapping is done at the integration partner, the orders and menus will be managed by mybill.' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === requestStatus);

    const handleRequest = (type) => {
        setRequestType(type);
        setShowRequestModal(true);
    };

    const handleSubmitRequest = (data) => {
        console.log('Request Data:', data);
        // Simulate API call
        setTimeout(() => {
            setRequestStatus('received');
            setShowRequestModal(false);
        }, 1000);
    };

    if (showConfig) {
        return (
            <IntegrationConfiguration
                integrationName={integration.name}
                onClose={() => setShowConfig(false)}
            />
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Marketplace</span>
                        <span>/</span>
                        <span>{integration.category}</span>
                        <span>/</span>
                        <span className="font-bold text-red-600">{integration.name}</span>
                    </div>
                </div>
            </div>

            {/* Success Banner - Show strictly if Zomato for demo or if status is set */}
            {/* For this specific requirement "need like this", we'll force show it if it's Zomato or if status is 'received' */}
            {(requestStatus === 'received' || integration.name === 'Zomato') && (
                <div className="px-6 py-4">
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                        <Check size={16} />
                        Your request for service activation has been submitted successfully to support team.
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-8">
                {/* Main Info */}
                <div className="flex-1 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex items-start gap-6">
                        <div className="w-24 h-24 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-3 shadow-inner shrink-0">
                            {integration.icon ? (
                                <img src={integration.icon} alt={integration.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-4xl font-bold text-gray-300">{integration.name[0]}</span>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{integration.name}</h1>
                                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                        Customize the ordering experience with {integration.name}. One click order on your mybill PoS with menu synchronization. (Only for existing {integration.name} enabled restaurants)
                                    </p>
                                </div>
                                {integration.isConnected && (
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded border border-green-200 flex items-center gap-1">
                                            <Check size={12} /> Activated
                                        </span>
                                        <div className="text-[10px] text-gray-500 text-right">
                                            Service is expiring on: <span className="font-bold text-gray-800">6 Apr 2026</span><br />
                                            <span className="text-red-500 font-bold">107 days left</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 mt-4">
                                {/* Always show Cloud Kitchen request button if user wants "need like this" */}
                                <button
                                    onClick={() => handleRequest('cloud')}
                                    className="px-4 py-2 border border-gray-300 bg-white text-gray-800 text-sm font-bold rounded hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Request For Cloud Kitchen Integration
                                </button>

                                {/* Show Restaurant Request only if NOT connected */}
                                {!integration.isConnected && (
                                    <button
                                        onClick={() => handleRequest('restaurant')}
                                        className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                    >
                                        Request For Restaurant
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px]">
                        <div className="flex border-b border-gray-200">
                            {/* Styling tabs to look like buttons in screenshot if needed, but standard tabs work */}
                            <div className="flex p-4 gap-2">
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`px-4 py-1.5 text-sm font-bold rounded transition-colors ${activeTab === 'settings' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500'}`}
                                >
                                    Settings:
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    {requestStatus === 'none' && !integration.isConnected ? (
                                        <div className="text-center py-20 text-gray-400">
                                            <p>No active requests. Please initiate a request to see status.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Status Cards */}
                                            <div className="flex flex-wrap gap-4 mb-8">
                                                {/* Card 1: Activated - Clickable for Config */}
                                                <div
                                                    onClick={() => setShowConfig(true)}
                                                    className="bg-white border border-gray-200 rounded p-4 w-52 shadow-sm relative cursor-pointer hover:border-red-300 transition-colors group"
                                                >
                                                    <div className="flex gap-2 mb-4 justify-between items-start">
                                                        <span className="bg-teal-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">Activated</span>
                                                        <Settings size={14} className="text-gray-400 group-hover:text-red-500" />
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-800 mb-4">
                                                        {integration.name === 'Zomato' ? '[SUNBURST STACK]' :
                                                            integration.name === 'Swiggy' ? '[Swiggy Store 1]' :
                                                                `[${integration.name} Outlet]`}
                                                    </div>
                                                    <div className="text-xs text-blue-500 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        Configure
                                                    </div>
                                                </div>

                                                {/* Card 2: In Process */}
                                                <div className="bg-white border border-gray-200 rounded p-4 w-52 shadow-sm relative">
                                                    <div className="flex gap-2 mb-4">
                                                        <span className="bg-yellow-300 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">In Process</span>
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-800 mb-4">
                                                        {integration.name === 'Zomato' ? '[Two Hands]' :
                                                            integration.name === 'Swiggy' ? '[Swiggy Pilot]' :
                                                                `[${integration.name} Test]`}
                                                    </div>
                                                    <div
                                                        onClick={() => setShowStatusModal(true)}
                                                        className="text-xs text-gray-500 pt-3 border-t border-gray-100 flex items-center justify-between cursor-pointer hover:text-gray-700 font-medium"
                                                    >
                                                        Check Status <ChevronLeft size={10} className="rotate-180" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description / Process Flow Section INSIDE Settings as per screenshot seems to flow down */}
                                            <div className="mt-8">
                                                <div className="bg-gray-100 px-3 py-1 inline-block rounded text-xs font-bold text-gray-600 mb-4">Description</div>

                                                <h3 className="text-sm font-bold text-gray-800 mb-2">Process Flow</h3>
                                                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                                                    For outlets that are currently online in {integration.name}, the outlets have to share their {integration.name} link or their ID. Once the integration is live, all the orders from the application lands on the PoS and then the whole journey from accepting it to marking the order ready to dispatching it can be done in the PoS itself rather than jumping between dashboards
                                                </p>

                                                <h3 className="font-bold text-gray-900 mb-2">Key Features</h3>
                                                <ul className="space-y-2 text-xs text-gray-600 mb-8 list-disc pl-4">
                                                    <li>Single click updates on {integration.name}.</li>
                                                    <li>Hassle free multiple App handling.</li>
                                                    <li>Simplest execution of the Online Orders for accepting and rejecting order.</li>
                                                    <li>Create different menus along with Prices just for {integration.name}.</li>
                                                    <li>No need for the extra reporting for the business done on {integration.name}.</li>
                                                    <li>Get 6 months free integration.</li>
                                                    <li>Get instant order straight from PoS.</li>
                                                </ul>

                                                <h3 className="text-sm font-bold text-gray-800 mb-4">Watch this video to know more.</h3>
                                                <div className="max-w-md">
                                                    <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden group cursor-pointer border border-gray-200">
                                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform z-10">
                                                            <PlayCircle size={32} className="text-white fill-current" />
                                                        </div>
                                                        <img
                                                            src="https://img.freepik.com/free-vector/isometric-delivery-concept_23-2147814981.jpg"
                                                            alt="Video Thumbnail"
                                                            className="w-full h-full object-cover opacity-80"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Help / Context */}
                {/* Optional, could stick support contacts here */}
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <IntegrationRequestModal
                    type={requestType}
                    integrationName={integration.name}
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={handleSubmitRequest}
                />
            )}

            {/* Status Modal */}
            {showStatusModal && (
                <IntegrationStatusModal
                    steps={steps}
                    integrationName={integration.name}
                    onClose={() => setShowStatusModal(false)}
                />
            )}
        </div>
    );
}
