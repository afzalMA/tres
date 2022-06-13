import React from 'react';
import { NextSeo } from 'next-seo';
import API from '@api/API';
import APIEnum from '@api/APIEnum';
import Head from 'next/head';
import {
  configStateCodeConverter,
  getAmpUrl,
  loadJS,
  stateCodeConverter,
  thumbnailExtractor,
} from '@utils/Helpers';
import { applicationConfig, languageMap } from '@utils/Constants';
import { useRouter } from 'next/router';
import useTranslator from '@hooks/useTranslator';
import {fetchMenuData} from '@utils/MenuData';
import ArticleList from '@components/article/ArticleList';
import PageListing from '@components/listing/PageListing';
import { getData } from '..';

const slug = ({ data, initCount, pageType, id, payload, dropDownData }) => {
  const router = useRouter();
  const { appLanguage } = useTranslator();
  let ampUrl = '';
  const scriptTagExtractionRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const convertedState = configStateCodeConverter(router.query.state);
  let fbContentId = '';
  if (
    applicationConfig &&
    applicationConfig.value &&
    applicationConfig.value.params_hash2
  ) {
    const fbContent =
      applicationConfig.value.params_hash2.config_params.fb_pages[
        convertedState
      ];
    fbContentId = fbContent ? fbContent.fb_page_id : null;
  }

  let ampExists = null;
  if (id) {
    const match = id.match(/(\d+)/);
    if (match) {
      ampExists = +match[0].slice(0, 12) >= 202102120000;
    }
  }
  let readwhere = false;

  const splitPath = router.asPath.split('/');
  const state = splitPath[2];
  if (
    state === 'uttar-pradesh' ||
    (state === 'national' && splitPath[1] !== 'urdu')
  ) {
    readwhere = true;
    ampExists = true;
  }

  // const ampExists = false; // prod enabling amp

  const getComponent = () => {
    let component = null;
    let headerObj = {};
    let stateName = null;
    let canonicalUrl = '';

    if (pageType === 'error') {
      return <div>URL Not Found</div>;
    } else if (pageType === 'redirect') {
      return null;
    }

    const pathname = new URL(`http:localhost:3000${router.asPath}`).pathname;
    const splitPath = pathname.split('/');

    if (pageType === 'article') {
      if (
        data.state &&
        data.state.length > 0 &&
        data.state.indexOf('na') !== -1
      ) {
        if (data.item_languages.indexOf('hi') !== -1) {
          stateName = 'delhi';
        } else if (data.item_languages.indexOf('te') !== -1) {
          stateName = 'telangana';
        } else if (data.item_languages.indexOf('ur') !== -1) {
          stateName = 'national';
        }
      }
    }

    const actualUrl = data.web_url;
    if (stateName) {
      canonicalUrl = `https://www.etvbharat.com${[
        ...splitPath.slice(0, 2),
        stateName,
        ...actualUrl.split('/').slice(2),
      ].join('/')}`;
    }else if(router.asPath){
      canonicalUrl = `https://www.etvbharat.com${router.asPath}`;
    } else {
      canonicalUrl = `https://www.etvbharat.com/${actualUrl}`;
    }
    if (pageType === 'article') {
      ampUrl = `https://www.etvbharat.com/amp/${actualUrl}`;
    }

    const state = splitPath[2];
    if (
      state === 'uttar-pradesh' ||
      (state === 'national' && splitPath[1] !== 'urdu')
    ) {
      ampUrl = getAmpUrl(canonicalUrl, splitPath.length === 3);
    }

    switch (pageType) {
      case 'article':
        const tags = new Set();
        let datum = {};
        const html = data
          ? data.html_tag
              .replace(scriptTagExtractionRegex, '')
              .replace(
                '<link rel="stylesheet" href="https://etvbharatimages.akamaized.net/newsroom-metadata/saranyunewsroom-2.css">',
                ''
              )
              .replace(/src=(['"])/g, 'data-etv-src=$1')
          : '';

        if (typeof window !== 'undefined') {
          let scrollDepth = !1;
          window.addEventListener(
            'scroll',
            function () {
              ((0 != document.documentElement.scrollTop &&
                !1 === scrollDepth) ||
                (0 != document.body.scrollTop && !1 === scrollDepth)) &&
                (!(function () {
                  const scripts = [];

                  let matchedScript = null;
                  do {
                    matchedScript = scriptTagExtractionRegex.exec(
                      data.html_tag
                    );
                    if (matchedScript) {
                      scripts.push(matchedScript[0]);
                    }
                  } while (matchedScript);

                  scripts.forEach((v) => {
                    const regex = /<script.*?src="(.*?)"/;
                    let m = regex.exec(v);
                    if (m) {
                      tags.add(m[1]);
                      loadJS(m[1]);
                    }
                  });
                })(),
                (scrollDepth = !0));
            },
            !0
          );
        }
        datum.html = html;
        datum.data = data;

        datum.contentType = data.content_type;
        datum.contentId = data.content_id;

        let k = data.update_date_string
          ? data.update_date_string.slice(0, 10)
          : '';
        let T = data.publish_date_string
          ? data.publish_date_string.slice(0, 10)
          : '';

        headerObj = {
          title: data.title,
          canonicalUrl: canonicalUrl,
          ampUrl: ampUrl,
          publish_date_string: data.publish_date_string,
          fbContentId: fbContentId,
          thumbnail: thumbnailExtractor(
            data.thumbnails,
            '3_2',
            'b2s',
            data.media_type
          ),

          description: data.short_description || data.description,
          keywords: data.keywords ? data.keywords.join(', ') : '',
          url: data.web_url,
          contentType: data.content_type,
          ldjson: true,
          headline: data.title.replace(/\"/gi, '\\"'),
          thumbnailM:
            data.thumbnails && data.thumbnails.medium_3_2
              ? data.thumbnails.medium_3_2.url
              : '',
          updatedAt: k,
          publishedAt: T,
        };

        component = (
          <ArticleList
            articleData={{ articles: [datum], contentId: datum.contentId }}
          />
        );
        break;

      case 'navlisting':
        let item = data.catalog_list_items[0];
        if (item.meta_tag_keywords && item.meta_tag_keywords.length === 0) {
          item = data;
        }
        return (
          <>
            <Head>
              <title>
                {item.meta_tag_title !== '' &&
                !item.meta_tag_title.includes('canonical tag')
                  ? item.meta_tag_title
                  : 'ETV Bharat'}
              </title>
              <link rel="canonical" href={canonicalUrl}></link>
             
              
            </Head>

            <NextSeo
              title={
                item.meta_tag_title !== '' &&
                !item.meta_tag_title.includes('canonical tag')
                  ? item.meta_tag_title
                  : 'ETV Bharat'
              }
              description={item.meta_tag_description}
              additionalMetaTags={[
                {
                  name: 'keywords',
                  content: item.meta_tag_keywords
                    ? item.meta_tag_keywords.join(', ')
                    : '',
                },
              ]}
              openGraph={{
                site_name: 'ETV Bharat News',
                url: `https://www.etvbharat.com${pathname}`,
                type: 'article',
                title: item.meta_tag_title,
                description: item.meta_tag_description,
                images: [
                  {
                    url: `https://www.etvbharat.com/assets/logos/${appLanguage.name}.png`,
                    width: 200,
                    height: 200,
                    alt: 'ETV Bharat News',
                  },
                ],
              }}
              twitter={{
                handle: '@etvbharat',
                site: '@etvbharat',
                cardType: 'summary_large_image',
              }}
            />
            <PageListing
              key={canonicalUrl}
              canonicalUrl={canonicalUrl}
              item={item}
              data={data}
              initCount={initCount}
              payload={payload}
              dropdown={dropDownData}
            ></PageListing>
          </>
        );
      case 'redirect':
        return null;
      default:
        return <></>;
    }
    return (
      <>
        {headerObj.title ? (
          <>
            {' '}
            <Head>
              {/* <link rel="preload" as="image" href={headerObj.thumbnail.url} /> */}
              <title>{headerObj.title}</title>
              <link rel="canonical" href={headerObj.canonicalUrl}></link>
              {ampExists && (data.is_amp || readwhere) ? (
                <link rel="amphtml" href={headerObj.ampUrl}></link>
              ) : null}
              <meta
                name="fbPages"
                property="fb:pages"
                content={headerObj.fbContentId}
              ></meta>

              <link
                rel="preconnect"
                href="https://prod.api.etvbharat.com"
              ></link>
            
              <meta
                property="og:image:secure_url"
                content={headerObj.thumbnail.url}
              />
             
            </Head>
            <NextSeo
              title={headerObj.title}
              description={headerObj.description}
              additionalMetaTags={[
                {
                  name: 'keywords',
                  content: headerObj.keywords,
                },{
                  name: 'datePublished',
                  content: headerObj.publish_date_string,
                }
              ]}
              openGraph={{
                site_name: 'ETV Bharat News',
                url: `https://www.etvbharat.com/${headerObj.url}`,
                type: headerObj.contentType,
                title: headerObj.title,
                description: headerObj.description,
                images: headerObj.images || [
                  {
                    url: headerObj.thumbnail.url,
                    width: 768,
                    height: 512,
                    alt: headerObj.thumbnail.alt_tags,
                  },
                ],
              }}
              twitter={{
                handle: '@etvbharat',
                site: '@etvbharat',
                cardType: 'summary_large_image',
              }}
            />
          </>
        ) : null}
        {headerObj.ldjson ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `
 {
 "@context": "https://schema.org",
 "@type": "NewsArticle",
 "mainEntityOfPage": {
 "@type": "WebPage",
 "@id": "https://www.etvbharat.com/${headerObj.url}"

 },
 "keywords":"${headerObj.keywords}",
 "headline": "${headerObj.headline}",
 "description": "${headerObj.description.replace(/\"/gi, '\\"')}",
 "image": {
 "@type": "ImageObject",
 "url": "${headerObj.thumbnailM}",
 "width": 708,
 "height": 474
 },
 "author": {
 "@type": "Organization",
 "name": "ETV Bharat"
 },
 "publisher": {
 "@type": "Organization",
 "name": "ETV Bharat",
 "logo": {
 "@type": "ImageObject",
 "url": "https://www.etvbharat.com/assets/images/etvlogo/${(
   headerObj.url.split('/')[0] + ''
 ).toLowerCase()}.png",
 "width": 82,
 "height": 60
 }
 },
 "datePublished": "${headerObj.publishedAt}",
 "dateModified": "${headerObj.updatedAt || headerObj.publishedAt}"
 }`,
            }}
          ></script>
        ) : null}
        {component}
      </>
    );
  };
  return (
    <>
      {data ? (
        getComponent()
      ) : (
        <div className={'not-found'}>
          {/* <Error statusCode={404}></Error> */}
        </div>
      )}
    </>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params, ...args }) {
  
   let bypass = false,
    qparams = null;
  const url = `/${params.language}/${params.state}/${params.category}/${
    params.subcategory
  }/${params.slug.join('/')}`;
  const language = languageMap[params.language];
  const state = stateCodeConverter(params.state);
  const api = API(APIEnum.Listing, APIEnum.CatalogList);
  const urlSplit = url.split('/');
 let headerData = await    fetchMenuData(api,urlSplit,language,state);

  if (/[ `!@#%^&*()_+\=\[\]{};':"\\|,.<>~]/gi.test(url) || headerData === undefined) {
    return {
      notFound: true,
       
    };
  }

  

  qparams = {
    state: params.state,
    language: language,
  };

  bypass = url.indexOf('/live-streaming/') >= 0;
  const id = params.slug.slice(-1)[0];
  const re = new RegExp('(' + state + '|na)\\d+', 'gi');
  if (re.test(id) || bypass) {
   
    let type = urlSplit[0].toLowerCase();
    if (bypass) {
      type = 'live-streaming';
    }

    const articleResponse = await api.CatalogList.getArticleDetails({
      params: qparams,
      query: {
        item_languages: language,
        region: 'IN',
        response: 'r2',
        content_id: id, //variable
        gallery_ad: true,
        page: 0,
        page_size: 1,
        portal_state: state, //national
        scroll_no: 0,
      },
    });

    let article = null;
    let error = '';
    try {
      const articleResp = articleResponse.data.data.catalog_list_items[0];
      article = articleResp.catalog_list_items[0];
    } catch (e) {
      error = 'Invalid URL';
    }

    if (error || !article) {
      return {
       
        notFound: true,
        revalidate: 60, // revalidate
       
          
          
      };
    }
    // Pass data to the page via props

    return {
      props: {
        pageType: 'article',
        data: article,
        id: id,
        headerData: headerData,
      },
      revalidate: 60, // revalidate
    };
  } else {
    return getData(url, language, state, urlSplit, params,headerData);
  }
}
export default slug;
