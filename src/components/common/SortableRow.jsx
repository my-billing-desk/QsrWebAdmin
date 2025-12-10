import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export function SortableRow({ id, children }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1, // Ensure dragging item is on top
        position: 'relative',
        opacity: isDragging ? 0.8 : 1,
    };

    // We pass the drag handle props to a specific handle element
    // The children function/element will receive the handle as a prop or we render it here

    return (
        <tr ref={setNodeRef} style={style} className={`group hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition-colors ${isDragging ? 'bg-blue-50' : ''}`}>
            {React.Children.map(children, child => {
                // If child has prop 'isDragHandle', we attach listeners
                if (React.isValidElement(child) && child.props['data-drag-handle']) {
                    return React.cloneElement(child, { ...attributes, ...listeners, className: `${child.props.className} cursor-grab active:cursor-grabbing` });
                }
                return child;
            })}
            {/* Fallback if no specific handle is marked, maybe just first cell? But we prefer explicit handle */}
            <td className="p-3 w-8" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab hover:text-gray-600" />
            </td>
            {children}
        </tr>
    );
}
