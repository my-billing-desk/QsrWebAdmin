/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Force light mode by default (since 'dark' class isn't added)
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            colors: {
                // Mapping semantic names to CSS Variables
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    hover: 'var(--color-primary-hover)',
                    shade: 'var(--color-primary-shade, var(--color-primary))',
                },
                secondary: 'var(--color-secondary)',
                main: 'var(--bg-main)',
                surface: 'var(--bg-surface)',
                sidebar: {
                    DEFAULT: 'var(--bg-sidebar)',
                    active: 'var(--sidebar-active)',
                    'active-text': 'var(--sidebar-active-text)',
                    text: 'var(--sidebar-text)',
                },
                header: 'var(--bg-header)',
                border: 'var(--border-color)',
                status: {
                    success: 'var(--status-success)',
                    warning: 'var(--status-warning)',
                    error: 'var(--status-error)',
                    info: 'var(--status-info)',
                }
            },
            boxShadow: {
                'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                'glow': '0 0 15px rgba(220, 38, 38, 0.3)',
            }
        },
    },
    plugins: [],
}
