import React from 'react';
import { Gift, ChevronRight, ArrowLeft } from 'lucide-react';

export function GiftCard() {
    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <span className="hover:text-gray-700 cursor-pointer">Marketplace</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-red-600">CRM | Gift Card</span>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex gap-6 mb-8">
                    <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm text-white">
                        <Gift className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Gift Card</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-3xl">
                            Provide customers with a customizable gift card service to enhance customer loyalty and engagement.
                            Merchants can easily create and issue gift cards with specific terms, allowing customers to redeem them conveniently
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                            Description
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
                            The gift card service enhances customer loyalty and provides a flexible gifting solution. Merchants can set specific terms and conditions for the usage, expiry and binding of the gift cards,enabling customers to redeem their gift cards easily while promoting brand engagement. With this easy-to-use tool, merchants can expand their reach and boost sales through thoughtful gifting options.
                        </p>
                    </section>

                    <section>
                        <h2 className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                            Key Features
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Create your gift card in the dashboard.</li>
                            <li>Accept Payments from the issued gift cards.</li>
                            <li>Customise the usage, expiry as well as binding of the gift card.</li>
                            <li>Access usage report from the dashboard.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
