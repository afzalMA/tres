import React, { useState, useContext } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import { RTLContext } from '@components/layout/Layout';
import SquareCard1 from '@components/listing/mobile/SquareCard1';
import API from '@api/API';
import APIEnum from '@api/APIEnum';

const Search = ({ data, requestBody, listdata, userAgent, tabindex }) => {
  const api = API(APIEnum.CatalogList, APIEnum.Listing);
  const [initialData, setInitialData] = useState(data);

  const isRTL = useContext(RTLContext);

  const totalsrcount = (data) => {
    let count = 0;

    if (data.data.catalog_list_items) {
      let value = undefined;
      data.data.catalog_list_items.map((article, index) => {
        if (article.total_items_count > 0 && value === undefined) {
          value = index;
        }
        count = count + article.total_items_count;
      });
    }
    return count;
  };
  const getHomeIndex = (data) => {
    let value = undefined;

    if (data.data.catalog_list_items) {
      data.data.catalog_list_items.map((article, index) => {
        if (article.total_items_count > 0 && value === undefined) {
          value = index;
        }
      });
    }
    return value;
  };
  const [activeIndex, setActiveIndex] = useState(getHomeIndex(data));
  const fetchtabdata = async (index) => {
    setlistItems([]);

    const listingResp = await api.CatalogList.getSearchdata({
      query: requestBody,
      param: initialData.data.catalog_list_items[index].friendly_id,
    });
    let items = reArrangeData(listingResp.data);
    setpageSize(1);
    setlistItems(items);
    setActiveIndex(index);
  };
  //const tabresults = fetchtabdata(data);
  const reArrangeData = (data) => {
    return data.data.catalog_list_items;
  };
  const tcount = totalsrcount(data);
  const [tsrcount, settsrcount] = useState(tcount);
  const [listItems, setlistItems] = useState(reArrangeData(listdata));
  const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreData);
  const [pageSize, setpageSize] = useState(1);
  async function fetchMoreData() {
    const payload = {
      ...requestBody,
      page: pageSize,
    };

    const listingResp = await api.CatalogList.getSearchdata({
      query: payload,
      param: initialData.data.catalog_list_items[activeIndex].friendly_id,
    });
    //const data = listingResp.data.data;
    let items = reArrangeData(listingResp.data);
    setlistItems((prevState) => {
      return prevState.concat(items);
    });
    setpageSize(pageSize + 1);
    setIsFetching(false);
  }
  return (
    <>
      {tsrcount > 0 ? (
        <>
          <span className="searchCount mt-5">
            You have searched for <b>"{decodeURIComponent(requestBody.q)}"</b> :
            {tsrcount} articles found
          </span>
          <div
            className={`lg:container listing-container mt-2 lg:mx-auto  relative flex flex-col md:flex-row w-full border-b-2 border-grey-500 md:space-x-10 ${
              isRTL ? 'md:flex-row-reverse rtl' : ''
            }`}
          >
            <div className="md:w-8/12 h-full px-2 md:flex md:flex-wrap">
              <TabView
                activeIndex={activeIndex}
                onTabChange={(e) => fetchtabdata(e.index)}
              >
                {data.data.catalog_list_items.map((article, ind) => {
                  if (!article.total_items_count) {
                    return <React.Fragment key={'ad' + ind}></React.Fragment>;
                  }
                  return (
                    <TabPanel
                      key={article.display_title}
                      header={article.display_title}
                      disabled={article.total_items_count > 0 ? false : true}
                    >
                      <div
                        className={
                          userAgent.includes('Mobile')
                            ? 'mobilesearchwrapper'
                            : 'searchwrapper'
                        }
                      >
                        {listItems.length > 0 ? (
                          listItems.map((article, index) => (
                            <SquareCard1
                              className="bg-white"
                              article={article}
                              lineClamp="2"
                              styleObj={{ height: '17vh' }}
                              main={true}
                              key={index}
                            />
                          ))
                        ) : (
                          <span>Loading....</span>
                        )}
                      </div>
                    </TabPanel>
                  );
                })}
              </TabView>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="searchCount">
            You have searched for <b>"{decodeURIComponent(requestBody.q)}" </b>
          </p>
          <div
            className={`lg:container listing-container mt-2 lg:mx-auto  relative flex flex-col md:flex-row w-full border-b-2 border-grey-500 md:space-x-10 ${
              isRTL ? 'md:flex-row-reverse rtl' : ''
            }`}
          >
            <div className="md:w-8/12 h-full px-2 md:flex md:flex-wrap">
              <div className="no-results ">
                <h1>We can not find any article matching your search.</h1>
                <div className="suggestions">
                  <p>A few suggestions</p>
                  <ul>
                    <li> Make sure all words are spelled correctly</li>
                    <li>Try different keywords</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Search;
