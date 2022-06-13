import NavLink from '@components/common/NavLink';
import eventBus from '@utils/EventBus';
import { articleClick } from '@utils/GoogleTagManager';
import { configStateCodeConverter, linkInfoGenerator } from '@utils/Helpers';
import SquareCard from './SquareCard';
import DistrictSelectModal from '@components/common/DistrictSelectModal';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '@services/api/API';
import APIEnum from '@services/api/APIEnum';
import useSWR, { mutate } from 'swr';
import { RTLContext } from '@components/layout/Layout';
import useTranslator from '@hooks/useTranslator';
import { applicationConfig } from '@utils/Constants';

const capitalize = (s) => {
  return s && s[0].toUpperCase() + s.slice(1);
};
const SeeAll = ({ data, article, className }) => {
  const isRTL = useContext(RTLContext);
  const isAMP = false;

  const router = useRouter();
  const { t, appLanguage } = useTranslator();

  const api = API(APIEnum.CatalogList);

  const [district, setDistrict] = useState(null);
  const [state, setState] = useState(null);

  const [showDistrictModal, setShowDistrictModal] = useState(isAMP);
  const [loading, setLoading] = useState(false);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const [displayData, setDisplayData] = useState(data);
  const appConfig = applicationConfig.value;
  const constructPayload = (type, code) => {
    if (!type) return;
    if (type === 'district') {
      return {
        params: {
          state: router.query.state,
        },
        query: {
          response: 'r2',
          item_languages: appLanguage.code,
          region: 'IN',
          dynamic_district: code,
        },
      };
    }

    return {
      params: {
        key:
          appConfig.params_hash2.config_params.carousel_on_selection[
            configStateCodeConverter(router.query.state)
          ]['dynamic-list'],
      },
      query: {
        collective_ads_count: 0,
        page: 0,
        page_size: 8,
        version: 'v2',
        response: 'r2',
        item_languages: appLanguage.code,
        portal_state: router.query.state,
        dynamic_state: configStateCodeConverter(code),
      },
    };
  };
  const apiCaller = (...args) => {
    startLoading();
    const [apiEnum, methodName, type, code] = args;
    const payload = constructPayload(type, code);
    if (!payload) {
      return;
    }

    return api[apiEnum][methodName](payload)
      .then((res) => {
        const result = res.data && res.data.data ? res.data.data : [];
        if (type) {
          setDisplayData(result);
        }
        return result;
      })
      .finally(() => {
        stopLoading();
      });
  };

  const { data: districtFetchedData, error: stateError } = useSWR(
    district
      ? ['CatalogList', 'getDistrictNews', 'district', district.code]
      : null,
    apiCaller,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  const { data: stateFetchedData, error } = useSWR(
    state ? ['CatalogList', 'getListing', 'state', state] : null,
    apiCaller,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (districtFetchedData && district) {
      setDisplayData(districtFetchedData);
    } else if (stateFetchedData && state) {
      setDisplayData(stateFetchedData);
    }
  }, [districtFetchedData, stateFetchedData]);

  const isEven = data.catalog_list_items.length % 2 === 0;
  const scope = {
    dropdown: false,
  };

  if (data.layout_type === 'featured_mosaic_carousel_seeall') {
    scope.dropdown = false;
    scope.see_all = true;
    scope.text = 'see_all';
    scope.link_info = linkInfoGenerator(
      data.url.startsWith('/') ? data.url.slice(1) : data.url,
      router.query.state
    );
  }
  if (data.filter_type) {
    scope.dropdown = true;
    scope.text = 'select';
    switch (data.filter_type) {
      case 'select_cities':
        scope.type = 'city';
        break;
      case 'select_state':
        scope.type = 'state';
        break;
      case 'see_all':
        scope.dropdown = false;

        scope.text = data.filter_type;
        scope.see_all = true;
        scope.link_info = linkInfoGenerator(
          data.url.startsWith('/') ? data.url.slice(1) : data.url,
          router.query.state
        );
        break;
      case 'none':
        scope.dropdown = false;
        if (data.url) {
          scope.text = 'see_all';
          scope.see_all = true;
          scope.link_info = linkInfoGenerator(
            data.url.startsWith('/') ? data.url.slice(1) : data.url,
            router.query.state
          );
        }

        break;
      default:
        scope.type = 'district';
        break;
    }

    scope.input_text = data[`dynamic_${scope.type}_name`]
      ? data[`dynamic_${scope.type}_name`][0].text
          .split(' ')
          .map(capitalize)
          .join(' ')
      : '';
  }

  const selectorModal = (scope) => {
    switch (scope.type) {
      case 'state':
        eventBus.emit(`${scope.type}-selector`, {
          show: true,
          callback: (path) => {
            startLoading();
            setState((prevState) => {
              const newState = path.split('/').slice(-1)[0];
              if (prevState !== newState) {
                mutate(
                  ['CatalogList', 'getListing', 'state', newState],
                  apiCaller
                );
              }
              return newState;
            });
          },
        });
        break;

      case 'district':
        setShowDistrictModal(true);
        break;
    }
  };

  const getSeeAllData = (displayData) => {
    let url = displayData.url.startsWith('/')
      ? displayData.url.slice(1)
      : displayData.url;

    if (url.endsWith('/district')) {
      url = url + '/' + displayData.dynamic_district;
    }
    return {
      text: t('see_all'),
      url: url,
      thumbnails: displayData.catalog_list_items[3].thumbnails,
    };
  };

  return (
    <>
      {showDistrictModal ? (
        <DistrictSelectModal
          state={router.query.state}
          onClose={() => {
            setShowDistrictModal(false);
          }}
          mainUrl={displayData ? displayData.url : ''}
          onDistrictSelect={(district) => {
            startLoading();

            setDistrict((prevDist) => {
              const newDist = district;
              if (prevDist && prevDist.code !== newDist.code) {
                mutate(
                  ['CatalogList', 'getListing', 'district', district.code],
                  apiCaller
                );
              }
              return newDist;
            });
            setShowDistrictModal(false);
          }}
        />
      ) : null}
      <div
        className={`my-2 flex w-full justify-between mb-1 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <div className="text-base md:text-lg">{data.ml_title[0].text}</div>

        {scope.dropdown ? (
          <div className="flex items-center ">
            <div className="pr-2 text-sm">{t(`${scope.text}`)}</div>

            <div
              className="flex items-center capitalize text-sm border border-gray-600 px-2 py-0 cursor-pointer"
              on={`tap:${scope.type}-lightbox`}
              role="button"
              tabIndex={0}
              onClick={() => {
                selectorModal(scope);
              }}
            >
              <div>
                {district
                  ? district.ml_title[0].text
                  : state
                  ? state
                  : scope.input_text}
              </div>
              <span className="pl-1 caret text-gray-700 "> &#9660;</span>
            </div>
          </div>
        ) : null}
        {scope.see_all ? (
           <div className={`tems-center font-semibold text-sm text-red-500 `}>
          <NavLink
            className={`text-sm`}
            href={scope.link_info.href}
            as={scope.link_info.as}
            passHref
            onClick={() => {
              articleClick(article);
            }}
          >
            {t(scope.text)}
          </NavLink>
          </div>
        ) : null}
      </div>

      <div className="w-full flex flex-wrap">
        {displayData.catalog_list_items
          .slice(0, isEven ? 2 : 3)
          .map((item, ind) => {
            return (
              <div className="w-1/2 p-1 " key={item.friendly_id}>
                <SquareCard className="bg-white" article={item} />
              </div>
            );
          })}
        {!isEven && displayData.catalog_list_items.length > 3 ? (
          <div className="w-1/2 p-1" key={displayData.friendly_id + 'see_all'}>
            <SquareCard
              className="bg-white w-full h-full flex justify-center items-center"
              data={getSeeAllData(displayData)}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default SeeAll;
