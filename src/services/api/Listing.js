import { APIRequest } from '@interfaces/API';

const controller = '';

export default function Catalog(inst) {
  return {
    getListingApiKey({ params, query, config } = new APIRequest()) {
      return inst.get(
        `${controller}/get_list_home_link?${new URLSearchParams(
          query
        )}`,
        config
      );
    },
  };
}
