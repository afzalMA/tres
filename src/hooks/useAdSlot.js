import { useEffect } from 'react';

export function useAdSlot({ mapping, sizes, id, gptId, isTransitioning }) {
  useEffect(() => {
    if (!isTransitioning && typeof window !== undefined) {
      const { googletag } = window;
      googletag.cmd.push(function () {
        const adMapping = googletag.sizeMapping();
        Object.keys(mapping).forEach((breakpoint) => {
          adMapping.addSize([Number(breakpoint), 0], [mapping[breakpoint]]);
        });
        const builtMapping = adMapping.build();

        googletag
          .defineSlot(id, sizes, gptId)
          .defineSizeMapping(builtMapping)
          .addService(googletag.pubads());
        googletag.enableServices();
      });

      googletag.cmd.push(function () {
        googletag.display(gptId);
      });
    }
  }, [mapping, sizes, id, gptId, isTransitioning]);
}
