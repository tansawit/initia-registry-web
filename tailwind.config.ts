import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e6',
          200: '#c2c5cb',
          300: '#9ca1ab',
          400: '#767d8a',
          500: '#5c6270',
          600: '#434959',
          700: '#363c4a',
          800: '#24282f',
          900: '#1a1d23',
          950: '#0f1115',
        },
      },
    },
  },
  plugins: [],
}

export default config
