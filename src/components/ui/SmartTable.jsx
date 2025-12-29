import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Filter, Download, Plus } from 'lucide-react';

/**
 * SmartTable Component
 * 
 * A reusable table component styled to match the "SmartHR" reference.
 * 
 * Props:
 * - data: Array of objects to display.
 * - columns: Array of column definitions:
 *   - key: string (field name in data)
 *   - header: string (header label)
 *   - render: (item) => ReactNode (optional custom renderer)
 *   - sortable: boolean (optional)
 *   - align: 'left' | 'center' | 'right' (optional, default left)
 * - title: string (Table title)
 * - actionButtons: ReactNode (Buttons to show in header, e.g., "Add Estimate")
 * - headerControls: ReactNode (Controls to show in header right side, e.g., Date Picker, Filter Dropdown)
 * - searchPlaceholder: string
 * - onSearch: (term) => void (optional external search handler)
 * - onRowClick: (item) => void
 * - isLoading: boolean
 */
export function SmartTable({
    data = [],
    columns = [],
    title = "List",
    actionButtons,
    headerControls,
    searchPlaceholder = "Search...",
    onRowClick,
    isLoading = false
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedRows, setSelectedRows] = useState([]);

    // --- Filtering & Sorting ---
    const filteredData = useMemo(() => {
        let processed = [...data];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            processed = processed.filter(item =>
                Object.values(item).some(val =>
                    val && String(val).toLowerCase().includes(lowerTerm)
                )
            );
        }

        if (sortConfig.key) {
            processed.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return processed;
    }, [data, searchTerm, sortConfig]);

    // --- Pagination ---
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === paginatedData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(paginatedData.map(item => item.id)); // Assuming 'id' exists
        }
    };

    const toggleSelectRow = (id, e) => {
        e.stopPropagation();
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-main-app p-4 gap-4 overflow-hidden">

            {/* Table Container (Card) */}
            <div className="bg-surface rounded-2xl shadow-sm border flex flex-col flex-1 overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>

                {/* 1. Header Section (Inside Card) */}
                <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                        <h2 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>{title}</h2>
                    </div>
                    {/* Header Controls (Right Aligned) */}
                    <div className="flex flex-wrap items-center gap-2">
                        {headerControls}
                        {actionButtons}
                    </div>
                </div>

                {/* 2. Controls Bar (Rows Per Page & Search) */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Left: Row Selector */}
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <span>Row Per Page</span>
                        <select
                            value={rowsPerPage}
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                            className="border rounded px-2 py-1 bg-surface focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer text-sm"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>Entries</span>
                    </div>

                    {/* Right: Search */}
                    <div className="relative w-full sm:w-auto">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-3 pr-8 py-2 border rounded-md text-sm w-full sm:w-64 bg-surface focus:outline-none focus:border-primary transition-colors"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                        />
                        <Search className="absolute right-2.5 top-2.5 w-4 h-4 text-muted" />
                    </div>
                </div>

                {/* 3. Table Content */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs font-bold uppercase bg-gray-50/50 sticky top-0 z-10 border-y" style={{ color: 'var(--text-main)', backgroundColor: 'var(--main-app)', borderColor: 'var(--border-color)' }}>
                            <tr>
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                                        checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`p-4 cursor-pointer hover:bg-black/5 transition-colors ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                                        onClick={() => col.sortable && handleSort(col.key)}
                                    >
                                        <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                                            {col.header}
                                            {col.sortable && (
                                                <div className="flex flex-col">
                                                    {sortConfig.key === col.key && sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> :
                                                        sortConfig.key === col.key && sortConfig.direction === 'desc' ? <ArrowDown className="w-3 h-3" /> :
                                                            <ArrowUpDown className="w-3 h-3 opacity-30" />}
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ divideColor: 'var(--border-color)' }}>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="p-8 text-center text-muted">Loading data...</td>
                                </tr>
                            ) : paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} className="p-8 text-center text-muted">No records found</td>
                                </tr>
                            ) : (
                                paginatedData.map((item, rowIdx) => (
                                    <tr
                                        key={item.id || rowIdx}
                                        className="hover:bg-main-app transition-colors cursor-pointer group"
                                        onClick={() => onRowClick && onRowClick(item)}
                                    >
                                        <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer w-4 h-4"
                                                checked={selectedRows.includes(item.id)}
                                                onChange={(e) => toggleSelectRow(item.id, e)}
                                            />
                                        </td>
                                        {columns.map((col, colIdx) => (
                                            <td
                                                key={colIdx}
                                                className={`p-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                                                style={{ color: 'var(--text-main)' }}
                                            >
                                                {col.render ? col.render(item) : item[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted font-medium bg-surface" style={{ borderColor: 'var(--border-color)' }}>
                    <div>
                        Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1.5 border rounded hover:bg-main-app disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-700"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${currentPage === i + 1
                                        ? 'bg-[#EF4444] text-white border-[#EF4444]' // Using exact red/orange from theme or ref match if possible. Ref looks like primary orange.
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                style={currentPage === i + 1 ? { backgroundColor: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: 'white' } : { borderColor: 'var(--border-color)' }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="px-3 py-1.5 border rounded hover:bg-main-app disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white text-gray-700"
                            style={{ borderColor: 'var(--border-color)' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
