import React from 'react';
import { X } from 'lucide-react';

export function ReportNotifications() {
    // Alert Variants Configuration
    const variants = [
        { type: 'primary', color: 'bg-orange-50 text-orange-600 border-orange-100', linkColor: 'text-orange-700' },
        { type: 'secondary', color: 'bg-gray-100 text-gray-600 border-gray-200', linkColor: 'text-gray-800' },
        { type: 'success', color: 'bg-green-50 text-green-600 border-green-100', linkColor: 'text-green-700' },
        { type: 'danger', color: 'bg-red-50 text-red-600 border-red-100', linkColor: 'text-red-700' },
        { type: 'warning', color: 'bg-yellow-50 text-yellow-600 border-yellow-100', linkColor: 'text-yellow-700' },
        { type: 'info', color: 'bg-blue-50 text-blue-600 border-blue-100', linkColor: 'text-blue-700' },
        { type: 'light', color: 'bg-gray-50 text-gray-500 border-gray-100', linkColor: 'text-gray-700' },
        { type: 'dark', color: 'bg-gray-200 text-gray-700 border-gray-300', linkColor: 'text-gray-900' },
    ];

    return (
        <div className="flex flex-col h-full bg-main-app p-6 font-sans gap-6 overflow-y-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>Alerts</h1>
                <div className="text-sm text-muted">Base UI / <span>Alerts</span></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Default Alerts Column */}
                <div className="bg-surface rounded-xl border p-6" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-main)' }}>Default Alerts</h3>
                    <div className="space-y-4">
                        {variants.map((v) => (
                            <div key={v.type} className={`px-4 py-3 rounded-lg border text-sm font-medium ${v.color}`}>
                                A simple {v.type} alert—check it out!
                            </div>
                        ))}
                    </div>
                </div>

                {/* Links In Alerts Column */}
                <div className="bg-surface rounded-xl border p-6" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-main)' }}>Links In Alerts</h3>
                    <div className="space-y-4">
                        {variants.map((v) => (
                            <div key={v.type} className={`px-4 py-3 rounded-lg border text-sm font-medium ${v.color}`}>
                                A simple {v.type} alert with <a href="#" className={`font-bold underline hover:opacity-80 ${v.linkColor}`}>an example link</a>. Give it a click if you like.
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Additional variants like "Dismissing", "Icons" can be added similarly if requested.
