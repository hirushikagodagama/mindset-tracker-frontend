/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d0f14',
        bg2: '#13151c',
        bg3: '#1a1d27',
        bg4: '#20242f',
        accent: '#5c6ef8',
        accent2: '#3ecf8e',
        accent3: '#f5a623',
        danger: '#e84343',
        purple: '#9b6ef5',
        teal: '#3ecfcf',
        txt: '#e8eaf0',
        txt2: '#8b8fa8',
        txt3: '#555970',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        sm: '8px',
      },
    },
  },
  plugins: [],
};
