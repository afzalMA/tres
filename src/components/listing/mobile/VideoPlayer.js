import video from '@components/video/Video.module.scss';
import {
  constructPlaybackUrl,
  smartUrlFetcher,
} from '@components/video/VideoList';
import { createHash } from '@utils/Helpers';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const VideoPlayer = ({ article, className }) => {
  const { publicRuntimeConfig } = getConfig();
  const [iframeSource, setIframeSource] = useState(null);

  const { data: smartUrls, error: smartUrlError } = useSWR(
    [
      article.play_url.url,
      createHash('ywVXaTzycwZ8agEs3ujx' + article.play_url.url),
      publicRuntimeConfig,
    ],
    smartUrlFetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (article && smartUrls) {
      setIframeSource(
        constructPlaybackUrl(article, smartUrls, publicRuntimeConfig) +
          '&autoplay=true&mute=true&content_type=live&v=' +
          Math.random()
      );
    }
  }, [article, smartUrls]);

  return (
    <div className={` ${className} ${video.player}`}>
      {iframeSource ? (
        <iframe src={iframeSource}></iframe>
      ) : (
        <img
          className={`w-full rounded-md -mt-10 `}
          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/newstime.png"
          alt="placeholder image"
        />
      )}
    </div>
  );
};

export default VideoPlayer;
