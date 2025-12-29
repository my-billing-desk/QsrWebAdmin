import React from 'react';
import { MoreVertical, Calendar, MessageSquare, Paperclip, Plus } from 'lucide-react';

/**
 * KanbanBoard Component
 * 
 * Implements the "Task Board" design reference.
 * 
 * Props:
 * - columns: Array of column definitions { id, title, color, count }
 * - data: Array of items (orders) with 'status' matching column ids.
 * - onStatusChange: (itemId, newStatus) => void (Placeholder for DnD logic)
 */
export function KanbanBoard({ columns, data, onStatusChange }) {

    const getColumnData = (colId) => data.filter(item => item.status === colId);

    return (
        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
            {columns.map(col => (
                <div key={col.id} className="min-w-[300px] flex flex-col bg-gray-50/50 rounded-xl h-full" style={{ backgroundColor: 'var(--bg-main)' }}>
                    {/* Column Header */}
                    <div className="p-4 flex items-center justify-between border-b border-transparent">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>{col.title}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-muted border shadow-sm" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
                                {String(getColumnData(col.id).length).padStart(2, '0')}
                            </span>
                        </div>
                        <button className="text-muted hover:text-main">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Cards Container */}
                    <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
                        {getColumnData(col.id).map((item, idx) => (
                            <KanbanCard key={item.id || idx} item={item} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function KanbanCard({ item }) {
    // Determine visuals based on item properties
    const priorityColor = item.type === 'dine-in' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600';
    const typeLabel = item.type === 'dine-in' ? 'Dine In' : item.type === 'delivery' ? 'Delivery' : 'Take Away';

    return (
        <div className="bg-surface p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow group cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>

            {/* Top Badges */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider bg-white" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        {typeLabel}
                    </span>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${priorityColor}`}>
                        #{item.subType || 'High'} {/* Using 'High' as visual placeholder if no subtype */}
                    </span>
                </div>
                <button className="text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>

            {/* Title & Progress */}
            <div className="mb-4">
                <h4 className="font-bold text-base mb-2" style={{ color: 'var(--text-main)' }}>{item.title}</h4>

                {/* Visual Progress Bar (Mocked for visual reference) */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-1">
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${item.progress || 30}%`,
                            backgroundColor: item.progressColor || 'var(--color-primary)'
                        }}
                    />
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-3 border-t border-dashed" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-1.5 text-xs text-muted font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date || 'Due: Today'}</span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Avatars Stack */}
                    <div className="flex -space-x-2">
                        {[1, 2].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[8px] font-bold text-muted overflow-hidden">
                                {/* Placeholder Avatar */}
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}${i}`} alt="avatar" />
                            </div>
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-orange-500 text-white flex items-center justify-center text-[8px] font-bold">
                            1+
                        </div>
                    </div>

                    {/* Comments Indicator */}
                    <div className="flex items-center gap-1 text-xs text-muted">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{item.itemsCount || 2}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>1</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
