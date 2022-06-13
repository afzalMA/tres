import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { dateFormatter, thumbnailExtractor } from '@utils/Helpers';
import { Media, MediaContextProvider } from '@media';
import SocialMedia from '@components/article/SocialMedia';
import Thumbnail from '@components/common/Thumbnail1';
import { RTLContext } from '@components/layout/Layout';
import Sticky from 'wil-react-sticky';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import getConfig from 'next/config';
import TaboolaAd from '@components/article/TaboolaAd'
import InfiniteTaboolaAd from '@components/article/InfiniteTaboolaAd'
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

import { articleViewScroll } from '@utils/GoogleTagManager';
import { pageView, nextPageView } from '@utils/ComScore';

import { useRouter } from 'next/router';
// import FirstAd from '@components/Article/FirstAd';
// initialPosition
// div height
// current Scroll position

export default function Article({
  contentId,
  data,
  html,
  className,
  rhs,
  nextArticle,
  scrollToNextArticle,
  viewed,
  related,
  ads,
  index,
  userAgent,
  htmlShow,
  infiniteTaboola
}) {
  const isAMP = false;
  const [istaboolaShow, setIstaboolaShow] = useState(true);
  const contentRef = useRef(null);
  const isRTL = useContext(RTLContext);
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  let adlink = null;
  const lang = router.query.language;

  switch (lang) {
    case 'marathi':
      /* adlink = {
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

  useEffect(() => {
    let api = null;

    if (viewed.indexOf(contentId) === -1) {
      viewed.push(contentId);
      articleViewScroll(data, { newsArticle: true });

      if (viewed.length === 1) {
        pageView();
      } else {
        nextPageView();
      }
    }
    if (inView) {
      const contentIdFromUrl = window.location.href.split('/').slice(-1)[0];
      if (contentIdFromUrl === contentId) {
        return;
      } else {
        if (ref && ref.current) {
          const elBoundary = ref.current.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          if (elBoundary.top > 0 && elBoundary.top < windowHeight) {
            document.title = data.title;
            window.history.pushState(
              { id: data.title },
              data.title,
              '/' + data.web_url + location.search
            );

            var event = new CustomEvent('newurl', {
              detail: contentId,
            });
            
            setIstaboolaShow(true);
            window.dispatchEvent(event);
          }
        }
      }
    }

   // console.log('inside non-amp!!!!');
    const isDesktop = window.innerWidth >= 768;
    const divStyle = isDesktop
      ? `width: 728px; height: 90px;`
      : `width: 300px; height: 250px;`;
    const slotArr = isDesktop ? [728, 90] : [300, 250];
    let adHTML = null;
    let adConf = null;
    if (data.ad_conf && Array.isArray(data.ad_conf) && data.ad_conf[0]) {
      if (data.ad_conf[0].web_msite && data.ad_conf[0].web_msite) {
        adConf = data.ad_conf[0].web_msite;
      } else {
        if (isDesktop) {
          adConf = data.ad_conf[0].web ? data.ad_conf[0].web : null;
        } else {
          adConf = data.ad_conf[0].msite ? data.ad_conf[0].msite : null;
        }
      }
    }

    window.ads = window.ads || new Set();
    const ads = window.ads;

    const showAd = (ad_id, slotArr, id) => {
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
        window.ads.add(id);
      }
    };

    if (adConf && Array.isArray(adConf) && adConf.length > 0) {
      const els = document.querySelectorAll(
        `[data-content-id="${contentId}"] .EtvadsSection`
      );
      els.forEach((el, ind) => {
        const id = adConf[ind] ? adConf[ind].gpt_id : null;
        const ad_id = adConf[ind] ? adConf[ind].ad_unit_id : null;
        if (!ads.has(id)) {
          adHTML = `<div id='${id}' style='${divStyle}'></div>`;

          if (el && el.querySelector('#adsContainer')) {
            el.innerHTML = adHTML;
            showAd(ad_id, slotArr, id);
          } else {
            const el = document.getElementById(id);
            if (el && !el.hasChildNodes()) {
              showAd(ad_id, slotArr, id);
            }
            // console.log(window.ads);
            // console.log(adConf.gpt_id);
            // console.log('In-Article ad container not found!!!', contentId);
          }
        } else {
          const adEl = document.getElementById(id);

          setTimeout(() => {
            if (adEl && !adEl.querySelector('iframe')) {
              googletag.cmd.push(function () {
                googletag.pubads().refresh([window[ad_id]]);
              });
            }
          }, 300);
        }
      });
    }

    return () => {
      api && api.shutdown();
    };
  }, [inView, contentId, contentRef]);

  const thumbnail = thumbnailExtractor(
    data.thumbnails,
    '3_2',
    publicRuntimeConfig.IMG_SIZE === 'sm' ? 's2b' : 'b2s',
    data.media_type
  );
  return (
    <>
      <div
        data-content-id={contentId}
        id={contentId}
        className={`article relative flex flex-col md:flex-row w-full border-b-2 border-grey-500 md:space-x-10 ${
          isRTL ? 'md:flex-row-reverse rtl' : ''
        }`}
      >
        <MediaContextProvider>
          <Media
            greaterThan="xs"
            className={`lg-social hidden absolute md:flex flex-col justify-around pt-0 h-64 ${
              isRTL ? 'rtl-social' : ''
            }`}
          >
            <SocialMedia data={data} index={index} />
          </Media>
        </MediaContextProvider>

        <div className="md:w-8/12 h-full bg-white">
          <Sticky
            containerSelectorFocus={`.article[data-content-id="${contentId}"]`}
            stickyEnableRange={[768, Infinity]}
            offsetTop={60}
          >
            <div
              className={`${
                className || ''
              } actual-content lg:container lg:mx-auto px-3 md:px-0 bg-white `}
              ref={contentRef}
            >
              {index > 0 && ads ? (
                <div className="pt-3">
                  <MobileAd
                    key={'art' + (index * 2 + 2)}
                    adData={ads['' + (index * 2 + 1)]}
                  />
                </div>
              ) : null}
              <MediaContextProvider>
                <Media at="xs">
                  {/* {index === 0 ? (
                    <FirstAd adData={ads ? ads['' + (index * 2 + 1)] : null} />
                  ) : null}  */}
                  <div className="relative pb-10">
                    <h1
                      ref={ref}
                      className="leading-tight text-xl font-bold p-2"
                    >
                      {data.title}
                    </h1>

                    <div className="px-2 mb-2 text-sm text-gray-600 md:text-black always-english">
                      {data.publish_date_uts
                        ? `Published on: ${dateFormatter(
                            data.publish_date_uts,
                            false
                          )}`
                        : ''}
                      <span className="hidden md:inline-block">
                        {data.publish_date_uts && data.update_date_uts
                          ? `  |  `
                          : ''}
                      </span>
                      <br className="md:hidden" />
                      {data.update_date_uts
                        ? `Updated on: ${dateFormatter(
                            data.update_date_uts,
                            isAMP
                          )}`
                        : ''}
                    </div>
                    <div className="flex justify-between px-6 w-full mb-2 absolute z-10">
                      <SocialMedia data={data} index={index} />
                    </div>
                  </div>
                </Media>
              </MediaContextProvider>
              <div className="flex flex-col md:flex-col-reverse md:mb-8">
                <div
                  className="-mx-3 md:mx-0 relative "
                  style={{ minWidth: '300px', minHeight: '200px' }}
                >
                  {/*   <Thumbnail
                    thumbnail={thumbnail}
                    className={'md:rounded-lg w-full'}
                    type={data.media_type}
                    lazy={false}
                  /> */}

                  {index === 0 ? (
                    <div
                      className="w-full rounded-md -mt-10"
                      style={{
                        width: '100%',
                        padding: '38.25%',
                      }}
                    >
                      <Image
                        priority
                        layout="fill"
                        src={thumbnail.url}
                        alt="Thumbnail image"
                      />
                    </div>
                  ) : (
                    <Thumbnail
                      thumbnail={thumbnail}
                      className={'md:rounded-lg w-full'}
                      type={data.media_type}
                      lazy={false}
                    />
                  )}
                </div>
                <div className="pt-4 pb-3 md:pt-0 md:pb-0 md:mb-3 md:border-b-2 md:border-gray-500">
                  <MediaContextProvider>
                    <Media greaterThan="xs">
                      <h1
                        ref={ref}
                        className="leading-tight text-xl md:text-2xl md:pt-3 md:pb-2 font-bold"
                      >
                        {data.title}
                      </h1>

                      <div className="text-sm text-gray-600 md:text-black always-english">
                        {data.publish_date_uts
                          ? `Published on: ${dateFormatter(
                              data.publish_date_uts,
                              isAMP
                            )}`
                          : ''}
                        <span className="hidden md:inline-block">
                          {data.publish_date_uts && data.update_date_uts
                            ? `  |  `
                            : ''}
                        </span>
                        <br className="md:hidden" />
                        {data.update_date_uts
                          ? `Updated on: ${dateFormatter(
                              data.update_date_uts,
                              isAMP
                            )}`
                          : ''}
                      </div>
                    </Media>
                  </MediaContextProvider>
                </div>
              </div>

              {htmlShow ? (
                <div
                  className={`text-base md:text-md `}
                  dangerouslySetInnerHTML={{
                    __html: html,
                  }}
                />
              ) : null}

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

              {ads ? (
                <div className="pt-3">
                  <MobileAd
                    key={'art' + (index * 2 + 2)}
                    adData={ads['' + (index * 2 + 2)]}
                  />
                </div>
              ) : null}
              {
                (nextArticle !== null && related.length !== 0  && htmlShow ) ? <TaboolaAd index={index} url={'https://preprod.etvbharat.com/${data.web_url}'} />: null
              }
             
            {
              (nextArticle === null && related.length !== 0 && htmlShow ) ? (<InfiniteTaboolaAd index={index} url={'https://preprod.etvbharat.com/${data.web_url}'} />): null
            }
              
            </div>
          </Sticky>
        </div>

        <MediaContextProvider>
          <Media at="xs">
            <MobileNextArticle
              label={'next_article'}
              data={data}
              related={related}
              scrollToNextArticle={scrollToNextArticle}
              nextArticle={nextArticle}
            ></MobileNextArticle>
          </Media>

          <Media greaterThan="xs" className={`ad-content md:block md:w-4/12`}>
            <div className="w-full items-center space-y-6 pt-4 pb-4">
              {!rhs ? 'Loading...' : <AdContainer data={rhs} index={index} />}
            </div>
          </Media>
        </MediaContextProvider>
       
      </div>
    </>
  );
}

