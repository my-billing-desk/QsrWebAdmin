
import React, { useState, useEffect } from 'react';
import {
    Settings, RefreshCw, Layout, Lock, Unlock, Download, Printer,
    ChevronDown, ChevronRight, Info, AlertCircle, ExternalLink
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const RecursiveRow = ({ label, data, level = 0, months, formatCurrency, isHeader = false }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = data.children && Object.keys(data.children).length > 0;
    const paddingLeft = level * 20 + 24; // Base padding 24px + indent

    return (
        <>
            <tr className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group ${isHeader ? 'bg-gray-50/50 dark:bg-gray-700/20' : ''}`}>
                <td className="py-3 pr-6" style={{ paddingLeft: `${paddingLeft}px` }}>
                    <div className="flex items-center gap-2">
                        {hasChildren && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="focus:outline-none text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 -ml-6"
                            >
                                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        )}
                        <span className={`text-gray-800 dark:text-gray-200 ${isHeader ? 'font-semibold' : 'font-normal text-sm'}`}>
                            {label}
                        </span>
                        {/* Add icons or tooltips if needed */}
                        {label === 'Online Integrated Store' && <ExternalLink size={12} className="text-blue-500" />}
                    </div>
                </td>
                {months.map(m => (
                    <td key={m.key} className={`py-3 px-6 text-right text-gray-900 dark:text-white ${isHeader ? 'font-semibold' : ''}`}>
                        {formatCurrency(data.values[m.key] || 0)}
                    </td>
                ))}
            </tr>
            {hasChildren && expanded && (
                Object.entries(data.children).map(([childKey, childData]) => (
                    <RecursiveRow
                        key={childKey}
                        label={childKey}
                        data={childData}
                        level={level + 1}
                        months={months}
                        formatCurrency={formatCurrency}
                    />
                ))
            )}
        </>
    );
};

export const ProfitLoss = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState(null);
    const [months, setMonths] = useState([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reports/profit-loss');
            processReportData(res.data);
        } catch (error) {
            console.error("Failed to load P&L", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const processReportData = (data) => {
        // Data comes as array of months: [{ month: '2025-12', revenue: 100, cost: 50, breakdown: {...} }, ...]
        if (!data || data.length === 0) return;

        // 1. Extract Months Columns
        const monthCols = data.map(d => {
            const date = new Date(d.month + '-01');
            return {
                label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                key: d.month
            };
        });
        setMonths(monthCols);

        // 2. Build Tree Structure
        // Root -> Revenue -> Online -> Zomato
        const structure = {
            Revenue: { values: {}, children: { 'Online Integrated Store': { values: {}, children: {} }, 'Physical Store': { values: {}, children: {} } } },
            Cost: { values: {}, children: {} }, // Expand later
            'Gross Cash Profit': { values: {}, children: {} },
            'Operating Cost': { values: {}, children: {} }, // Expand later
            'Net Cash Profit': { values: {}, children: {} }
        };

        data.forEach(m => {
            const k = m.month;

            // Top Level
            structure.Revenue.values[k] = m.revenue;
            structure.Cost.values[k] = m.cost;
            structure['Gross Cash Profit'].values[k] = m.revenue; // Assuming Gross = Revenue for now (ignoring COGS details in backend for now)
            structure['Net Cash Profit'].values[k] = m.profit;

            // Revenue Breakdown
            if (m.breakdown) {
                // Online
                structure.Revenue.children['Online Integrated Store'].values[k] = m.breakdown.online.total;
                Object.entries(m.breakdown.online.sources).forEach(([source, amount]) => {
                    if (!structure.Revenue.children['Online Integrated Store'].children[source]) {
                        structure.Revenue.children['Online Integrated Store'].children[source] = { values: {}, children: {} };
                    }
                    structure.Revenue.children['Online Integrated Store'].children[source].values[k] = amount;
                });

                // Offline
                structure.Revenue.children['Physical Store'].values[k] = m.breakdown.offline.total;
                Object.entries(m.breakdown.offline.types).forEach(([type, amount]) => {
                    const label = type.charAt(0).toUpperCase() + type.slice(1);
                    if (!structure.Revenue.children['Physical Store'].children[label]) {
                        structure.Revenue.children['Physical Store'].children[label] = { values: {}, children: {} };
                    }
                    structure.Revenue.children['Physical Store'].children[label].values[k] = amount;
                });
            }
        });

        setReportData(structure);
    };

    const formatCurrency = (amount) => {
        return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cash Profit & Loss</h1>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/reports/profit-loss/configure')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                    >
                        Configure P&L
                    </button>
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Data
                    </button>
                    {/* ... other buttons ... */}
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

                {/* Legend */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button className="px-6 py-1.5 rounded-full border border-red-500 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/10">
                        Monthly
                    </button>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        {/* Indicators matches screenshot colors */}
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Revenue</div>
                        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Profit</div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading Report...</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-sky-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700">
                                    <th className="py-4 px-6 font-semibold text-gray-900 dark:text-white w-1/3 min-w-[200px]">
                                        Net Cash Profit Summary
                                        <div className="text-xs font-normal text-gray-500 mt-0.5">View: Monthly</div>
                                    </th>
                                    {months.map(month => (
                                        <th key={month.key} className="py-4 px-6 font-bold text-gray-800 dark:text-white text-right min-w-[150px]">
                                            {month.label}
                                            <div className="mt-2 flex items-center justify-end gap-2 text-green-600 text-lg">
                                                {formatCurrency(reportData['Net Cash Profit']?.values[month.key] || 0)}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {reportData && (
                                    <>
                                        {/* Revenue Tree */}
                                        <RecursiveRow
                                            label="Revenue"
                                            data={reportData.Revenue}
                                            months={months}
                                            formatCurrency={formatCurrency}
                                            isHeader={true}
                                        />

                                        {/* Other Sections (Flat for now unless data expands) */}
                                        <RecursiveRow
                                            label="Cost of Goods Sold"
                                            data={reportData.Cost}
                                            months={months}
                                            formatCurrency={formatCurrency}
                                            isHeader={true}
                                        />

                                        <tr className="bg-gray-50/50 dark:bg-gray-700/20 font-bold border-t border-gray-200">
                                            <td className="py-3 px-6 pl-10 text-gray-800 dark:text-gray-100">
                                                Gross Cash Profit
                                            </td>
                                            {months.map(m => (
                                                <td key={m.key} className="py-3 px-6 text-right text-gray-900 dark:text-white">
                                                    {formatCurrency(reportData['Gross Cash Profit'].values[m.key] || 0)}
                                                </td>
                                            ))}
                                        </tr>

                                        <RecursiveRow
                                            label="Operating Cost"
                                            data={reportData['Operating Cost']}
                                            months={months}
                                            formatCurrency={formatCurrency}
                                            isHeader={true}
                                        />

                                        <tr className="bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                                            <td className="py-4 px-6 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                Net Cash Profit
                                                <Info size={14} className="text-gray-400" />
                                            </td>
                                            {months.map(m => (
                                                <td key={m.key} className="py-4 px-6 text-right font-bold text-green-600">
                                                    {formatCurrency(reportData['Net Cash Profit'].values[m.key] || 0)}
                                                </td>
                                            ))}
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 m-6 mt-4 rounded-xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start">
                    <div className="mt-0.5 text-blue-500">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">?</div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Data reflects live sales. Final P&L may vary based on end-of-month adjustments.
                    </p>
                </div>
            </div>
        </div>
    );
};
