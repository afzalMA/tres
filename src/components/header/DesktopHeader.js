import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useContext } from 'react';

import header from './Header.module.scss';

import NavLink from '@components/common/NavLink';
import DesktopSidebar from '@components/header/DesktopSidebar';
import Modal from '@components/modal/Modal';
import DesktopSubMenu from '@components/header/DesktopSubMenu';
import {
  languageChange,
  searchItem,
  menuClick,
  subMenuClick,
} from '@utils/GoogleTagManager';
import { Media, MediaContextProvider } from '@media';
import { RTLContext, ScrollContext } from '@components/layout/Layout';
import API from '@services/api/API';
import APIEnum from '@services/api/APIEnum';
import { getSocialLinks } from '@utils/Helpers';
import useTranslator from '@hooks/useTranslator';

const DesktopHeader = ({ className, data }) => {
  const router = useRouter();
  const { t, appLanguage } = useTranslator();
  const api = API(APIEnum.Catalog);
  const isScrolled = useContext(ScrollContext);
  const isRTL = useContext(RTLContext);
  const [state, setState] = useState(router.query.state);
  const [language, setLanguage] = useState(router.query.language);

  const [stateData, setStateData] = useState(null);
  const [headerAd, setHeaderAd] = useState(null);
  const [socialHandlers, setSocialHandlers] = useState({
    twitter: 'https://twitter.com/ETVBharatEng',
    fb: 'https://www.facebook.com/ETVBharatEnglish',
  });

  const [selected, setSelected] = useState({ state: '', language: '' });
  const [openStateModal, setOpenStateModal] = useState([]);
  const [sidebar, toggleSidebar] = useState(false);
  const [category, setCategory] = useState(null);

  const [searchBox, toggleSearchBox] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const setInitialCategory = (item) => {
    const subitem = item.catalog_list_items ? item.catalog_list_items[0] : {};
    setCategory({ ...subitem, title: item.ml_title[0].text });
  };

  const goToLanguageListing = (language, routeParams) => {
    languageChange(language);
    setTimeout(() => {
      window.location.pathname = routeParams[1];
    }, 10);
  };
  const languageNStateSelect = (language, states) => {
    if (language === 'english') {
      goToLanguageListing(language, [`/national`, `/${language}/national`]);
    } else {
      if (states.length === 1 && states[0].state) {
        const state = states[0].state.toLowerCase();
        goToLanguageListing(language, [`/${state}`, `/${language}/${state}`]);
      } else {
        setSelected({ state: '', language: '' });
        setOpenStateModal(states);
      }
    }
  };

  const goToSelected = () => {
    languageNStateSelect(selected.language, [{ state: selected.state }]);
    setOpenStateModal([]);
    setSelected(null);
  };

  const containerOut = (ev) => {
    setCategory(null);
  };

  const searchitem = (e) => {
    let value = searchInput;
    setSearchInput('');
    const goTo = () => {
      toggleSearchBox(false);
      searchItem(searchInput);
      router.push(`/${language}/${state}/search/${decodeURI(value)}`);
    };
    if (e) {
      if (e.key === 'Enter') {
        goTo();
      }
    } else {
      goTo();
    }
  };
  useEffect(() => {
    if (language && state) {
      setStateData(
        data && data.languages
          ? data.languages[language].find(
              (v) => v.state.toLowerCase() === state
            )
          : null
      );
    }
  }, [data, state, language, appLanguage]);

  useEffect(() => {
    const splitPath = location.pathname.split('/');
    setLanguage(splitPath[1]);
    setState(splitPath[2]);
    const isDesktop = window && window.innerWidth >= 768;
    const socialLinks = getSocialLinks(state);
    setSocialHandlers(socialLinks);

    const getHeaderAd = () => {
      let url = splitPath.slice(0, -2).join('/');
      if (url.trim().length === 0) {
        url = location.pathname + (splitPath.length === 3 ? '/home' : '');
      }
      api.Catalog.getPageAds({
        query: {
          app: 'web',
          item_languages: appLanguage.name,
          response: 'r2',
          language: language,
          state: state,
          url: decodeURI(url),
        },
      })
        .then((resp) => {
          if (resp.data && resp.data.data) {
            setHeaderAd(
              <iframe
                className="mx-auto hidden lg:block"
                width={755}
                height={110}
                src={new URL(resp.data.data.ad_list[0].ad_Url).pathname}
              />
            );
          }
        })
        .catch((e) => {});
    };
    if (isDesktop) {
      getHeaderAd();
    }
    const handleRouteChange = (url) => {
      const socialLinks = getSocialLinks(state);
      setSocialHandlers(socialLinks);
      // setTwitterHandler();
      if (isDesktop) {
        getHeaderAd(url);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <>
      {openStateModal.length ? (
        <Modal
          title={'change_state'}
          open={!!openStateModal}
          isMobile={false}
          onClose={() => setOpenStateModal([])}
          width={null}
          height={null}
        >
          <div className="px-6 py-4 flex justify-around items-center h-24">
            <div className="text-md font-medium">{t('state')}</div>
            <div className="w-40">
              <select
                value={selected.state}
                onChange={(e) => {
                  setSelected({
                    language: openStateModal[0].item_languages[0],
                    state: e.target.value,
                  });
                }}
                className="form-control"
              >
                <option value="select">{t('select_state')}</option>
                {openStateModal.map((v) => {
                  return (
                    <option key={v.state} value={v.state}>
                      {v.display_title}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end w-full p-4 pb-6">
            <div
              className="button px-4 py-2 border-2 border-red-700 text-red-700 rounded-md cursor-pointer focus:text-white focus:bg-red-700"
              onClick={() => setOpenStateModal([])}
            >
              {t('cancel_capital')}
            </div>
            <div
              className="button yes px-4 py-2 border-2 border-red-700 text-red-700 rounded-md ml-3 cursor-pointer"
              onClick={() => {
                selected.state && goToSelected();
              }}
            >
              {t('done_txt')}
            </div>
          </div>

          <style jsx>
            {`
              select {
                display: block;
                width: 100%;
                height: 34px;
                padding: 6px 12px;
                font-size: 14px;
                line-height: 1.42857143;
                color: #555;
                background-color: #fff;
                background-image: none;
                border: 1px solid #ccc;
                border-radius: 4px;
                -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
                -webkit-transition: border-color ease-in-out 0.15s,
                  -webkit-box-shadow ease-in-out 0.15s;
                -o-transition: border-color ease-in-out 0.15s,
                  box-shadow ease-in-out 0.15s;
                transition: border-color ease-in-out 0.15s,
                  box-shadow ease-in-out 0.15s;
                cursor: pointer;
              }

              .form-control:focus {
                border-color: #c53030;
                outline: 0;
                -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                  0 0 8px rgba(233, 102, 102, 0.6);
                box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
                  0 0 8px rgba(233, 102, 102, 0.6);
              }
              .form-control::-moz-placeholder {
                color: #999;
                opacity: 1;
              }
              .form-control:-ms-input-placeholder {
                color: #999;
              }
              .form-control::-webkit-input-placeholder {
                color: #999;
              }
              .form-control::-ms-expand {
                background-color: transparent;
                border: 0;
              }

              .button:hover {
                box-shadow: 0 0 0 3px rgba(197, 48, 48, 0.1);
              }

              .button:active {
                background: #c53030;
                color: white;
              }
            `}
          </style>
        </Modal>
      ) : null}

      {sidebar ? (
        <DesktopSidebar data={data} onClose={() => toggleSidebar(false)} />
      ) : null}

      <div
        className={`${className} divide-y md:block hidden bg-hbg px-2 font-english border-b`}
      >
        <div
          className={`${
            header.scroll
          } lg:container h-13 lg:mx-auto flex justify-between items-center py-1 overflow-x-auto ${
            isRTL ? 'flex-row-reverse rtl' : ''
          }`}
        >
          <div
            className={`bg-hbg flex space-x-6 ${
              isRTL ? 'flex-row-reverse space-x-reverse rtl' : ''
            }`}
          >
            {data.languages
              ? Object.entries(data.languages).map(([language, states]) => {
                  return (
                    <div
                      key={language}
                      onClick={() => languageNStateSelect(language, states)}
                      className="flex-1 flex flex-col justify-center items-center cursor-pointer"
                    >
                      <div className={`language-icon ${language}`}></div>
                      <div className="text-white text-xs">
                        {language.charAt(0).toUpperCase() + language.slice(1)}
                      </div>
                    </div>
                  );
                })
              : null}
          </div>

          <div
            className={`flex flex-row items-center space-x-3 ${
              isRTL ? 'left-side-container' : 'right-side-container'
            }`}
          >
            <div>
              <a href={socialHandlers.fb}>
                <p className="fb-icon"></p>
              </a>
            </div>
            <div>
              <a href={socialHandlers.twitter}>
                <p className="twitter-icon"></p>
              </a>
            </div>
            <div className="srch-container">
              <div
                className="search-icon cursor-pointer"
                onClick={() => toggleSearchBox((searchBox) => !searchBox)}
              ></div>
              {searchBox ? (
                <div className="absolute z-50 search-box">
                  <input
                    placeholder="Search stories"
                    defaultValue={searchInput}
                    onInput={(e) => setSearchInput(e.target['value'])}
                    onKeyPress={(e) => searchitem(e)}
                    type="text"
                    className="relative h-8 border border-gray-300 rounded-sm p-2 pr-6 w-48"
                  />

                  <button
                    onClick={() => searchitem(null)}
                    className="btn absolute right-0 top-0 h-8 p-0 m-0 bg-gray-300 text-lg w-8"
                    style={{
                      borderRadius: '0 3px 3px 0',
                      color: '#595959',
                      lineHeight: 1,
                    }}
                  >
                    {/* ❱ */}
                    &#x25ba;
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${className} ${header.main} bg-hbg md:block hidden px-2 sticky top-0`}
        onMouseLeave={containerOut}
      >
        <div
          className={`${
            header.scroll
          } lg:container lg:mx-auto flex items-center py-1 overflow-x-auto space-x-3 ${
            isRTL ? 'flex-row-reverse rtl' : ''
          }`}
        >
          <div
            className={`${header.hamburger} ml-2`}
            onClick={() => toggleSidebar(true)}
          ></div>

          {data.menu && data.menu.desktop
            ? (data.menu.desktop.map((item) => {
                return (
                  <div
                    key={item.list_id}
                    className={`${header['header-menu-item']} text-white cursor-pointer whitespace-nowrap hover:text-red-700`}
                  >
                    <div
                      className=" flex flex-col items-center relative"
                      onMouseEnter={() => setInitialCategory(item)}
                    >
                    
                      <NavLink
                        href={item.url}
                        as={item.url}
                        passHref
                        onClick={() => {
                          menuClick(item, 'headermenu');
                        }}
                      >
                        {item.ml_title[0].text.toUpperCase()}
                      </NavLink>
                      {item.total_items_count > 0 ? (
                        <div
                          className={`${header['arrow-up']} absolute transform translate-y-5`}
                        ></div>
                      ) : null}
                    </div>

                    {item.total_items_count > 0 ? (
                      <div
                        className={`${header.submenu} lg:container absolute left-0 w-full z-10 text-black`}
                      >
                        <div className="h-3 bg-transparent"></div>
                        <div
                          className={`${header['submenu-container']} w-full bg-white shadow-md p-3`}
                          onMouseLeave={() => setCategory(null)}
                        >
                          <div
                            className={`flex w-full h-full ${
                              isRTL ? 'flex-row-reverse rtl' : ''
                            }`}
                          >
                            <div
                              className={`h-full p-3 overflow-y-scroll flex-grow-0 flex-shrink-0 whitespace-pre-wrap ${header['lhs-content']}`}
                              style={{ flexBasis: '19%' }}
                            >
                              {item.catalog_list_items.map((subitem) => {
                                return (
                                  <div
                                    key={subitem.list_id}
                                    className="p-1 font-bold text-lg hover:text-red-700"
                                    onMouseEnter={() =>
                                      setCategory({
                                        ...subitem,
                                        title: item.ml_title[0].text,
                                      })
                                    }
                                  >
                                    <NavLink
                                      className="block"
                                      href={subitem.url}
                                      as={subitem.url}
                                      passHref
                                      onClick={() => {
                                        subMenuClick(subitem, '');
                                      }}
                                    >
                                      {subitem.ml_title[0].text}
                                    </NavLink>
                                  </div>
                                );
                              })}
                            </div>
                            {category &&
                            item.ml_title[0].text === category.title ? (
                              <DesktopSubMenu
                                key={item.ml_title[0].text}
                                category={category}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })
              )
            : null}
            
            
        </div>
      </div>

      <div className={`${className} md:block hidden border-b`}>
        <div
          className={`lg:container lg:mx-auto flex justify-between px-2 py-1 self-center ${
            isRTL ? 'flex-row-reverse rtl' : ''
          }`}
        >
          <div
            className={`flex items-center ${
              isRTL ? 'flex-row-reverse rtl' : ''
            }`}
            style={{ flex: '1 0 30%' }}
          >
            <NavLink
              href={{
                pathname: '/[language]/[state]',
                query: {
                  language: language,
                  state: state,
                },
              }}
              as={`/${language}/${state}`}
              passHref
              title={`ETV ${language}`}
              hideTitle={true}
            >
              <div className={`logo ${language}`}></div>
            </NavLink>
            <div className="flex items-center pl-3">
              {stateData ? (
                <div className="text-md">
                  <div className="border-b border-red-700">
                    {stateData.display_title}
                  </div>
                  <div>
                    {stateData.state
                      .split('-')
                      .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
                      .join(' ')}
                  </div>
                </div>
              ) : (
                language
              )}
            </div>
          </div>

          <div
            className={`flex items-center w-full ${
              isRTL ? 'justify-end' : ' justify-start'
            }`}
          >
            {/* <iframe className="mx-auto" width={755} height={110} src={`https://www.etvbharat.com/banner-near-logo/${router.query.state}/business/728x90-1.htm`}/> */}

            <MediaContextProvider>
              <Media greaterThan="xs"> {isScrolled ? headerAd : null}</Media>
            </MediaContextProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default DesktopHeader;
