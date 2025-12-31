import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, Palette } from 'lucide-react';
import { outletService } from '../../services/api';
import toast from 'react-hot-toast';

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
    {
        id: 'nordic_frost',
        name: 'Nordic Frost (Light)',
        colors: ['#6366F1', '#1E293B', '#F1F5F9', '#475569', '#FFFFFF'],
        isPro: true,
        type: 'light',
        settings: {
            '--bg-main': '#F1F5F9',
            '--bg-surface': '#FFFFFF',
            '--bg-sidebar': '#FFFFFF',
            '--bg-header': '#FFFFFF',
            '--text-main': '#0F172A',
            '--text-muted': '#64748B',
            '--color-primary': '#6366F1', // Indigo
            '--color-primary-hover': '#4F46E5',
            '--color-secondary': '#94A3B8',
            '--status-success': '#10B981',
            '--status-warning': '#F59E0B',
            '--status-error': '#E11D48',
            '--status-info': '#0EA5E9',
            '--border-color': '#E2E8F0',
            '--sidebar-active': '#EEF2FF',
            '--sidebar-active-text': '#6366F1',
            '--sidebar-text': '#64748B',
            '--pos-btn-pay': '#6366F1',
            '--pos-btn-hold': '#F59E0B',
            '--pos-btn-save': '#1E293B',
            '--pos-btn-cancel': '#E11D48',
            '--chart-1': '#6366F1',
            '--chart-2': '#0EA5E9',
            '--chart-3': '#F43F5E',
            '--chart-4': '#FB923C',
            '--chart-5': '#8B5CF6',
        }
    }, {
        id: 'obsidian_gold',
        name: 'Obsidian Gold (Dark)',
        colors: ['#F59E0B', '#0A0A0A', '#171717', '#A3A3A3', '#262626'],
        isPro: true,
        type: 'dark',
        settings: {
            '--bg-main': '#0A0A0A',
            '--bg-surface': '#171717',
            '--bg-sidebar': '#000000',
            '--bg-header': '#171717',
            '--text-main': '#F5F5F5',
            '--text-muted': '#A3A3A3',
            '--color-primary': '#D97706', // Amber Gold
            '--color-primary-hover': '#B45309',
            '--color-secondary': '#404040',
            '--status-success': '#10B981',
            '--status-warning': '#F59E0B',
            '--status-error': '#DC2626',
            '--status-info': '#3B82F6',
            '--border-color': '#262626',
            '--sidebar-active': 'rgba(217, 119, 6, 0.15)',
            '--sidebar-active-text': '#F59E0B',
            '--sidebar-text': '#737373',
            '--pos-btn-pay': '#D97706',
            '--pos-btn-hold': '#404040',
            '--pos-btn-save': '#525252',
            '--pos-btn-cancel': '#7F1D1D',
            '--chart-1': '#D97706',
            '--chart-2': '#D4D4D4',
            '--chart-3': '#A1A1AA',
            '--chart-4': '#71717A',
            '--chart-5': '#404040',
        }
    }, {
        id: 'rosewood_cream',
        name: 'Rosewood & Cream',
        colors: ['#9F1239', '#FFFBEB', '#FDE68A', '#4C0519', '#FFFFFF'],
        isPro: true,
        type: 'light',
        settings: {
            '--bg-main': '#FFFBF0',
            '--bg-surface': '#FFFFFF',
            '--bg-sidebar': '#4C0519', // Deep Rosewood
            '--bg-header': '#FFFFFF',
            '--text-main': '#451A03',
            '--text-muted': '#78350F',
            '--color-primary': '#E11D48',
            '--color-primary-hover': '#BE123C',
            '--color-secondary': '#D97706',
            '--status-success': '#059669',
            '--status-warning': '#D97706',
            '--status-error': '#9F1239',
            '--status-info': '#2563EB',
            '--border-color': '#FEF3C7',
            '--sidebar-active': 'rgba(255, 255, 255, 0.1)',
            '--sidebar-active-text': '#FDE68A',
            '--sidebar-text': '#FDA4AF',
            '--pos-btn-pay': '#E11D48',
            '--pos-btn-hold': '#B45309',
            '--pos-btn-save': '#78350F',
            '--pos-btn-cancel': '#9F1239',
            '--chart-1': '#BE123C',
            '--chart-2': '#F59E0B',
            '--chart-3': '#10B981',
            '--chart-4': '#4C0519',
            '--chart-5': '#F472B6',
        }
    }, {
        id: 'cyber_violet',
        name: 'Cyber Violet',
        colors: ['#8B5CF6', '#1E1B4B', '#312E81', '#C084FC', '#111827'],
        isPro: true,
        type: 'dark',
        settings: {
            '--bg-main': '#0F172A',
            '--bg-surface': '#1E293B',
            '--bg-sidebar': '#1E1B4B',
            '--bg-header': '#0F172A',
            '--text-main': '#F8FAFC',
            '--text-muted': '#94A3B8',
            '--color-primary': '#A855F7',
            '--color-primary-hover': '#9333EA',
            '--color-secondary': '#475569',
            '--status-success': '#22C55E',
            '--status-warning': '#F59E0B',
            '--status-error': '#F43F5E',
            '--status-info': '#38BDF8',
            '--border-color': '#334155',
            '--sidebar-active': 'rgba(168, 85, 247, 0.2)',
            '--sidebar-active-text': '#C084FC',
            '--sidebar-text': '#94A3B8',
            '--pos-btn-pay': '#8B5CF6',
            '--pos-btn-hold': '#F59E0B',
            '--pos-btn-save': '#334155',
            '--pos-btn-cancel': '#E11D48',
            '--chart-1': '#A855F7',
            '--chart-2': '#EC4899',
            '--chart-3': '#3B82F6',
            '--chart-4': '#10B981',
            '--chart-5': '#F59E0B',
        }
    },
    {
        id: 'slate_terracotta',
        name: 'Slate & Terracotta',
        colors: ['#E27D60', '#2D3748', '#F7FAFC', '#718096', '#FFFFFF'],
        isPro: true,
        type: 'light',
        settings: {
            '--bg-main': '#F8F9FA',
            '--bg-surface': '#FFFFFF',
            '--bg-sidebar': '#1A202C',
            '--bg-header': '#FFFFFF',
            '--text-main': '#2D3748',
            '--text-muted': '#718096',
            '--color-primary': '#E27D60', // Terracotta
            '--color-primary-hover': '#C0563E',
            '--color-secondary': '#4A5568',
            '--status-success': '#52AD8C',
            '--status-warning': '#E9C46A',
            '--status-error': '#E76F51',
            '--status-info': '#264653',
            '--border-color': '#EDF2F7',
            '--sidebar-active': 'rgba(226, 125, 96, 0.15)',
            '--sidebar-active-text': '#E27D60',
            '--sidebar-text': '#A0AEC0',
            '--pos-btn-pay': '#E27D60',
            '--pos-btn-hold': '#E9C46A',
            '--pos-btn-save': '#2D3748',
            '--pos-btn-cancel': '#E76F51',
            '--chart-1': '#E27D60',
            '--chart-2': '#264653',
            '--chart-3': '#E9C46A',
            '--chart-4': '#F4A261',
            '--chart-5': '#2A9D8F',
        }
    }, {
        id: 'deep_sea_mint',
        name: 'Deep Sea & Mint',
        colors: ['#00F5D4', '#001219', '#00212E', '#94A3B8', '#FFFFFF'],
        isPro: true,
        type: 'dark',
        settings: {
            '--bg-main': '#001219',
            '--bg-surface': '#00212E',
            '--bg-sidebar': '#001219',
            '--bg-header': '#00212E',
            '--text-main': '#F8FAFC',
            '--text-muted': '#94A3B8',
            '--color-primary': '#00F5D4', // Mint Cyan
            '--color-primary-hover': '#00D1B2',
            '--color-secondary': '#0A9396',
            '--status-success': '#94D2BD',
            '--status-warning': '#EE9B00',
            '--status-error': '#AE2012',
            '--status-info': '#005F73',
            '--border-color': '#005F73',
            '--sidebar-active': 'rgba(0, 245, 212, 0.1)',
            '--sidebar-active-text': '#00F5D4',
            '--sidebar-text': '#94A3B8',
            '--pos-btn-pay': '#00F5D4',
            '--pos-btn-hold': '#EE9B00',
            '--pos-btn-save': '#0A9396',
            '--pos-btn-cancel': '#AE2012',
            '--chart-1': '#00F5D4',
            '--chart-2': '#94D2BD',
            '--chart-3': '#0A9396',
            '--chart-4': '#E9D8A6',
            '--chart-5': '#CA6702',
        }
    }, {
        id: 'desert_sand',
        name: 'Desert Sand (Light)',
        colors: ['#4338CA', '#FAF7F2', '#EFE9E1', '#78350F', '#FFFFFF'],
        isPro: false,
        type: 'light',
        settings: {
            '--bg-main': '#FAF7F2',
            '--bg-surface': '#FFFFFF',
            '--bg-sidebar': '#F3EEE7',
            '--bg-header': '#FFFFFF',
            '--text-main': '#43403E',
            '--text-muted': '#8D8781',
            '--color-primary': '#312E81', // Deep Indigo
            '--color-primary-hover': '#1E1B4B',
            '--color-secondary': '#D4CDC3',
            '--status-success': '#16A34A',
            '--status-warning': '#D97706',
            '--status-error': '#DC2626',
            '--status-info': '#2563EB',
            '--border-color': '#EFE9E1',
            '--sidebar-active': '#FFFFFF',
            '--sidebar-active-text': '#312E81',
            '--sidebar-text': '#8D8781',
            '--pos-btn-pay': '#312E81',
            '--pos-btn-hold': '#D97706',
            '--pos-btn-save': '#A39C94',
            '--pos-btn-cancel': '#B91C1C',
            '--chart-1': '#312E81',
            '--chart-2': '#8D8781',
            '--chart-3': '#C2410C',
            '--chart-4': '#065F46',
            '--chart-5': '#6B21A8',
        }
    }, {
        id: 'midnight_carbon',
        name: 'Midnight Carbon (Dark)',
        colors: ['#3B82F6', '#000000', '#111111', '#EDEDED', '#1A1A1A'],
        isPro: true,
        type: 'dark',
        settings: {
            '--bg-main': '#000000',
            '--bg-surface': '#111111',
            '--bg-sidebar': '#000000',
            '--bg-header': '#111111',
            '--text-main': '#EDEDED',
            '--text-muted': '#71717A',
            '--color-primary': '#3B82F6', // Electric Blue
            '--color-primary-hover': '#2563EB',
            '--color-secondary': '#27272A',
            '--status-success': '#22C55E',
            '--status-warning': '#EAB308',
            '--status-error': '#EF4444',
            '--status-info': '#3B82F6',
            '--border-color': '#27272A',
            '--sidebar-active': 'rgba(59, 130, 246, 0.2)',
            '--sidebar-active-text': '#60A5FA',
            '--sidebar-text': '#71717A',
            '--pos-btn-pay': '#3B82F6',
            '--pos-btn-hold': '#3F3F46',
            '--pos-btn-save': '#27272A',
            '--pos-btn-cancel': '#7F1D1D',
            '--chart-1': '#3B82F6',
            '--chart-2': '#FFFFFF',
            '--chart-3': '#52525B',
            '--chart-4': '#A1A1AA',
            '--chart-5': '#1D4ED8',
        }
    },
];

export function ThemeConfiguration() {
    const [selectedThemeId, setSelectedThemeId] = useState('emerald_slate');
    const [customSettings, setCustomSettings] = useState(null);
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
            if (data.themePalette) {
                const palette = JSON.parse(data.themePalette);
                if (palette.id === 'custom_theme') {
                    setSelectedThemeId('custom_theme');
                    setCustomSettings(palette.settings);
                } else {
                    setSelectedThemeId(palette.id);
                }
            } else if (data.themeName) {
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
            let theme;
            if (selectedThemeId === 'custom_theme') {
                theme = {
                    ...THEME_PALETTES.find(p => p.id === 'custom_theme'),
                    settings: customSettings || THEME_PALETTES.find(p => p.id === 'custom_theme').settings
                };
            } else {
                theme = THEME_PALETTES.find(p => p.id === selectedThemeId);
            }

            const payload = {
                themeName: theme.name,
                themeColor: theme.settings['--color-primary'] || theme.colors[0],
                themePalette: JSON.stringify(theme)
            };
            await outletService.updateConfig(payload);
            applyTheme(theme);
            toast.success('Theme updated successfully!');
        } catch (error) {
            console.error('Error saving theme:', error);
            toast.error('Failed to update theme');
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

                        {/* Color Palette Details or Custom Editor */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                {selectedThemeId === 'custom_theme' ? 'Manual Property Customization' : 'Role-Based Palette'}
                            </p>
                            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                                {Object.entries(selectedThemeId === 'custom_theme' ? (customSettings || currentPalette.settings) : (currentPalette.settings || {})).map(([key, val], i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-3">
                                            {selectedThemeId === 'custom_theme' ? (
                                                <input
                                                    type="color"
                                                    value={val}
                                                    onChange={(e) => {
                                                        const newSettings = { ...(customSettings || currentPalette.settings), [key]: e.target.value };
                                                        setCustomSettings(newSettings);
                                                        // Live preview
                                                        document.documentElement.style.setProperty(key, e.target.value);
                                                    }}
                                                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: val }} />
                                            )}
                                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400 lowercase">{key.replace('--', '')}</span>
                                        </div>
                                        {selectedThemeId === 'custom_theme' ? (
                                            <input
                                                type="text"
                                                value={val}
                                                onChange={(e) => {
                                                    const newSettings = { ...(customSettings || currentPalette.settings), [key]: e.target.value };
                                                    setCustomSettings(newSettings);
                                                    document.documentElement.style.setProperty(key, e.target.value);
                                                }}
                                                className="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded w-20 outline-none focus:ring-1 focus:ring-emerald-500"
                                            />
                                        ) : (
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">{val}</span>
                                        )}
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
