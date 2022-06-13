import { useCallback, useContext, useEffect, useState } from 'react';
import { useInView, InView } from 'react-intersection-observer';
import { Media, MediaContextProvider } from '@media';
import SocialMedia from '@components/article/SocialMedia';
import gallery from './Gallery.module.scss';
import { articleViewScroll } from '@utils/GoogleTagManager';
import { pageView, nextPageView } from '@utils/ComScore';
import { RTLContext } from '@components/layout/Layout';
import Sticky from 'wil-react-sticky';
import { dateFormatter } from '@utils/Helpers';
import React from 'react';
import dynamic from 'next/dynamic';
// import Thumbnail from '@components/common/Thumbnail';
import Thumbnail1 from '@components/common/Thumbnail1';
import TaboolaAd from '@components/article/TaboolaAd'
import InfiniteTaboolaAd from '@components/article/InfiniteTaboolaAd'
import Image from 'next/image';
import { useRouter } from 'next/router';

const options = {
  loading: () => <div>Loading...</div>,
};
const MobileAd = dynamic(() => import('@components/article/MobileAd'), options);
const MobileNextArticle = dynamic(
  () => import('@components/article/MobileNextArticle'),
  options
);
const AdContainer = dynamic(
  () => import('@components/article/AdContainer'),
  options
);

const Gallery = ({
  contentId,
  data,
  className,
  rhs,
  desktop,
  nextGallery,
  scrollToNextGallery,
  webUrl,
  scrollPosition,
  count,
  viewed,
  related,
  ads,
  index,
  scrolled,
  thumbnail,
}) => {
  const isAMP = false;
  const isRTL = useContext(RTLContext);
  const router = useRouter();
  const [paramExists, setParamExists] = useState(null);

  let adlink = null;
  const lang = router.query.language;

  switch (lang) {
    case 'marathi':
      /*  adlink = {
        text: 'जोडीदार शोधत आहात? मराठी मॅट्रीमोनीमध्ये रजीस्ट्रेशन मोफत आहे!',
        link:
          'http://campaign.bharatmatrimony.com/track/clicktrack.php?trackid=00100401215688',
      }; */
      break;
    case 'telugu':
      adlink = {
        text:
          'సంబంధం కోసం వెతుకుతున్నారా? తెలుగు మాట్రిమోని లో రిజిస్ట్రేషన్ ఉచితం!',
        link:
          'http://campaign.bharatmatrimony.com/track/clicktrack.php?trackid=00100401015686',
      };
      break;
    case 'kannada':
      adlink = {
        text:
          'ನಿಮ್ಮ ಸೂಕ್ತ ಸಂಗಾತಿ ಹುಡುಕುತ್ತಿರುವಿರಾ? ಕನ್ನಡ ಮ್ಯಾಟ್ರಿಮೋನಿಯಲ್ಲಿ ನೋಂದಣಿ ಉಚಿತ',
        link:
          'http://campaign.bharatmatrimony.com/track/clicktrack.php?trackid=00100401115687',
      };
      break;
  }
  adlink = null;

  const [inViewRef, inView, entry] = useInView({
    // delay: 200,
    // triggerOnce: true,
    threshold: 1,
  });

  const ref = useCallback(
    (node) => {
      if (node !== null && node) {
        inViewRef(node);
        ref.current = node;
      }
    },
    [inViewRef]
  );

  let properData = [
    {
      ...data[0],
      thumbnails: {
        l_large: { ...data[0].main_thumbnails.high_3_2 },
      },
    },
    ...data,
  ];

  if (
    thumbnail &&
    data[0].thumbnails &&
    data[0].thumbnails.l_large &&
    data[0].main_thumbnails.high_3_2.url === data[0].thumbnails.l_large.url
  ) {
    // properData = data;
  }
  /*   
  const {ref, inView, entry} = useInView({
    // delay: 200,
    // triggerOnce: true,
    threshold: 1,
  });
 */

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (index !== 0) return;
    if (
      !scrolled &&
      params.c_id &&
      (!paramExists || (paramExists && paramExists.content_id !== params.c_id))
    ) {
      const imageObj = properData.find((v) => v.content_id === params.c_id);
      setParamExists(imageObj);
      document.documentElement.scrollTop = 100;

      setTimeout(() => {
        const el = document.getElementById(params.c_id);
        if (el) {
          el.scrollIntoView({ block: 'center' });
        }
      }, 500);
    }
  });
  useEffect(() => {
    if (viewed.indexOf(contentId) === -1) {
      viewed.push(contentId);
      // updateViewed(viewed);
      // console.log(viewed);
      articleViewScroll(data[0], { galleryArticle: true });

      if (viewed.length === 1) {
        pageView();
      } else {
        nextPageView();
      }
    }
    if (inView) {
      const main = data[0];
      const contentIdFromUrl = window.location.pathname.split('/').slice(-1)[0];
      if (contentIdFromUrl === contentId) {
        return;
      } else {
        if (!scrolled) return;
        if (ref && ref.current) {
          const elBoundary = ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (elBoundary.top > 0 && elBoundary.top < windowHeight) {
            document.title = main.title;
            var pathArray  = window.location.pathname.split('/');
            
            const urlSearchParams = new URLSearchParams(window.location.search);
            const params = Object.fromEntries(urlSearchParams.entries());
            console.log(params)
            delete params.c_id;

            var queryString = Object.keys(params)
              .map((key) => key + '=' + params[key])
              .join('&');

            window.history.pushState(
              { id: main.title },
              main.title,
              location.origin +
                '/' +
                (webUrl.startsWith('/') ? webUrl.slice(1) : webUrl) +
                `${queryString ? '?' + queryString : ''}`
            );

            var event = new CustomEvent('newurl', {
              detail: contentId,
            });

            window.dispatchEvent(event);
            setTimeout(() => {
              /*   router.push({
                  pathname: '/[state]/[...slug]',
                  query: {
                    state,
                    slug: urlParts.slice(2)
                  },
                },
                  '/' + data.web_url, { shallow: true }) */
            }, 2000);
          }
        }
      }
    }

    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 768;
      const divStyle = isDesktop
        ? `width: 728px; height: 90px;`
        : `width: 300px; height: 250px;`;
      const slotArr = isDesktop ? [728, 90] : [300, 250];
      let adHTML = null;
      let adConf = null;
      if (data.ad_conf && Array.isArray(data.ad_conf) && data.ad_conf[0]) {
        if (data.ad_conf[0].web_msite && data.ad_conf[0].web_msite) {
          adConf = data.ad_conf[0].web_msite[0];
        } else {
          if (isDesktop) {
            adConf = data.ad_conf[0].web ? data.ad_conf[0].web[0] : null;
          } else {
            adConf = data.ad_conf[0].msite ? data.ad_conf[0].msite[0] : null;
          }
        }
      }

      const id = adConf ? adConf.gpt_id : null;
      const ad_id = adConf ? adConf.ad_unit_id : null;

      window.ads = window.ads || new Set();
      const ads = window.ads;

      if (id && ad_id) {
        if (!ads.has(adConf.gpt_id)) {
          adHTML = `<div id='${id}' style='${divStyle}'></div>`;
          const el = document.querySelector(
            `[data-content-id="${contentId}"] .EtvadsSection`
          );

          if (el && el.querySelector('#adsContainer')) {
            // document.body.appendChild(s);
            el.innerHTML = adHTML;
            setTimeout(() => {
              if (window.googletag && googletag.apiReady) {
                googletag.cmd.push(function () {
                  googletag.pubads().collapseEmptyDivs();
                  googletag
                    .defineSlot(ad_id, slotArr, id)
                    .addService(googletag.pubads());
                  googletag.enableServices();
                });
                googletag.cmd.push(function () {
                  googletag.display(id);
                });
                window.ads.add(adConf.gpt_id);
              }
            }, 10);
          } else {
           // console.log('In-Article ad container not found!!!', contentId);
          }
        }
      }
    }
  }, [inView, contentId]);

  return (
    <div
      data-content-id={contentId}
      className={`article relative flex flex-col md:flex-row w-full border-b-2 border-grey-500 md:space-x-10 ${
        isRTL ? 'md:flex-row-reverse rtl' : ''
      }`}
    >
      <MediaContextProvider>
        <Media
          greaterThan="xs"
          className={`lg-social hidden absolute md:flex flex-col justify-around pt-2  h-64 ${
            isRTL ? 'rtl-social' : ''
          }`}
        >
          <SocialMedia data={data[0]} index={index} />
        </Media>
      </MediaContextProvider>

      <div className="md:w-8/12">
        <div
          className={`${
            className || ''
          } actual-content lg:container lg:mx-auto px-3 md:px-0 `}
        >
          {index > 0 && ads ? (
            <div className="pt-3">
              <MobileAd adData={ads ? ads[index * 2 + 1] : null} />
            </div>
          ) : null}

          <div className="flex flex-col md:flex-col-reverse md:mb-4">
            <div className="pt-4 pb-3 md:pt-0 md:pb-0 md:mb-3 md:border-b-2 md:border-gray-500">
              <h1
                ref={ref}
                className="leading-tight text-xl md:text-2xl md:pt-3 md:pb-2 font-bold"
              >
                {data[0].display_title}
              </h1>
              {data[0].publish_date_uts ? (
                <div className="text-sm text-gray-600 md:text-black always-english">
                  {data[0].publish_date_uts
                    ? `Published on: ${dateFormatter(
                        data[0].publish_date_uts,
                        isAMP
                      )}`
                    : ''}
                  <span className="hidden md:inline-block">
                    {data[0].publish_date_uts && data[0].update_date_uts
                      ? `  |  `
                      : ''}
                  </span>
                  <br className="md:hidden" />
                  {data[0].update_date_uts
                    ? `Updated on: ${dateFormatter(
                        data[0].update_date_uts,
                        isAMP
                      )}`
                    : ''}
                </div>
              ) : null}
            </div>
          </div>

          <MediaContextProvider>
            <Media at="xs">
              <div className="flex justify-between w-full mb-2 px-6">
                <SocialMedia data={data} index={index} />
              </div>
            </Media>
          </MediaContextProvider>
          {
            data[0].main_description !== "" ? (  <div className="about-gallery">{data[0].main_description}</div>):null
          }
         
          <div className="space-y-5 p-3 pt-0">
            {properData.map((image, ind) => {
              if (
                image.layout_type &&
                image.layout_type.indexOf('ad_unit') >= 0 &&
                image.msite_ad_url.length > 0
              ) {
                const [width, height] =
                  image.layout_type === 'ad_unit_sqaure_gallery'
                    ? [300, 250]
                    : [550, 250];
                return scrolled ? (
                  <iframe
                    className="mx-auto"
                    key={image.ad_unit_id + ' ' + ind}
                    width={width + 50}
                    height={height + 50}
                    src={image.msite_ad_url}
                  />
                ) : null;
              } else {
                return (
                  <React.Fragment key={image.order_no + ' 1.' + ind}>
                    {ind === 0 ? (
                      <div
                        className="-mx-3 md:mx-0 relative "
                        style={{ minWidth: '300px', minHeight: '200px' }}
                      >
                        <div
                          className="w-full rounded-md"
                          style={{
                            width: '100%',
                            padding: '38.25%',
                            mariginTop: '30px',
                            marginBottom: '90px',
                          }}
                        >
                          <Image
                            priority
                            layout="fill"
                            src={image.thumbnails.l_large.url}
                            alt={image.description || image.title}
                          />
                        </div>
                        <div className={`${gallery.counter}`}>
                          <span>{image.order_no}</span>/ {count + 1}
                        </div>
                      </div>
                    ) : scrolled ? (
                      <>
                        <InView
                          as="div"
                          className="relative"
                          id={image.content_id}
                          onChange={(inView, entry) => {
                            if (inView) {
                              if (!paramExists) {
                                console.log('mysla',webUrl.startsWith('/'))
                                history.pushState(
                                  null,
                                  document.title,

                                  location.origin +
                                    '/' +
                                    (webUrl.startsWith('/')
                                      ? webUrl.includes('c_id') ? webUrl.slice(1).substring(0, webUrl.slice(1).lastIndexOf('/')): webUrl.slice(1)
                                      : webUrl.includes('c_id') ? webUrl.substring(0, webUrl.lastIndexOf('/')):webUrl) +
                                    '/c_id_' +
                                    image.content_id
                                );

                                articleViewScroll(data, {
                                  galleryArticle: true,
                                  location:
                                    location.origin +
                                    location.pathname.includes('c_id') ? location.pathname.substring(0, webUrl.lastIndexOf('/')) : location.pathname +
                                    '/c_id=' +
                                    image.content_id,
                                });
                              } else if (
                                paramExists.content_id === image.content_id
                              ) {
                                setParamExists(false);
                              } else {
                                setParamExists(false);
                              }
                            }
                          }}
                        >
                          <Thumbnail1
                            className={'rounded-lg'}
                            thumbnail={{
                              url: image.thumbnails.l_large.url,
                              alt_tags: image.description || image.title,
                            }}
                            lazy={
                              paramExists &&
                              paramExists.content_id === image.content_id
                                ? false
                                : true
                            }
                          />

                          <div className={`${gallery.counter}`}>
                            <span>{image.order_no + 1}</span>/ {count + 1}
                          </div>
                        </InView>
                        <div className="relative"></div>
                        <div className="text-md">
                          {image.description || image.title}
                        </div>
                      </>
                    ) : null}
                  </React.Fragment>
                );
              }
            })}
          </div>

          <InView
            as="div"
            className="pseudo quarter"
            triggerOnce={true}
            onChange={(inView, entry) => {
              if (inView) {
                articleViewScroll(data, { galleryArticle: true }, 25);
              }
            }}
          >
            <span></span>
          </InView>
          <InView
            as="div"
            className="pseudo half"
            triggerOnce={true}
            onChange={(inView, entry) => {
              if (inView) {
                articleViewScroll(data, { galleryArticle: true }, 50);
              }
            }}
          >
            <span></span>
          </InView>

          <InView
            as="div"
            className="pseudo three-quarter"
            triggerOnce={true}
            onChange={(inView, entry) => {
              if (inView) {
                articleViewScroll(data, { galleryArticle: true }, 75);
              }
            }}
          >
            <span></span>
          </InView>

          <InView
            as="div"
            className="pseudo full"
            triggerOnce={true}
            onChange={(inView, entry) => {
              if (inView) {
                articleViewScroll(data, { galleryArticle: true }, 100);
              }
            }}
          >
            <span></span>
          </InView>

          {adlink ? (
            <div className="matrimony-ad text-lg md:text-xl text-center">
              <a
                href={adlink.link}
                title={adlink.text}
                target="_blank"
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
              >
                {adlink.text}
              </a>
            </div>
          ) : null}
          <MobileAd adData={ads ? ads[index * 2 + 2] : null} />
          {
                (nextGallery !==null ) ? <TaboolaAd index={index} url={'https://www.etvbharat.com/${data.web_url}'} />: null
              }
             
            {
              (nextGallery === null ) ? (<InfiniteTaboolaAd index={index} url={'https://www.etvbharat.com/${data.web_url}'} />): null
            }
        </div>
      </div>

      <MediaContextProvider>
        <Media at="xs">
          <MobileNextArticle
            label={'next_gallery'}
            scrollToNextArticle={scrollToNextGallery}
            nextArticle={nextGallery}
            data={data}
            related={related}
          ></MobileNextArticle>
        </Media>
        <Media greaterThan="xs" className="md:block md:w-4/12">
          <Sticky
            containerSelectorFocus={`.article[data-content-id="${contentId}"]`}
            stickyEnableRange={[768, Infinity]}
            offsetTop={60}
          >
            <div className="w-full flex flex-col items-center space-y-6 pt-4 pb-20">
              {!rhs ? 'Loading...' : <AdContainer data={rhs} index={index} />}
            </div>
          </Sticky>
        </Media>
      </MediaContextProvider>
    </div>
  );
};

export default Gallery;
