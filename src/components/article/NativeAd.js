import { useContext, useEffect, useRef, useState } from 'react';
import { TransitionContext } from '@pages/_app';

const NativeAd = ({ index }) => {
  const isTransitioning = useContext(TransitionContext);

  useEffect(() => {
    
    window.ads = window.ads || new Set();
    const ads = window.ads;
    if (window.googletag && googletag.apiReady) {
      window['native_ad'] = googletag
      .defineSlot(
        '/175434344/Native_adunit',
        ['fluid'],
        'native_ad'
      )
      .addService(googletag.pubads());
    googletag.enableServices();
    googletag.cmd.push(function () {
      googletag.display('native_ad');
    });
    window.ads.add('native_ad');
    }
   

    
  }, [index]);

  return (
    <div id={`native_ad`}></div>
  );
};

export default NativeAd;
