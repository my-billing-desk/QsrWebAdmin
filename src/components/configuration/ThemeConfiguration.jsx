import React, { useState, useEffect } from 'react';
import { Palette, Check, Loader2, ArrowLeft, Monitor, Smartphone, Eye, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { outletService } from '../../services/api';

// Predefined color themes with professional color palettes
const THEME_PRESETS = [
    { name: 'Ruby Red', color: '#dc2626', desc: 'Classic, bold, and energetic' },
    { name: 'Ocean Blue', color: '#2563eb', desc: 'Professional and trustworthy' },
    { name: 'Emerald', color: '#059669', desc: 'Fresh, organic, and natural' },
    { name: 'Royal Purple', color: '#7c3aed', desc: 'Premium and sophisticated' },
    { name: 'Sunset Orange', color: '#ea580c', desc: 'Warm, friendly, and inviting' },
    { name: 'Hot Pink', color: '#db2777', desc: 'Modern, fun, and vibrant' },
    { name: 'Teal', color: '#0d9488', desc: 'Calm, balanced, and modern' },
    { name: 'Midnight', color: '#1e293b', desc: 'Elegant and minimal' },
    { name: 'Gold', color: '#ca8a04', desc: 'Luxurious and premium' },
    { name: 'Coral', color: '#f43f5e', desc: 'Fresh, trendy, and dynamic' },
    { name: 'Sky', color: '#0ea5e9', desc: 'Light, airy, and approachable' },
    { name: 'Indigo', color: '#4f46e5', desc: 'Creative and innovative' },
];

// Helper to generate color variants from a hex color
function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
            default: h = 0;
        }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function ThemeConfiguration() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [outletConfig, setOutletConfig] = useState({});
    const [selectedColor, setSelectedColor] = useState('#dc2626');
    const [selectedName, setSelectedName] = useState('Ruby Red');
    const [customColor, setCustomColor] = useState('');
    const [showPreview, setShowPreview] = useState('pos');

    useEffect(() => {
        fetchOutletConfig();
    }, []);

    const fetchOutletConfig = async () => {
        try {
            const res = await outletService.getConfig();
            if (res.data.success && res.data.data) {
                setOutletConfig(res.data.data);
                setSelectedColor(res.data.data.themeColor || '#dc2626');
                setSelectedName(res.data.data.themeName || 'Ruby Red');
            }
        } catch (error) {
            console.error('Error fetching outlet config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePresetSelect = (preset) => {
        setSelectedColor(preset.color);
        setSelectedName(preset.name);
        setCustomColor('');
    };

    const handleCustomColorChange = (e) => {
        const color = e.target.value;
        setCustomColor(color);
        setSelectedColor(color);
        setSelectedName('Custom');
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await outletService.updateConfig({
                ...outletConfig,
                themeColor: selectedColor,
                themeName: selectedName,
            });
            alert('Theme saved successfully! All apps will update to use this theme.');
        } catch (error) {
            console.error('Error saving theme:', error);
            alert('Failed to save theme. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const hsl = hexToHsl(selectedColor);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
            {/* Header */}
            <div className="mb-6">
                <Link to="/config" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Configuration
                </Link>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                    <Palette className="w-7 h-7" style={{ color: selectedColor }} />
                    Theme Configuration
                </h1>
                <p className="text-gray-500 mt-1">
                    Choose a color theme that will be applied across all your apps — POS, Kitchen Display, and more.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Color Selection Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Preset Colors */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Choose a Theme Color</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {THEME_PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => handlePresetSelect(preset)}
                                    className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${selectedColor === preset.color
                                            ? 'border-gray-800 dark:border-white scale-105 shadow-lg'
                                            : 'border-transparent hover:border-gray-300 hover:shadow-md'
                                        }`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full mb-2 shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: preset.color }}
                                    >
                                        {selectedColor === preset.color && (
                                            <Check className="w-5 h-5 text-white drop-shadow-md" />
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center">
                                        {preset.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Custom Color Picker */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">Or pick a custom color:</h3>
                            <div className="flex items-center gap-4">
                                <input
                                    type="color"
                                    value={customColor || selectedColor}
                                    onChange={handleCustomColorChange}
                                    className="w-16 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={customColor || selectedColor}
                                    onChange={(e) => {
                                        if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) {
                                            handleCustomColorChange(e);
                                        }
                                    }}
                                    maxLength={7}
                                    placeholder="#000000"
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm bg-white dark:bg-gray-700"
                                />
                                <div className="flex-1">
                                    <span className="text-xs text-gray-500">
                                        HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Color Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Selected Theme</h2>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-20 h-20 rounded-2xl shadow-lg"
                                style={{ backgroundColor: selectedColor }}
                            />
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{selectedName}</h3>
                                <p className="text-gray-500 text-sm">{selectedColor.toUpperCase()}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {THEME_PRESETS.find(p => p.color === selectedColor)?.desc || 'Your custom brand color'}
                                </p>
                            </div>
                        </div>

                        {/* Generated Palette */}
                        <div className="mt-6">
                            <h4 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-3">Auto-Generated Palette:</h4>
                            <div className="flex gap-2">
                                {[95, 85, 70, 50, 40, 30, 20].map((lightness) => (
                                    <div
                                        key={lightness}
                                        className="flex-1 h-10 rounded-lg first:rounded-l-xl last:rounded-r-xl"
                                        style={{
                                            backgroundColor: `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`
                                        }}
                                        title={`Lightness: ${lightness}%`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                    {/* Preview Toggle */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="w-5 h-5 text-gray-500" />
                            <span className="font-bold text-gray-700 dark:text-gray-200">Live Preview</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowPreview('pos')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${showPreview === 'pos'
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                style={showPreview === 'pos' ? { backgroundColor: selectedColor } : {}}
                            >
                                <Monitor className="w-4 h-4" />
                                POS
                            </button>
                            <button
                                onClick={() => setShowPreview('mobile')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-colors ${showPreview === 'mobile'
                                        ? 'text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                style={showPreview === 'mobile' ? { backgroundColor: selectedColor } : {}}
                            >
                                <Smartphone className="w-4 h-4" />
                                Mobile
                            </button>
                        </div>
                    </div>

                    {/* Preview Content */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
                        {showPreview === 'pos' ? (
                            <POSPreview color={selectedColor} hsl={hsl} />
                        ) : (
                            <MobilePreview color={selectedColor} hsl={hsl} />
                        )}
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        style={{ backgroundColor: selectedColor }}
                    >
                        {saving ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'Saving...' : 'Save Theme'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        Once saved, this theme will automatically sync to all connected POS terminals and apps.
                    </p>
                </div>
            </div>
        </div>
    );
}

// POS Preview Component
function POSPreview({ color, hsl }) {
    return (
        <div className="h-72 flex flex-col">
            {/* Header */}
            <div className="px-3 py-2 flex items-center gap-2" style={{ backgroundColor: color }}>
                <div className="w-6 h-6 bg-white/20 rounded-lg" />
                <span className="text-white font-bold text-sm">MyBillDesk POS</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
                {/* Sidebar */}
                <div className="w-12 bg-gray-900 flex flex-col items-center py-3 gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div
                            key={i}
                            className={`w-8 h-8 rounded-lg ${i === 1 ? '' : 'bg-gray-700'}`}
                            style={i === 1 ? { backgroundColor: color } : {}}
                        />
                    ))}
                </div>

                {/* Main */}
                <div className="flex-1 p-3 bg-gray-100">
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-lg p-2 shadow-sm">
                                <div className="w-full h-6 bg-gray-200 rounded mb-1" />
                                <div className="text-[8px] font-bold text-gray-600">Item {i}</div>
                                <div className="text-[7px]" style={{ color }}>₹99</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart */}
                <div className="w-28 bg-white border-l border-gray-200 p-2 flex flex-col">
                    <div className="text-[9px] font-bold text-gray-700 mb-2">Cart</div>
                    <div className="flex-1 space-y-1">
                        {[1, 2].map(i => (
                            <div key={i} className="text-[7px] p-1 bg-gray-50 rounded">Item x1</div>
                        ))}
                    </div>
                    <button
                        className="w-full py-2 rounded-lg text-white text-[9px] font-bold"
                        style={{ backgroundColor: color }}
                    >
                        Pay ₹198
                    </button>
                </div>
            </div>
        </div>
    );
}

// Mobile Preview Component
function MobilePreview({ color, hsl }) {
    return (
        <div className="h-72 flex flex-col bg-gray-100">
            {/* Header */}
            <div className="px-3 py-3 flex items-center justify-between" style={{ backgroundColor: color }}>
                <span className="text-white font-bold text-sm">Menu</span>
                <div className="w-6 h-6 bg-white/20 rounded-full" />
            </div>

            {/* Categories */}
            <div className="flex px-2 py-2 gap-2 bg-white">
                {['All', 'Main', 'Drinks'].map((cat, i) => (
                    <div
                        key={cat}
                        className={`px-3 py-1 rounded-full text-[8px] font-semibold ${i === 0 ? 'text-white' : 'bg-gray-100 text-gray-600'}`}
                        style={i === 0 ? { backgroundColor: color } : {}}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            {/* Items */}
            <div className="flex-1 p-2 space-y-2 overflow-hidden">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg p-2 flex items-center gap-2 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-gray-200" />
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-gray-700">Menu Item {i}</div>
                            <div className="text-[8px] text-gray-400">Description text</div>
                        </div>
                        <div className="text-[10px] font-bold" style={{ color }}>₹199</div>
                    </div>
                ))}
            </div>

            {/* Bottom Cart */}
            <div className="px-3 py-2 bg-white border-t border-gray-200 flex items-center justify-between">
                <div>
                    <div className="text-[8px] text-gray-500">2 items</div>
                    <div className="text-[12px] font-bold text-gray-800">₹398</div>
                </div>
                <button
                    className="px-4 py-2 rounded-lg text-white text-[10px] font-bold"
                    style={{ backgroundColor: color }}
                >
                    View Cart →
                </button>
            </div>
        </div>
    );
}

export default ThemeConfiguration;
