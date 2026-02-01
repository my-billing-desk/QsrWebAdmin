import React, { useState } from 'react';
import { ChevronRight, Printer, Save, FileText, Settings, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export function PrintSettings() {
    const [activeTab, setActiveTab] = useState('bill'); // 'bill' or 'kot'
    const [config, setConfig] = useState({
        bill: {
            paperSize: '3inch',
            showLogo: true,
            showHeader: true,
            showFooter: true,
            headerText: '',
            footerText: '<p>Thank you for visiting!</p>',
            showTaxDetails: true,
            showCashierName: true,
            showFssai: true,
            showGst: true,
            autoPrint: true,
            numberOfCopies: 1,
            fontSize: 'normal',
            template: 'standard' // standard, classic, minimal
        },
        kot: {
            paperSize: '3inch',
            showLogo: false,
            showHeader: true,
            showFooter: false,
            headerText: '<p style="text-align: center;"><strong>KITCHEN ORDER TICKET</strong></p>',
            footerText: '',
            showTaxDetails: false,
            showCashierName: false,
            showFssai: false,
            showGst: false,
            autoPrint: true,
            numberOfCopies: 1,
            fontSize: 'normal',
            template: 'standard'
        }
    });

    const activeConfig = config[activeTab];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const handleQuillChange = (name, value) => {
        setConfig(prev => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab],
                [name]: value
            }
        }));
    };

    const handleSave = () => {
        console.log('Saving print config:', config);
        toast.success(`${activeTab === 'bill' ? 'Bill' : 'KOT'} settings saved successfully`);
    };

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ],
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
                <div className="flex bg-gray-200 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('bill')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'bill' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Bill Receipt
                    </button>
                    <button
                        onClick={() => setActiveTab('kot')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'kot' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Kitchen Ticket (KOT)
                    </button>
                </div>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Paper Size</label>
                                <select
                                    name="paperSize"
                                    value={activeConfig.paperSize}
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
                                    value={activeConfig.fontSize}
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
                                    value={activeConfig.numberOfCopies}
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
                                    checked={activeConfig.autoPrint}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Auto Print After Payment</span>
                            </label>

                            {activeTab === 'bill' && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="showLogo"
                                        checked={activeConfig.showLogo}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Logo</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            Content Configuration
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Header Text (Rich Text)</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="showHeader" checked={activeConfig.showHeader} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                        <span className="text-xs text-gray-500">Enable</span>
                                    </label>
                                </div>
                                <div className={`${!activeConfig.showHeader ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <ReactQuill
                                        theme="snow"
                                        value={activeConfig.headerText}
                                        onChange={(value) => handleQuillChange('headerText', value)}
                                        modules={modules}
                                        className="bg-white dark:bg-gray-700 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Footer Text (Rich Text)</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" name="showFooter" checked={activeConfig.showFooter} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                        <span className="text-xs text-gray-500">Enable</span>
                                    </label>
                                </div>
                                <div className={`${!activeConfig.showFooter ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <ReactQuill
                                        theme="snow"
                                        value={activeConfig.footerText}
                                        onChange={(value) => handleQuillChange('footerText', value)}
                                        modules={modules}
                                        className="bg-white dark:bg-gray-700 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {activeTab === 'bill' && (
                            <div className="mt-8 flex flex-wrap gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="showTaxDetails" checked={activeConfig.showTaxDetails} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Tax Breakdown</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="showCashierName" checked={activeConfig.showCashierName} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Cashier Name</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="showFssai" checked={activeConfig.showFssai} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Show FSSAI No.</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="showGst" checked={activeConfig.showGst} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Show GST No.</span>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Live Preview (Mock) */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
                    <div className="flex flex-col w-full mb-4">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2 mb-3">
                            <Layout className="w-5 h-5 text-gray-500" />
                            Preview: {activeTab === 'bill' ? 'Receipt' : 'KOT'}
                        </h2>

                        <div className="flex gap-2 self-center bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => handleChange({ target: { name: 'template', value: 'standard' } })}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeConfig.template === 'standard' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Template 1
                            </button>

                            <button
                                onClick={() => handleChange({ target: { name: 'template', value: 'minimal' } })}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeConfig.template === 'minimal' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Template 2
                            </button>
                        </div>
                    </div>

                    <div className={`
                        bg-white border border-gray-200 shadow-lg p-4 text-gray-800 
                        ${activeConfig.template === 'classic' ? 'font-sans' : activeConfig.template === 'minimal' ? 'font-light' : 'font-sans'} 
                        ${activeConfig.fontSize === 'large' ? 'text-sm' : 'text-xs'} 
                        leading-relaxed overflow-hidden transition-all duration-300 
                        ${activeConfig.paperSize === '3inch' ? 'w-64' : activeConfig.paperSize === '2inch' ? 'w-48' : 'w-full max-w-sm'}
                    `}>
                        {/* Header Section */}
                        {activeConfig.showLogo && (
                            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-400">Logo</div>
                        )}

                        {activeConfig.showHeader && activeConfig.headerText ? (
                            <div className="mb-4 prose prose-sm max-w-none text-center" dangerouslySetInnerHTML={{ __html: activeConfig.headerText }} />
                        ) : !activeConfig.showHeader && activeTab === 'bill' && (
                            <div className="text-center mb-4">
                                <div className="font-normal text-xs text-gray-600">Lorem ipsum 258</div>
                                <div className="font-normal text-xs text-gray-600">City Index - 02025</div>
                                <div className="font-bold text-xs text-gray-800 mt-1">Tel.: +456-468-987-02</div>
                            </>
                        )}
                    </div>
                        )}

                    {/* Separator Style Selection */}
                    {activeConfig.template === 'minimal' && activeTab === 'bill' ? (
                        <div className="border-t border-gray-800 my-2"></div>
                    ) : activeTab === 'bill' && (
                        <>
                            <div className="text-center mb-2 text-[10px] text-gray-500">
                                {activeConfig.showGst && <div>GSTIN: 29AAAAA0000A1Z5</div>}
                                {activeConfig.showFssai && <div>FSSAI: 11219332000216</div>}
                            </div>
                            {activeConfig.showLogo && <div className="border-b border-dashed border-gray-400 mb-2"></div>}
                        </>
                    )}

                    {/* Info Section */}
                    {activeConfig.template !== 'minimal' && (
                        <div className="flex justify-between">
                            <span>Date: 01/02/2026</span><span>Time: 10:30 AM</span>
                        </div>
                    )}

                    {activeConfig.template !== 'minimal' && (
                        <div className="flex justify-between mb-2">
                            <span>{activeTab === 'bill' ? 'Bill No' : 'KOT No'}: 1001</span><span>Table: 5</span>
                        </div>
                    )}
                    {activeConfig.showCashierName && activeConfig.template === 'standard' && <div className="mb-2">Cashier: John Doe</div>}

                    {activeConfig.template === 'classic' && activeTab === 'bill' ? (
                        <div className="overflow-hidden whitespace-nowrap text-gray-400 text-[8px] my-2 tracking-widest">
                            ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
                        </div>
                    ) : activeConfig.template === 'minimal' && activeTab === 'bill' ? (
                        null // No additional separator for minimal here
                    ) : (
                        <div className="border-b border-dashed border-gray-400 mb-2"></div>
                    )}

                    {/* Table Header */}
                    {activeConfig.template !== 'minimal' && (
                        <div className="flex justify-between font-bold mb-2">
                            <span className="w-1/2 text-left">Name</span>
                            <span className="w-1/4 text-center">{activeTab === 'bill' ? 'Qty' : 'Qty'}</span>
                            {activeTab === 'bill' && <span className="w-1/4 text-right">Price</span>}
                        </div>
                    )}

                    {/* Items */}
                    {activeTab === 'bill' ? (
                        activeConfig.template === 'minimal' ? (
                            <div className="space-y-3 mt-4">
                                <div>
                                    <div className="font-bold mb-1">Mains</div>
                                    <div className="flex justify-between"><span>1 x Burger</span><span>£12.50</span></div>
                                    <div className="flex justify-between"><span>1 x Grilled Aubergine</span><span>£11.00</span></div>
                                    <div className="flex justify-between"><span>1 x Lamb Kebab</span><span>£12.00</span></div>
                                </div>
                                <div>
                                    <div className="font-bold mb-1">Sides</div>
                                    <div className="flex justify-between"><span>1 x Chips</span><span>£3.50</span></div>
                                </div>
                                <div>
                                    <div className="font-bold mb-1">Keg Pint</div>
                                    <div className="flex justify-between"><span>1 x Keg Taster</span><span>£0.00</span></div>
                                    <div className="flex justify-between"><span>1 x Pint Cardinaldred</span><span>£6.30</span></div>
                                </div>
                                <div>
                                    <div className="font-bold mb-1">Gin & Spirits</div>
                                    <div className="flex justify-between"><span>1 x Brockmans Gin</span><span>£5.70</span></div>
                                    <div className="pl-4 text-xs italic">Extras</div>
                                    <div className="flex justify-between pl-4 text-xs"><span>1 x Mixer</span><span>£1.30</span></div>
                                </div>
                                <div>
                                    <div className="font-bold mb-1">Soft Drinks</div>
                                    <div className="flex justify-between"><span>1 x House Lemonade</span><span>£3.00</span></div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="w-1/2 text-left leading-tight">Lorem ipsum</span>
                                    <span className="w-1/4 text-center">1</span>
                                    <span className="w-1/4 text-right">$9.20</span>
                                </div>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="w-1/2 text-left leading-tight">Lorem ipsum dolor sit</span>
                                    <span className="w-1/4 text-center">1</span>
                                    <span className="w-1/4 text-right">$19.20</span>
                                </div>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="w-1/2 text-left leading-tight">Lorem ipsum</span>
                                    <span className="w-1/4 text-center">1</span>
                                    <span className="w-1/4 text-right">$15.00</span>
                                </div>
                            </>
                        )
                    ) : (
                        // KOT View
                        <>
                            <div className="mb-2">
                                <div className="flex justify-between font-medium"><span>Burger</span><span>1</span></div>
                                <div className="text-[10px] italic text-gray-600 pl-2">Note: Less spicy</div>
                            </div>
                            <div className="mb-2">
                                <div className="flex justify-between font-medium"><span>Fries</span><span>2</span></div>
                            </div>
                            <div>
                                <div className="flex justify-between font-medium"><span>Coke</span><span>1</span></div>
                                <div className="text-[10px] italic text-gray-600 pl-2">Note: No Ice</div>
                            </div>
                        </>
                    )}




                    {activeConfig.template === 'classic' && activeTab === 'bill' ? (
                        <div className="overflow-hidden whitespace-nowrap text-gray-400 text-[8px] my-2 tracking-widest">
                            ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
                        </div>
                    ) : activeConfig.template === 'minimal' && activeTab === 'bill' ? (
                        <div className="border-b border-gray-800 my-4"></div>
                    ) : (
                        <div className="border-b border-dashed border-gray-400 my-2"></div>
                    )}

                    {/* Totals */}
                    {activeTab === 'bill' && (
                        <>
                            {activeConfig.template === 'minimal' ? (
                                <div className="flex flex-col items-end gap-1 mb-4">
                                    <div className="flex justify-between w-full text-right gap-8"><span>Food Total</span><span>£39.00</span></div>
                                    <div className="flex justify-between w-full text-right gap-8"><span>Drink Total</span><span>£16.30</span></div>
                                    <div className="text-center w-full my-2 text-xs">Service Charge Not Added</div>
                                    <div className="flex justify-between w-full text-lg font-bold mt-2"><span>Total</span><span>£55.30</span></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center">
                                        <span>Sub Total</span>
                                        <span>$107.60</span>
                                    </div>
                                    <>
                                        {activeConfig.showTaxDetails && (
                                            <>
                                                <div className="flex justify-between text-[10px] text-gray-500"><span>CGST (2.5%)</span><span>8.00</span></div>
                                                <div className="flex justify-between text-[10px] text-gray-500"><span>SGST (2.5%)</span><span>8.00</span></div>
                                            </>
                                        )}
                                        <div className="flex justify-between font-bold text-sm mt-2"><span>Total</span><span>336.00</span></div>
                                        <div className="border-b border-dashed border-gray-400 my-2"></div>
                                    </>
                                </>
                            )}


                        </>
                    )}

                    {/* Barcode for Classic */}
                    {activeConfig.template === 'classic' && (
                        <div className="flex justify-center my-4">
                            <div className="h-12 w-48 bg-gray-800 flex items-end justify-center text-white text-[8px] tracking-[4px]">
                                || | ||| || ||| ||
                            </div>
                        </div>
                    )}

                    {/* Footer for Minimal (Pint Shop Style) */}
                    {activeConfig.template === 'minimal' && activeTab === 'bill' && (
                        <div className="text-center space-y-1 mb-4">
                            <div className="border-t border-gray-800 w-full mb-2"></div>
                            <div className="flex justify-between text-[10px] text-gray-600">
                                <span>02/07/2018 13:41:09</span>
                                <span>Bill No. 553305</span>
                            </div>
                            <div className="text-[10px] text-gray-600">Covers 3</div>
                            <div className="text-[10px] text-gray-600">VAT No. 166356195</div>
                            <div className="text-[10px] text-gray-600 mt-2">www.pintshop.co.uk</div>
                        </div>
                    )}

                    {activeConfig.showFooter && activeConfig.footerText && (
                        <div className="mt-4 prose prose-sm max-w-none text-center" dangerouslySetInnerHTML={{ __html: activeConfig.footerText }} />
                    )}
                </div>
            </div>
        </div>
        </div >
    );
}

// Default export if needed
export default PrintSettings;
