import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, Palette } from 'lucide-react';
import { outletService } from '../../services/api';

const THEME_PALETTES = [
    {
        id: 'emerald_slate',
        name: 'Emerald & Slate (Light)',
        colors: ['#10B981', '#0F172A', '#F8FAFC', '#64748B', '#FFFFFF'],
        isPro: true,
        type: 'light',
        settings: {
            '--bg-main': '#F8FAFC',
            '--bg-surface': '#FFFFFF',
            '--bg-sidebar': '#0F172A',
            '--bg-header': '#FFFFFF',
            '--text-main': '#1E293B',
            '--text-muted': '#64748B',
            '--color-primary': '#10B981',
            '--color-primary-hover': '#059669',
            '--color-secondary': '#64748B',
            '--status-success': '#22C55E',
            '--status-warning': '#F59E0B',
            '--status-error': '#EF4444',
            '--status-info': '#3B82F6',
            '--border-color': '#E2E8F0',
            '--sidebar-active': 'rgba(16, 185, 129, 0.1)',
            '--sidebar-active-text': '#10B981',
            '--sidebar-text': '#94A3B8',
            '--pos-btn-pay': '#10B981',
            '--pos-btn-hold': '#F59E0B',
            '--pos-btn-save': '#64748B',
            '--pos-btn-cancel': '#EF4444',
            '--chart-1': '#10B981',
            '--chart-2': '#3B82F6',
            '--chart-3': '#8B5CF6',
            '--chart-4': '#64748B',
            '--chart-5': '#EC4899',
        }
    },
    {
        id: 'midnight_emerald',
        name: 'Midnight Emerald (Dark)',
        colors: ['#34D399', '#0F172A', '#1E293B', '#F8FAFC', '#020617'],
        isPro: true,
        type: 'dark',
        settings: {
            '--bg-main': '#0F172A',
            '--bg-surface': '#1E293B',
            '--bg-sidebar': '#020617',
            '--bg-header': '#0F172A',
            '--text-main': '#F8FAFC',
            '--text-muted': '#94A3B8',
            '--color-primary': '#34D399',
            '--color-primary-hover': '#10B981',
            '--color-secondary': '#64748B',
            '--status-success': '#22C55E',
            '--status-warning': '#F59E0B',
            '--status-error': '#EF4444',
            '--status-info': '#3B82F6',
            '--border-color': '#334155',
            '--sidebar-active': 'rgba(52, 211, 153, 0.1)',
            '--sidebar-active-text': '#34D399',
            '--sidebar-text': '#94A3B8',
            '--pos-btn-pay': '#34D399',
            '--pos-btn-hold': '#F59E0B',
            '--pos-btn-save': '#64748B',
            '--pos-btn-cancel': '#EF4444',
            '--chart-1': '#34D399',
            '--chart-2': '#3B82F6',
            '--chart-3': '#8B5CF6',
            '--chart-4': '#64748B',
            '--chart-5': '#EC4899',
        }
    },
    { id: 'sunset_maroon', name: 'Sunset Maroon', colors: ['#4a0404', '#722f37', '#c04040', '#d27d59', '#f4d7b1'] },
    { id: 'berry_teal', name: 'Berry Teal', colors: ['#9d2a6a', '#e61d4b', '#ff6d31', '#ffce4a', '#2a9a9b'] },
    { id: 'modern_slate', name: 'Modern Slate', colors: ['#3d5a80', '#98c1d9', '#e0fbfc', '#ee6c4d', '#293241'] },
    { id: 'ocean_coral', name: 'Ocean Coral', colors: ['#003049', '#118ab2', '#b8f2e6', '#ff6b6b', '#d00000'] }
];

export function ThemeConfiguration() {
    const [selectedThemeId, setSelectedThemeId] = useState('emerald_slate');
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchThemeConfig();
    }, []);

    const fetchThemeConfig = async () => {
        try {
            const res = await outletService.getConfig();
            const data = res.data;
            setConfig(data);
            if (data.themeName) {
                const matched = THEME_PALETTES.find(p => p.name === data.themeName);
                if (matched) setSelectedThemeId(matched.id);
            }
        } catch (error) {
            console.error('Error fetching theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const theme = THEME_PALETTES.find(p => p.id === selectedThemeId);
            const payload = {
                themeName: theme.name,
                themeColor: theme.colors[0],
                themePalette: JSON.stringify(theme)
            };
            await outletService.updateConfig(payload);
            applyTheme(theme);
            alert('Theme updated successfully!');
        } catch (error) {
            console.error('Error saving theme:', error);
            alert('Failed to update theme');
        } finally {
            setSaving(false);
        }
    };

    const applyTheme = (themeData) => {
        const root = document.documentElement;
        if (themeData.settings) {
            Object.entries(themeData.settings).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
            localStorage.setItem('tenant_theme', JSON.stringify(themeData));
            return;
        }

        const colors = themeData.colors;
        if (colors) {
            root.style.setProperty('--color-primary', colors[0]);
            root.style.setProperty('--bg-sidebar', colors[1]);
            root.style.setProperty('--bg-main', colors[2]);
            root.style.setProperty('--text-main', colors[1]);
            root.style.setProperty('--color-primary-hover', colors[0]);
            root.style.setProperty('--sidebar-active-text', colors[0]);
        }
        localStorage.setItem('tenant_theme', JSON.stringify(themeData));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading palettes...</div>;

    const currentPalette = THEME_PALETTES.find(p => p.id === selectedThemeId) || THEME_PALETTES[0];

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--bg-main)' }}>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-gray-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <Palette className="w-8 h-8 text-emerald-500" style={{ color: 'var(--color-primary)' }} />
                                Theme Customization
                            </h1>
                            <p className="text-sm text-gray-500">Select a color palette that matches your brand identity.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-8 py-3 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        {saving ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Theme
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {THEME_PALETTES.map((palette) => {
                        const isSelected = selectedThemeId === palette.id;
                        return (
                            <button
                                key={palette.id}
                                onClick={() => setSelectedThemeId(palette.id)}
                                className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 ${isSelected
                                    ? 'border-emerald-500 bg-white dark:bg-gray-800 shadow-2xl scale-105 z-10'
                                    : 'border-transparent bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl dark:border-gray-700'
                                    }`}
                                style={isSelected ? { borderColor: 'var(--color-primary)' } : {}}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-sm font-black uppercase tracking-wider ${isSelected ? 'text-emerald-500' : 'text-gray-500'}`} style={isSelected ? { color: 'var(--color-primary)' } : {}}>
                                        {palette.name}
                                    </span>
                                    {isSelected && (
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
                                            <Check className="w-4 h-4 stroke-[4]" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex h-16 rounded-xl overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-900">
                                    {palette.colors.map((color, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-1"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Theme Preview Section */}
                <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">Visual Preview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* POS Mockup */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">POS Interface</p>
                            <div className="aspect-video rounded-3xl border-8 border-gray-900 bg-gray-100 dark:bg-gray-900 overflow-hidden flex shadow-2xl">
                                <div className="w-16 h-full flex flex-col items-center py-4 gap-4" style={{ backgroundColor: 'var(--bg-sidebar)' }}>
                                    <div className="w-8 h-8 rounded-lg opacity-20 bg-white" />
                                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: 'var(--color-primary)' }} />
                                    <div className="w-8 h-8 rounded-lg opacity-20 bg-white" />
                                </div>
                                <div className="flex-1 p-4 flex flex-col gap-4">
                                    <div className="h-4 w-1/3 rounded-full opacity-50" style={{ backgroundColor: 'var(--text-main)' }} />
                                    <div className="grid grid-cols-3 gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="aspect-square rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 p-2 flex flex-col justify-end gap-1">
                                                <div className="h-1 w-full rounded bg-gray-100 dark:bg-gray-700" />
                                                <div className="h-1 w-2/3 rounded" style={{ backgroundColor: 'var(--color-primary)' }} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-auto flex gap-2">
                                        <div className="h-10 flex-1 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--pos-btn-hold)' }} />
                                        <div className="h-10 flex-[1.5] rounded-xl shadow-lg flex items-center justify-center text-[10px] font-black text-white uppercase tracking-wider" style={{ backgroundColor: 'var(--pos-btn-pay)' }}>Checkout</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Color Palette Details */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Role-Based Palette</p>
                            <div className="grid grid-cols-1 gap-2">
                                {Object.entries(currentPalette.settings || {}).slice(0, 15).map(([key, val], i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: val }} />
                                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 lowercase">{key.replace('--', '')}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
