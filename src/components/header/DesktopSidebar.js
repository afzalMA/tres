import { useContext, useEffect, useState } from 'react';
import header from './Header.module.scss';
import NavLink from '@components/common/NavLink';
import { subMenuClick, menuClick } from '@utils/GoogleTagManager';
import { RTLContext } from '@components/layout/Layout';

export default function DesktopSidebar({ data, onClose, isMobile = false }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const isRTL = useContext(RTLContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 10);
    const key = isMobile ? 'mobile' : 'desktop';
    if (data && data.menu && data.menu[key]) {
      setItems(
        data.menu[key].map((v) => {
          const urlSplit = v.url.startsWith('/')
            ? v.url.split('/').slice(1)
            : v.url.split('/');
          let icon = !!urlSplit[2] ? urlSplit[2] : 'national';
          if (urlSplit[3] === 'sports' && urlSplit[4]) {
            icon = urlSplit[4];
          }
          return { ...v, expanded: false, icon };
        })
      );
    }
    return () => clearTimeout(timer);
  }, [data]);

  const closeSidebar = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const toggleExpand = (index) => {
    const done = items[index].expanded;
    setItems((items) =>
      items.map((v, i) => {
        v.expanded = !done && index === i;
        return v;
      })
    );
  };

  return (
    <div className={`backdrop relative ${open ? 'open' : ''}`}>
      <div className="bg-white w-64 h-full st-menu">
        <div className="w-full h-10 cursor-pointer" onClick={closeSidebar}>
          <span className="transform -translate-x-3 float-right text-2xl font-semibold">
            &#215;
          </span>
        </div>
        <div
          className="items-container w-full flex flex-col divide-y divide-gray-300 border-b border-gray-300"
          style={{
            maxHeight: 'calc(100vh - 50px)',
            overflowY: 'auto',
          }}
        >
          {items.map((item, index) => {
            return (
              <div key={item.list_id} className="w-full">
                <div
                  className={`flex items-center flex-wrap justify-between h-12 pl-8 pr-6 hover:bg-gray-300 ${
                    isRTL ? 'flex-row-reverse rtl' : ''
                  }`}
                >
                  <NavLink
                    href={item.url}
                    as={item.url}
                    passHref
                    onClick={() => {
                      menuClick(item, 'sidemenu');
                    }}
                  >
                    <div
                      className={`flex items-center ${
                        isRTL ? 'flex-row-reverse rtl' : ''
                      }`}
                    >
                      <span
                        className={`${header[item.icon]} ${
                          header['sidebar-icon']
                        } ${isRTL ? 'ml-2' : 'mr-2'}`}
                      ></span>
                      <span className="font-bold">
                        {' '}
                        {item.ml_title[0].text}
                      </span>
                    </div>
                  </NavLink>

                  <div>
                    {item.total_items_count > 0 ? (
                      <span
                        className="text-xl font-bold text-gray-500 cursor-pointer"
                        onClick={() => {
                          toggleExpand(index);
                        }}
                      >
                        {!item.expanded ? (
                          <span>&#43;</span>
                        ) : (
                          <span>&#8722;</span>
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>

                {item.expanded ? (
                  <div className="pb-1">
                    {item.catalog_list_items.map((subitem) => {
                      return (
                        <NavLink
                          key={subitem.list_id}
                          className={`pl-10 h-8 flex items-center text-sm font-normal hover:bg-gray-300  ${
                            isRTL ? 'flex-row-reverse rtl' : ''
                          }`}
                          href={subitem.url}
                          as={subitem.url}
                          passHref
                          onClick={() => {
                            subMenuClick(subitem, item);
                          }}
                        >
                          <span> {subitem.ml_title[0].text}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="absolute -z-1 w-screen h-screen top-0 left-0"
        onClick={closeSidebar}
      ></div>

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
          z-index: 1003;
        }

        .st-menu {
          visibility: visible;
          -webkit-transform: translate3d(-100%, 0, 0);
          transform: translate3d(-100%, 0, 0);
          -webkit-transition: all 0.3s;
          transition: all 0.3s;
        }

        .backdrop.open .st-menu {
          visibility: visible;
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
        }
        .items-container::-webkit-scrollbar {
          width: 5px;
        }

        .items-container::-webkit-scrollbar-track {
          border-radius: 9px;
          background-color: #eee;
        }

        .items-container::-webkit-scrollbar-thumb {
          border-radius: 2.5px;
          background-color: #e30a0a;
        }
      `}</style>
    </div>
  );
}
