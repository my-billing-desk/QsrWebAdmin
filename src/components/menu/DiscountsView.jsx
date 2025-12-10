import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { configService } from '../../services/api';

export function DiscountsView() {
    const [discounts, setDiscounts] = useState([]);
    const [formData, setFormData] = useState({ name: '', value: '', type: 'percentage' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const res = await configService.getDiscounts();
        setDiscounts(res.data);
    };

    const handleAdd = async () => {
        if (!formData.name || !formData.value) return;
        await configService.createDiscount(formData);
        setFormData({ name: '', value: '', type: 'percentage' });
        loadData();
    };

    const handleDelete = async (id) => {
        if (confirm('Delete discount?')) {
            await configService.deleteDiscount(id);
            loadData();
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow">
                <input
                    placeholder="Discount Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="p-2 border rounded flex-1"
                />
                <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="p-2 border rounded w-32"
                >
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                </select>
                <input
                    placeholder="Value"
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                    className="p-2 border rounded w-24"
                />
                <button onClick={handleAdd} className="bg-blue-600 text-white px-4 rounded flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 font-semibold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Value</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts.map(d => (
                            <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{d.name}</td>
                                <td className="p-4 capitalize">{d.type}</td>
                                <td className="p-4">{d.type === 'percentage' ? `${d.value}%` : `₹${d.value}`}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
