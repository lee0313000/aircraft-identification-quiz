import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        aviation: {
          navy: '#071d36',
          blue: '#0b3a63',
          sky: '#8ecae6',
          mist: '#dfeaf6',
          orange: '#f8a94b',
          slate: '#1a2a3a'
        }
      },
      boxShadow: {
        panel: '0 18px 40px rgba(7, 29, 54, 0.2)'
      },
      backgroundImage: {
        radar: 'radial-gradient(circle at center, rgba(142,202,230,0.18), rgba(11,58,99,0.15) 40%, rgba(7,29,54,0.7) 100%)'
      }
    }
  },
  plugins: []
};

export default config;
