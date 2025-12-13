import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, FileText, ChevronRight } from 'lucide-react';
import { inventoryService } from '../../services/api';

export function InventoryReports() {
    const [activeReport, setActiveReport] = useState('All');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // List of reports based on user screenshots
    const reports = [
        { id: 'transfer-payment', name: 'Transfer Payment Report', category: 'Payment' },
        { id: 'recipe-costing', name: 'Recipe Costing Report', category: 'Costing' },
        { id: 'material-purchase', name: 'Material Purchase Report', category: 'Purchase' },
        { id: 'supplier-payment', name: 'Supplier Payment Report', category: 'Payment' },
        { id: 'material-transfer', name: 'Material Transfer Report', category: 'Transfer' },
        { id: 'po-variance', name: 'Purchase Order Variance Report', category: 'Purchase' },
        { id: 'purchase-sales-return', name: 'Purchase-Sales Return Report', category: 'Return' },
        { id: 'opening-closing', name: 'Opening - Closing Stock Report', category: 'Stock' },
        { id: 'sales-transfer-variance', name: 'Sales And Transfer Variance Report', category: 'Sales' },
        { id: 'po-received', name: 'Purchase Order Received Report', category: 'Purchase' },
    ];

    const fetchReport = async (reportId) => {
        setLoading(true);
        setError(null);
        setReportData([]);

        try {
            // Implementation for Opening-Closing report
            if (reportId === 'opening-closing') {
                const res = await inventoryService.getClosingStockReport();
                setReportData(res.data);
            } else if (reportId === 'material-purchase') {
                const res = await inventoryService.getPurchases(); // Using existing getPurchases
                // Need to flatten purchase items for the report
                const flattedData = res.data.flatMap(purchase =>
                    purchase.PurchaseItems.map(item => ({
                        date: purchase.invoiceDate,
                        supplier: purchase.Supplier?.name || 'Unknown',
                        itemName: item.RawMaterial?.name || 'Unknown',
                        quantity: item.quantity,
                        unit: item.unit,
                        rate: item.price,
                        amount: item.amount,
                        invoiceNo: purchase.invoiceNumber
                    }))
                );
                setReportData(flattedData);
            } else {
                // Mock waiting for others
                await new Promise(r => setTimeout(r, 600));
                setReportData([]); // Others are still empty/placeholder
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch report data.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (activeReport) {
            fetchReport(activeReport);
        }
    };

    const renderReportFilters = (reportId) => {
        // Generic filters matching most screenshots
        return (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">From Date</label>
                    <input type="date" className="p-2 border rounded text-sm bg-gray-50 bg-white" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">To Date</label>
                    <input type="date" className="p-2 border rounded text-sm bg-gray-50 bg-white" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="flex flex-col gap-1 min-w-[150px]">
                    <label className="text-xs font-bold text-gray-600">Type/Category</label>
                    <select className="p-2 border border-gray-300 rounded text-sm bg-white"><option>All</option></select>
                </div>

                <button onClick={handleSearch} className="px-6 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 mb-0.5 text-sm">Search</button>
                <button className="px-6 py-2 bg-white border border-gray-300 text-gray-600 rounded font-medium hover:bg-gray-50 mb-0.5 text-sm">Clear</button>
            </div>
        );
    };

    const renderTable = () => {
        if (loading) return <div className="text-center p-12 text-gray-500">Loading Report...</div>;
        if (error) return <div className="text-center p-12 text-red-500">{error}</div>;

        if (reportData.length === 0) {
            return (
                <div className="bg-white rounded-lg border border-gray-200 min-h-[400px] flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-10 h-10 text-red-200" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">No Record Found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                </div>
            )
        }

        // Logic for specialized tables based on report type
        if (activeReport === 'opening-closing') {
            return (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th className="p-4">Item Name</th>
                                <th className="p-4">Unit</th>
                                <th className="p-4 text-right">Closing Quantity</th>
                                <th className="p-4 text-right">Avg Price</th>
                                <th className="p-4 text-right">Total Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reportData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-800">{row.name}</td>
                                    <td className="p-4 text-gray-500">{row.unit}</td>
                                    <td className="p-4 text-right font-medium">{row.closingStock}</td>
                                    <td className="p-4 text-right text-gray-500">{row.price}</td>
                                    <td className="p-4 text-right font-bold text-gray-700">{row.value}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold text-gray-800 border-t border-gray-200">
                            <tr>
                                <td colSpan="4" className="p-4 text-right">Total Value</td>
                                <td className="p-4 text-right">
                                    {reportData.reduce((sum, r) => sum + parseFloat(r.value || 0), 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        }


        if (activeReport === 'material-purchase') {
            return (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Invoice No</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Item Name</th>
                                <th className="p-4 text-right">Qty</th>
                                <th className="p-4 text-right">Rate</th>
                                <th className="p-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reportData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="p-4 text-gray-500">{new Date(row.date).toLocaleDateString()}</td>
                                    <td className="p-4 text-gray-800">{row.invoiceNo}</td>
                                    <td className="p-4 text-gray-600">{row.supplier}</td>
                                    <td className="p-4 font-medium text-gray-800">{row.itemName}</td>
                                    <td className="p-4 text-right">{row.quantity} {row.unit}</td>
                                    <td className="p-4 text-right text-gray-500">{row.rate}</td>
                                    <td className="p-4 text-right font-bold text-gray-700">{row.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold text-gray-800 border-t border-gray-200">
                            <tr>
                                <td colSpan="6" className="p-4 text-right">Total Purchase Value</td>
                                <td className="p-4 text-right">
                                    {reportData.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            );
        }

        return <div className="p-8">Table format for {activeReport} coming soon.</div>;
    };

    if (activeReport === 'All') {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Reports</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map(report => (
                        <div key={report.id}
                            onClick={() => { setActiveReport(report.id); setReportData([]); }}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600 uppercase">{report.category}</span>
                            </div>
                            <h3 className="font-bold text-lg mt-4 text-gray-800 group-hover:text-red-600 transition-colors">{report.name}</h3>
                            <div className="mt-4 flex items-center text-sm text-gray-500 font-medium">
                                View Report <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentReport = reports.find(r => r.id === activeReport);

    return (
        <div className="flex flex-col h-full bg-gray-50 font-sans">
            <div className="bg-white p-6 shadow-sm border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => setActiveReport('All')} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                        Inventory Reports
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                    <h2 className="text-lg font-bold text-gray-800">{currentReport?.name || 'Report'}</h2>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                        <Download className="w-4 h-4 mr-2" /> Download
                    </button>
                    <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">
                        <Calendar className="w-4 h-4 mr-2" /> Date Range
                    </button>
                </div>
            </div>
            <div className="flex-1 p-6 overflow-auto">
                {renderReportFilters(activeReport)}
                {renderTable()}
            </div>
        </div>
    );
}
