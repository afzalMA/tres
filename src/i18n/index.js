const NextI18Next = require('next-i18next').default;
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig;
const path = require('path');

module.exports = new NextI18Next({
  browserLanguageDetection: false, // <---
  serverLanguageDetection: false, // <-
  defaultLanguage: 'en',
  defaultNS: 'common',
  otherLanguages: [
    'asm',
    'bn',
    'gu',
    'hi',
    'kn',
    'ml',
    'mr',
    'or',
    'pan',
    'ur',
    'en',
    'te',
    'ta',
    'pan',
  ],
  localeSubpaths,
  localePath: path.resolve('./public/assets/locales'),
});
