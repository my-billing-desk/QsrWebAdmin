import React, { useState } from 'react';
import { Palette, Layout, Smartphone } from 'lucide-react';

const ColorPicker = ({ label, value, onChange, description }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-0 gap-4">
        <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{label}</h4>
            {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="flex items-center gap-3">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-24 px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded uppercase font-mono"
            />
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer transition-transform hover:scale-105"
            />
        </div>
    </div>
);

export function ThemeSettings({ theme, onChange }) {
    const [activeTab, setActiveTab] = useState('admin');

    const updateColor = (pScope, key, value) => {
        const newTheme = { ...theme };
        if (!newTheme[pScope]) newTheme[pScope] = {};
        newTheme[pScope][key] = value;
        onChange(newTheme);
    };

    const tabs = [
        { id: 'admin', label: 'Admin Dashboard', icon: Layout },
        { id: 'pos', label: 'POS Interface', icon: Smartphone }
    ];

    const config = {
        admin: [
            { id: 'background', label: 'Main Background', description: 'Overall dashboard background color' },
            { id: 'sidebar', label: 'Sidebar Background', description: 'Left navigation menu background' },
            { id: 'sidebar_text', label: 'Sidebar Text', description: 'Menu item color' },
            { id: 'header', label: 'Header Background', description: 'Top navigation bar background' },
            { id: 'primary_button', label: 'Primary Button', description: 'Main actions like Save, Add, etc.' },
            { id: 'primary_button_text', label: 'Primary Button Text', description: 'Color for button labels' },
            { id: 'card', label: 'Card Background', description: 'Background of content boxes' },
            { id: 'text_main', label: 'Main Text', description: 'General text content color' }
        ],
        pos: [
            { id: 'background', label: 'Main Background', description: 'Overall POS terminal background' },
            { id: 'header', label: 'POS Header', description: 'Top bar of the POS terminal' },
            { id: 'category_button', label: 'Category Button', description: 'Background for category items' },
            { id: 'category_active', label: 'Active Category', description: 'Selected category highlight color' },
            { id: 'category_active_text', label: 'Active Category Text', description: 'Text color for selected category' },
            { id: 'item_card', label: 'Item Card', description: 'Background for menu items' },
            { id: 'checkout_button', label: 'Checkout Button', description: 'Payment/Check-out button color' },
            { id: 'confirm_button', label: 'Confirm Button', description: 'Primary action/confirm button' },
            { id: 'cancel_button', label: 'Cancel Button', description: 'Void or cancel order button' },
            { id: 'numpad_button', label: 'Numpad Button', description: 'Background for touch numbers' }
        ]
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl">
                    <Palette className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Theme & Branding</h2>
                    <p className="text-gray-500 text-sm">Personalize the visual appearance of your applications.</p>
                </div>
            </div>

            {/* Platform Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl mb-8 w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${activeTab === tab.id
                                ? 'bg-white dark:bg-gray-800 text-pink-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dynamic Controls based on selected platform */}
            <div className="space-y-2 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                {config[activeTab].map(item => (
                    <ColorPicker
                        key={item.id}
                        label={item.label}
                        description={item.description}
                        value={theme?.[activeTab]?.[item.id] || '#000000'}
                        onChange={(val) => updateColor(activeTab, item.id, val)}
                    />
                ))}
            </div>

            {/* Quick Preview Note */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 italic">
                    Note: Color changes will be applied globally to all devices after saving.
                </p>
            </div>
        </div>
    );
}
