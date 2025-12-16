import React, { useState, useEffect } from 'react';
import { Search, Save, Info, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { settingsService, inventoryService } from '../../services/api';

export function InventorySettings() {
    const [activeTab, setActiveTab] = useState('Consumption and production');
    const [searchQuery, setSearchQuery] = useState('');
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    // Assuming backend will have an endpoint for outlets/locations, mocking for now or fetching generic if available
    const [locations, setLocations] = useState([]);

    const tabs = [
        'Consumption and production',
        'Purchase Order',
        'Stock Purchase',
        'Sales and Transfer',
        'Settings applying to both sales and purchases.',
        'Closing Related Settings',
        'Other Settings',
        'Ledger Settings',
        'Batchwise Settings',
        'Configuration Logs'
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const [settingsRes, supRes] = await Promise.all([
                settingsService.getAll(),
                inventoryService.getSuppliers() // Reusing existing service method
                // inventoryService.getLocations() // If exists
            ]);
            setSettings(settingsRes.data);
            setSuppliers(supRes.data || []);
            setLocations([{ id: 'main', name: 'Main Kitchen' }, { id: 'outlet1', name: 'Outlet 1' }]); // Mock locations for now as no endpoint evident
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveSettings = async () => {
        try {
            await settingsService.update(settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("Failed to save settings.");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'Consumption and production':
                return <ConsumptionProductionSettings settings={settings} onChange={handleSettingChange} />;
            case 'Purchase Order':
                return <PurchaseOrderSettings settings={settings} suppliers={suppliers} locations={locations} onChange={handleSettingChange} />;
            case 'Stock Purchase':
                return <StockPurchaseSettings settings={settings} onChange={handleSettingChange} />;
            case 'Sales and Transfer':
                return <SalesTransferSettings settings={settings} onChange={handleSettingChange} />;
            case 'Other Settings':
                return <OtherSettings settings={settings} locations={locations} onChange={handleSettingChange} />;
            // Add other cases as needed
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Info className="w-12 h-12 mb-2 opacity-50" />
                        <p>Settings for {activeTab} are coming soon.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex h-full bg-gray-50 dark:bg-gray-900 font-sans">
            {/* Settings Sidebar */}
            <div className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <SettingsIcon className="w-5 h-5 text-gray-500" />
                        Inventory Settings
                    </h2>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab
                                ? 'bg-red-50 text-red-600 border-l-4 border-red-600'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{activeTab}</h1>
                    <div className="relative w-80">
                        <input
                            type="text"
                            placeholder="Search for settings here"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                            Loading...
                        </div>
                    )}
                    <div className="max-w-4xl space-y-8 pb-20">
                        {renderContent()}
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="bg-red-50/50 border-t border-red-100 p-4 flex justify-end shrink-0">
                    <button onClick={saveSettings} className="px-8 py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition-colors">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components ---

function ConsumptionProductionSettings({ settings, onChange }) {
    return (
        <div className="space-y-8">
            <SettingGroup label="Want inventory to be consumed automatically according to the recipe?">
                <RadioGroup
                    name="autoConsume"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.autoConsume || 'yes'}
                    onChange={onChange}
                />
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-2 flex gap-3 text-sm text-yellow-800">
                    <Info className="w-5 h-5 text-yellow-600 shrink-0" />
                    <p>Before you enable this option, create Recipe. <a href="#" className="underline font-bold">Click Here.</a></p>
                </div>
            </SettingGroup>

            <SettingGroup label="Add the type for which you require consumption on saved bills.">
                <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="consType"
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                            checked={settings.consType === 'default' || !settings.consType}
                            onChange={() => onChange('consType', 'default')}
                        />
                        <span className="text-sm">Default (Applicable for print or Ebill status)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="consType"
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                            checked={settings.consType === 'online'}
                            onChange={() => onChange('consType', 'online')}
                        />
                        <span className="text-sm">Online orders</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="consType"
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                            checked={settings.consType === 'offline'}
                            onChange={() => onChange('consType', 'offline')}
                        />
                        <span className="text-sm">Offline orders</span>
                    </label>
                </div>
            </SettingGroup>

            <SettingGroup label="Get notified in the POS and inventory notification section when raw material stock hits the At par stock level?">
                <RadioGroup
                    name="notifyPar"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.notifyPar || 'no'}
                    onChange={onChange}
                />
            </SettingGroup>
        </div>
    );
}

function PurchaseOrderSettings({ settings, suppliers, locations, onChange }) {
    return (
        <div className="space-y-8">
            <SettingGroup label="Want to display Tax in Purchase Order?">
                <RadioGroup
                    name="displayTaxPO"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.displayTaxPO || 'no'}
                    onChange={onChange}
                />
            </SettingGroup>

            <SettingGroup label="In add Purchase Order 'Deliver To'">
                <select
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white"
                    value={settings.poDeliverTo || ''}
                    onChange={(e) => onChange('poDeliverTo', e.target.value)}
                >
                    <option value="">Select Option</option>
                    {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                    {suppliers.map(sup => (
                        <option key={sup.id} value={`sup_${sup.id}`}>Supplier: {sup.name}</option>
                    ))}
                </select>
            </SettingGroup>

            <SettingGroup label="Want to configure ship to bill?">
                <RadioGroup
                    name="shipToBill"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.shipToBill || 'no'}
                    onChange={onChange}
                />
            </SettingGroup>

            <SettingGroup label="Allow the user to raise a Purchase Order when the stock at the kitchen/restaurant level is negative?">
                <RadioGroup
                    name="allowNegStockPO"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.allowNegStockPO || 'yes'}
                    onChange={onChange}
                />
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-2 flex gap-3 text-sm text-yellow-800">
                    <Info className="w-5 h-5 text-yellow-600 shrink-0" />
                    <p>Before issuing a PO, ensure that the kitchen and restaurant have adequate stock.</p>
                </div>
            </SettingGroup>
        </div>
    );
}

function StockPurchaseSettings({ settings, onChange }) {
    return (
        <div className="space-y-8">
            <SettingGroup label="Label for a Purchase invoice" required>
                <input
                    type="text"
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg outline-none text-sm"
                    value={settings.purchaseInvoiceLabel || 'Invoice'}
                    onChange={(e) => onChange('purchaseInvoiceLabel', e.target.value)}
                />
            </SettingGroup>

            <SettingGroup label="Choose how many days you want to use to obtain the latest average purchase price.">
                <div className="flex gap-6 flex-wrap">
                    {[15, 30, 45, 60, 75, 90, 'Till Now'].map(val => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="avgDays"
                                className="w-4 h-4 text-red-600 focus:ring-red-500"
                                checked={String(settings.avgDays) === String(val) || (!settings.avgDays && val === 90)}
                                onChange={() => onChange('avgDays', String(val))}
                            />
                            <span className="text-sm">{val}</span>
                        </label>
                    ))}
                </div>
            </SettingGroup>

            <SettingGroup label="Allow user to edit or delete purchase once entries are completed?">
                <RadioGroup
                    name="editPurchase"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.editPurchase || 'yes'}
                    onChange={onChange}
                />
            </SettingGroup>
        </div>
    );
}

function SalesTransferSettings({ settings, onChange }) {
    return (
        <div className="space-y-8">
            <SettingGroup label="Label for a sales invoice" required>
                <input
                    type="text"
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg outline-none text-sm"
                    value={settings.salesInvoiceLabel || 'TAX INVOICE'}
                    onChange={(e) => onChange('salesInvoiceLabel', e.target.value)}
                />
            </SettingGroup>

            <SettingGroup label="Would you like to allow user to add sales or transfer from previous dates?">
                <RadioGroup
                    name="allowBackdatedSales"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.allowBackdatedSales || 'yes'}
                    onChange={onChange}
                />
            </SettingGroup>

            <SettingGroup label="Want to display average purchase(without tax) price as internal transfer/sale/sale return price?">
                <RadioGroup
                    name="avgPriceTransfer"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.avgPriceTransfer || 'no'}
                    onChange={onChange}
                />
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-2 flex gap-3 text-sm text-yellow-800">
                    <Info className="w-5 h-5 text-yellow-600 shrink-0" />
                    <p>To maintain the average purchase price, include the correct raw material purchase price when adding the purchases.</p>
                </div>
            </SettingGroup>
        </div>
    );
}

function OtherSettings({ settings, locations, onChange }) {
    return (
        <div className="space-y-8">
            <SettingGroup label="Restaurant or kitchen mapping">
                <select
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white mb-2"
                    value={settings.restMap || ''}
                    onChange={(e) => onChange('restMap', e.target.value)}
                >
                    <option value="">Select</option>
                    {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
                <p className="text-xs text-blue-500 mb-4">Note: For all restaurants, please make it empty.</p>

                <label className="text-sm font-bold text-gray-700 block mb-2">Type of outlet (Ownership)</label>
                <select className="w-full max-w-md p-2 border border-gray-300 rounded-lg outline-none text-sm bg-white">
                    <option>COFO - Company Owned Franchisee Operated</option>
                </select>
            </SettingGroup>

            <SettingGroup label="If raw material stock is negative, would you prefer that a user complete sales,wastage or a transfer?">
                <RadioGroup
                    name="negStockOps"
                    options={[{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]}
                    selectedValue={settings.negStockOps || 'yes'}
                    onChange={onChange}
                />
            </SettingGroup>
        </div>
    );
}


// --- Helper Components ---

function SettingGroup({ label, required, children }) {
    return (
        <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
            <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

function RadioGroup({ name, options, selectedValue, onChange }) {
    return (
        <div className="flex gap-6">
            {options.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                            type="radio"
                            name={name}
                            value={opt.value}
                            checked={selectedValue === opt.value}
                            onChange={() => onChange && onChange(name, opt.value)}
                            className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-green-600 cursor-pointer transition-colors"
                        />
                        <div className="absolute w-2.5 h-2.5 bg-green-600 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                </label>
            ))}
        </div>
    );
}

function SettingsIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}
