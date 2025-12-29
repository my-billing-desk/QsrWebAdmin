import React from 'react';

export function ButtonsPage() {
    const defaultButtons = [
        { label: 'Primary', color: 'bg-orange-500 hover:bg-orange-600 text-white' }, // Matches approximate ref color
        { label: 'Secondary', color: 'bg-slate-600 hover:bg-slate-700 text-white' },
        { label: 'Success', color: 'bg-green-500 hover:bg-green-600 text-white' },
        { label: 'Danger', color: 'bg-red-600 hover:bg-red-700 text-white' },
        { label: 'Warning', color: 'bg-yellow-400 hover:bg-yellow-500 text-white' },
        { label: 'Info', color: 'bg-blue-500 hover:bg-blue-600 text-white' },
        { label: 'Light', color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
        { label: 'Dark', color: 'bg-gray-900 hover:bg-gray-800 text-white' },
        { label: 'Link', color: 'bg-transparent text-blue-600 hover:underline px-0', variant: 'link' },
    ];

    return (
        <div className="flex flex-col h-full bg-main-app p-6 font-sans gap-6 overflow-y-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>Buttons</h1>
                <div className="text-sm text-muted">Base UI / <span>Buttons</span></div>
            </div>

            {/* Default Buttons Card */}
            <div className="bg-surface rounded-xl border p-6" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="font-bold text-lg mb-6" style={{ color: 'var(--text-main)' }}>Default Buttons</h3>
                <div className="flex flex-wrap gap-3">
                    {defaultButtons.map((btn) => (
                        <button
                            key={btn.label}
                            className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${btn.color} ${btn.variant !== 'link' ? 'shadow-sm' : ''}`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
