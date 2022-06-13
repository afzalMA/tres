import { languageMap } from '@utils/Constants';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

let translations = null;
let oLanguage = null;
const useTranslator = (options = { init: false }) => {
  const router = useRouter();
  const [appLanguage, setAppLanguage] = useState({
    code: languageMap[router.query.language],
    name: router.query.language,
  });

  const fetchTranslationData = (language) => {
    if (!oLanguage || oLanguage !== language || !translations) {
      document.documentElement.lang = languageMap[language] || 'en';
      import(
        '../static/locales/' + document.documentElement.lang + '/common.js'
      )
        .then((res) => {
          const data = res.default;
          setAppLanguage((prevState) => ({
            ...prevState,
            code: languageMap[language],
            name: language,
          }));
          translations = data;
          oLanguage = language;
        })
        .catch((e) => {});
    }
  };

  useEffect(() => {
    const handleRouteComplete = (url, a) => {
      fetchTranslationData(url.split('/')[1]);
    };

    if (options.init) {
      if (typeof window !== undefined) {
        fetchTranslationData(router.query.language);
      }

      router.events.on('routeChangeComplete', handleRouteComplete);

      // If the component is unmounted, unsubscribe
      // from the event with the `off` method:
    }

    return () => {
      options.init &&
        router.events.off('routeChangeComplete', handleRouteComplete);
    };
  }, []);

  const t = (key) => {
    return translations ? translations[key] : '';
  };

  return { t, appLanguage };
};

export default useTranslator;
