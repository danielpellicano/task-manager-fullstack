// tailwind.config.ts ou .js
export default {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
          colors: {
            primary: {
              50: '#eff6ff',
              100: '#dbeafe',
              200: '#bfdbfe',
              300: '#93c5fd',
              400: '#60a5fa',
              500: '#3b82f6',
              600: '#2563eb', // ← esse é rgb(37 99 235)
              700: '#1d4ed8',
              800: '#1e40af',
              900: '#1e3a8a',
            },
          },
        },
      },
    plugins: [],
  }
  