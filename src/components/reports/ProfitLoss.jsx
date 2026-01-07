import React, { useState, useEffect } from 'react';
import { RotateCcw, Calendar, Settings, Download, Printer, Lock, ChevronDown, ChevronRight, Info, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reportService } from '../../services/api';
import toast from 'react-hot-toast';

export function ProfitLoss() {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [expandedSections, setExpandedSections] = useState({
        'revenue': true,
        'onlineIntegratedStore': true,
        'operatingCost': true,
        'Labor Costs': false,
        'Food and Beverage': true,
        'Expenses & Withdrawal': true,
        'Rent and Utilities': true,
        'Maintenance and Repairs': true
    });
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [lastUpdated, setLastUpdated] = useState(new Date());

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await reportService.getProfitLoss(dateRange);
            if (res.data.success && res.data.data.length > 0) {
                const data = res.data.data;
                setReportData(data);

                // Update selected months if current selection is empty or invalid
                setSelectedMonths(prev => {
                    const validPrev = prev.filter(m => data.some(d => d.month === m));
                    if (validPrev.length > 0) return validPrev;

                    // Default to last 3 available months
                    return data.slice(0, 3).map(d => d.month);
                });
            } else {
                setReportData([]);
                setSelectedMonths([]);
            }
        } catch (error) {
            console.error('Error fetching P&L:', error);
            toast.error('Failed to load Profit & Loss report');
        } finally {
            setLoading(false);
            setLastUpdated(new Date());
        }
    };

    const handleRefresh = () => {
        toast.promise(
            fetchReport(),
            {
                loading: 'Updating real-time data...',
                success: 'P&L Updated successfully',
                error: 'Failed to update P&L',
            }
        );
    };

    const toggleMonth = (month) => {
        setSelectedMonths(prev => {
            if (prev.includes(month)) {
                if (prev.length === 1) return prev; // Don't allow deselecting the last month
                return prev.filter(m => m !== month);
            }

            if (prev.length >= 3) {
                toast.error('Maximum 3 months can be selected for comparison');
                return prev;
            }

            return [...prev, month].sort((a, b) => b.localeCompare(a));
        });
    };

    const filteredData = reportData.filter(item => selectedMonths.includes(item.month));

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const formatMonth = (monthStr) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const toggleExpand = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderRow = (label, valueKey, level = 0, isBold = false, isHeader = false, sectionKey = null, customValue = null) => {
        const isExpandable = sectionKey !== null;
        const isExpanded = expandedSections[sectionKey];

        return (
            <tr className={`${isHeader ? 'bg-gray-50/30' : 'hover:bg-gray-50'} group`}>
                <td className={`p-3 bg-white sticky left-0 z-10 border-r flex items-center gap-2 w-[400px] min-w-[400px]`} style={{ paddingLeft: `${level * 1.5 + 1}rem` }}>
                    {isExpandable && (
                        <button onClick={() => toggleExpand(sectionKey)} className="focus:outline-none">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                        </button>
                    )}
                    {!isExpandable && level > 0 && <div className="w-4" />}
                    <span className={`flex-1 ${isBold ? 'font-bold text-gray-800' : 'text-gray-600'} truncate`} title={label}>{label}</span>
                    {!isHeader && <Info className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 cursor-help" />}
                </td>
                {filteredData.map(item => {
                    let val = 0;
                    if (customValue) {
                        val = customValue(item);
                    } else {
                        val = valueKey.split('.').reduce((obj, key) => obj?.[key], item) || 0;
                    }

                    return (
                        <td key={item.month} className={`p-3 text-right border-r pr-8 w-[220px] min-w-[220px] ${isBold ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                            <div className="flex items-center justify-end gap-2">
                                <span>{formatCurrency(val)}</span>
                                {!isHeader && <Edit2 className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500" />}
                            </div>
                        </td>
                    );
                })}
            </tr>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans overflow-hidden w-full relative">
            {/* 1. Header Section */}
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-gray-800">Cash Profit & Loss</h1>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-md">
                        {reportData.map(m => (
                            <button
                                key={m.month}
                                onClick={() => toggleMonth(m.month)}
                                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${selectedMonths.includes(m.month)
                                    ? 'bg-white text-red-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {formatMonth(m.month)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold border border-green-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            REAL-TIME
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                            Last Refreshed: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/reports/profit-loss/configure')} className="px-4 py-1.5 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">Configure P&L</button>
                    <button onClick={handleRefresh} className="px-4 py-1.5 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">Refresh Data</button>
                    <button className="px-4 py-1.5 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">Freeze P&L</button>
                    <button className="px-4 py-1.5 border border-red-200 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors">Unfreeze P&L</button>
                    <button className="px-4 py-1.5 border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Download className="w-4 h-4" /> Download
                    </button>
                    <button className="px-4 py-1.5 border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Printer className="w-4 h-4" /> Print
                    </button>
                </div>
            </div>

            {/* 2. Controls & Legend */}
            <div className="p-4 flex justify-between items-center bg-gray-50/50 border-b">
                <div className="flex items-center gap-2">
                    <button className="px-4 py-1 bg-red-50 text-red-600 border border-red-200 rounded-full text-xs font-bold">Monthly</button>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> Revenue
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div> Cost
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div> Profit
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Modified values
                    </div>
                </div>
            </div>

            {/* 3. Report Table */}
            <div className="flex-1 overflow-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading Report...</div>
                ) : (
                    <table className="w-full text-left text-sm border-collapse min-w-max">
                        <thead className="bg-white sticky top-0 z-20">
                            <tr className="border-b">
                                <th className="p-4 w-[400px] min-w-[400px] bg-white sticky left-0 z-30 border-r text-left">
                                    <div className="text-xs font-bold text-gray-800">Net Cash Profit Summary</div>
                                    <div className="text-[10px] text-gray-400 font-normal">View: Monthly</div>
                                </th>
                                {filteredData.map(item => (
                                    <th key={item.month} className="p-4 text-center border-r w-[220px] min-w-[220px]">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-xs font-bold text-gray-500">{formatMonth(item.month)}</div>
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-3 h-3 text-gray-400" />
                                                <span className={`text-sm font-bold ${item.netCashProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {formatCurrency(item.netCashProfit)}
                                                </span>
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {/* Revenue Section */}
                            {renderRow('Revenue', 'revenue.total', 0, true, true, 'revenue')}
                            {expandedSections['revenue'] && (
                                <>
                                    {renderRow('Online Integrated Store', 'revenue.onlineIntegratedStore.total', 1, false, false, 'onlineIntegratedStore')}
                                    {expandedSections['onlineIntegratedStore'] && (
                                        <>
                                            {Array.from(new Set(filteredData.flatMap(m => Object.keys(m.revenue?.onlineIntegratedStore?.sources || {})))).sort().map(source => (
                                                renderRow(source, `revenue.onlineIntegratedStore.sources.${source}`, 2)
                                            ))}
                                        </>
                                    )}
                                    {renderRow('Other Revenue', 'revenue.other', 1)}
                                </>
                            )}

                            {/* Commissions Section */}
                            {renderRow('Commissions', 'commissions.total', 0, true, true, 'commissions')}

                            {/* Gross Cash Profit */}
                            <tr className="bg-gray-50/30 font-bold">
                                <td className="p-3 pl-4 text-gray-800 bg-white sticky left-0 z-10 border-r w-[400px] min-w-[400px]">Gross Cash Profit</td>
                                {filteredData.map(item => (
                                    <td key={item.month} className="p-3 text-right text-gray-800 border-r pr-8 w-[220px] min-w-[220px]">
                                        {formatCurrency(item.grossCashProfit)}
                                    </td>
                                ))}
                            </tr>

                            {/* Operating Cost Section */}
                            {renderRow('Operating Cost', 'operatingCost.total', 0, true, true, 'operatingCost')}
                            {expandedSections['operatingCost'] && (
                                <>
                                    {/* Labor Costs */}
                                    {renderRow('Labor Costs', 'operatingCost.groups.Labor Costs.total', 1, false, false, 'Labor Costs')}
                                    {expandedSections['Labor Costs'] && (
                                        Array.from(new Set(filteredData.flatMap(m => Object.keys(m.operatingCost?.groups?.['Labor Costs']?.items || {})))).sort().map(item => (
                                            renderRow(item, `operatingCost.groups.Labor Costs.items.${item}`, 2)
                                        ))
                                    )}

                                    {/* Food and Beverage */}
                                    {renderRow('Food and Beverage', 'operatingCost.groups.Food and Beverage.total', 1, false, false, 'Food and Beverage')}
                                    {expandedSections['Food and Beverage'] && (
                                        Array.from(new Set(filteredData.flatMap(m => Object.keys(m.operatingCost?.groups?.['Food and Beverage']?.items || {})))).sort().map(item => (
                                            renderRow(item, `operatingCost.groups.Food and Beverage.items.${item}`, 2)
                                        ))
                                    )}

                                    {/* Expenses & Withdrawal */}
                                    {renderRow('Expenses & Withdrawal', 'operatingCost.groups.Expenses & Withdrawal.total', 1, false, false, 'Expenses & Withdrawal')}
                                    {expandedSections['Expenses & Withdrawal'] && (
                                        Array.from(new Set(filteredData.flatMap(m => Object.keys(m.operatingCost?.groups?.['Expenses & Withdrawal']?.items || {})))).sort().map(item => (
                                            renderRow(item, `operatingCost.groups.Expenses & Withdrawal.items.${item}`, 2)
                                        ))
                                    )}

                                    {/* Rent and Utilities */}
                                    {renderRow('Rent and Utilities', 'operatingCost.groups.Rent and Utilities.total', 1, false, false, 'Rent and Utilities')}
                                    {expandedSections['Rent and Utilities'] && (
                                        Array.from(new Set(filteredData.flatMap(m => Object.keys(m.operatingCost?.groups?.['Rent and Utilities']?.items || {})))).sort().map(item => (
                                            renderRow(item, `operatingCost.groups.Rent and Utilities.items.${item}`, 2)
                                        ))
                                    )}

                                    {/* Maintenance and Repairs */}
                                    {renderRow('Maintenance and Repairs', 'operatingCost.groups.Maintenance and Repairs.total', 1, false, false, 'Maintenance and Repairs')}
                                    {expandedSections['Maintenance and Repairs'] && (
                                        Array.from(new Set(filteredData.flatMap(m => Object.keys(m.operatingCost?.groups?.['Maintenance and Repairs']?.items || {})))).sort().map(item => (
                                            renderRow(item, `operatingCost.groups.Maintenance and Repairs.items.${item}`, 2)
                                        ))
                                    )}

                                    {/* Other Groups */}
                                    {['Delivery and Transportation', 'Interest/Loan related expenses', 'Consumables', 'Miscellaneous'].map(group => (
                                        <React.Fragment key={group}>
                                            {renderRow(group, `operatingCost.groups.${group}.total`, 1, false, false, group)}
                                            {expandedSections[group] && (
                                                Array.from(new Set(filteredData.flatMap(m => Object.keys(m.operatingCost?.groups?.[group]?.items || {})))).sort().map(item => (
                                                    renderRow(item, `operatingCost.groups.${group}.items.${item}`, 2)
                                                ))
                                            )}
                                        </React.Fragment>
                                    ))}
                                </>
                            )}

                            {/* Net Cash Profit Row */}
                            <tr className="bg-red-50/30 font-bold">
                                <td className="p-3 pl-4 text-gray-800 bg-white sticky left-0 z-10 border-r flex items-center gap-2 w-[400px] min-w-[400px]">
                                    Net Cash Profit
                                    <Info className="w-3.5 h-3.5 text-gray-400" />
                                </td>
                                {filteredData.map(item => (
                                    <td key={item.month} className={`p-3 text-right border-r pr-8 w-[220px] min-w-[220px] ${item.netCashProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {formatCurrency(item.netCashProfit)}
                                    </td>
                                ))}
                            </tr>
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={100} className="p-10 text-center text-gray-400 italic">
                                        No data available for the selected months.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
