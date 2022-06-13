import React, { useState, useEffect, useContext } from 'react';
import useSWR from 'swr';
import { Media, MediaContextProvider } from 'media';

import API from '@services/api/API';
import APIEnum from '@services/api/APIEnum';
import {
  configStateCodeConverter,
  createHash,
  stateCodeConverter,
  thumbnailExtractor,
} from '@utils/Helpers';

import BottomRelatedBar from '@components/article/BottomRelatedBar';
import Breadcrumbs from '@components/article/Breadcrumbs';
import Video from '@components/video/Video';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import VideoAPI from '@services/api/Video';
import { applicationConfig, languageMap } from '@utils/Constants';

export const smartUrlFetcher = (...args) => {
  const [play_url, hash, envs] = args;
  if (envs.APP_ENV !== 'development') {
    return VideoAPI(null)
      .getSmartUrls({
        params: {
          play_url: play_url,
          hash,
        },
        query: null,
        payload: null,
      })
      .then((resp) => {
        return resp;
      });
  } else {
    const api = API(APIEnum.Video);

    return api.Video.getSmartUrls({
      params: {
        play_url: play_url,
        hash,
        auth: 'kmAJAH4RTtqHjgoauC4o',
      },
      suv: true,
    }).then((resp) => {
      return resp.data;
    });
  }
};

export const constructPlaybackUrl = (
  data,
  smartData,
  publicRuntimeConfig,
  isAmp,
  thumbnail
) => {
  if (
    !smartData ||
    Object.keys(smartData).length === 0 ||
    !smartData.adaptive_urls
  ) {
    return null;
  }
  let urlSplit = data.web_url.split('/');
  let href =
    publicRuntimeConfig.APP_ENV !== 'development'
      ? `${window.location.origin}/${data.web_url}`
      : `https://www.etvbharat.com/${data.web_url}`;

  if (thumbnail.url.indexOf('/placeholder.png') > 0) {
    thumbnail.url = 'https://www.etvbharat.com/assets/images/newstime.png';
  }

  var s,
    r,
    a = 'live_stream' === data.media_type,
    o = urlSplit[0], //language
    l = urlSplit[1], // state
    c = urlSplit[2], // video
    d = urlSplit[3], //
    u = data.display_title,
    m = window.location.href;

  data.media_type,
    (s =
      '' == data.district[0] || void 0 == data.district[0]
        ? 'INDIA'
        : data.district[0]),
    (r =
      '' == data.city[0] || void 0 == data.district[0]
        ? 'INDIA'
        : data.city[0]);

  var h = 'english',
    p = {
      'andhra-pradesh': '10',
      assam: '11',
      english: '12',
      urdu: '13',
      bihar: '14',
      chhattisgarh: '15',
      delhi: '16',
      gujarat: '17',
      haryana: '18',
      'himachal-pradesh': '19',
      'jammu-and-kashmir': '20',
      jharkhand: '21',
      karnataka: '22',
      kerala: '23',
      'madhya-pradesh': '24',
      maharashtra: '25',
      odisha: '26',
      punjab: '27',
      rajasthan: '28',
      'tamil-nadu': '29',
      telangana: '30',
      'uttar-pradesh': '31',
      uttarakhand: '32',
      'west-bengal': '33',
    }[(h = 'national' == l ? o : l)],
    w = smartData.adaptive_urls[0].playback_url,
    g = smartData.adaptive_urls[0].video_duration,
    origin = '/assets/embed_etv.html?contenturl=',
    /*  origin = isAMP
      ? '/assets/embed_etv.html?contenturl='
      : publicRuntimeConfig.APP_ENV === 'staging' ||
        publicRuntimeConfig.APP_ENV === 'development'
      ? 'https://etvbharatimages.akamaized.net/player/etvbharat-test/embed_etv.html?contenturl='
      : 'https://etvbharatimages.akamaized.net/player/etvbharat-staging/embed_etv.html?contenturl=', */
    y =
      origin +
      w +
      (a ? '' : '&video_duration=' + g) +
      '&thumbnailurl=' +
      thumbnail.url +
      '&autoplay=' +
      (a ? 'true' : 'false') +
      '&mute=' +
      (a ? 'true' : 'false') +
      '&content_id=' +
      data.content_id +
      (a ? '&content_type=livestream' : '&content_type=vods') +
      '&comscorec3=' +
      p +
      '&ga_tracking=true&language=' +
      o +
      '&stateName=' +
      l +
      '&category=' +
      c +
      '&subcategory=' +
      d +
      '&videossection=true&videocity=' +
      r +
      '&videotitle=' +
      u +
      '&currentpageurl=' +
      href +
      '&videodistrict=' +
      s +
      '&constituency=INDIA';

  return y;
};

const VideoList = ({ videoData }) => {
  const isAMP = false;
  const { publicRuntimeConfig } = getConfig();

  const router = useRouter();
  const api = API(APIEnum.CatalogList, APIEnum.Video);
  const language = languageMap[router.query.language];
  const [videos, setVideos] = useState(videoData.videos);
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState([]);
  const [rhs, setRhs] = useState(null);
  const [isDesktop, setIsDesktop] = useState(null);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const [viewed, setViewed] = useState([]);
  const [mobileAds, setMobileAds] = useState([]);

  const relatedVideosFetcher = (...args) => {
    const [apiEnum, methodName, contentId] = args;

    let suffix = null;
    if (applicationConfig) {
      let convertedState = configStateCodeConverter(
        location.pathname.split('/')[2]
      );
      convertedState =
        location.pathname.split('/')[1] === 'urdu' ? 'urdu' : convertedState;

      suffix =
        applicationConfig.value['params_hash2'].config_params.ssr_details[
          convertedState
        ].video_details_link;
    }

    return api[apiEnum][methodName]({
      config: { isSSR: methodName !== 'getVideoDetails' },
      params: {
        state: location.pathname.split('/')[2],
        language: language,
        suffix: suffix,
      },
      query: {
        response: methodName === 'getVideoDetails' ? 'r2' : 'r1',
        item_languages: language,
        page: 0,
        page_size: 10,
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);

  const { data: smartUrls, error: smartUrlError } = useSWR(
    () => {
      return isDesktop
        ? [
            videoData.videos[0].data.play_url.url,
            createHash(
              'ywVXaTzycwZ8agEs3ujx' + videoData.videos[0].data.play_url.url
            ),
            publicRuntimeConfig,
          ]
        : null;
    },

    smartUrlFetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  const { data: adData, error: adError } = useSWR(
    () => {
      return isDesktop
        ? ['CatalogList', 'getVideoDetails', videoData.contentId]
        : null;
    },
    relatedVideosFetcher,
    { dedupingInterval: 5 * 60 * 1000 }
  );

  const { data, error } = useSWR(
    () => {
      return isDesktop
        ? ['CatalogList', 'getRelatedArticles', videoData.contentId]
        : null;
    },
    relatedVideosFetcher,
    { dedupingInterval: 5 * 60 * 1000 }
  );

  if (videos) {
    videos.forEach((video, ind) => {
      video.data.thumbnail = thumbnailExtractor(
        video.data.thumbnails,
        '3_2',
        //!isDesktop ? 's2b' : 'b2s',
        publicRuntimeConfig.IMG_SIZE === 'sm' ? 's2b' : 'b2s',
        video.data.media_type
      );

      if (video.data.thumbnail.url.indexOf('/placeholder.png') > 0) {
        video.data.thumbnail.url =
          'https://www.etvbharat.com/assets/images/newstime.png';
      }
    });
  }

  // Set videos from videoData
  useEffect(() => {
    if (data) {
      stopLoading();
      setMobileAds(data.bf_af_ads ? data.bf_af_ads[0] : []);
      setRelated(data.catalog_list_items);
    } else {
      startLoading();
    }

    let video = videos.find(
      (article) => article.data.content_id === videoData.contentId
    );

    if (video) {
      video.thumbnail = thumbnailExtractor(
        video.data.thumbnails,
        '3_2',
        // !isDesktop ? 's2b' : 'b2s',
        'b2s',
        video.data.media_type
      );

      if (video.thumbnail.url.indexOf('/placeholder.png') > 0) {
        video.thumbnail.url =
          'https://www.etvbharat.com/assets/images/newstime.png';
      }
    }

    if (adData) {
      if (video) {
        const data = adData.catalog_list_items.slice(1).filter((v) => {
          return (
            v.layout_type.indexOf('ad_unit') >= 0 ||
            (v.layout_type.indexOf('ad_unit') === -1 &&
              v.catalog_list_items.length > 0)
          );
        });
        if (data && data.length === 2) {
          setRhs(data[1].catalog_list_items);
        }
        video.desktop = adData.catalog_list_items[0].catalog_list_items[0];
      }
    }
    if (video && smartUrls) {
      video.iframeSource = constructPlaybackUrl(
        video.data,
        smartUrls,
        publicRuntimeConfig,
        isAMP,
        video.data.thumbnail
      );
      setVideos((videos) => [...videos]);
    } else {
      if (videoData) {
        if (videoData.error) {
          // Handle error
        } else {
          setVideos(videoData.videos);
        }
      }
    }
  }, [videoData, data, adData, smartUrls]);

  return (
    <>
      {/* <div className="article-count fixed right-0 text-white top-0 z-50 p-3 text-2xl font-bold">{videos.length}</div> */}
      <Breadcrumbs />

      <ul className="article-list flex flex-col lg:container lg:mx-auto">
        {videos.length > 0 &&
          videos.map((video, i) => (
            <Video
              key={video.contentId}
              {...video}
              rhs={rhs}
              iframeSource={video.iframeSource}
              nextVideo={i < 9 ? related[i + 1] : null}
              scrollToNextVideo={() => {}}
              viewed={viewed}
              related={related}
              index={i}
              ads={mobileAds}
              thumbnail={video.thumbnail}
              userAgent={isDesktop ? '' : 'Mobile'}
              updateViewed={(viewed) => {
                setViewed(viewed);
              }}
            />
          ))}
        {/*  {loading && (
          <h1 className="w-full text-red-700 text-2xl z-10">Loading ...</h1>
        )} */}
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
export default VideoList;
