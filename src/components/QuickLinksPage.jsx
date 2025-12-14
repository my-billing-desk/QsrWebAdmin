import React, { useState } from 'react';
import { useQuickLinks } from '../context/QuickLinksContext';
import { Search, Plus, Check, Trash2, Zap } from 'lucide-react';

export function QuickLinksPage() {
    const { allMenuItems, quickLinks, toggleQuickLink } = useQuickLinks();
    const [activeTab, setActiveTab] = useState('add');
    const [searchQuery, setSearchQuery] = useState('');

    const flattenItems = (groups) => {
        let items = [];
        groups.forEach(group => {
            if (group.items) {
                group.items.forEach(item => {
                    if (item.items) {
                        // Sub items
                        item.items.forEach(sub => {
                            items.push({ ...sub, parent: item.label, group: group.title || 'General' });
                        });
                        if (item.path) { // If parent itself is clickable
                            items.push({ ...item, group: group.title || 'General' });
                        }
                    } else {
                        items.push({ ...item, group: group.title || 'General' });
                    }
                });
            }
        });
        return items;
    };

    const allItems = flattenItems(allMenuItems);

    const filteredItems = allItems.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isAdded = (id) => quickLinks.some(link => link.id === id);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Links Management</h1>

                <div className="flex items-center gap-6 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'add' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Add Links
                        {activeTab === 'add' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('view')}
                        className={`pb-3 text-sm font-semibold transition-colors relative ${activeTab === 'view' ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        View ({quickLinks.length})
                        {activeTab === 'view' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>}
                    </button>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'add' && (
                    <>
                        <div className="relative mb-6">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search modules..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            {filteredItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-sm transition-shadow">
                                    <div className="flex items-center gap-3">
                                        {/* <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                            {item.icon ? <item.icon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                                         </div> */}
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</h3>
                                            <p className="text-xs text-gray-400">{item.group} {item.parent ? `> ${item.parent}` : ''}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleQuickLink(item)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isAdded(item.id)
                                                ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                                                : 'bg-red-600 text-white hover:bg-red-700'
                                            }`}
                                    >
                                        {isAdded(item.id) ? 'Remove' : 'Add'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'view' && (
                    <div className="space-y-2">
                        {quickLinks.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">No quick links added yet.</div>
                        ) : (
                            quickLinks.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.label}</h3>
                                            <p className="text-xs text-gray-400">{item.path}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleQuickLink(item)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Remove"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
