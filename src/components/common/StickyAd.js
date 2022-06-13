import { useContext, useEffect, useRef, useState } from 'react';
import { TransitionContext } from '@pages/_app';

const StickyAd = ({ className, refresh }) => {
  const adData = {
    gpt_id: 'div-gpt-ad-8094695-1',
    ad_unit: '/175434344/Mobile_Web_Test_Sticky',
  };

  const isTransitioning = useContext(TransitionContext);
  const [isDesktop, setIsDesktop] = useState(null);
  const adEl = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, [adData]);

  useEffect(() => {
    if (!isTransitioning && typeof window !== undefined && isDesktop != null) {
      setTimeout(() => {
        if (adData && adData.ad_unit) {
          window.ads = window.ads || new Set();
          const ads = window.ads;

          if (!ads.has(adData.gpt_id)) {
            if (adEl.current) {
              if (window.googletag && googletag.apiReady) {
                window[adData.gpt_id] = googletag
                  .defineSlot(adData.ad_unit, [[320, 50]], adData.gpt_id)
                  .addService(googletag.pubads());

                googletag.enableServices();

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
      }, 300);
    }
  }, [adData, isDesktop, adEl]);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
      className={className}
    >
      {adData ? (
        <div
          ref={adEl}
          data-ad-unit={adData.ad_unit}
          id={adData.gpt_id}
          style={{
            width: '330px',
            height: '50px',
          }}
        ></div>
      ) : null}
    </div>
  );
};

export default StickyAd;
