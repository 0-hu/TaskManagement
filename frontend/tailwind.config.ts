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
        // Status colors
        status: {
          todo: '#FF4D4D',
          inProgress: '#4D7CFF',
          completed: '#4CAF50',
          onHold: '#9E9E9E',
        },
        // Stat card colors
        stat: {
          total: '#4D7CFF',
          inProgress: '#FFA726',
          completed: '#EC407A',
          scheduled: '#4CAF50',
        },
        // Priority colors
        priority: {
          low: '#4CAF50',
          medium: '#FFA726',
          high: '#FF6B6B',
          urgent: '#D32F2F',
        },
        // UI colors
        ui: {
          background: '#F8F9FA',
          card: '#FFFFFF',
          border: '#E5E7EB',
          text: '#333333',
          textSecondary: '#6B7280',
          primary: '#4D7CFF',
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}

export default config
