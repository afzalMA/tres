import Header from '@components/header/Header';
import Footer from '@components/footer/Footer';
import React from 'react';

import API from '@api/API';
import APIEnum from '@api/APIEnum';
import { useEffect, useState } from 'react';
import {
  applicationConfig,
  accessToken as token,
  languageMap,
} from '@utils/Constants';
import { configStateCodeConverter, stateCodeConverter } from '@utils/Helpers';
import { usePromiseTracker } from 'react-promise-tracker';
import { useRouter } from 'next/router';
import eventBus from '@utils/EventBus';
import StateSelectModal from '@components/common/StateSelectModal';
import FileFetcher from '@services/api/FileFetcher';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const env = publicRuntimeConfig.APP_ENV;
const country = 'IN';
export const RTLContext = React.createContext(false);
export const ScrollContext = React.createContext(false);

const Layout = ({ children, accessToken, pageType, headerData }) => {
  const router = useRouter();
  const api = API(APIEnum.Catalog, APIEnum.CatalogList);
  const [data, setData] = useState({
    footer: headerData.footer,
    header: headerData.header,
  });
  
  const path = router.asPath;
  const splitPath = path.split('/');
  const lang = splitPath[1];
  const language = headerData.language;
  const state = splitPath[2];

  const [showStateModal, setShowStateModal] = useState(null);
  const { promiseInProgress } = usePromiseTracker();
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchMenu = async () => {
    const menu = {
      desktop: [],
      mobile: [],
    };

    const response = await fetch(`/api/menu?url=${lang + '/' + state}`);
    let data = null;

    if (response.ok) {
      try {
        data = await response.json();
        if (data) {
          menu.desktop = data;
          menu.mobile = data;

          return menu;
        }
      } catch (e) {
        data = null;
      }
    }

    if (!data) {
      let convertedState = configStateCodeConverter(state);
      convertedState =
        language === 'ur' && convertedState !== 'jk' ? 'urdu' : convertedState;
      const urlSuffix = language == 'ur' ? '-urdu' : '';
      const headerResp = await api.CatalogList.getMenuDetails({
        params: {
          suffix:
            env === 'staging'
              ? 'left-menu-msite'
              : `msite-new-left-menu` +
                `${state !== 'national' ? '-' + state : urlSuffix}`,
        },
        query: {
          region: country,
          response: 'r2',
          item_languages: language,
          portal_state: stateCodeConverter(state),
          only_items: 'catalog_list',
          //  env: 'staging',
        },
        isSSR: true,
      });
      if (headerResp && headerResp.data) {
        menu.desktop = headerResp.data.data.catalog_list_items;
        menu.mobile = headerResp.data.data.catalog_list_items;
        fetch(`/api/menu?url=${lang + '/' + state}`, {
          method: 'POST',
          body: JSON.stringify({ data: menu.desktop }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        return menu;
      }
    }
  };

  const fetchConfig = async () => {
    const response = await fetch(`/api/config`);
    if (response.ok) {
      const resp = await response.json();
      applicationConfig.value = resp.data;
      return resp.data;
    } else {
      const res = await FileFetcher.getAppConfig({
        query: {
          response: 'r2',
          item_languages: 'en',
          current_version: '1.1',
          region: 'IN',
          version: 'v2',
        },
        isSSR: true,
      });

      const appConfig = res.data.data;
      applicationConfig.value = appConfig;
      fetch(`/api/config`, {
        method: 'POST',
        body: JSON.stringify({ data: appConfig }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return appConfig;
    }
  };

  const fetchFooter = async () => {
    const response = await fetch(`/api/footer`);
    const footer = {};
    if (response.ok) {
      const resp = await response.json();
      const data = resp.data;
      footer.languages = data.languages;
      footer.required = data.required;
    } else {
      const result = await FileFetcher.getFooterDetails({
        query: {
          region: country,
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

      fetch(`/api/footer`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            languages: languageData,
            required: requiredData,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return footer;
  };

  useEffect(() => {
    window.addEventListener('script-loaded', () => {
      setTimeout(() => {
        setIsScrolled(true);
      }, 200);
    });
  });

  useEffect(() => {
    eventBus.on('state-selector', (data) => {
      setShowStateModal({ data: data });
    });

    eventBus.on('district-selector', (data) => {
      setShowDistrictModal(data.show);
    });

    return () => {
      eventBus.die('state-selector');
      eventBus.die('district-selector');
    };
  });

  

  return (
    <>
      {showStateModal ? (
        <StateSelectModal
          data={data ? data.footer.required : {}}
          callback={showStateModal.data.callback}
          onClose={() => {
            setShowStateModal(null);
          }}
        />
      ) : null}
      <RTLContext.Provider value={language === 'ur' ? true : false}>
        <ScrollContext.Provider value={isScrolled}>
          <Header data={data.header} language={language} />
          {promiseInProgress ? (
            <div
              style={{
                width: '100%',
                height: '100',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/*  <Loader
                type="ThreeDots"
                color="#2BAD60"
                height="100"
                width="100"
              /> */}
              Loading..
            </div>
          ) : (
            <section
              className={`content ${
                pageType === 'listing' || pageType === 'navlisting'
                  ? 'bg-gray-200'
                  : 'bg-white'
              }`}
            >
              {children}
            </section>
          )}
          
            <Footer
              key={headerData.language}
              data={data.footer.required}
              menu={data.header ? data.header['menu'] : null}
              language={headerData.language}
              state={headerData.state}
            />
          
        </ScrollContext.Provider>
      </RTLContext.Provider>
    </>
  );
};

export default Layout;
