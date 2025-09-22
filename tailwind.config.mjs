/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
      colors: {
        'cupcake-coral': '#FF6B9D',
        'cupcake-cherry': '#FF8FA3',
        'cupcake-pink': '#FFB3C6',
        'sunshine-400': '#FFD700',
        'sunshine-500': '#FFA500',
        'sunshine-600': '#FF8C00',
      },
      animation: {
        'float-random': 'float 8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(180deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 5px rgba(255, 107, 157, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(255, 107, 157, 0.8)' },
        },
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      dropShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
