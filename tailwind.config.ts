import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:          'var(--bg)',
        surface:     'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border:      'var(--border)',
        text:        'var(--text)',
        muted:       'var(--text-muted)',
        accent:      'var(--accent)',
        success:     'var(--success)',
        error:       'var(--error)',
      },
      fontFamily: {
        cairo:    ['Cairo', 'sans-serif'],
        jakarta:  ['Plus Jakarta Sans', 'sans-serif'],
        mono:     ['Geist Mono', 'monospace'],
        fraunces: ['Fraunces', 'serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
