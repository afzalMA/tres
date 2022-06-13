import NavLink from '@components/common/NavLink';
import Thumbnail1 from '@components/common/Thumbnail1';
import { RTLContext } from '@components/layout/Layout';
import { articleClick, seeAll } from '@utils/GoogleTagManager';
import { thumbnailExtractor, linkInfoGenerator } from '@utils/Helpers';
import { useContext } from 'react';
import { useRouter } from 'next/router';

const SquareCard = ({
  data,
  article,
  className,
  lineClamp,
  style,
  imgHeight,
  noDescription,
  styleObj,
  main,
}) => {
  const isRTL = useContext(RTLContext);
  const router = useRouter();

  const linkInfo = linkInfoGenerator(
    article ? article.web_url : data ? data.url : null,
    router.query.state
  );

  const thumbnail = article
    ? thumbnailExtractor(article.thumbnails, '3_2', 's2b', 'breaking_news')
    : data && data.thumbnails
    ? thumbnailExtractor(data.thumbnails, '3_2', 's2b', 'breaking_news')
    : null;

  return article ? (
    <NavLink
      key={article.friendly_id}
      className={`flex  flex-col pb-1 cursor-pointer rounded-md shadow ${
        isRTL ? 'rtl' : ''
      } ${className}`}
      href={linkInfo.href}
      as={linkInfo.as}
      passHref
      onClick={() => {
        articleClick(article);
      }}
      style={style}
    >
      <div
        className="relative"
        style={{ height: imgHeight ? imgHeight : 'auto' }}
      >
        <Thumbnail1
          thumbnail={thumbnail}
          className={`rounded-t-md w-full ${imgHeight ? 'h-full' : ''}`}
          type={''}
          creditSize={'no-size'}
          styleObj={styleObj}
          lazy={main}
        ></Thumbnail1>

        {article.overlay_tag ? (
          <img
            className="absolute bottom-0 left-0 h-full "
            src={`https://etvbharatimages.akamaized.net/images/live/${
              article.overlay_tag === 'live1' ? 'LIVE-1' : 'LIVE-2'
            }.png`}
            alt=""
          />
        ) : article.has_videos ? (
          <img
            className="absolute w-6 bottom-1 right-1"
            src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/video_big_icon-2x.png"
            alt="etv play button"
          />
        ) : null}
      </div>

      <div className="h-12 my-2 pl-2 pr-1 text-gray-700 leading-tight">
        <div
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            display: '-webkit-box',
            WebkitLineClamp: lineClamp || '3',
            lineHeight: 'normal',
          }}
          className={`text-base md:text-base relative -top-1 ${
            isRTL ? 'rtl' : ''
          }`}
        >
          {noDescription ? '' : article.display_title}
        </div>
      </div>
    </NavLink>
  ) : data ? (
    <NavLink
      className={`flex md:text-lg relative flex-col pb-1 cursor-pointer rounded-md ${
        isRTL ? 'rtl' : ''
      } ${className}`}
      href={linkInfo.href}
      as={linkInfo.as}
      passHref
      onClick={() => {
        seeAll(linkInfo);
      }}
    >
      {data.text}
      <div
        style={{
          backgroundImage: 'url(' + thumbnail.url + ')',
          backgroundSize: 'cover',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          zIndex: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          opacity: '0.3',
          borderRadius: '8px',
        }}
      ></div>
    </NavLink>
  ) : null;
};

export default SquareCard;
