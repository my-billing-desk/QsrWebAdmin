import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, MoreHorizontal } from 'lucide-react';
import { inventoryService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { SmartTable } from '../ui/SmartTable';

export default function RawMaterialsList() {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await inventoryService.getRawMaterials();
            setMaterials(res.data);
        } catch (error) {
            console.error("Failed to fetch materials", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this raw material?")) return;
        try {
            await inventoryService.deleteRawMaterial(id);
            fetchMaterials();
        } catch (error) {
            console.error("Failed to delete material", error);
        }
    };

    const columns = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'category', header: 'Category', sortable: true, render: (item) => item.category || <span className="text-muted italic">No Category</span> },
        {
            key: 'actions',
            header: 'Action',
            align: 'right',
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <button className="p-2 text-muted hover:text-main hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                        <FileText className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/inventory/raw-materials/edit/${item.id}`); }}
                        className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="h-full">
            <SmartTable
                title="Raw Materials Management"
                data={materials}
                columns={columns}
                isLoading={loading}
                searchPlaceholder="Search raw materials..."
                actionButtons={
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/inventory/raw-materials/add')}
                            className="px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
                            style={{ backgroundColor: 'var(--color-primary)' }}
                        >
                            <Plus className="w-4 h-4" /> Create New
                        </button>
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                            <Plus className="w-4 h-4" /> Quick Add
                        </button>
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                            Action <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                }
            />
        </div>
    );
}
