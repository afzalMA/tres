import Modal from '@components/modal/Modal';
import { useEffect, useState } from 'react';
import useTranslator from '@hooks/useTranslator';
import { useRouter } from 'next/router';

const ListingStateSelectModal = ({
  data,
  state,
  onClose,
  onStateSelect,
  type,
  on,
}) => {
  const [isShowing, setIsShowing] = useState(true);
  const [loading, setLoading] = useState(true);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const { t, appLanguage } = useTranslator();
  const router = useRouter();

  const close = () => {
    onClose();
    setIsShowing(false);
  };
  useEffect(() => {
    stopLoading();
  });

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
      ampon={on}
    >
      <>
        <div className="p-3 pb-4 rounded-md" style={{ background: '#f0f0f0' }}>
          <div className="flex justify-between pb-4">
            <div className="text-gray-700 text-md pl-2">
              {t('change_' + type)}
            </div>
            <div>
              <button
                type="button"
                className="font-semibold text-gray-500 hover:text-gray-900 text-md"
                onClick={() => {
                  close();
                }}
                on={`${on}.close`}
              >
                &#10005;
              </button>
            </div>
          </div>

          <div
            className="flex flex-wrap w-80 px-2  mx-auto"
            style={{ maxHeight: '80vh', overflow: 'auto' }}
          >
            {!loading && data.length > 0
              ? data
                  .filter((v) => {
                    return router.query.subcategory || !v.capital;
                  })
                  .map((v) => {
                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          onStateSelect(v);
                        }}
                        className="py-1  cursor-pointer"
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

export default ListingStateSelectModal;
