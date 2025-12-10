import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { configService } from '../../services/api';

export function TaxesView() {
    const [taxes, setTaxes] = useState([]);
    const [formData, setFormData] = useState({ name: '', percentage: '' });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const res = await configService.getTaxes();
        setTaxes(res.data);
    };

    const handleAdd = async () => {
        if (!formData.name || !formData.percentage) return;
        await configService.createTax(formData);
        setFormData({ name: '', percentage: '' });
        loadData();
    };

    const handleDelete = async (id) => {
        if (confirm('Delete tax?')) {
            await configService.deleteTax(id);
            loadData();
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex gap-4 mb-6 bg-white p-4 rounded shadow">
                <input
                    placeholder="Tax Name (e.g. GST)"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="p-2 border rounded flex-1"
                />
                <input
                    placeholder="Percentage (%)"
                    type="number"
                    value={formData.percentage}
                    onChange={e => setFormData({ ...formData, percentage: e.target.value })}
                    className="p-2 border rounded w-32"
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
                            <th className="p-4">Percentage</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxes.map(t => (
                            <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{t.name}</td>
                                <td className="p-4">{t.percentage}%</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
