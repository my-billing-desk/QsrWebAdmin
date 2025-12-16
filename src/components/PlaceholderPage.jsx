import React from 'react';

export function PlaceholderPage({ title }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl mb-4 shadow-inner">
                🚧
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
            <p className="text-gray-400 mt-2">This module is currently under development.</p>
        </div>
    );
}
