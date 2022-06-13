import axios from 'axios';
import Constants, { accessToken } from '@utils/Constants';
// import toast from '@utils/ToastHelper';
import getConfig from 'next/config';
import { APIRequest } from '@interfaces/API';
const { publicRuntimeConfig } = getConfig();

const CancelToken = axios.CancelToken;
const defaultControllers = [];

const requireComponent = require.context(
  // Look for files in the current directory
  '.',
  // Do not look in subdirectories
  false,
  /[\w]+\.js$/
);

const apis = {};
/* // For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName);
  if (fileName.search(/\.\/(?:(index|API|APIEnum))\.js$/g) === -1) {
    apis[fileName.match(/\.\/(\w+)\.js$/)[1]] =
      componentConfig.default || componentConfig;
  }
}); */

export const apiStatusHandler = (error, hideMessage = false) => {
  let message = '';

  if (error.response) {
    if (error.response.status === 401) {
      message = 'unauthorized';
    }
    if (!hideMessage) {
      // toast.error(message);
    }

    return;
  }

  if (message) {
    //   toast.error(message);
    return true;
  } else {
    return false;
  }
};

class APIError extends Error {
  constructor(message, data) {
    super(message);
    this.name = 'APIError';
    this.data = data;
  }
}

export const accessTokenFetcher = (authToken) => {
  let url =
    Constants.baseURL.indexOf('localhost') != -1
      ? 'https://prod.api.etvbharat.com/'
      : Constants.baseURL;

  url = url + `/access_token?auth_token=${authToken}`;
  return fetch(url, {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'cache-control': 'max-age=0',
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then((response) => response.json());
};

async function errorResponseHandler(error) {
  if (
    error.response &&
    error.response.status === 422 &&
    error.response.data.error &&
    error.response.data.error.message.indexOf('access_token') >= 0
  ) {
    //   Constants.authToken
    const result1 = await accessTokenFetcher(Constants.authToken);
    accessToken.web = result1.data.access_token;

    const result = await accessTokenFetcher(Constants.mAuthToken);
    accessToken.mobile = result.data.access_token;
  }
  // check for errorHandle config
  if (
    error &&
    error.config &&
    error.config.hasOwnProperty('errorHandle') &&
    error.config.errorHandle === false
  ) {
    return Promise.reject(error);
  }
  // if has response show the error
  if (error.response) {
    const handled = apiStatusHandler(error);
    if (!handled) {
      const message = error.response.data ? error.response.data.error_code : '';
      // return Promise.reject(new APIError(message, error.response.data));
      // return Promise.reject(error);
      // throw new APIError(message, error.response.data);
    }
    return Promise.resolve(new APIError(error)); // here it was Promise.resolve
  } else {
    return Promise.reject(error);
  }
}

export default function API(...controllers) {
  let inst = null;
  const requiredServices = {};
  const source = CancelToken.source();

  inst = axios.create({
    baseURL: Constants.baseURL,
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    cancelToken: source.token,
  });

  inst.interceptors.request.use((request) => {
    if (publicRuntimeConfig.APP_ENV !== 'development' && request.suv) {
      request.baseURL = 'https://prod.suv.etvbharat.com';
    } else {
      if (!request.url.startsWith('/access_token')) {
        if (request.url.indexOf('msite') >= 0 || request.isSSR) {
          request.url = `${request.url}&auth_token=${Constants.mAuthToken}&access_token=${accessToken.mobile}`;
        } else {
          request.url = `${request.url}&auth_token=${Constants.authToken}&access_token=${accessToken.web}`;
        }
      }
    }
    return request;
  });

  inst.interceptors.response.use(async (response) => {
    // Do something with response data
    if (response.error != null) {
      await errorResponseHandler(response);
      return Promise.reject(response);
    }
    return response;
  }, errorResponseHandler);

  /* controllers from mounted() method */
  controllers = controllers.concat(defaultControllers);

  if (controllers.length) {
    for (let i = 0; i < controllers.length; i++) {
      const controller = controllers[i];

      if (controller) {
        if (!apis[controller]) {
          const fileContent = require('./' + controller + '.js');
          if (fileContent && fileContent.default) {
            apis[controller] = require('./' + controller + '.js').default;
          }
        }

        requiredServices[controller] = {
          ...apis[controller](inst),
        };
      } else {
        throw new Error(
          `Failed to load api! Given enum of controller - ${controller} doesn't exist`
        );
      }
    }
  }

  return {
    shutdown() {
      source.cancel();
      inst = null;
    },
    getAccessToken({ params, query, ...config } = new APIRequest()) {
      return inst.get(`/access_token?auth_token=${params.auth_token}`, config);
    },
    ...requiredServices,
  };
}

// export const getTokenDetails = async () => {
//   if(typeof window === 'undefined') {
//     fetch('https://staging.api.etvbharat.com/access_token?auth_token=kmAJAH4RTtqHjgoauC4o')
//   }
// }
