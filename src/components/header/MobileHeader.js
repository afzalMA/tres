import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import NavLink from '@components/common/NavLink';
import header from './Header.module.scss';
import Modal from '@components/modal/Modal';
import { menuClick } from '@utils/GoogleTagManager';
import useTranslator from '@hooks/useTranslator';
import { RTLContext } from '@components/layout/Layout';

const country = 'IN';

export default function MobileHeader({ data, className }) {
  const isAMP = false;
  const router = useRouter();

  const [state, setState] = useState(router.query.state);
  const [language, setLanguage] = useState(router.query.language);
  const [stateData, setStateData] = useState(null);
  const { t, appLanguage } = useTranslator();
  const isRTL = useContext(RTLContext);

  const [openStateModal, setOpenStateModal] = useState([]);

  const [category, setCategory] = useState(null);

  const languageNStateSelect = (language, states) => {
    if (language === 'english') {
      router.push(`/${language}/national`);
    } else {
      if (states.length === 1) {
        router.push(`/${language}/${states[0].state}`);
      } else {
        setOpenStateModal(states);
      }
    }
  };

  const goToSelected = (selected) => {
    languageNStateSelect(selected.language, [{ state: selected.state }]);
    setOpenStateModal([]);
  };

  const containerOut = (ev) => {
    setCategory(null);
  };
  useEffect(() => {
    const splitPath = location.pathname.split('/');
    setLanguage(splitPath[1]);
    setState(splitPath[2]);
    setStateData(
      data && data.languages
        ? data.languages[language].find((v) => v.state.toLowerCase() === state)
        : null
    );
  }, [data, router, appLanguage]);

  // menu: headerResp.data.data.catalog_list_items
  return (
    <>
      {openStateModal.length > 0 ? (
        <Modal
          title=""
          isMobile={true}
          open={!!openStateModal}
          onClose={() => {
            setOpenStateModal([]);
          }}
          width={null}
          height={null}
        >
          <>
            <div className="p-4 rounded-md" style={{ background: '#f0f0f0' }}>
              <div
                className={`flex justify-between pl-3 pb-4 ${
                  isRTL ? 'flex-row-reverse rtl' : ''
                }`}
              >
                <div className="text-gray-700 text-md pl-2">Select State</div>
                <div>
                  <button
                    type="button"
                    className="font-semibold text-gray-500 hover:text-gray-900 text-md"
                    onClick={() => setOpenStateModal([])}
                  >
                    &#10005;
                  </button>
                </div>
              </div>

              <div
                className={`flex flex-wrap w-64 mx-auto px-2 ${
                  isRTL ? 'flex-row-reverse rtl' : ''
                }`}
              >
                {openStateModal.map((v) => {
                  return (
                    <div
                      key={v.state}
                      onClick={() => {
                        goToSelected({
                          language: openStateModal[0].item_languages[0],
                          state: v.state,
                        });
                      }}
                      className="py-1"
                      style={{ flexBasis: '50%' }}
                    >
                      {v.display_title}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        </Modal>
      ) : null}

      <div
        next-page-hide="1"
        className={`${className} ${header['mobile-header']} block md:hidden bg-mhbg`}
      >
        <div
          className={`${
            header['logo-container']
          } flex justify-start bg-white px-2 py-1 self-center border-b ${
            isRTL ? 'flex-row-reverse rtl' : ''
          }`}
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
            <div
              className={`logo ${language} ${isRTL ? 'ml-3 rtl' : ''}`}
              style={{ transform: `translate(-24px, -19px) scale(0.6)` }}
            ></div>
          </NavLink>
          <div
            className={`flex items-center ${
              isRTL ? 'flex-row-reverse rtl' : ''
            }`}
          >
            {stateData ? (
              <div className="text-sm">
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
            ) : null}
          </div>
        </div>

        <div className="bg-mhbg h-53px px-3 font-english border-b border-white">
          <div
            className={`bg-mhbg flex justify-between items-center py-1 overflow-x-auto ${
              isRTL ? 'flex-row-reverse rtl' : ''
            }`}
          >
            <div
              className={`flex space-x-6 ${
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
          </div>
        </div>
      </div>

      <div
        className={`${className} bg-mhbg px-3  ${header['sub-header']} sticky block md:hidden -t-1 z-100`}
        next-page-hide="1"
        onMouseLeave={containerOut}
      >
        <div
          className={`bg-mhbg h-7 lg:mx-auto flex items-center py-1 overflow-x-auto space-x-3 ${
            isRTL ? 'flex-row-reverse rtl space-x-reverse' : ''
          }`}
        >
         
          {data.menu && data.menu.mobile
            ? data.menu.mobile.map((item) => {
                return (
                  <div
                    key={item.list_id + item.ml_title[0].text}
                    className={`${header['header-menu-item']} text-white cursor-pointer whitespace-nowrap hover:text-red-700`}
                  >
                    <div className=" flex flex-col items-center relative  text-sm">
                      <NavLink
                        href={item.url}
                        as={item.url}
                        passHref
                        onClick={() => {
                          menuClick(item, 'headermenu');
                        }}
                      >
                        <div>{item.ml_title[0].text.toUpperCase()}</div>
                      </NavLink>
                    </div>
                  </div>
                );
              })
            : null}
           

        </div>
      </div>
    </>
  );
}
