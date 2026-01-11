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
        { key: 'category', header: 'Category', sortable: true, render: (item) => item.category || <span className="text-gray-500 italic">No Category</span> },
        {
            key: 'actions',
            header: 'Action',
            align: 'right',
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600">
                        <FileText className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/inventory/raw-materials/edit/${item.id}`); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-blue-600"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600"
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
                            className="btn-primary"
                        >
                            <Plus className="w-4 h-4" /> Create New
                        </button>
                        <button className="btn-secondary">
                            <Plus className="w-4 h-4" /> Quick Add
                        </button>
                        <button className="btn-secondary">
                            Action <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                }
            />
        </div>
    );
}
