import NavLink from '@components/common/NavLink';
import Thumbnail from '@components/common/Thumbnail1';
import { RTLContext } from '@components/layout/Layout';
import { linkInfoGenerator, thumbnailExtractor } from '@utils/Helpers';
import { useContext } from 'react';
import grid from './GridList.module.scss';
import { useRouter } from 'next/router';
import { articleClick } from '@utils/GoogleTagManager';

const GridList = ({ data }) => {
  const isRTL = useContext(RTLContext);
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="text-xl font-bold text-gray-600 border-b">
        {data.ml_title[0].text.toUpperCase()}
      </div>
      <div
        className={`flex flex-wrap w-full ${grid.list} ${isRTL ? 'rtl' : ''}`}
      >
        {data.catalog_list_items.map((v) => {
          const linkInfo = linkInfoGenerator(v.web_url, router.query.state);
          const thumbnail = thumbnailExtractor(v.thumbnails, '3_2', 's2b', '');

          return (
            <NavLink
              key={v.friendly_id}
              className="w-1/2 cursor-pointer relative"
              href={linkInfo.href}
              as={linkInfo.as}
              passHref
              onClick={() => {
                articleClick(v);
              }}
            >
              <Thumbnail
                thumbnail={thumbnail}
                className={'rounded-lg'}
                type={''}
                creditSize={'small'}
              />
              <div className="pt-2 leading-tight">{v.display_title}</div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default GridList;
