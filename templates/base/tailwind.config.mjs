/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:  '#E91E8C',
        accent:   '#FF6B35',
        dark:     '#1A1A2E',
        light:    '#F8F9FA',
        success:  '#28A745',
        muted:    '#6B7280',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        'h1-mob': '28px',
        'h1-desk': '48px',
        'h2-mob': '22px',
        'h2-desk': '36px',
      },
    },
  },
  plugins: [],
}
