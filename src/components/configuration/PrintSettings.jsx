import React, { useState } from 'react';
import { ChevronRight, Printer, Save, FileText, Settings, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export function PrintSettings() {
    const [config, setConfig] = useState({
        paperSize: '3inch', // 2inch, 3inch, A4
        showLogo: true,
        showHeader: true,
        showFooter: true,
        headerText: '',
        footerText: 'Thank you for visiting!',
        showTaxDetails: true,
        showCashierName: true,
        showFssai: true,
        showGst: true,
        autoPrint: true,
        numberOfCopies: 1,
        fontSize: 'normal', // small, normal, large
        template: 'standard' // standard, classic
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        // Here you would typically save to the backend
        console.log('Saving print config:', config);
        toast.success("Print settings saved successfully");
    };

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
                <Link to="/config/outlet" className="hover:text-gray-700">Configuration</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-blue-600">Print Settings</span>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Printer className="w-6 h-6 text-blue-600" />
                    Print Configuration
                </h1>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" />
                            General Settings
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Receipt Template</label>
                                <select
                                    name="template"
                                    value={config.template}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="standard">Standard (Modern)</option>
                                    <option value="classic">Classic (Thermal)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Size</label>
                                <select
                                    name="paperSize"
                                    value={config.paperSize}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="2inch">2 Inch (Thermal)</option>
                                    <option value="3inch">3 Inch (Thermal)</option>
                                    <option value="A4">A4 (Laser/Inkjet)</option>
                                    <option value="A5">A5</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Font Size</label>
                                <select
                                    name="fontSize"
                                    value={config.fontSize}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="small">Small</option>
                                    <option value="normal">Normal</option>
                                    <option value="large">Large</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Copies</label>
                                <input
                                    type="number"
                                    name="numberOfCopies"
                                    value={config.numberOfCopies}
                                    onChange={handleChange}
                                    min="1" max="5"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="autoPrint"
                                    checked={config.autoPrint}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Auto Print After Payment</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="showLogo"
                                    checked={config.showLogo}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Show Logo</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            Content Configuration
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Header Text</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="showHeader" checked={config.showHeader} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                        <span className="text-xs text-gray-500">Enable</span>
                                    </label>
                                </div>
                                <textarea
                                    name="headerText"
                                    value={config.headerText}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter text to appear at the top of the receipt"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!config.showHeader}
                                ></textarea>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Footer Text</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="showFooter" checked={config.showFooter} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                        <span className="text-xs text-gray-500">Enable</span>
                                    </label>
                                </div>
                                <textarea
                                    name="footerText"
                                    value={config.footerText}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Enter text to appear at the bottom of the receipt"
                                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={!config.showFooter}
                                ></textarea>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="showTaxDetails" checked={config.showTaxDetails} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Show Tax Breakdown</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="showCashierName" checked={config.showCashierName} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Show Cashier Name</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="showFssai" checked={config.showFssai} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Show FSSAI No.</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="showGst" checked={config.showGst} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Show GST No.</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Live Preview (Mock) */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 w-full">
                        <Layout className="w-5 h-5 text-gray-500" />
                        Live Preview (Mock)
                    </h2>

                    <div className={`bg-white border border-gray-200 shadow-lg p-4 text-gray-800 ${config.template === 'classic' ? 'font-mono' : 'font-sans'} text-xs leading-relaxed overflow-hidden transition-all duration-300 ${config.paperSize === '3inch' ? 'w-64' : config.paperSize === '2inch' ? 'w-48' : 'w-full max-w-sm'}`}>
                        {config.showLogo && (
                            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-400">Logo</div>
                        )}

                        {config.showHeader && config.headerText && (
                            <div className="text-center mb-4 whitespace-pre-wrap">{config.headerText}</div>
                        )}

                        {!config.showHeader && (
                            <div className="text-center mb-4">
                                <div className="font-bold uppercase text-sm mb-1">Restaurant Name</div>
                                <div className="font-normal text-xs text-gray-600">Sura and Sanklecha Ventures</div>
                                <div className="font-normal text-xs text-gray-600">#30, 80 Feet Rd, Indiranagar, Bengaluru</div>
                            </div>
                        )}

                        <div className="text-center mb-2 text-[10px] text-gray-500">
                            {config.showGst && <div>GSTIN: 29AAAAA0000A1Z5</div>}
                            {config.showFssai && <div>FSSAI: 11219332000216</div>}
                        </div>

                        {config.showLogo && <div className="border-b border-dashed border-gray-400 mb-2"></div>}
                        <div className="flex justify-between"><span>Date: 01/02/2026</span><span>Time: 10:30 AM</span></div>
                        <div className="flex justify-between mb-2"><span>Bill No: 1001</span><span>Table: 5</span></div>
                        {config.showCashierName && <div className="mb-2">Cashier: John Doe</div>}

                        <div className="border-b border-dashed border-gray-400 mb-2"></div>

                        <div className="flex justify-between font-bold mb-1">
                            <span>Item</span>
                            <span>Amt</span>
                        </div>
                        <div className="flex justify-between"><span>1 x Burger</span><span>120.00</span></div>
                        <div className="flex justify-between"><span>2 x Fries</span><span>160.00</span></div>
                        <div className="flex justify-between"><span>1 x Coke</span><span>40.00</span></div>

                        <div className="border-b border-dashed border-gray-400 my-2"></div>

                        <div className="flex justify-between"><span>Subtotal</span><span>320.00</span></div>
                        {config.showTaxDetails && (
                            <>
                                <div className="flex justify-between text-[10px] text-gray-500"><span>CGST (2.5%)</span><span>8.00</span></div>
                                <div className="flex justify-between text-[10px] text-gray-500"><span>SGST (2.5%)</span><span>8.00</span></div>
                            </>
                        )}
                        <div className="flex justify-between font-bold text-sm mt-2"><span>Total</span><span>336.00</span></div>

                        <div className="border-b border-dashed border-gray-400 my-2"></div>

                        {config.showFooter && config.footerText && (
                            <div className="text-center mt-4 whitespace-pre-wrap">{config.footerText}</div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

// Default export if needed
export default PrintSettings;
