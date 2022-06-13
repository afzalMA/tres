import useSWR from 'swr';
import React, { useContext, useEffect, useState } from 'react';
import Sticky from 'wil-react-sticky';
import dynamic from 'next/dynamic';
import { DFPSlotsProvider, AdSlot } from 'react-dfp';
import { Media, MediaContextProvider } from '@media';
import API from '@api/API';
import APIEnum from '@api/APIEnum';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { menuClick } from '@utils/GoogleTagManager';
import useTranslator from '@hooks/useTranslator';
import NativeAd from '@components/article/NativeAd'
import MobileAd from '@components/article/MobileAd'
import {Adsense} from '@ctrl/react-adsense';
import SkyScaper from '@components/article/SkyScaper'
import RectangleCard from '@components/listing/mobile/RectangleCard';
import NavLink from '@components/common/NavLink';
import Loading from './mobile/Loading';
import { stateCodeConverter } from '@utils/Helpers';
import MainArticles from './MainArticles';
import MobileMainArticles from './mobile/MobileMainArticles';
import { RTLContext } from '@components/layout/Layout';

const options = {
  loading: () => <div>Loading....</div>,
};
const AdContainer = dynamic(
  () => import('@components/article/AdContainer'),
  options
);
const DesktopAdContainer = dynamic(
  () => import('@components/article/DesktopAdContainer'),
  options
);
const SliderSeeAll = dynamic(() => import('./mobile/SliderSeeAll'), options);
const SeeAll = dynamic(() => import('./mobile/SeeAll'), options);

const ListContainer = ({ children, data, payload,adinfo }) => {
  const api = API(APIEnum.CatalogList);
  const isRTL = useContext(RTLContext);

  const { t } = useTranslator();
  let totalCalls = Math.ceil(data.total_items_count / 8);

  const reArrangeData = (data) => {
    return data.catalog_list_items;
  };
  const [isDesktop, setIsDesktop] = useState(false);

  const items = reArrangeData(data);
  const [listItems, setListItems] = useState(items);
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);
  const [callsDone, setCallsDone] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  const [filteredRHS, setFilteredRHS] = useState([]);
  const adsMap = [];
  const [firstSet, setFirstSet] = useState([]);

  const relatedArticlesFetcher = (...args) => {
    const [apiEnum, methodName, contentId, language] = args;
    return api[apiEnum][methodName]({
      query: {
        // region: country,
        response: methodName === 'getArticleDetails' ? 'r2' : 'r1',
        item_languages: language,
        page: 0,
        page_size: 10,
        content_id: contentId,
        gallery_ad: true,
        scroll_no: 0,
        // portal_state: english,
        state: stateCodeConverter(location.pathname.split('/')[2]),
      },
    }).then((res) => {
      return res.data.data;
    });
  };
  const { data: adData, error: adError } = useSWR(
    () => {
      let article = null;
      if (data && data.catalog_list_items && data.catalog_list_items[1]) {
        article = data.catalog_list_items[1].catalog_list_items.find(
          (v) => v.content_type === 'article'
        );
      }
      return article
        ? [
            'CatalogList',
            'getArticleDetails',
            article.content_id,
            article.item_languages[0],
          ]
        : null;
    },

    relatedArticlesFetcher,
    { dedupingInterval: 5 * 60 * 1000 }
  );

  useEffect(() => {
    // setListItems(reArrangeData(data));
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const { googletag } = window;

      setTimeout(() => {
        setIsDesktop(true);
      }, 10);
      document.addEventListener('load', () => {
        setTimeout(() => {
          // googletag.pubads().refresh();
        }, 1000);
      });
    }
  }, [data]);

  useEffect(() => {
    if (adData) {
      let filtered = adData.catalog_list_items.slice(1).filter((v) => {
        return (
          v.layout_type.indexOf('ad_unit') >= 0 ||
          (v.layout_type.indexOf('ad_unit') === -1 &&
            v.catalog_list_items.length > 0)
        );
      });
      setFilteredRHS(filtered);
    }
    if (isDesktop) {
      fetchMoreListItems();
    }
  }, [adData]);

  async function fetchMoreListItems() {
    if (payload && callsDone < totalCalls && dataLoading) {
      setDataLoading(false);
      const requestPayload = {
        ...payload,
        query: {
          ...payload.query,
          page: callsDone, // since page index startsfrom 0
        },
      };

      const listingResp = await api.CatalogList.getListing(requestPayload);
      if (listingResp.data) {
        setCallsDone((callsDone) => callsDone + 1);
        const data = listingResp.data.data;
        let items = reArrangeData(data);

        if (isDesktop) {
          let first = [...firstSet];
          let result = [];
          items.forEach((v) => {
            if (v.catalog_list_items.length === 5) {
              if (!first.length) {
                first = v.catalog_list_items;
              } else {
                v.catalog_list_items = [...first, ...v.catalog_list_items];
                result.push(v);
                first = [];
              }
            } else {
              result.push(v);
            }
          });
          items = result;
          if (first.length) {
            setFirstSet(first);
          }
        }

        setListItems((prevState) => {
          return prevState.concat(items);
        });
        setDataLoading(true);
        
      }
    }

    setIsFetching(false);
  }

  function renderLayout(catalog, ind) {
    let returnValue = null;
    switch (catalog.layout_type) {
      case 'news_listing':
        const len = catalog.catalog_list_items.length;
        const items = catalog.catalog_list_items;
        if (len % 2 === 1) {
          // items = catalog.catalog_list_items.slice(0, -1);
        }
        returnValue = items.map((article, index) => (
          <RectangleCard
            key={ind + article.content_id + index}
            article={article}
            className="rectangle-card bg-white mt-1 md:mt-2 md:w-1/2 rounded-md"
          />
        ));
        break;
      case 'ad_unit_square':
        if (catalog.ad_conf && catalog.ad_conf.responsive_ad) {
          if (
            adsMap.findIndex(
              (v) => v && v.gpt_id === catalog.ad_conf.responsive_ad.gpt_id
            ) === -1
          ) {
            adsMap.push(catalog);
          }
        }
        if (!isDesktop) {
          returnValue = (
            <React.Fragment key={'ad' + ind}>
              <AdContainer
                isDesktop={isDesktop}
                data={[catalog]}
                className="my-1 listing-ad"
                type={'listing'}
              />
            </React.Fragment>
          );
        }
        break;

      case 'catalog_wall_menu':
        /* return catalog.catalog_list_items.length > 0 ? (
          <CatalogWall
            key={catalog.friendly_id + ind}
            data={catalog.catalog_list_items}
          />
        ) : null; */
        returnValue = null;
        break;
      case 'slider_seeall':
      case 'news_grid_seeall':
        returnValue = (
          <SliderSeeAll key={catalog.friendly_id + ind} data={catalog} />
        );
        break;

      case 'featured_mosaic_carousel':
      case 'auto_horizontal_dropdown_carousel_viewall':
      case 'featured_mosaic_carousel_seeall':
        returnValue =
          catalog.catalog_list_items.length > 0 ? (
            <SeeAll key={catalog.friendly_id + ind} data={catalog} />
          ) : null;
        break;
    }
    const desktopAdIndex = [3, 6, 10, 14, 19].findIndex((v) => v == ind);
    return (
      <React.Fragment key={ind}>
        {returnValue}
      
        
        {desktopAdIndex !== -1 && adsMap[desktopAdIndex] ? (
          <DesktopAdContainer
            desktop={isDesktop}
            data={[adsMap[desktopAdIndex]]}
            className="my-1 listing-ad"
            type={'listing'}
          />
        ) : null}
      </React.Fragment>
    );
  }

  return (
    <>
      <MediaContextProvider>
        <Media at="xs" className="w-full mt-2">
          {listItems[0].layout_type == 'featured_topnews_seeall' ||
          ('featured_staggered_grid' && listItems[0].url != '') ? (
            <div>
              <div className="flex items-center font-extrabold float-left ml-3.5">
                {listItems[0].ml_title[0].text}
              </div>
              <div className="flex items-center font-semibold text-sm text-red-500 float-right mr-10">
                {listItems[0].url != '' ? (
                  <NavLink
                    href={listItems[0].url}
                    as={listItems[0].url}
                    passHref
                    onClick={() => {
                      menuClick(listItems[0], 'headermenu');
                    }}
                  >
                    {t('see_all')}
                  </NavLink>
                ) : null}
              </div>
            </div>
          ) : null}
        </Media>
      </MediaContextProvider>
      <div
        className={`lg:container lg:mx-auto listing-container mt-2 bg-gray-200 relative flex flex-col md:flex-row w-full border-b-2 border-grey-500 md:space-x-10 ${
          isRTL ? 'md:flex-row-reverse rtl' : ''
        }`}
      >{
        adinfo && adinfo.lhs_skyscapper_ads ? (<MediaContextProvider>
          <Media
            greaterThan="xs"
            className={``}
          >
            <DFPSlotsProvider dfpNetworkId="175434344">
              <div className="skysacper sticky top-0" >
          <AdSlot sizes={[[120,600]]} adUnit={adinfo.lhs_skyscapper_ads.ad_unit_id.substring(adinfo.lhs_skyscapper_ads.ad_unit_id.lastIndexOf("/") + 1, adinfo.lhs_skyscapper_ads.ad_unit_id.length)} />
        </div>
       
      </DFPSlotsProvider>
          </Media>
        </MediaContextProvider>):null
      }
        
        <div className="md:w-8/12 h-full px-2 md:flex md:flex-wrap">
          {/* Mobile listing */}
          <MediaContextProvider>
            {listItems && listItems.length > 0 ? (
              <>
                <Media at="xs" className="w-full">
                  <MobileMainArticles list={listItems[0].catalog_list_items} />{
                    console.log('ach',adinfo)
                  }
                  {
                     adinfo && adinfo.native_ads ? (
                     <div className="native-ads mt-2" >
                 <NativeAd index={0} />
               </div>
              
            ):null
                  }
                  
                </Media>
                <Media greaterThan="xs" className="w-full flex space-x-2">
                  <MainArticles list={listItems[0].catalog_list_items} />
                  
                </Media>
                {/* {filteredRHS ? (<NativeAd />
              ) : null} */}
              
                {listItems.slice(1).map((subList, ind) => {
                  return renderLayout(subList, ind);
                })}
               
                 
              </>
            ) : null}

            <Loading isLoading={isFetching && callsDone < totalCalls} />
          </MediaContextProvider>
        </div>
        <MediaContextProvider>
          <Media
            greaterThan="xs"
            className={`ad-content px-3 pt-2 -my-3 bg-white md:block md:w-4/12`}
          >
            <Sticky
              containerSelectorFocus={`.listing-container`}
              stickyEnableRange={[768, Infinity]}
              offsetTop={60}
            >
              <Loading isLoading={!filteredRHS} />
              {filteredRHS ? (
                <AdContainer data={filteredRHS} index={0} type={'home_page'} />
              ) : null}
            </Sticky>
          </Media>
        </MediaContextProvider>
      </div>
    </>
  );
};

export default ListContainer;
