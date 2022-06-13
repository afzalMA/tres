
import { useContext, useEffect, useRef, useState } from 'react';
const useNativeAd = ({ path, size, id }) => {
    useEffect(() => {
      const googletag = window.googletag || {};
      googletag.cmd = googletag.cmd || [];
      googletag.cmd.push(function() {
        googletag.defineSlot(path, ['fluid'], id)
          .addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
      });
      googletag.cmd.push(function() {
        googletag.display(id);
      });
    }, [path, size, id]);
  };

  export default useNativeAd;