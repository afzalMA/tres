import { useEffect, useState } from 'react';
import header from './Header.module.scss';

export default function AMPSidebar({ data }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data && data.menu && data.menu.desktop) {
      setItems(
        data.menu.desktop.map((v) => {
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
  }, [data]);

  return (
    <amp-sidebar
    next-page-hide="1"
    id="sidebar1"
      layout="nodisplay"
      style={{ width: '300px' }}
    >
      <amp-accordion id="myAccordion">
        {items.map((item, index) => {
          return (
            <section id={item.list_id} key={item.list_id}>
              <h2
                className={`${
                  item.total_items_count > 0 ? 'can-expand' : ''
                } accordion-header`}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 16px 5px 5px',
                    alignItems: 'center',
                  }}
                >
                  <a
                    href={`https://www.etvbharat.com/${item.url.split('/')[1]}`}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <span
                      className={`${header[item.icon]} ${
                        header['sidebar-icon']
                      } mr-2`}
                    ></span>
                    <span className="font-bold text-black">
                      {' '}
                      {item.ml_title[0].text}
                    </span>
                  </a>
                </div>
              </h2>

              {item.total_items_count > 0 ? (
                <div className="pb-1">
                  {item.catalog_list_items.map((subitem, ind) => {
                    return (
                      <a
                        key={subitem.list_id + ind}
                        className="pl-10 h-8 flex items-center text-sm font-normal hover:bg-gray-300"
                        href={`https://www.etvbharat.com/${
                          subitem.url.split('/')[1]
                        }`}
                      >
                        <span className="text-black">
                          {' '}
                          {subitem.ml_title[0].text}
                        </span>
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p></p>
              )}
            </section>
          );
        })}
      </amp-accordion>
    </amp-sidebar>
  );
}
