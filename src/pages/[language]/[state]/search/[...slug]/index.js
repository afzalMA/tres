import { useRouter } from 'next/router';
import Search from '@components/search/Search';
import API from '@api/API';
import APIEnum from '@api/APIEnum';
import Head from 'next/head';
import { trackPromise } from 'react-promise-tracker';
import { stateCodeConverter } from '@utils/Helpers';
import { languageMap } from '@utils/Constants';
import {fetchMenuData} from '@utils/MenuData';

const slug = ({ data, payload, dropDownData, userAgent }) => {
  return (
    <>
      <Head>
        <title>ETV Bharat</title>
      </Head>
      <Search
        key={payload.q}
        data={data}
        requestBody={payload}
        listdata={dropDownData}
        userAgent={userAgent}
      ></Search>
    </>
  );
};

slug.getInitialProps = async ({ query, req, res, ...args }) => {
  const url = args.asPath;

  const urlSplit = url.split('/');
  const language = languageMap[urlSplit[1]];
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const state = stateCodeConverter(urlSplit[2]);
  const searchString = url.split('/');
  const api = API(APIEnum.Listing, APIEnum.CatalogList, APIEnum.Catalog);
  let headerData = await    fetchMenuData(api,urlSplit,language,state);
  const params = {
    page: 0,
    page_size: 45,
    version: 'v2',
    response: 'r2',
    item_languages: language,
    portal_state: state,
    q: decodeURI(searchString[searchString.length - 1]),
    state: state,
  };
  const response = await trackPromise(
    api.CatalogList.getSearchResults({ query: params })
  );
  let key = undefined;
  for (var i = 0; i < response.data.data.catalog_list_items.length; i++) {
    let article = response.data.data.catalog_list_items[i];
    if (article.total_items_count > 0 && !key) {
      key = article.friendly_id;
    }
  }

  if (!key) {
    key = response.data.data.catalog_list_items[0].friendly_id;
  }
  const initialresponse = await trackPromise(
    api.CatalogList.getSearchdata({ query: params, param: key })
  );

  // const redirectUrl = `https://old.etvbharat.com${url}`;
  // if (res) {
  //   res.writeHead(302, { Location: `https://old.etvbharat.com${url}` }).end();
  // } else {
  //   window.location = redirectUrl;
  // }
  return {
    payload: params,
    data: response.data,
    pageType: 'search',
    dropDownData: initialresponse.data,
    userAgent: userAgent,
    headerData:headerData
    
  };

  return {};
};

export default slug;
