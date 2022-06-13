import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Media, MediaContextProvider } from 'media';

import API from '@services/api/API';
import APIEnum from '@services/api/APIEnum';
import { stateCodeConverter } from '@utils/Helpers';

import Article from '@components/article/Article';
import BottomRelatedBar from '@components/article/BottomRelatedBar';
import Breadcrumbs from '@components/article/Breadcrumbs';
import { useRouter } from 'next/router';
import { languageMap } from '@utils/Constants';

const ArticleList = ({ articleData }) => {
  const api = API(APIEnum.CatalogList);
  const router = useRouter();
  const language = languageMap[router.query.language];
  const [isDesktop, setIsDesktop] = useState(null);
  const [infiniteTaboola, setInfiniteTaboola] = useState(false)
  const [articles, setArticles] = useState(articleData.articles);
  const [loading, setLoading] = useState(false);
  const [htmlShow, setHtmlShow] = useState(true);
  const [related, setRelated] = useState([]);
  const [mobileAds, setMobileAds] = useState([]);
  const [rhs, setRhs] = useState(null);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const [loadRelated, setLoadRelated] = useState(false);
  const [viewed, setViewed] = useState([]);

  const relatedArticlesFetcher = (...args) => {
    const [apiEnum, methodName, contentId] = args;
    return api[apiEnum][methodName]({
      config: { isSSR: methodName !== 'getArticleDetails' },
      query: {
        // region: country,
        response: methodName === 'getArticleDetails' ? 'r2' : 'r1',
        item_languages: language,
        page: 0,
        page_size: window && window.innerWidth >= 768 ? 10 : 1,
        content_id: contentId,
        gallery_ad: true,
        scroll_no: 0,
        // portal_state: english,
        state: stateCodeConverter(location.pathname.split('/')[2]),
      },
    }).then((res) => {
      return res.data.data;
    });
  };

  const { data: adData, error: adError } = useSWR(
    () => {
      return isDesktop
        ? ['CatalogList', 'getArticleDetails', articleData.contentId]
        : null;
    },
    relatedArticlesFetcher,
    { dedupingInterval: 5 * 60 * 1000 }
  );

  const { data, error } = useSWR(
    () => {
      return loadRelated
        ? ['CatalogList', 'getRelatedArticles', articleData.contentId]
        : null;
    },
    relatedArticlesFetcher,
    { dedupingInterval: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);

  // Set articles from articleData
  useEffect(() => {
    if (articleData) {
      if (articleData.error) {
        // Handle error
      } else {
        setArticles(articleData.articles);
      }
    }
    if (data) {
      stopLoading();
      setMobileAds(data.bf_af_ads ? data.bf_af_ads[0] : null);
      setRelated(data.catalog_list_items);
    } else {
      startLoading();
    }

    if (adData) {
      let article = articles.find(
        (article) => article.data.content_id === articleData.contentId
      );
      if (article) {
        setRhs(
          adData.catalog_list_items.slice(1).filter((v) => {
            return (
              v.layout_type.indexOf('ad_unit') >= 0 ||
              (v.layout_type.indexOf('ad_unit') === -1 &&
                v.catalog_list_items.length > 0)
            );
          })
        );
        article.desktop = adData.catalog_list_items[0].catalog_list_items[0];
      }
    }

    return () => {
      // api && api.shutdown();
    };
  }, [articleData, data, adData]);

  // Listen to scroll positions for loading more data on scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const handleScroll = async () => {
    setLoadRelated(true);
    if (!htmlShow) {
      setHtmlShow(true);
    }

    const iframes = document.querySelectorAll('[data-etv-src]');
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].src = iframes[i].dataset.etvSrc;
      delete iframes[i].dataset.etvSrc;
    }
    const el = document.querySelector('.html-content.hide');
    if (el) {
      el.classList.remove('hide');
    }
    // To get page offset of last article
    const lastArticleLoaded = document.querySelector(
      '.article-list > .article:last-child'
    );
    if (lastArticleLoaded) {
      let offsetHeight = document.body.offsetHeight;
      if (window.innerWidth < 769) {
        offsetHeight -= 350;
      }
      if (Math.round(window.innerHeight + window.pageYOffset) >= offsetHeight) {
        const curIndex = related.findIndex(
          (v) =>
            v.content_id === lastArticleLoaded.getAttribute('data-content-id')
        );
        if (
          curIndex > -1 &&
          curIndex < 9 &&
          !loading &&
          related[curIndex + 1]
        ) {
          startLoading();
          await api.CatalogList.getArticleDetails({
            query: {
              response: 'r2',
              item_languages: language,
              content_id: related[curIndex + 1].content_id, //variable
              page_size: 1, // window.innerWidth < 769 ? 1 : 10,
              portal_state: stateCodeConverter(location.pathname.split('/')[2]),
              scroll_no: articles.length,
            },
          }).then((res) => {
            const newArticle =
              res.data.data.catalog_list_items[0].catalog_list_items[0];
            // const rhs = res.data.data.catalog_list_items.slice(1);
            const scriptTagExtractionRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
            const html = newArticle
              ? newArticle.html_tag.replace(scriptTagExtractionRegex, '')
              : '';

            /* const scripts = [];

            let matchedScript = null;
            do {
              matchedScript = scriptTagExtractionRegex.exec(newArticle.html_tag);
              if (matchedScript) {
                scripts.push(matchedScript[0]);
              }
            } while (matchedScript);
            console.log(scripts); */
            const newList = [
              ...articles,
              {
                html: html,
                data: newArticle,
                contentId: newArticle.content_id,
              },
            ];
            setArticles(newList);
            stopLoading();
          });
        }
      }
    }
  };

  const scrollToArticle = (article) => {
    const articleEl = document.querySelector(
      `.article[data-content-id=${article.content_id}]`
    );
    if (articleEl) {
      // articleEl.scrollIntoView({ behavior: "smooth", inline: "nearest" });

      const y = articleEl.getBoundingClientRect().top + window.scrollY - 28;
      window.scroll({
        top: y,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {/* <div className="article-count fixed right-0 text-white top-0 z-50 p-3 text-2xl font-bold">{articles.length}</div> */}{' '}
      <Breadcrumbs />
      <ul className={`article-list flex flex-col lg:container lg:mx-auto `}>
        {articles.length > 0 &&
          articles.map((article, index) => (
            <Article
              key={article.contentId}
              {...article}
              rhs={rhs}
              infiniteTaboola={false}
              related={related}
              desktop={article.desktop}
              nextArticle={index < 9 ? related[index + 1] : null}
              scrollToNextArticle={() => scrollToArticle(related[index + 1])}
              viewed={viewed}
              index={index}
              userAgent={isDesktop ? '' : 'Mobile'}
              htmlShow={htmlShow}
              ads={mobileAds}
              updateViewed={(viewed) => {
                setViewed(viewed);
              }}
            />
          ))}
        {loading && (
          <h1 className="w-full text-red-700 text-2xl z-10">Loading ...</h1>
        )}
      </ul>
      {related ? (
        <MediaContextProvider>
          <Media
            greaterThan="xs"
            className="fixed bottom-0 z-1100 w-screen h-16 "
          >
            {' '}
            <BottomRelatedBar data={related} />
          </Media>
        </MediaContextProvider>
      ) : null}
    </>
  );
};
export default ArticleList;
