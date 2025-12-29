import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState({
        themeColor: '#10b981',
        themeName: 'Emerald',
        palette: ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0']
    });

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
                const res = await axios.get(`${API_URL}/config/outlet`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data?.data) {
                    const data = res.data.data;
                    let palette = ['#10b981', '#059669', '#34d399', '#6ee7b7', '#a7f3d0'];
                    if (data.themePalette) {
                        try {
                            palette = JSON.parse(data.themePalette);
                        } catch (e) {
                            console.error('Failed to parse palette', e);
                        }
                    } else if (data.themeColor) {
                        palette = [data.themeColor, data.themeColor, data.themeColor, data.themeColor, data.themeColor];
                    }

                    const newTheme = {
                        themeColor: data.themeColor || '#10b981',
                        themeName: data.themeName || 'Emerald',
                        palette: palette
                    };
                    setTheme(newTheme);
                    applyTheme(newTheme.palette);
                }
            } catch (error) {
                console.error('Error fetching theme:', error);
            }
        };

        fetchTheme();
    }, []);

    const applyTheme = (themeData) => {
        const root = document.documentElement;

        // Support granular pro settings
        if (themeData.settings) {
            Object.entries(themeData.settings).forEach(([key, value]) => {
                root.style.setProperty(key, value);
            });
            return;
        }

        // Fallback for color arrays (old format)
        if (Array.isArray(themeData)) {
            root.style.setProperty('--color-primary', themeData[0]);
            root.style.setProperty('--bg-sidebar', themeData[1]);
            root.style.setProperty('--bg-main', themeData[2]);
            return;
        }

        const colors = themeData.palette || themeData.colors; // Changed from themeData.colors to themeData.palette

        if (themeData.id === 'emerald_slate') {
            root.style.setProperty('--bg-main', '#F8FAFC');
            root.style.setProperty('--bg-surface', '#FFFFFF');
            root.style.setProperty('--bg-sidebar', '#0F172A');
            root.style.setProperty('--bg-header', '#FFFFFF');
            root.style.setProperty('--text-main', '#1E293B');
            root.style.setProperty('--text-muted', '#64748B');
            root.style.setProperty('--color-primary', '#10B981');
            root.style.setProperty('--color-primary-hover', '#059669');
            root.style.setProperty('--color-secondary', '#64748B');
            root.style.setProperty('--status-success', '#22C55E');
            root.style.setProperty('--status-warning', '#F59E0B');
            root.style.setProperty('--status-error', '#EF4444');
            root.style.setProperty('--sidebar-active', 'rgba(16, 185, 129, 0.1)');
            root.style.setProperty('--sidebar-active-text', '#10B981');
            root.style.setProperty('--sidebar-text', '#94A3B8');
            root.style.setProperty('--border-color', '#E2E8F0');
        } else if (themeData.id === 'midnight_emerald') {
            root.style.setProperty('--bg-main', '#0F172A');
            root.style.setProperty('--bg-surface', '#1E293B');
            root.style.setProperty('--bg-sidebar', '#020617');
            root.style.setProperty('--bg-header', '#0F172A');
            root.style.setProperty('--text-main', '#F8FAFC');
            root.style.setProperty('--text-muted', '#94A3B8');
            root.style.setProperty('--color-primary', '#34D399');
            root.style.setProperty('--color-primary-hover', '#10B981');
            root.style.setProperty('--color-secondary', '#64748B');
            root.style.setProperty('--status-success', '#22C55E');
            root.style.setProperty('--status-warning', '#F59E0B');
            root.style.setProperty('--status-error', '#EF4444');
            root.style.setProperty('--sidebar-active', 'rgba(52, 211, 153, 0.1)');
            root.style.setProperty('--sidebar-active-text', '#34D399');
            root.style.setProperty('--sidebar-text', '#94A3B8');
            root.style.setProperty('--border-color', '#334155');
        } else if (colors) {
            // Fallback for custom palettes or older formats
            root.style.setProperty('--color-primary', colors[0]);
            root.style.setProperty('--bg-sidebar', colors[1]);
            root.style.setProperty('--bg-main', colors[2]);
            root.style.setProperty('--text-main', colors[1]); // This might need adjustment based on desired text color
            root.style.setProperty('--color-primary-hover', colors[0]);
            root.style.setProperty('--bg-surface', '#FFFFFF'); // Default for custom
            root.style.setProperty('--sidebar-active-text', colors[0]);

            // Clear old variables if they exist
            root.style.removeProperty('--brand-color');
            root.style.removeProperty('--brand-secondary');
            root.style.removeProperty('--bg-accent');
            root.style.removeProperty('--text-accent');
            root.style.removeProperty('--border-accent');
            root.style.removeProperty('--pos-cat-active');
            root.style.removeProperty('--active-bg');
        }
    };

    return (
        <ThemeContext.Provider value={{ ...theme, refreshTheme: () => { } }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
