import React from 'react';
import { NextSeo } from 'next-seo';
import API from '@api/API';
import APIEnum from '@api/APIEnum';
import {
  configStateCodeConverter,
  getAmpUrl,
  loadJS,
  stateCodeConverter,
  thumbnailExtractor,
} from '@utils/Helpers';
import { applicationConfig, languageMap } from '@utils/Constants';
import { useRouter } from 'next/router';
import FileFetcher from '@services/api/FileFetcher';
import getConfig from 'next/config';
import {fetchMenuData} from '@utils/MenuData';
import Error from 'next/error';
import Head from 'next/head';
import VideoList from '@components/video/VideoList';
import useTranslator from '@hooks/useTranslator';
const slug = ({ data, pageType, id }) => {
  const router = useRouter();
  const { appLanguage } = useTranslator();
  const { publicRuntimeConfig } = getConfig();

  if (router.isFallback) {
    return <h2 className="loading"></h2>;
  }

  let ampUrl = '';
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
    ampExists = true;
    readwhere = true;
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

    if (pageType === 'article' || pageType === 'video') {
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

    if (stateName) {
      canonicalUrl = `https://www.etvbharat.com${[
        ...splitPath.slice(0, 2),
        stateName,
        ...splitPath.slice(3),
      ].join('/')}`;
    } else {
      canonicalUrl = `https://www.etvbharat.com${pathname}`;
    }

    ampUrl = `https://www.etvbharat.com/amp${pathname}`;

    const state = splitPath[2];
    if (
      state === 'uttar-pradesh' ||
      (state === 'national' && splitPath[1] !== 'urdu')
    ) {
      ampUrl = getAmpUrl(canonicalUrl, splitPath.length === 3);
    }

    let videoDatum = {};
    videoDatum.data = data;

    videoDatum.contentType = data.content_type;
    videoDatum.contentId = data.content_id;

    headerObj = {
      title: data.title,
      canonicalUrl: canonicalUrl,
      publish_date_string: data.publish_date_string,
      ampUrl: ampUrl,
      publishedAt: data.publish_date_string,
      fbContentId: fbContentId,
      thumbnail: thumbnailExtractor(
        data.thumbnails,
        '3_2',
        publicRuntimeConfig.IMG_SIZE === 'sm' ? 's2b' : 'b2s',
        data.media_type
      ),

      description: data.short_description || data.description,
      keywords: data.keywords ? data.keywords.join(', ') : '',
      url: data.web_url,
      contentType: data.content_type,
      ldjson: data.is_ldjson,
    };

    component = (
      <VideoList
        videoData={{
          videos: [videoDatum],
          contentId: videoDatum.contentId,
        }}
      />
    );

    return (
      <>
        {headerObj.title ? (
          <>
            {' '}
            <Head>
              {/* <link
                rel="preload"
                as="image"
                href={thumbnail ? thumbnail.url : headerObj.thumbnail.url}
              /> */}
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
              description={headerObj.description
                .replace(/\(/g, '%28')
                .replace(/\)/g, '%29')
                .replace(/\[/g, '%5B')
                .replace(/\]/g, '%5D')}
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
  "@type": "VideoObject",
  "name": "${headerObj.title}",
  "description": "${headerObj.description.replace(/\"/gi, '\\"')}",
  "thumbnailUrl": "${data.ldjson.videos[0].thumbnail}",
  "uploadDate": "${data.ldjson.videos[0].upload_date}",
  "contentUrl": "${data.ldjson.videos[0].url}",
  "embedUrl": "${data.ldjson.videos[0].url}"
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
          <Error statusCode={404}></Error>
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
  let  qparams = null,
    bypass = false;

  const url = `/${params.language}/${
    params.state
  }/live-streaming/${params.slug.join('/')}`;
  
  const language = languageMap[params.language];
  const state = stateCodeConverter(params.state);
  const api = API(APIEnum.Listing, APIEnum.CatalogList,  APIEnum.Catalog);
  const urlSplit = url.split('/');
 let headerData = await    fetchMenuData(api,urlSplit,language,state);
  if (/[ `!@#%^&*()_+\=\[\]{};':"\\|,.<>~]/gi.test(url) || headerData === undefined) {
    return {
      notFound: true,
   
    };
  }
  // const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  const userAgent = 'Mobile';

 

  qparams = {
    state: params.state,
    language: language,
  };

  bypass = url.indexOf('/live-streaming/') >= 0;
  const id = params.slug.slice(-1)[0];
  const re = new RegExp('(' + state + '|na)\\d+', 'gi');

  if (re.test(id) || bypass) {
    
    let type = params.slug[0].toLowerCase();
    if (bypass) {
      type = 'live-streaming';
    }

    if (typeof window !== 'undefined') {
      window['applicationConfig'] = applicationConfig;
    }
    let suffix = null;
    if (!applicationConfig.value) {
      const res = await FileFetcher.getAppConfig({
        query: {
          response: 'r2',
          item_languages: 'en',
          current_version: '1.1',
          region: 'IN',
          version: 'v2',
        },
        isSSR: true,
      });

      applicationConfig.value = res.data.data;
    }

    let convertedState = configStateCodeConverter(params.state);
    convertedState = params.language === 'urdu' ? 'urdu' : convertedState;
    suffix =
      applicationConfig.value['params_hash2'].config_params.ssr_details[
        convertedState
      ].video_details_link;

    const videoResponse = await api.CatalogList.getVideoDetails({
      params: {
        ...qparams,
        suffix: suffix,
      },
      query: {
        response: 'r2',
        item_languages: language,
        content_id: id, //variable
        gallery_ad: true,
        version: 'v2',
        page: 0,
        page_size: typeof window === 'undefined' ? 1 : 10,
        portal_state: state, //national
        region: 'IN',
        scroll_no: 0,
      },

      // config: { isSSR: typeof window === 'undefined' },

      // isSSR: typeof window === 'undefined',
    });
    const videoResp = videoResponse.data.data.catalog_list_items[0];
    const video = videoResp.catalog_list_items[0];
    // Pass data to the page via props
    if (!video) {
      return {
        notFound: true,
        revalidate: 60, // revalidate
       
      };
    }
    return {
      props: {
        pageType: 'video',
        data: video,
        userAgent: userAgent,
        id: id,
        headerData:headerData,
      },
      revalidate: 60, // revalidate
    };
  } else {
    return {
      notFound: true,
      revalidate: 60, // revalidate
      
    };
  }
}
export default slug;
