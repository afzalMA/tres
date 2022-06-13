import NavLink from '@components/common/NavLink';
import Thumbnail from '@components/common/Thumbnail1';
import { RTLContext } from '@components/layout/Layout';
import { thumbnailExtractor } from '@utils/Helpers';
import { useContext, useEffect, useState } from 'react';
import { articleClick } from '@utils/GoogleTagManager';

import bottom from './BottomRelatedBar.module.scss';
const BottomRelatedBar = ({ data }) => {
  const isRTL = useContext(RTLContext);

  const [startIndex, setStartIndex] = useState(0);
  const [visible, setVisible] = useState([]);
  const [contentId, setContentId] = useState('');
  const handler = (e) => {
    const contentIdFromUrl = window.location.href.split('/').slice(-1)[0];
    setContentId(contentIdFromUrl);

    const index = data.findIndex((v) => v.content_id === contentIdFromUrl);
    if (index > -1 && (index < startIndex || index >= startIndex + 5)) {
      setStartIndex(() => {
        return index >= 5 ? 10 - index : index;
      });
    }
  };

  useEffect(() => {
    if (data) {
      const contentIdFromUrl = window.location.href.split('/').slice(-1)[0];
      setContentId(contentIdFromUrl);
      setVisible(data.slice(startIndex, startIndex + 5));
    }
    window.addEventListener('newurl', handler);

    return () => window.removeEventListener('newurl', handler);
  }, [startIndex, data]);

  const moveLeft = () => {
    if (startIndex > 0) {
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  };

  const moveRight = () => {
    if (startIndex + 5 < data.length) {
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  return visible.length > 0 ? (
    <div className="bottom-one flex shadow-t bg-white z-10 h-full">
      <div
        className={`px-1 pt-2 pb-1 border-t ${
          startIndex <= 0 ? 'cursor-not-allowed' : 'cursor-pointer '
        }`}
        onClick={() => {
          moveLeft();
        }}
      >
        <div className={`${bottom['left-icon']} h-full`}></div>
      </div>
      {visible.map((rel, ind) => {
        const thumbnail = thumbnailExtractor(
          rel.thumbnails,
          '1_1',
          's2b',
          null
        );

        return (
          <NavLink
            key={rel.friendly_id}
            className={`flex px-1 pt-2 pb-1 cursor-pointer ${
              rel.content_id === contentId
                ? 'border-t-2 border-red-700'
                : 'border'
            } ${isRTL ? 'flex-row-reverse rtl' : ''}`}
            style={{ flexBasis: '20%' }}
            href={`/${rel.web_url}`}
            as={`/${rel.web_url}`}
            passHref
            onClick={() => {
              articleClick(rel);
            }}
          >
           <Thumbnail
              thumbnail={thumbnail}
              className={'rounded-md w-20'}
              type={''}
              creditSize={'no-size'}
            />
            <div className=" px-1 text-xs text-gray-700 leading-tight">
              {rel.display_title}
            </div>
          </NavLink>
        );
      })}
      <div
        className={`cursor-pointer pl-1 pt-2 pb-1 border-t ${
          startIndex + 5 >= data.length
            ? 'cursor-not-allowed'
            : 'cursor-pointer '
        }`}
        onClick={() => {
          moveRight();
        }}
      >
        <div className={`${bottom['right-icon']} h-full`}></div>
      </div>
    </div>
  ) : null;
};

export default BottomRelatedBar;
