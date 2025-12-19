import React, { useState, useEffect, useMemo } from 'react';
import {
    Search, Plus, Receipt, Calendar, ToggleLeft, ToggleRight, Edit2, Trash2, X
} from 'lucide-react';
import { specialNoteService } from '../../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const SpecialNote = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [formData, setFormData] = useState({ name: '', isAvailable: true });

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            const res = await specialNoteService.getAll();
            setNotes(res.data);
        } catch (error) {
            console.error("Failed to load notes", error);
            toast.error("Failed to load special notes");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingNote) {
                await specialNoteService.update(editingNote.id, formData);
                toast.success('Note updated successfully');
            } else {
                await specialNoteService.create(formData);
                toast.success('Note created successfully');
            }
            setIsModalOpen(false);
            setEditingNote(null);
            setFormData({ name: '', isAvailable: true });
            loadNotes();
        } catch (error) {
            console.error("Error saving note", error);
            toast.error("Failed to save note");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                await specialNoteService.delete(id);
                toast.success('Note deleted');
                setNotes(notes.filter(n => n.id !== id));
            } catch (error) {
                console.error("Error deleting note", error);
                toast.error("Failed to delete note");
            }
        }
    };

    const handleToggle = async (id) => {
        // Optimistic update
        setNotes(prev => prev.map(n => n.id === id ? { ...n, isAvailable: !n.isAvailable } : n));
        try {
            await specialNoteService.toggleStatus(id);
            toast.success('Status updated');
        } catch (error) {
            setNotes(prev => prev.map(n => n.id === id ? { ...n, isAvailable: !n.isAvailable } : n));
            toast.error("Failed to update status");
        }
    };

    const openEdit = (note) => {
        setEditingNote(note);
        setFormData({ name: note.name, isAvailable: note.isAvailable });
        setIsModalOpen(true);
    };

    const filteredNotes = useMemo(() => {
        return notes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [notes, searchQuery]);

    return (
        <div className="flex-1 overflow-hidden flex flex-col h-full bg-gray-50/50 dark:bg-gray-900">
            {/* Header */}
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Special Note
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Manage predefined notes for orders
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEditingNote(null);
                                setFormData({ name: '', isAvailable: true });
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors shadow-sm font-medium text-xs"
                        >
                            <Plus size={14} /> Add Special Note
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <th className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </th>
                                <th className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Special Note
                                </th>
                                <th className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Available
                                </th>
                                <th className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filteredNotes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Receipt size={40} className="opacity-20" />
                                            <p>No special notes found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredNotes.map((note) => (
                                    <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                                        <td className="px-4 py-2">
                                            <input type="checkbox" className="rounded border-gray-300" />
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="font-medium text-gray-900 dark:text-white">{note.name}</span>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                                            {format(new Date(note.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => handleToggle(note.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${note.isAvailable
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                                    }`}
                                            >
                                                {note.isAvailable ? 'Yes' : 'No'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEdit(note)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                    Showing {filteredNotes.length} of {notes.length} records
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {editingNote ? 'Edit Special Note' : 'Add Special Note'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Note Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                    placeholder="e.g. Less Spicy"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isAvailable}
                                        onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                </label>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                >
                                    {editingNote ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
