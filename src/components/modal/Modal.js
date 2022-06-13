import ClientOnlyPortal from '@components/modal/ClientOnlyPortal';
import useTranslator from '@hooks/useTranslator';
import { useContext } from 'react';

const Modal = ({
  open,
  title,
  onClose,
  children,
  isMobile,
  width,
  height,
  ampon,
}) => {
  const { t } = useTranslator();
  const isAMP = false;

  return (
    <>
      {open && (
        <ClientOnlyPortal selector="#modal">
          <div className="backdrop flex justify-center items-center">
            <div
              className="modal"
              style={{ width: width || 'auto', height: height || 'auto' }}
            >
              {!isMobile ? (
                <div className="header text-xl flex justify-between bg-gray-300 p-4 items-center">
                  <div className="text-gray-600 font-semibold">
                    {t(title) || ''}
                  </div>
                  <button
                    type="button"
                    className="font-semibold text-gray-500 hover:text-gray-900 text-2xl"
                    onClick={onClose}
                  >
                    &#10005;
                  </button>
                </div>
              ) : null}
              {children}
            </div>
            <style jsx>{`
              :global(body) {
                overflow: hidden;
              }
              .backdrop {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 9999;
              }
              .modal {
                background-color: white;
                width: 400px;
                max-width: 95vw;
                min-height: 200px;
                border-radius: 6px;
                position: relative;
              }
              .header {
                background: #e9e9e9;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
              }
            `}</style>
          </div>
        </ClientOnlyPortal>
      )}
    </>
  );
};

export default Modal;
