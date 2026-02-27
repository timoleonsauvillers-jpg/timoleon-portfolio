/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAFA',
        foreground: '#1A1A1A',
        muted: '#9A9A9A',
        border: '#E5E5E5',
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'nav': ['0.8125rem', { letterSpacing: '0.01em', lineHeight: '1.5' }],
        'body': ['0.75rem', { lineHeight: '1.6' }],
        'project-title': ['0.75rem', { letterSpacing: '0.01em', lineHeight: '1.5' }],
        'project-number': ['0.75rem', { letterSpacing: '0.01em', lineHeight: '1.5' }],
        'heading': ['1.25rem', { letterSpacing: '-0.01em', lineHeight: '1.3' }],
      },
      screens: {
        'md': '768px',
      },
      spacing: {
        'nav-height': '35px',
        'footer-height': '30px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'snap': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
