import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const env = publicRuntimeConfig.APP_ENV;
export default {
  getFooterDetails({ params, query, config } = new APIRequest()) {
    return import('../../static/footer').then((r) => r.default);
  },
  getAppConfig({ params, query, ...config }) {
    if(env === "staging"){
      return import('../../static/stagingAppconfig')
      .then((r) => r.default)
      .catch((e) => {});
    }else{
      return import('../../static/appConfig')
      .then((r) => r.default)
      .catch((e) => {});
    }
    
  },
  
  getAccessToken({ params, query, ...config }) {
    return import('../../static/accessToken')
      .then((r) => r.default)
      .catch((e) => {});
  },
};
