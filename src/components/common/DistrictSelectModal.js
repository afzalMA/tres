import Modal from '@components/modal/Modal';
import { useEffect, useState } from 'react';
import API from '@services/api/API';
import APIEnum from '@services/api/APIEnum';
import useSWR from 'swr';
import useTranslator from '@hooks/useTranslator';
import NavLink from '@components/common/NavLink';
import { linkInfoGenerator } from '@utils/Helpers';

const DistrictSelectModal = ({ state, onClose, onDistrictSelect, mainUrl }) => {
  const api = API(APIEnum.Catalog);
  const [isShowing, setIsShowing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [districts, setDistricts] = useState([]);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const { t, appLanguage } = useTranslator();
  const isAMP = false;

  const fUrl = mainUrl.startsWith('/') ? mainUrl.slice(1) : mainUrl;
  const getLink = (district) => {
    let url = fUrl;
    if (fUrl.endsWith('/district')) {
      url = url + '/' + district;
    }
    return linkInfoGenerator(url, state);
  };

  const close = () => {
    onClose();
    setIsShowing(false);
  };

  const apiCaller = (...args) => {
    const [apiEnum, methodName, stateName] = args;
    return api[apiEnum][methodName]({
      params: {
        state: stateName,
      },
      query: {
        response: 'r2',
        item_languages: appLanguage.code,
        region: 'IN',
      },
    }).then((res) => {
      return res.data && res.data.data && res.data.data.items
        ? res.data.data.items
        : [];
    });
  };

  const { data, error } = useSWR(
    ['Catalog', 'getDistricts', state],
    apiCaller,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (data) {
      stopLoading();
      const newdata = data.map((v) => {
        return { ...v, linkInfo: getLink(v.friendly_id) };
      });
      setDistricts(newdata);
    } else {
      startLoading();
    }
  }, [data]);

  return (
    <Modal
      title=""
      isMobile={true}
      open={isShowing}
      onClose={() => {
        close();
      }}
      width={null}
      height={null}
      ampon={`tap:district-lightbox`}
    >
      <>
        <div className="p-3 pb-4 rounded-md" style={{ background: '#f0f0f0' }}>
          <div className="flex justify-between pb-4">
            <div className="text-gray-700 text-md pl-2">
              {t('change_district')}
            </div>
            <div>
              <button
                type="button"
                className="font-semibold text-gray-500 hover:text-gray-900 text-md"
                onClick={() => {
                  close();
                }}
                tabIndex={0}
                role="button"
                on={`tap:district-lightbox.close`}
              >
                &#10005;
              </button>
            </div>
          </div>

          <div className="flex flex-wrap w-full px-3 text-sm mx-auto">
            {!loading && districts.length > 0
              ? districts.map((v) => {
                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        onDistrictSelect(v);
                      }}
                      className="py-1 capitalize cursor-pointer"
                      style={{ flexBasis: '50%' }}
                    >
                      {v.ml_title[0].text}
                    </div>
                  );
                })
              : null}
          </div>
        </div>
      </>
    </Modal>
  );
};

export default DistrictSelectModal;
