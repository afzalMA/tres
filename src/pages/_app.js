import Layout from '@components/layout/Layout';
import ErrorLayout from '@components/layout/ErrorLayout';

import React, { useEffect, useState } from 'react';
import '@styles/tailwind.css';
import '@styles/_fonts.scss';
import '@styles/globals.scss';

import { useRouter } from 'next/router';
import { accessToken } from '@utils/Constants';
import Head from 'next/head';
import NProgress from 'nprogress';
import useTranslator from '@hooks/useTranslator';

export const TransitionContext = React.createContext(true);

function App({ Component, pageProps }) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const language = router.query.language || 'english';
  useTranslator({ init: true });

  useEffect(() => {
    const handleRouteChange = (url) => {
      // console.log(`Loading: ${url}`);
      NProgress.start();
      setIsTransitioning(true);
      // destroy all ad slots
      const { googletag } = window;
      window.ads = new Set();
      if (googletag) {
        googletag.cmd.push(function () {
          googletag.destroySlots();
        });
      }
    };
    const handleRouteError = () => NProgress.done();

    const handleRouteComplete = (url) => {
      NProgress.done();
      setIsTransitioning(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteComplete);
    router.events.on('routeChangeError', handleRouteError);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteError);
    };
  }, []);

  const langName = language;
  const langCap = langName.charAt(0).toUpperCase() + langName.slice(1);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="googlebot" content="all" />
        <meta name="bingbots" content="all" />
        <meta name="robots" content="all" />
        <meta name="theme-color" content="#07254c" />

        {/*      <link
          rel="preload"
          href={`https://etvbharatimages.akamaized.net/etvbharat/static/${
            langName === 'assamese'
              ? 'o-0IIpQlx3QUlC5A4PNr5TRA.woff2'
              : 'assets/fonts/' + langCap + '/' + langName + '.woff2'
          }`}
          as="font"
          type="font/woff2"
          crossOrigin={'anonymous'}
        /> */}
      </Head>

      <TransitionContext.Provider value={isTransitioning}>
       
        {/*   {isTransitioning ? <GlobalSpinner /> : null} */}
        
       {
         pageProps.headerData !== undefined ? (  <Layout key={pageProps.headerData.language + pageProps.headerData.keystate} accessToken={accessToken} headerData={pageProps.headerData} pageType={pageProps.pageType}>
          <Component {...pageProps} />
        </Layout>):( <ErrorLayout><Component {...pageProps} /></ErrorLayout>)
       }
       
      </TransitionContext.Provider>
    </>
  );
}

export default App;
