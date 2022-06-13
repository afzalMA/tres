import Image from 'next/image';
import { useState } from 'react';

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const Thumbnail = ({ thumbnail, className, type, lazy, layout }) => {
  const [state, setState] = useState({
    src: thumbnail.url,
    errored: false,
  });

  return (type === 'breaking_news' || type === 'news') && !state.src ? (
    <Image
      priority={!(lazy === undefined || lazy === true)}
      layout={layout || 'fill'}
      src={`/assets/images/${'breakingplate'}.png`}
      className="breaking_news"
      alt="Breaking News"
    />
  ) : !(lazy === undefined || lazy === true) ? (
    <Image
      layout={layout || 'fill'}
      priority
      src={state.src}
      layout="fill"
      className={`${className} ${type}`}
      alt={thumbnail.alt_tags}
    />
  ) : (
    <Image
      layout={layout || 'fill'}
      src={state.src}
      layout="fill"
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      className={`${className} ${type}`}
      alt={thumbnail.alt_tags}
    />
  );
};

export default Thumbnail;
