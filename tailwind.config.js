/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                secondary: {
                    DEFAULT: '#22d3ee',
                    light: '#67e8f9',
                    dark: '#06b6d4',
                },
                success: {
                    DEFAULT: '#10b981',
                    light: '#34d399',
                },
                warning: {
                    DEFAULT: '#f59e0b',
                    light: '#fbbf24',
                },
                danger: {
                    DEFAULT: '#ef4444',
                    light: '#f87171',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
