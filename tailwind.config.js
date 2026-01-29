/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#0055b7',      // Primary blue
          'primary-hover': '#1276c0', // Brand accent (hover state)
          secondary: '#cce9fb',     // Brand secondary background
        },
        // Gray Scale
        gray: {
          '50': '#fafbfb',          // bg-general-secondary
          '100': '#f6f6f7',         // Hover states
          '200': '#d2d3d6',         // border-general-default
          '400': '#949494',         // Placeholder text
          '700': '#4d4f5c',         // text-label-default, text-body-default
        },
        // Semantic Colors
        general: {
          primary: '#ffffff',       // bg-general-primary
          secondary: '#fafbfb',     // bg-general-secondary
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'default': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'footer': '0 -1px 4px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'sm': '8px',  // radius-sm from Figma
        'md': '12px',
        'lg': '16px',
      },
      maxWidth: {
        'question': '720px',  // Max width for question container to prevent text stretching
      },
    },
  },
  plugins: [],
}