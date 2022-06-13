import { APIRequest } from '@interfaces/API';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const env = publicRuntimeConfig.APP_ENV;
const controller = '/catalog_lists';

const getProperParam = (params, options) => {
  if (!params && typeof window !== 'undefined') {
    params = {
      state:
        location.pathname.split('/')[1] === 'urdu'
          ? 'urdu'
          : location.pathname.split('/')[2],
    };
  }

  return params &&
    params.state &&
    (options.exclude || ['national', 'kerala', 'odisha']).indexOf(
      params.state
    ) === -1
    ? '-' + params.state
    : '';
};

export default function CatalogList(inst) {
  return {
    getArticleDetails({ params, query, config } = new APIRequest()) {
      config = config || {};
      return inst.get(
        `${controller}/${
          config['isSSR'] ? '' : 'web-'
        }news-details${getProperParam(params, {
          exclude: !config['isSSR'] ? ['national'] : null,
        })}.gzip?${new URLSearchParams(query)}`,
        config
      );
    },
    getSkyScaperAds({query,config} = new APIRequest()) {
      return inst.get(
        `/native_ads?${new URLSearchParams(query)}`,
        config
      );
    },
    getVideoDetails({ params, query, config } = new APIRequest()) {
      config = config || {};
      return inst.get(
        `${controller}/${
          config['isSSR'] ? 'video-details' : params.suffix
        }.gzip?${new URLSearchParams(query)}`,
        config
      );
    },
    getRelatedArticles({ params, query, config } = new APIRequest()) {
      return inst.get(
        `/get_related_articles.gzip?${new URLSearchParams(query)}`,
        config
      );
    },
    getMenuDetails({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/${params.suffix}${getProperParam(
          params
        )}.gzip?${new URLSearchParams({ ...query /* , env: 'staging' */ })}`,
        config
      );
    },
    getSubMenuDetails({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/${params.key}.gzip?${new URLSearchParams(query)}`,
        config
      );
    },
    getListing({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/${params.key}.gzip?${new URLSearchParams(query)}`,
        config
      );
    },
    getSearchResults({ query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/search-page-list?${new URLSearchParams(query)}`,
        config
      );
    },

    // https://prod.api.etvbharat.com/catalog_lists/app-new-headlines-district-carousel1-andhra-pradesh?item_languages=te&auth_token=kmAJAH4RTtqHjgoauC4o&region=IN&response=r2&access_token=woB1UukKSzZ5aduEUxwt&dynamic_district=chittoor&portal_state=ap
    getDistrictNews({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/app-new-headlines-district-carousel1-${
          params.state
        }?${new URLSearchParams(query)}`
      );
    },

    getSearchdata({param,query, config} = new APIRequest()){
      return inst.get(
        `${controller}/${param}?${new URLSearchParams(query)}`,
        config
      );
    },
  };
}
