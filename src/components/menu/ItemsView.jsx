import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ArrowLeft, Copy, List, Edit, Trash2, Upload, ChevronDown, MoreHorizontal, FileText, ToggleLeft, ToggleRight, Save, GripVertical } from 'lucide-react';
import { menuService } from '../../services/api';
import { AddItem } from '../AddItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Row Component for Items Table
function SortableRow({ id, children }) {
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
        <tr ref={setNodeRef} style={style} className="group hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition-colors">
            <td className="p-3 w-10 text-center" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-gray-400 cursor-grab mx-auto" />
            </td>
            {children}
        </tr>
    );
}

// Sortable Item for Category Sidebar
function SortableCategorySidebarItem({ id, category, selectedCategory, onClick }) {
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
        position: 'relative',
        zIndex: isDragging ? 20 : 1
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group flex items-center pr-4 pl-1 py-3 cursor-pointer border-l-4 transition-colors ${selectedCategory === category.name ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            onClick={onClick}
        >
            <div {...attributes} {...listeners} className="p-2 mr-1 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3 text-gray-400" />
            </div>
            <span className={`text-sm font-medium ${selectedCategory === category.name ? 'text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900'}`}>
                {category.name}
            </span>
        </div>
    );
}

export function ItemsView() {
    const [view, setView] = useState('list');
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [hideEmpty, setHideEmpty] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Dnd Sensors (Use activationConstraint to allow clicks)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [catRes, itemRes] = await Promise.all([
                menuService.getCategories(),
                menuService.getItems()
            ]);
            setCategories(catRes.data);
            setItems(itemRes.data);
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            await menuService.deleteItem(id);
            loadData();
        }
    };

    const handleItemDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                const updates = newItems.map((item, index) => ({
                    id: item.id,
                    sortOrder: index
                }));
                menuService.reorder('item', updates).catch(err => console.error("Reorder failed", err));

                return newItems;
            });
        }
    };

    const handleCategoryDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setCategories((cats) => {
                // IDs are strings 'cat-X', need to find index
                // Actually if I use 'cat-X' as id in useSortable, active.id is 'cat-X'.
                // But my categories state has numeric IDs usually.
                // I need to map properly.
                // Let's assume I pass the whole string ID to useSortable.

                const oldIndex = cats.findIndex((c) => `cat-${c.id}` === active.id);
                const newIndex = cats.findIndex((c) => `cat-${c.id}` === over.id);

                if (oldIndex === -1 || newIndex === -1) return cats;

                const newCats = arrayMove(cats, oldIndex, newIndex);

                const updates = newCats.map((cat, index) => ({
                    id: cat.id,
                    sortOrder: index
                }));

                menuService.reorder('category', updates).catch(err => console.error("Category reorder failed", err));

                return newCats;
            });
        }
    };

    if (view === 'add') {
        return <AddItem itemToEdit={editingItem} onBack={() => { setView('list'); setEditingItem(null); loadData(); }} />;
    }

    const filteredItems = items.filter(i =>
        selectedCategory === 'All' ? true : i.Category?.name === selectedCategory
    );

    return (
        <div className="flex flex-1 overflow-hidden h-[calc(100vh-140px)] bg-gray-50 dark:bg-gray-900">
            {/* Sidebar Categories */}
            <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-all duration-300">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-3">Categories</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Hide empty categories</span>
                        <button
                            onClick={() => setHideEmpty(!hideEmpty)}
                            className={`w-8 h-4 rounded-full p-0.5 transition-colors ${hideEmpty ? 'bg-red-500' : 'bg-gray-300'}`}
                        >
                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${hideEmpty ? 'translate-x-4' : ''}`} />
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto pt-2">
                    <div
                        className={`group flex items-center px-4 py-3 cursor-pointer border-l-4 transition-colors ${selectedCategory === 'All' ? 'border-red-600 bg-red-50 dark:bg-red-900/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        onClick={() => setSelectedCategory('All')}
                    >
                        <div className="p-2 mr-1 opacity-0">
                            <div className="w-3 h-3" /> {/* Spacer for alignment */}
                        </div>
                        <span className={`text-sm font-medium ${selectedCategory === 'All' ? 'text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900'}`}>All Categories</span>
                    </div>

                    {/* Category List with DnD */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleCategoryDragEnd}
                        id="categories-dnd"
                    >
                        <SortableContext
                            items={categories.map(c => `cat-${c.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            {categories.map(cat => (
                                <SortableCategorySidebarItem
                                    key={`cat-${cat.id}`}
                                    id={`cat-${cat.id}`}
                                    category={cat}
                                    selectedCategory={selectedCategory}
                                    onClick={() => setSelectedCategory(cat.name)}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Toolbar */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex flex-wrap gap-3 items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-2 flex-grow max-w-2xl">
                        <button className="p-2 border border-gray-200 rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-500">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="pl-9 pr-3 py-1.5 border rounded text-sm w-48 focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                placeholder="Search"
                            />
                        </div>
                        <button className="px-3 py-1.5 border rounded text-sm flex items-center gap-1 text-gray-600 hover:bg-gray-50">
                            Action <ChevronDown className="w-3 h-3" />
                        </button>
                        <button className="px-3 py-1.5 border rounded text-sm flex items-center gap-1 text-gray-600 hover:bg-gray-50">
                            Quick Actions <ChevronDown className="w-3 h-3" />
                        </button>
                        <button className="px-4 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
                            Save
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-4 bg-gray-200 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-0 top-0 border border-gray-200"></div>
                            </div>
                            <span className="text-sm text-gray-600">Rank wise</span>
                        </div>

                        <button
                            onClick={() => setView('add')}
                            className="px-4 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 flex items-center gap-1 shadow-sm"
                        >
                            <Plus className="w-4 h-4" /> Add Items
                        </button>

                        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-full border border-gray-200">
                            <span className="text-xs font-medium px-2 text-gray-600">Available</span>
                            <div className="w-4 h-4 rounded-full bg-green-500 shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Table Area */}
                <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleItemDragEnd}
                        id="items-dnd"
                    >
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="p-3 w-10 text-center">
                                        #
                                    </th>
                                    <th className="p-3 w-10">
                                        <input type="checkbox" className="rounded border-gray-300" />
                                    </th>
                                    <th className="p-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Name *</th>
                                    <th className="p-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-24">Short Code *</th>
                                    <th className="p-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-24">Price *</th>
                                    <th className="p-3 text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                                    <th className="p-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-24 text-center">Available</th>
                                    <th className="p-3 text-xs font-bold text-gray-700 uppercase tracking-wider w-40 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                <SortableContext
                                    items={filteredItems.map(i => i.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {filteredItems.map(item => (
                                        <SortableRow key={item.id} id={item.id}>
                                            <td className="p-3 relative">
                                                {/* Veg/Non-Veg Indicator Strip */}
                                                <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <input type="checkbox" className="rounded border-gray-300 ml-2" />
                                            </td>
                                            <td className="p-3">
                                                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</div>
                                                <div className="flex gap-2 mt-1">
                                                    {/* Indicators */}
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded border border-red-100">O</span>
                                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded border border-red-100">V</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-sm text-gray-600">{item.shortCode || '-'}</td>
                                            <td className="p-3 text-sm font-bold text-gray-800">₹{item.price}</td>
                                            <td className="p-3 text-sm text-gray-500 truncate max-w-xs">{item.description || '-'}</td>
                                            <td className="p-3 text-center">
                                                <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer mx-auto transition-colors">
                                                    <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute right-0.5 top-0.5 border border-gray-200"></div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex justify-center items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Copy">
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Manage Variants/Addons">
                                                        <List className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => { setEditingItem(item); setView('add'); }}
                                                        className="p-1.5 hover:bg-gray-100 rounded text-blue-500"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </SortableRow>
                                    ))}
                                </SortableContext>
                            </tbody>
                        </table>
                    </DndContext>
                </div>

                {/* Footer / Legend */}
                <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 flex justify-between items-center shrink-0">
                    <div>
                        Showing 1 to {filteredItems.length} of {filteredItems.length} records
                    </div>
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><b className="text-red-600">O</b> Expose in online order</span>
                        <span className="flex items-center gap-1"><b className="text-red-600">V</b> Item having Variation</span>
                        <span className="flex items-center gap-1"><b className="text-red-600">A</b> Addon details</span>
                        <span className="flex items-center gap-1"><b className="text-red-600">C</b> Set as combo</span>
                        <span className="flex items-center gap-1"><b className="text-red-600">F</b> Favourite Item</span>
                        <span className="flex items-center gap-1"><b className="text-red-600">K</b> Expose in kiosk order</span>
                    </div>
                </div>
            </div>

            {/* AI Agent Button (Visual only) */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                    <span className="font-bold text-xs">AI Agent</span>
                </button>
            </div>
        </div>
    );
}
