import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const getVariantStyle = (variant) => {
    switch (variant) {
        case 'primary': return { backgroundColor: 'var(--color-primary)' };
        case 'blue': return { backgroundColor: '#3b82f6' };
        case 'green': return { backgroundColor: '#10b981' };
        case 'purple': return { backgroundColor: '#8b5cf6' };
        case 'pink': return { backgroundColor: '#ec4899' };
        case 'orange': return { backgroundColor: '#f97316' };
        default: return { backgroundColor: '#64748b' };
    }
};

// Helper for MoreVertical accessible menu icon
function MoreVertical({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
        </svg>
    );
}

export function StatsCard({ icon: Icon, label, value, subValue, variant = 'primary', showMenu = false }) {
    const variantStyles = getVariantStyle(variant);

    return (
        <div className="bg-surface p-5 rounded-xl border shadow-sm relative h-full flex flex-col justify-between" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-muted text-sm font-medium mb-1">{label}</span>
                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === 'primary' ? 'text-white' : ''}`}
                    style={{
                        backgroundColor: variant === 'primary' ? 'var(--color-primary)' : `${variantStyles.backgroundColor}20`,
                        color: variant === 'primary' ? 'white' : variantStyles.backgroundColor
                    }}
                >
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                {subValue && <span className="text-sm font-medium text-muted">{subValue}</span>}
                {showMenu && (
                    <button className="text-muted hover:text-main">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
