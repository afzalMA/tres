import { useEffect, useRef, useState } from 'react';

const ArticleThumbnail = ({
  thumbnail,
  className,
  type,
  creditSize = '',
  children,
  lazy,
  styleObj,
}) => {
  const isAMP = false;

  const [state, setState] = useState({
    src: thumbnail.url,
    errored: false,
  });
  const imgEl = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!!window.IntersectionObserver) {
        let observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                observer.unobserve(entry.target);
              }
            });
          },
          { rootMargin: '0px 0px 10px 0px' }
        );
        imgEl && observer.observe(imgEl.current);
      } else {
        imgEl && (imgEl.current.src = imgEl.current.dataset.src);
      }
    }
  });
  const onError = () => {
    if (!state.errored && !isAMP) {
      setState({
        src:
          'https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/placeholder.png',
        errored: true,
      });
    }
  };

  return (type === 'breaking_news' || type === 'news') && !state.src ? (
    <img
      ref={imgEl}
      loading={(lazy === undefined || lazy === true) && !isAMP ? 'lazy' : ''}
      className="breaking_news"
      alt="Breaking News"
      height="100%"
      width="auto"
      src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/placeholder.png"
      data-src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/breakingplate.jpg"
      src={`/assets/images/${
        (lazy === undefined || lazy === true) && !isAMP
          ? 'placeholder'
          : 'breakingplate'
      }.png`}
      style={styleObj}
    />
  ) : (
    <>
      <img
        ref={imgEl}
        data-src={state.src}
        height="100%"
        width="auto"
        src={state.src}
        onError={onError}
        className={`${className} ${type}`}
        alt={thumbnail.alt_tags}
        style={styleObj}
      />
      {thumbnail.credit ? (
        <div className={`image-credit ${creditSize}`}>{thumbnail.credit}</div>
      ) : null}
    </>
  );
};

export default ArticleThumbnail;
