module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mbg: 'var(--color-mb-background)',
        hbg: '#031820',
        mhbg: '#052e43',
      },
      fontSize: {
        tiny: '0.9375rem',
      },
      zIndex: {
        '-1': '-1',
        '-10': '-10',
        1000: '1000',
        1100: '1100',
      },
      fontFamily: {
        // english: ['LikhithEnglish'],
      },
      boxShadow: {
        t: '0 -2px 13px rgba(0,0,0,0.2)',
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/line-clamp'),
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
    [
      '@fullhuman/postcss-purgecss',
      {
        content: [
          './pages/**/*.{js,jsx,ts,tsx}',
          './components/**/*.{js,jsx,ts,tsx}',
        ],
        defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: ['html', 'body'],
      },
    ],
  ],
};
