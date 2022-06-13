import { APIRequest } from '@interfaces/API';
import { domainUrl } from '@utils/Constants';

const controller = '/catalogs';

export default function Catalog(inst) {
  return {
    getLanguages({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/city-state/items/india/languages?${new URLSearchParams(
          query
        )}`,
        config
      );
    },
    getListingPageStates({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/city-state/states?${new URLSearchParams(query)}`,
        config
      );
    },
    getCityDistrictData({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/city-state/items/india/states/${
          params.key
        }?${new URLSearchParams(query)}`,
        config
      );
    },
    getPageAds({ params, query, config } = new APIRequest()) {
      return inst.get(`/page_ads?${new URLSearchParams(query)}`, config);
    },
    getDistricts({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/city-state/items/india/states/${
          params.state
        }/districts?${new URLSearchParams(query)}`,
        config
      );
    },
  };
}
