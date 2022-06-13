import FileFetcher from '@services/api/FileFetcher';


export const fetchMenuData = async (api, urlSplit, language, state) => {
  //console.log(urlSplit)
  const urlSuffix = urlSplit[1] == 'urdu' ? '-urdu' : '';
  const headerResp = await api.CatalogList.getMenuDetails({
    params: {
      suffix: `msite-new-left-menu${
        urlSplit[2] !== 'national' ? '-' + urlSplit[2] : urlSuffix
      }`,
    },
    query: {
      region: 'IN',
      response: 'r2',
      item_languages: language,
      portal_state: state,
      only_items: 'catalog_list',
      //  env: 'staging',
    },
    isSSR: true,
  });
  const footer = {};

  const result = await FileFetcher.getFooterDetails({
    query: {
      region: 'IN',
      response: 'r2',
      item_languages: language,
      // env: 'staging',
    },
  });
  const requiredData = result.data.data.params_hash2.footer;
  let languageData = {};
  requiredData.forEach((state) => {
    state.item_languages.forEach((language) => {
      languageData[language] = languageData[language] || [];
      if (state.state) {
        if (state.state === 'tamilnadu') {
          state.state = 'tamil-nadu';
        } else if (state.state === 'orissa') {
          state.state = 'odisha';
        } else if (state.state === 'maharastra') {
          state.state = 'maharashtra';
        } else if (state.state === 'Assam') {
          state.state = 'assam';
        } else if (state.state === 'tripura') {
        }
        state.display_title = state.display_title.replace(' ETV', '');
        if (state.state !== 'tripura') {
          languageData[language].push(state);
        }
      }
    });
  });
  languageData = Object.keys(languageData)
    .sort()
    .reduce((a, c) => ((a[c] = languageData[c]), a), {});
  footer.languages = languageData;
  footer.required = requiredData;
  
  let hdata;
  if(headerResp.data !== undefined){
     hdata = {
      footer: footer,
      header: {
        menu: {
          desktop: headerResp.data.data.catalog_list_items,
          mobile: headerResp.data.data.catalog_list_items,
        },
        languages: languageData,
      },
      language: language,
      state:state,
      keystate:urlSplit[2],
    };
  }else{
    hdata = undefined;
  }
  
   
  return hdata;
};
