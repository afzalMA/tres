import { useContext, useEffect, useRef, useState } from 'react';
import { TransitionContext } from '@pages/_app';

const InfiniteTaboolaAd = ({ index,url }) => {
  const isTransitioning = useContext(TransitionContext);

  useEffect(() => {
    
    window._taboola = window._taboola || [];
    window._taboola.push({article:index, url:url});
window._taboola.push({mode: 'alternating-thumbnails-a', 
container: `taboola-below-article-thumbnails-${index}`, 
placement: 'Below Article Feed', target_type: 'mix'});
window._taboola.push({ flush: true });
   

    
  }, [index]);

  return (
    <div id={`taboola-below-article-thumbnails-${index}`}></div>
  );
};

export default InfiniteTaboolaAd;
