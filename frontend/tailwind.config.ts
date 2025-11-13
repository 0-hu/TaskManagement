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
          background: '#F5F5F5',
          card: '#FFFFFF',
          border: '#E0E0E0',
          text: '#424242',
          textSecondary: '#616161',
          primary: '#4D7CFF',
        },
      },
    },
  },
  plugins: [],
}

export default config
