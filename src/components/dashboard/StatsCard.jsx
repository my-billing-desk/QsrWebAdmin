import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const getVariantClasses = (variant) => {
    switch (variant) {
        case 'primary': return { bg: 'bg-indigo-600', text: 'text-indigo-600', bgSoft: 'bg-indigo-50' };
        case 'blue': return { bg: 'bg-blue-500', text: 'text-blue-500', bgSoft: 'bg-blue-50' };
        case 'green': return { bg: 'bg-emerald-500', text: 'text-emerald-500', bgSoft: 'bg-emerald-50' };
        case 'purple': return { bg: 'bg-purple-500', text: 'text-purple-500', bgSoft: 'bg-purple-50' };
        case 'pink': return { bg: 'bg-pink-500', text: 'text-pink-500', bgSoft: 'bg-pink-50' };
        case 'orange': return { bg: 'bg-orange-500', text: 'text-orange-500', bgSoft: 'bg-orange-50' };
        default: return { bg: 'bg-gray-500', text: 'text-gray-500', bgSoft: 'bg-gray-50' };
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
    const styles = getVariantClasses(variant);

    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm font-medium mb-1">{label}</span>
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${variant === 'primary' ? 'bg-indigo-600 text-white' : `${styles.bgSoft} ${styles.text}`}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                {subValue && <span className="text-sm font-medium text-gray-500">{subValue}</span>}
                {showMenu && (
                    <button className="text-gray-500 hover:text-indigo-600">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
