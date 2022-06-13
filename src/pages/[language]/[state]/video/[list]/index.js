import React from 'react';
import { NextSeo } from 'next-seo';
import { trackPromise } from 'react-promise-tracker';
import cacheData from 'memory-cache';
import API from '@api/API';
import APIEnum from '@api/APIEnum';
import Head from 'next/head';
import { getAmpUrl, stateCodeConverter } from '@utils/Helpers';
import { languageMap } from '@utils/Constants';
import { useRouter } from 'next/router';
import useTranslator from '@hooks/useTranslator';
import Error from 'next/error';
import PageListing, { totalItemsCount } from '@components/listing/PageListing';
import {fetchMenuData} from '@utils/MenuData';
const slug = ({ data, initCount, pageType, id, payload, dropDownData }) => {
  const router = useRouter();
  const { appLanguage } = useTranslator();

  if (router.isFallback) {
    return <h2 className="loading"></h2>;
  }

  let ampExists = null;
  if (id) {
    const match = id.match(/(\d+)/);
    if (match) {
      ampExists = +match[0].slice(0, 12) >= 202102120000;
    }
  }
  let readwhere = false;

  const splitPath = router.asPath.split('/');
  const state = splitPath[2];
  if (
    state === 'uttar-pradesh' ||
    (state === 'national' && splitPath[1] !== 'urdu')
  ) {
    ampExists = true;
    readwhere = true;
  }

  const getComponent = () => {
    let stateName = null;
    let canonicalUrl = '';

    if (pageType === 'error') {
      return <div>URL Not Found</div>;
    } else if (pageType === 'redirect') {
      return null;
    }

    const pathname = new URL(`http:localhost:3000${router.asPath}`).pathname;
    const splitPath = pathname.split('/');

    if (stateName) {
      canonicalUrl = `https://www.etvbharat.com${[
        ...splitPath.slice(0, 2),
        stateName,
        ...splitPath.slice(3),
      ].join('/')}`;
    } else {
      canonicalUrl = `https://www.etvbharat.com${pathname}`;
    }
    let ampUrl = '';
    const state = splitPath[2];
    if (
      state === 'uttar-pradesh' ||
      (state === 'national' && splitPath[1] !== 'urdu')
    ) {
      ampUrl = getAmpUrl(canonicalUrl, splitPath.length === 3);
    }

    switch (pageType) {
      case 'navlisting':
        let item = data.catalog_list_items[0];
        if (item.meta_tag_keywords && item.meta_tag_keywords.length === 0) {
          item = data;
        }
        return (
          <>
            <Head>
              <title>
                {item.meta_tag_title !== '' &&
                !item.meta_tag_title.includes('canonical tag')
                  ? item.meta_tag_title
                  : 'ETV Bharat'}
              </title>
              <link rel="canonical" href={canonicalUrl}></link>
            </Head>

            <NextSeo
              title={
                item.meta_tag_title !== '' &&
                !item.meta_tag_title.includes('canonical tag')
                  ? item.meta_tag_title
                  : 'ETV Bharat'
              }
              description={item.meta_tag_description}
              additionalMetaTags={[
                {
                  name: 'keywords',
                  content: item.meta_tag_keywords
                    ? item.meta_tag_keywords.join(', ')
                    : '',
                },
              ]}
              openGraph={{
                site_name: 'ETV Bharat News',
                url: `https://www.etvbharat.com${pathname}`,
                type: 'article',
                title: item.meta_tag_title,
                description: item.meta_tag_description,
                images: [
                  {
                    url: `https://www.etvbharat.com/assets/logos/${appLanguage.name}.png`,
                    width: 200,
                    height: 200,
                    alt: 'ETV Bharat News',
                  },
                ],
              }}
              twitter={{
                handle: '@etvbharat',
                site: '@etvbharat',
                cardType: 'summary_large_image',
              }}
            />
            <PageListing
              key={canonicalUrl}
              canonicalUrl={canonicalUrl}
              item={item}
              data={data}
              initCount={initCount}
              payload={payload}
              dropdown={dropDownData}
            ></PageListing>
          </>
        );
      case 'redirect':
        return null;
      default:
        return <></>;
    }
  };

  return (
    <>
      {data ? (
        getComponent()
      ) : (
        <div className={'not-found'}>
          <Error statusCode={404}></Error>
        </div>
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params, ...args }) {
 
  const url = `/${params.language}/${params.state}/video/${params.list}`;
  const language = languageMap[params.language];
  const state = stateCodeConverter(params.state);
  const api = API(APIEnum.Listing, APIEnum.CatalogList,  APIEnum.Catalog);
  const urlSplit = url.split('/');
 let headerData = await    fetchMenuData(api,urlSplit,language,state);

  if (/[ `!@#%^&*()_+\=\[\]{};':"\\|,.<>~]/gi.test(url) || headerData === undefined) {
    return {
      notFound: true,
     
    };
  }

 
  if (
    url.includes('state') ||
    url.substring(url.length - 'state'.length) == 'state' ||
    url.includes('bharat') ||
    url.includes('crime') ||
    url.includes('video') ||
    url.includes('gallery') ||
    url.includes('city') ||
    url.includes('district') ||
    url.includes('sitara') ||
    url.includes('entertainment') ||
    url.includes('film-and-tv') ||
    url.includes('international') ||
    url.includes('business') ||
    url.includes('champion') ||
    url.includes('science-and-technology') ||
    url.includes('sukhibhava') ||
    url.includes('opinion') ||
    url.includes('sports') || true
  ) {
    const response = await api.Listing.getListingApiKey({
      query: {
        app: 'msite',
        url: url,
      },
    }).catch((e) => {
      // console.log(e);
      return {
        data: null,
      };
    });
    const result = response.data;

    if (!result) {
      return {
        notFound: true,
        revalidate: 60, // listing
       
      };
    }

    let finalDataObj = {
      title: '',
      data: [],
    };
    let dropDownData = undefined;
    if (
      (url.includes('state') ||
        url.includes('city') ||
        url.includes('district')) &&
      !url.includes('video')
    ) {
      let otherStates = '';
      if (
        url.includes('english') ||
        (urlSplit[1] === 'urdu' && params.state === 'national')
      ) {
        otherStates = 'yes';
      }
      const cityParam = url.includes('city')
        ? urlSplit[2] + '/cities'
        : urlSplit[2] + '/districts';
      const statePayload = {
        query: {
          response: 'r2',
          item_languages: language,
          region: 'IN',
          other_states: otherStates,
        },
      };

      const cityDistrictPayload = {
        params: {
          key: cityParam,
        },
        query: {
          response: 'r2',
          item_languages: language,
          region: 'IN',
        },
      };

      if (url.includes('state')) {
        const data = cacheData.get(urlSplit[1] + urlSplit[2]);
        finalDataObj.type = 'state';
        if (data) {
          dropDownData = data;
        } else {
          const response = await trackPromise(
            api.Catalog.getListingPageStates(statePayload)
          );

          if (response && response.data && response.data.data) {
            dropDownData = response.data.data.items;
            if (dropDownData.length > 0) {
              cacheData.put(
                urlSplit[1] + urlSplit[2],
                dropDownData,
                10 * 1000 * 60 * 60
              );
            }
          } else {
            console.log('h3r3');
          }
        }
      } else {
        let type = url.includes('city') ? 'city' : 'district';
        let finalurl = url;

        if (url.substring(url.length - type.length) !== type) {
          finalurl = url.substr(0, url.lastIndexOf('/'));
        }

        finalDataObj.type = type;
        finalDataObj.url = finalurl;
        const data = cacheData.get(urlSplit[1] + urlSplit[2] + urlSplit[3]);
        //  console.log('cache', urlSplit[1] + urlSplit[2]+urlSplit[3]);
        if (data) {
          dropDownData = data;
        } else {
          const response = await trackPromise(
            api.Catalog.getCityDistrictData(cityDistrictPayload)
          );

          if (response && response.data && response.data.data) {
            dropDownData = response.data.data.items;
            if (dropDownData.length > 0) {
              cacheData.put(
                urlSplit[1] + urlSplit[2] + urlSplit[3],
                dropDownData,
                10 * 1000 * 60 * 60
              );
            }
          } else {
            console.log('h3r3');
          }
        }
      }
      let selectedValue = '';

      const state = urlSplit[4] || urlSplit[2];
      const titleobj = dropDownData.filter((item) => state == item.friendly_id);

      if (titleobj.length > 0) {
        selectedValue = titleobj[0].ml_title[0].text;
      } else {
        selectedValue = dropDownData[0].ml_title[0].text;
      }

      if (language == 'en' && !selectedValue) {
        if (url.includes('state')) {
          selectedValue = 'Delhi';
        }
      }

      finalDataObj.data = dropDownData;
      finalDataObj.title = selectedValue;
    }

    const params = {
      collective_ads_count: 0,
      page: 0,
      page_size: 4,
      version: 'v2',
      response: 'r2',
      item_languages: language,
      portal_state: state,
    };

    if (result) {
      var finalQueryParamObject = {};
      for (var i = 0; i < result.query_params.length; i++) {
        finalQueryParamObject = Object.assign(
          {},
          finalQueryParamObject,
          result.query_params[i]
        );
      }

      if (
        url.includes('city') &&
        Object.keys(finalQueryParamObject).length === 0
      ) {
        finalQueryParamObject.dynamic_city = dropDownData[0].friendly_id;
      }
      if (
        url.includes('district') &&
        Object.keys(finalQueryParamObject).length === 0
      ) {
        finalQueryParamObject.dynamic_district = dropDownData[0].friendly_id;
      }
      if (
        url.includes('state') &&
        Object.keys(finalQueryParamObject).length === 0
      ) {
        finalQueryParamObject.dynamic_state = 'dl';
      }
      const requestPayload = {
        params: {
          key: result.home_link,
        },
        query: Object.assign({}, params, finalQueryParamObject),
      };

      const listingResp = await trackPromise(
        api.CatalogList.getListing(requestPayload)
      );
      if (listingResp && listingResp.data && listingResp.data.data) {
        const data = listingResp.data.data;
        let initCount = 0;
        try {
          initCount = totalItemsCount(data.catalog_list_items);
        } catch (e) {
          initCount = 0;
        }

        if (initCount) {
          return {
            props: {
              pageType: 'navlisting',
              data: data,
              initCount: initCount,
              payload: requestPayload,
              dropDownData: finalDataObj,
              headerData:headerData
            },
            revalidate: 60, // listing
          };
        }
      }

      return {
        notFound: true,
        revalidate: 60, // listing
        
      };

      //console.log(data);
    } else {
      console.log('here');
    }
  } else {
    return {
      redirect: {
        destination: params
          ? `/${params.language}/${params.state}`
          : `/english/national`,
        permanent: false,
      },
    };
  }
}
export default slug;
