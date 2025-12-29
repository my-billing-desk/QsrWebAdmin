import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(null);

    const applyTheme = useCallback((themeData) => {
        if (!themeData || !themeData.admin) return;

        const root = document.documentElement;
        const adminTheme = themeData.admin;

        // Map theme keys to CSS variables
        const variableMap = {
            'background': '--bg-main',
            'sidebar': '--sidebar-bg',
            'sidebar_text': '--sidebar-text',
            'sidebar_active': '--sidebar-active',
            'sidebar_active_text': '--sidebar-active-text',
            'header': '--header-bg',
            'header_text': '--header-text',
            'card': '--card-bg',
            'primary_button': '--primary-btn-bg',
            'primary_button_text': '--primary-btn-text',
            'secondary_button': '--secondary-btn-bg',
            'secondary_button_text': '--secondary-btn-text',
            'text_main': '--text-main',
            'text_muted': '--text-muted',
            'border_color': '--border-color',
            'input_background': '--input-bg'
        };

        Object.entries(variableMap).forEach(([key, varName]) => {
            if (adminTheme[key]) {
                root.style.setProperty(varName, adminTheme[key]);
            }
        });
    }, []);

    const fetchTheme = async () => {
        try {
            // Get token from localStorage if using AuthProvider context is not easy here
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await axios.get(`${API_URL}/settings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.theme_config) {
                const themeData = JSON.parse(res.data.theme_config);
                setTheme(themeData);
                applyTheme(themeData);
            }
        } catch (error) {
            console.error('Failed to fetch theme', error);
        }
    };

    useEffect(() => {
        fetchTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, refreshTheme: fetchTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
