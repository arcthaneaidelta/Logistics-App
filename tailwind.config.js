/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14213D',
          hover: '#1C2C4F',
          light: '#22325A',
        },
        secondary: {
          DEFAULT: '#4A5568',
        },
        accent: {
          DEFAULT: '#D97B3D',
          hover: '#C56A2E',
          tint: '#FBF0E8',
          subtle: 'rgba(217, 123, 61, 0.12)',
        },
        background: '#FAF9F6',
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F3F1EC',
          hover: 'rgba(23, 26, 31, 0.04)',
          active: 'rgba(23, 26, 31, 0.08)',
        },
        text: {
          primary: '#171A1F',
          secondary: '#565C66',
          muted: '#8B909B',
        },
        border: {
          DEFAULT: '#E5E2DA',
          strong: '#CFCBC0',
        },
        success: {
          DEFAULT: '#2E7D5B',
          light: '#EAF4EE',
        },
        warning: {
          DEFAULT: '#C98A2E',
          light: '#FBF4E7',
        },
        error: {
          DEFAULT: '#C44536',
          light: '#FAEBEA',
        },
        info: {
          DEFAULT: '#3B6E91',
          light: '#EAF2F7',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(23, 26, 31, 0.04)',
        'md': '0 6px 16px rgba(23, 26, 31, 0.06)',
        'lg': '0 16px 40px rgba(23, 26, 31, 0.10)',
        'float': '0 20px 48px rgba(20, 33, 61, 0.12)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'soft': 'cubic-bezier(0.45, 0, 0.55, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
