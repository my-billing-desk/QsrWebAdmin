import React, { useState, useEffect } from 'react';
import { Plus, Trash2, GripVertical, Search } from 'lucide-react';
import { menuService } from '../../services/api';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCategoryRow({ id, category, handleDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
        position: 'relative'
    };

    return (
        <tr ref={setNodeRef} style={style} className="border-b last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="p-4 w-10 text-center" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab mx-auto" />
            </td>
            <td className="p-4 text-gray-900 dark:text-gray-100">{category.name}</td>
            <td className="p-4 text-right">
                <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-800 p-2"><Trash2 className="w-4 h-4" /></button>
            </td>
        </tr>
    );
}

export function CategoriesView() {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Dnd Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const res = await menuService.getCategories();
            setCategories(res.data);
        } catch (e) { console.error(e); }
    };

    const handleAdd = async () => {
        if (!newCat) return;
        await menuService.createCategory({ name: newCat });
        setNewCat('');
        loadData();
    };

    const handleDelete = (id) => {
        setCategoryToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            await menuService.deleteCategory(categoryToDelete);
            loadData();
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCategories((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    sortOrder: index
                }));
                menuService.reorder('category', updates).catch(err => console.error("Reorder failed", err));

                return newItems;
            });
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 flex gap-2">
                    <input
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="New Category Name"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 whitespace-nowrap">
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>

                <div className="relative md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Search categories..."
                    />
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700 font-semibold text-gray-700 dark:text-gray-200">
                            <tr>
                                <th className="p-4 w-10"></th>
                                <th className="p-4">Name</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            <SortableContext
                                items={filteredCategories.map(c => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {filteredCategories.map(cat => (
                                    <SortableCategoryRow
                                        key={cat.id}
                                        id={cat.id}
                                        category={cat}
                                        handleDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                        </tbody>
                    </table>
                </DndContext>
            </div>

            {/* Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Delete Category?</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                Are you sure you want to delete this category? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
