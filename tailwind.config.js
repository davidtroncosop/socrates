/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f0f0ee',
        surface: '#EDEDED',
      },
      fontSize: {
        'badge': ['11.5px', { lineHeight: '1rem' }],
        'label': ['12px', { lineHeight: '1.15rem' }],
        'body': ['13px', { lineHeight: '1.25rem' }],
        'nav': ['14px', { lineHeight: '1.3rem' }],
        'title': ['1.5rem', { lineHeight: '1.15' }],
        'title-lg': ['1.75rem', { lineHeight: '1.15' }],
      }
    },
  },
  plugins: [],
}
