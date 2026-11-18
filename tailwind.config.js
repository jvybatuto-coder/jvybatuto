/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Values live in index.css (:root = dark, [data-theme='light'] = light) so the theme can switch at runtime.
      colors: {
        ink: {
          950: 'rgb(var(--ink-950) / <alpha-value>)',
          900: 'rgb(var(--ink-900) / <alpha-value>)',
          850: 'rgb(var(--ink-850) / <alpha-value>)',
          800: 'rgb(var(--ink-800) / <alpha-value>)',
          700: 'rgb(var(--ink-700) / <alpha-value>)',
          600: 'rgb(var(--ink-600) / <alpha-value>)',
          500: 'rgb(var(--ink-500) / <alpha-value>)',
        },
        crimson: {
          DEFAULT: 'rgb(var(--crimson) / <alpha-value>)',
          light: 'rgb(var(--crimson-light) / <alpha-value>)',
          dark: 'rgb(var(--crimson-dark) / <alpha-value>)',
        },
        mist: {
          100: 'rgb(var(--mist-100) / <alpha-value>)',
          300: 'rgb(var(--mist-300) / <alpha-value>)',
          400: 'rgb(var(--mist-400) / <alpha-value>)',
          500: 'rgb(var(--mist-500) / <alpha-value>)',
          600: 'rgb(var(--mist-600) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        /** Formal serif used by the resume. */
        serif: ['"Source Serif 4"', 'Georgia', '"Times New Roman"', 'serif'],
      },
      maxWidth: { site: '1200px' },
      letterSpacing: { label: '0.22em' },
    },
  },
  plugins: [],
}
