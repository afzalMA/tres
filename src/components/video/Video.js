import { useCallback, useContext, useEffect, useState } from 'react';
import { useInView, InView } from 'react-intersection-observer';
import { Media, MediaContextProvider } from '@media';
import SocialMedia from '@components/article/SocialMedia';
import video from './Video.module.scss';
import { articleViewScroll } from '@utils/GoogleTagManager';
import { pageView, nextPageView } from '@utils/ComScore';
import { RTLContext } from '@components/layout/Layout';
import Sticky from 'wil-react-sticky';
import { createHash, dateFormatter, loadJS } from '@utils/Helpers';
import AdContainer from '@components/article/AdContainer';
import InfiniteTaboolaAd from '@components/article/InfiniteTaboolaAd'
import useSWR from 'swr';
import {
  constructPlaybackUrl,
  smartUrlFetcher,
} from '@components/video/VideoList';
import getConfig from 'next/config';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Video = ({
  contentId,
  data,
  className,
  rhs,
  desktop,
  iframeSource,
  viewed,
  index,
  userAgent,
}) => {
  const isAMP = false;
  const { publicRuntimeConfig } = getConfig();
  const [isDesktop, setIsDesktop] = useState(null);
  const router = useRouter();

  const isRTL = useContext(RTLContext);
  const [source, setSource] = useState(iframeSource);
  const [showVideo, setShowVideo] = useState(false);
  const [inViewRef, inView, entry] = useInView({
    // delay: 200,
    // triggerOnce: true,
    threshold: 1,
  });

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

  const ref = useCallback(
    (node) => {
      if (node !== null && node) {
        inViewRef(node);
        ref.current = node;
      }
    },
    [inViewRef]
  );

  const { data: smartUrls, error: smartUrlError } = useSWR(
    () => {
      return isDesktop != null && !isDesktop && !isAMP
        ? [
            data.play_url.url,
            createHash('ywVXaTzycwZ8agEs3ujx' + data.play_url.url),
            publicRuntimeConfig,
          ]
        : null;
    },
    smartUrlFetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const isMobile = !isDesktop;
    if (isMobile && !isAMP && !source) {
      const source = constructPlaybackUrl(
        data,
        smartUrls,
        publicRuntimeConfig,
        isAMP,
        data.thumbnail
      );

      setSource(source);
    } else {
      setSource(iframeSource);
    }
  }, [smartUrls, iframeSource]);

  useEffect(() => {
    if (inView) {
      const urlParts = data.web_url.split('/');
      const state = urlParts[1];
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

      //  router.push(data.web_url, undefined, { shallow: true })
    }

    if (viewed.indexOf(contentId) === -1) {
      viewed.push(contentId);
      articleViewScroll(data, { videoArticle: true });
      if (viewed.length === 1) {
        pageView();
      } else {
        nextPageView();
      }
    }
    if (typeof window !== 'undefined' && !isAMP) {
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
            console.log('In-Article ad container not found!!!', contentId);
          }
        }
      }
    }
  }, [inView, contentId, rhs, desktop, source]);

  useEffect(() => {
    if (showVideo) {
      if (typeof window !== 'undefined' && !isAMP) {
        loadJS(
          'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'
        );
        loadJS(
          'https://players-saranyu.s3.amazonaws.com/etvbharat_staging/saranyu_player/plugin/external-js/scroll-playpause1.js'
        );
      }
      setTimeout(() => {
        let iframe = document.getElementById('player' + contentId);
        iframe.onload = function (params) {
          setTimeout(() => {
            iframe.contentWindow.postMessage('SPWebSiteVodsPlay');
          }, 600);
        };
      }, 200);
    }
  }, [showVideo]);

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
          className={`lg-social hidden absolute md:flex flex-col justify-around pt-2 h-64 ${
            isRTL ? 'rtl-social' : ''
          }`}
        >
          <SocialMedia data={data} index={index} />
        </Media>
      </MediaContextProvider>

      <div className={`${video.container} md:w-8/12  md:h-full`} style={{ paddingBottom: 'calc(100% + 2rem)' }}>
        <Sticky
          containerSelectorFocus={`.article[data-content-id="${contentId}"]`}
          stickyEnableRange={[768, Infinity]}
          offsetTop={60}
        >
          <div
            className={`${
              className || ''
            } actual-content lg:container lg:mx-auto px-3 md:px-0 `}
          >
            <div className="flex flex-col md:flex-col-reverse md:mb-1">
              <div className="pt-4 pb-3 md:pt-0 md:pb-0 md:mb-3 md:border-b-2 md:border-gray-500">
                <h1
                  ref={ref}
                  className="leading-tight text-xl md:text-2xl md:pt-3 md:pb-2 font-bold"
                >
                  {data.title}
                </h1>
                {data.publish_date_uts ? (
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
                ) : null}
              </div>

              <MediaContextProvider>
                <Media
                  at="xs"
                  className="flex justify-between mx-auto w-full mb-2 px-6"
                >
                  <SocialMedia data={data} index={index} />
                </Media>
              </MediaContextProvider>
            </div>

            {
              <div className={`${video.player} z-0 md:m-0 -mx-3`} >
                {!showVideo ? (
                  <div
                    className="play-button"
                    onClick={() => {
                      setShowVideo(true);
                    }}
                  >
                    <div
                      className="w-full rounded-md -mt-10"
                      style={{
                        width: '100%',
                        padding: '30.25%',
                      }}
                    >
                      <Image
                        priority
                        layout="fill"
                        src={data.thumbnail.url}
                        alt="Thumbnail image"
                      />
                    </div>
                    <img
                      className="play-pause"
                      src="/assets/images/play_pause.png"
                    />
                  </div>
                ) : source ? (
                  <iframe id={'player' + contentId} src={source}></iframe>
                ) : null}
              </div>
            }

            <div
              className="px-2 pt-4 text-sm lg:text-base text-justify lg:text-left"
              
            >
              {data.description}
            </div>

            <div className="EtvadsSection">
              <div id="adsContainer"></div>
            </div>

            <InView
              as="div"
              className="pseudo quarter"
              triggerOnce={true}
              onChange={(inView, entry) => {
                if (inView) {
                  articleViewScroll(data, { videoArticle: true }, 25);
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
                  articleViewScroll(data, { videoArticle: true }, 50);
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
                  articleViewScroll(data, { videoArticle: true }, 75);
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
                  articleViewScroll(data, { videoArticle: true }, 100);
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
              <InfiniteTaboolaAd index={0} url={`https://www.etvbharat.com/${data.web_url}`} /> 
            
             
           
            
          </div>
        </Sticky>
      </div>

      <MediaContextProvider>
        <Media greaterThan="xs" className={`ad-content md:block md:w-4/12`}>
          <div className="w-full items-center space-y-6 pt-4 pb-4">
            {!rhs ? 'Loading...' : <AdContainer data={rhs} index={index} />}
          </div>
        </Media>
      </MediaContextProvider>
    </div>
  );
};

export default Video;
