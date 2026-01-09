import React, { useState } from 'react';
import { Check, X, Shield, Zap, Layout, Settings } from 'lucide-react';

export function SubscriptionPlans() {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const plans = [
        {
            title: 'Basic',
            price: billingCycle === 'monthly' ? 50 : 500,
            features: [
                { text: '10 Employees', included: true },
                { text: '50 Projects', included: true },
                { text: '50 Clients', included: true },
                { text: '50 GB Storage', included: true },
                { text: 'Voice & Video Chat', included: false },
                { text: 'CRM', included: false }
            ]
        },
        {
            title: 'Professional',
            price: billingCycle === 'monthly' ? 100 : 1000,
            features: [
                { text: '50 Employees', included: true },
                { text: '100 Projects', included: true },
                { text: '100 Clients', included: true },
                { text: '50 GB Storage', included: true }, // Ref check: Pro also says 50GB
                { text: 'Voice & Video Chat', included: true },
                { text: 'CRM', included: false }
            ]
        },
        {
            title: 'Enterprise',
            price: billingCycle === 'monthly' ? 200 : 2000,
            features: [
                { text: '100 Employees', included: true },
                { text: '200 Projects', included: true },
                { text: '200 Clients', included: true },
                { text: 'Unlimited Storage', included: true },
                { text: 'Voice & Video Chat', included: true },
                { text: 'CRM', included: true }
            ]
        }
    ];

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 font-sans gap-8 overflow-y-auto">
            {/* Header matches Reference */}
            <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>Pricing</h1>
                <div className="text-sm text-gray-500">Pages / <span>Pricing</span></div>
            </div>

            {/* Toggle Centered */}
            <div className="flex justify-center items-center gap-3">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Monthly</span>
                <button
                    onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                    className="relative w-12 h-6 rounded-full bg-gray-200 transition-colors focus:outline-none"
                    style={{ backgroundColor: billingCycle === 'yearly' ? 'var(--color-primary)' : '' }}
                >
                    <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}
                    />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>Yearly</span>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                    <div key={idx} className="bg-white rounded-xl border p-1 flex flex-col h-full relative group transition-all hover:shadow-lg" style={{ borderColor: 'var(--border-color)' }}>
                        {/* Card Body inner container match Ref */}
                        <div className="bg-white rounded-lg p-6 flex flex-col h-full">

                            {/* Header Section */}
                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>{plan.title}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold" style={{ color: 'var(--text-main)' }}>${plan.price}</span>
                                    <span className="text-sm text-gray-500">/{billingCycle === 'monthly' ? 'monthly' : 'yearly'}</span>
                                </div>
                            </div>

                            <hr className="mb-6 opacity-50" />

                            {/* Features List */}
                            <div className="mb-6 flex-1 space-y-4">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Features Includes</p>
                                {plan.features.map((feat, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3 text-sm">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feat.included ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {feat.included ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        </div>
                                        <span className={feat.included ? 'text-main' : 'text-gray-500'}>{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Button */}
                            <button className="w-full py-3 rounded-lg border-2 border-transparent bg-gray-900 text-white font-bold text-sm tracking-wide hover:opacity-90 transition-opacity dark:bg-white dark:text-black">
                                Choose Plan
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
