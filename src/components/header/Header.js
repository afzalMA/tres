import { capSentence } from '@components/article/Breadcrumbs';
import DesktopHeader from '@components/header/DesktopHeader';
import MobileHeader from '@components/header/MobileHeader';
import { Media, MediaContextProvider } from 'media';
import Head from 'next/head';

export default function Header({ data, language }) {
  let menuHeaders = {};
  try {
    if (data && data.menu && data.menu.mobile) {
      const names = [];
      const urls = [];

      data.menu.mobile.map((item) => {
        const name =
          language === 'en'
            ? capSentence(item.ml_title[0].text)
            : item.ml_title[0].text;
        names.push(name);
        urls.push('https://www.etvbharat.com' + item.url);
        if (item.total_items_count > 0) {
          item.catalog_list_items.map((subitem) => {
            names.push(
              name + '-' + language === 'en'
                ? capSentence(subitem.ml_title[0].text)
                : subitem.ml_title[0].text
            );
            urls.push('https://www.etvbharat.com' + subitem.url);
          });
        }
      });

      if (names.length > 0 && urls.length > 0) {
        menuHeaders = { names: names, urls: urls };
      }
    }
  } catch (e) {
    console.log(e);
  }
  return (
    <>
      <Head>
        {menuHeaders && menuHeaders.names && menuHeaders.urls ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `{
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "name": ${
                  menuHeaders.names ? JSON.stringify(menuHeaders.names) : ''
                },
                "url": ${
                  menuHeaders.urls ? JSON.stringify(menuHeaders.urls) : ''
                }
              }
              `,
            }}
          ></script>
        ) : null}
      </Head>

      <MediaContextProvider>
        <Media at="xs">
          {(mediaClassNames, renderChildren) => {
            return <MobileHeader className={mediaClassNames} data={data} />;
          }}
        </Media>
        <Media greaterThan="xs">
          {(mediaClassNames, renderChildren) => {
            return <DesktopHeader className={mediaClassNames} data={data} />;
          }}
        </Media>
      </MediaContextProvider>
    </>
  );
}
