import React from 'react';
import { MoreVertical, Clock, Plus, Eye } from 'lucide-react';

/**
 * RunningOrderBoard Component
 * 
 * Implements the "Task Board" design reference.
 * 
 * Props:
 * - columns: Array of column definitions { id, title, color, count }
 * - data: Array of items (orders) with 'status' matching column ids.
 * - onStatusChange: (itemId, newStatus) => void (Placeholder for DnD logic)
 */
export function RunningOrderBoard({ columns, data, onStatusChange, currentTime = new Date() }) {

    const getColumnData = (colId) => data.filter(item => item.status === colId);

    return (
        <div className="grid grid-cols-4 gap-4 h-full w-full min-w-[1024px] lg:min-w-0">
            {columns.map(col => (
                <div key={col.id} className="flex flex-col bg-gray-50/50 rounded-xl h-full overflow-hidden" style={{ backgroundColor: 'var(--bg-gray-50)' }}>
                    {/* Column Header */}
                    <div className="p-4 flex items-center justify-between border-b border-transparent shrink-0">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                            <h3 className="font-bold text-lg truncate" style={{ color: 'var(--text-main)' }}>{col.title}</h3>
                            <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 border shadow-sm" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-white)' }}>
                                {String(getColumnData(col.id).length).padStart(2, '0')}
                            </span>
                        </div>
                        <button className="text-gray-500 hover:text-main">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Cards Container */}
                    <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
                        {getColumnData(col.id).map((item, idx) => (
                            <KanbanCard key={item.id || idx} item={item} onStatusChange={onStatusChange} currentTime={currentTime} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function KanbanCard({ item, onStatusChange, currentTime }) {
    // Determine visuals based on item properties
    const priorityColor = item.type === 'dine-in' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600';
    const typeLabel = item.type === 'dine-in' ? 'Dine In' : item.type === 'delivery' ? 'Delivery' : 'Take Away';

    const formatDuration = (dateString) => {
        const diff = currentTime.getTime() - new Date(dateString).getTime();
        const seconds = Math.floor(diff / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ago`;
    };

    const getTimeLeft = (dateString) => {
        const target = new Date(new Date(dateString).getTime() + 40 * 60 * 1000); // 40 mins target
        const diff = target.getTime() - currentTime.getTime();
        if (diff <= 0) return 'OVERDUE';
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s left`;
    };

    const getNextStatus = (current) => {
        if (current === 'placed') return 'preparing';
        if (current === 'preparing') return item.type === 'delivery' ? 'dispatched' : 'served';
        if (current === 'ready') return 'completed';
        return null;
    };

    const nextStatus = getNextStatus(item.status);

    return (
        <div className="bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow group cursor-pointer" style={{ borderColor: 'var(--border-color)' }}>

            {/* Top Badges */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider bg-white" style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                        {typeLabel}
                        {item.isOnline && <span className="ml-1 text-[8px] text-blue-500 font-black tracking-tighter">(ONLINE)</span>}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); item.onView?.(item); }}
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${priorityColor} hover:underline`}
                    >
                        #{item.subType || 'High'}
                    </button>
                </div>
                {item.isOnline && (
                    <div className="flex flex-col items-end">
                        <span className={`text-[9px] font-black tracking-wider ${getTimeLeft(item.createdAt).includes('OVERDUE') ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`}>
                            {getTimeLeft(item.createdAt)}
                        </span>
                        <span className="text-[8px] text-gray-400 font-bold uppercase">Dispatch</span>
                    </div>
                )}
            </div>

            {/* Title & Progress */}
            <div className="mb-4" onClick={() => item.onView?.(item)}>
                <h4 className="font-bold text-base mb-1" style={{ color: 'var(--text-main)' }}>{item.title}</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold mb-3 uppercase tracking-tight">
                    <Clock className="w-3 h-3" />
                    {formatDuration(item.createdAt)}
                </div>

                {/* Visual Progress Bar */}
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
                <button
                    onClick={(e) => { e.stopPropagation(); item.onView?.(item); }}
                    className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold hover:text-indigo-600 transition-colors uppercase"
                >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                </button>

                {nextStatus && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onStatusChange(item.id, nextStatus);
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm active:scale-95"
                    >
                        {nextStatus === 'completed' ? 'Complete Order' : `Move to ${nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}`}
                    </button>
                )}
            </div>
        </div>
    );
}
