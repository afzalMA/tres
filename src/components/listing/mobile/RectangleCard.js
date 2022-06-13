import NavLink from '@components/common/NavLink';
import Thumbnail1 from '@components/common/Thumbnail1';
import { RTLContext } from '@components/layout/Layout';
import { articleClick } from '@utils/GoogleTagManager';
import { linkInfoGenerator, thumbnailExtractor } from '@utils/Helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

const RectangleCard = ({ data, article, className, keyProp }) => {
  const isRTL = useContext(RTLContext);

  const router = useRouter();
  const linkInfo = linkInfoGenerator(
    article ? article.web_url : data.url,
    router.query.state
  );

  const thumbnail = thumbnailExtractor(article.thumbnails, '3_2', 's2b', null);

  return (
    <NavLink
      key={keyProp}
      className={`flex  justify-between px-1 pt-1 pb-1 cursor-pointer border shadow ${
        isRTL ? 'rtl' : ''
      } ${className}`}
      href={linkInfo.href}
      as={linkInfo.as}
      passHref
      onClick={() => {
        articleClick(article);
      }}
    >
      <div
        className={`line-clamp-3 px-1 pt-1 text-base md:text-base text-gray-700 leading-tight ${
          isRTL ? 'rtl' : ''
        }`}
        style={{ width: 'calc(100% - 6rem)', maxHeight: '63px' }}
      >
        {article.display_title}
      </div>

      <div className="relative w-24 rounded-md ">
        <Thumbnail1
          thumbnail={thumbnail}
          className={'h-full'}
          type={''}
          creditSize={'no-size'}
          styleObj={{ minHeight: '65px' }}
        />

        {article.overlay_tag ? (
          <img
            loading="lazy"
            className="absolute bottom-0 right-0 h-full"
            src={`https://etvbharatimages.akamaized.net/images/live/${
              article.overlay_tag === 'live1' ? 'LIVE-1' : 'LIVE-2'
            }.png`}
            alt=""
          />
        ) : article.has_videos ? (
          <img
            className="absolute w-5 bottom-2 right-2 "
            src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/video_big_icon-2x.png"
            alt="etv play button"
          />
        ) : null}
      </div>
    </NavLink>
  );
};

export default RectangleCard;
