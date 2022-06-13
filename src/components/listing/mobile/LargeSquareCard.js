import NavLink from '@components/common/NavLink';
import Thumbnail from '@components/common/Thumbnail';
import { RTLContext } from '@components/layout/Layout';
import { articleClick } from '@utils/GoogleTagManager';
import { thumbnailExtractor, linkInfoGenerator } from '@utils/Helpers';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import getConfig from 'next/config';

const LargeSquareCard = ({
  data,
  article,
  className,
  noDescription,
  styleObj,
  main,
}) => {
  const isRTL = useContext(RTLContext);
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const linkInfo = linkInfoGenerator(
    article ? article.web_url : data ? data.url : '',
    router.query.state
  );

  const thumbnail = article
    ? thumbnailExtractor(
        article.thumbnails,
        '3_2',
        publicRuntimeConfig.IMG_SIZE === 'sm' ? 's2b' : 'b2s',
        'breaking_news'
      )
    : data && data.thumbnails
    ? thumbnailExtractor(
        data.thumbnails,
        '3_2',
        publicRuntimeConfig.IMG_SIZE === 'sm' ? 's2b' : 'b2s',
        'breaking_news'
      )
    : null;

  return article ? (
    <NavLink
      key={article.friendly_id}
      className={`flex h-full flex-col pb-1 cursor-pointer rounded-md shadow ${
        isRTL ? 'rtl' : ''
      } ${className}`}
      href={linkInfo.href}
      as={linkInfo.as}
      passHref
      onClick={() => {
        articleClick(article);
      }}
    >
      <div className="relative" style={styleObj}>
        <Thumbnail
          thumbnail={thumbnail}
          className={'rounded-t-md w-full'}
          type={''}
          creditSize={'no-size'}
          lazy={!main}
        ></Thumbnail>

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
            WebkitLineClamp: '3',
          }}
          className={`text-base md:text-base relative -top-1 ${
            isRTL ? 'rtl' : ''
          }`}
        >
          {noDescription ? '' : article.display_title}
        </div>
      </div>
    </NavLink>
  ) : null;
};

export default LargeSquareCard;
