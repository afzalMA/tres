import { useContext, useEffect, useRef, useState } from 'react';
import { TransitionContext } from '@pages/_app';

const GNativeAd = ({ adData, className, refresh }) => {
  const isTransitioning = useContext(TransitionContext);
  const isAMP = false;

  const [isDesktop, setIsDesktop] = useState(null);

  const adEl = useRef(null);
  let [width, height] = [null, null];
  if (
    adData &&
    adData.ad_unit &&
    adData.ad_unit.indexOf('728x90-300x250') === -1
  ) {
    [width, height] = adData.ad_unit
      .split('/')
      .slice(-1)[0]
      .split('x')
      .map((v) => {
        const num = /\d+/.exec(v);
        return num ? +num[0] : 400;
      });
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, [adData]);

  useEffect(() => {
    if (!isTransitioning && typeof window !== undefined && isDesktop != null) {
      if (adData && adData.ad_unit) {
        window.ads = window.ads || new Set();
        const ads = window.ads;

        if (!ads.has(adData.gpt_id)) {
          if (adEl.current) {
            if (window.googletag && googletag.apiReady) {
              if (adData.ad_unit.indexOf('728x90-300x250') > 0) {
                window[adData.gpt_id] = googletag
                  .defineSlot(
                    adData.ad_unit,
                    [
                      'fluid'
                    ],
                    adData.gpt_id
                  )
                  .addService(googletag.pubads());
                  googletag.pubads().enableSingleRequest();
                googletag.enableServices();
               
              } else {
                window[adData.gpt_id] = googletag
                  .defineSlot(adData.ad_unit, ['fluid'], adData.gpt_id)
                  .addService(googletag.pubads());
                  googletag.pubads().enableSingleRequest();
                googletag.enableServices();
              }

              googletag.cmd.push(function () {
                // googletag.pubads().collapseEmptyDivs();
              });

              googletag.cmd.push(function () {
                googletag.display(adData.gpt_id);
              });
              window.ads.add(adData.gpt_id);
            }
          }
        } else {
          if (adEl.current) {
            setTimeout(() => {
              if (adEl.current && !adEl.current.querySelector('iframe')) {
                googletag.cmd.push(function () {
                  googletag.pubads().refresh([window[adData.gpt_id]]);
                });
              }
            }, 300);
          }
        }
      }
    }
  }, [adData, isDesktop, adEl]);

  return (
    <div
      
    >
      {adData ? (
        <div
         
          id={adData.gpt_id}
          
        ></div>
      ) : null}
    </div>
  );
};

export default GNativeAd;
