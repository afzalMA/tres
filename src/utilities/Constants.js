import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const env = publicRuntimeConfig.APP_ENV;

const prd_test = publicRuntimeConfig.TEST === 'test';

const baseURL =
  env === 'production' && !prd_test
    ? 'https://prod.api.etvbharat.com'
    : env === 'development' || prd_test
    ? 'http://localhost:3000/apis'
    : 'https://staging.api.etvbharat.com';

export const domainUrl =
  env === 'production' && !prd_test
    ? 'https://react2.etvbharat.com'
    : env === 'development' || prd_test
    ? 'http://localhost:3000'
    : 'https://staging.etvbharat.com';

const mAuthToken = env === 'staging' ? 'rss' : 'kmAJAH4RTtqHjgoauC4o';
const authToken = env === 'staging' ? 'rss' : 'xBUKcKnXfngfrqGoF93y';

const Constants = Object.freeze({
  baseURL: baseURL,
  authToken: authToken,
  mAuthToken: mAuthToken,
  appURLs: {
    android:
      'https://play.google.com/store/apps/details?id=com.etvbharat.android',
    ios: 'https://itunes.apple.com/us/app/yourapp/id1453416186',
  },
});

export const accessToken = {
  web:
    env === 'production' || env === 'development'
      ? 'TjeNsXehJqhh2DGJzBY9'
      : 'Fw3196P2FES3HBfytEtn',
  mobile:
    env === 'production' || env === 'staging' || env === 'development'
      ? 'woB1UukKSzZ5aduEUxwt'
      : 's2byd1VP6PN8hYDsb8zj',
};

export const applicationConfig = {
  value: null,
};

export const languageMap = {
  assamese: 'asm',
  bengali: 'bn',
  english: 'en',
  gujarati: 'gu',
  hindi: 'hi',
  kannada: 'kn',
  malayalam: 'ml',
  marathi: 'mr',
  oriya: 'or',
  punjabi: 'pan',
  tamil: 'ta',
  telugu: 'te',
  urdu: 'ur',
};

export const localeSubpaths = {
  asm: 'assamese',
  bn: 'bengali',
  gu: 'gujarati',
  hi: 'hindi',
  kn: 'kannada',
  ml: 'malayalam',
  mr: 'marathi',
  or: 'oriya',
  pan: 'punjabi',
  ur: 'urdu',
  en: 'english',
  te: 'telugu',
  ta: 'tamil',
};

export default Constants;
