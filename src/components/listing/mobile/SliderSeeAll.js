import SquareCard from '@components/listing/mobile/SquareCard';
import LargeSquareCard from '@components/listing/mobile/LargeSquareCard';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import RectangleCard from '@components/listing/mobile/RectangleCard';
import { Media, MediaContextProvider } from '@media';
import { RTLContext } from '@components/layout/Layout';
import NavLink from '@components/common/NavLink';
import { articleClick } from '@utils/GoogleTagManager';
import MainArticles from '../MainArticles';
import useTranslator from '@hooks/useTranslator';

const SliderSeeAll = ({ data }) => {
  const isRTL = useContext(RTLContext);

  const router = useRouter();
  const { t, appLanguage } = useTranslator();

  return (
    <>
      <div className={`mt-3 `}>
        <div className={`text-base md:text-lg flex items-center font-extrabold ${isRTL ? 'float-right mr-10' : 'float-left  ml-3.5'} `}>
          {data.ml_title[0].text}
        </div>
        {data.url ? (
          <div className={`tems-center font-semibold text-sm text-red-500 ${isRTL ?  'float-left  ml-3.5' :'float-right mr-10' }`}>
            <NavLink
              className={`text-sm`}
              href={data.url}
              as={data.url}
              passHref
              onClick={() => {
                articleClick(data);
              }}
            >
              {t('see_all')}
            </NavLink>
          </div>
        ) : null}
        <MediaContextProvider>
          <Media at="xs" className="w-full mt-2">
            {data.catalog_list_items.length > 1 ? (
              <LargeSquareCard
                className="w-full bg-white mb-2"
                article={data.catalog_list_items[0]}
                styleObj={{ height: '30vh' }}
                main={true}
              />
            ) : null}
            {data.catalog_list_items.length > 2 ? (
              <div
                className={`w-full flex space-x-2 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <SquareCard
                  className="w-1/2 bg-white"
                  article={data.catalog_list_items[1]}
                  styleObj={{ height: '17vh' }}
                  main={true}
                />
                <SquareCard
                  className="w-1/2 bg-white"
                  article={data.catalog_list_items[2]}
                  styleObj={{ height: '17vh' }}
                  main={true}
                />
              </div>
            ) : null}
            {!data.url && data.catalog_list_items.length > 3 ? (
              <div
                className={`w-full flex space-x-2 flex-wrap grid grid-flow-row grid-cols-2`}
              >
                {data.catalog_list_items.slice(3).map((article, index) => (
                  <SquareCard
                    className="bg-white mt-2"
                    article={article}
                    styleObj={{ height: '17vh' }}
                    main={true}
                  />
                ))}
              </div>
            ) : null}
          </Media>

          <Media greaterThan="xs" className="w-full flex space-x-2">
            <div className="w-full flex flex-wrap">
              <MainArticles list={data.catalog_list_items} />
            </div>
          </Media>
          <Media greaterThan="xs">
            {!data.url && data.catalog_list_items.length > 3 ? (
              <div className="w-full flex  flex-wrap grid grid-flow-row grid-cols-2">
                {data.catalog_list_items.slice(3).map((article, index) => (
                  <RectangleCard
                    className="bg-white  mt-1 md:mt-2  rounded-md"
                    article={article}
                    styleObj={{ height: '17vh' }}
                    main={true}
                  />
                ))}
              </div>
            ) : null}
          </Media>
        </MediaContextProvider>
      </div>
    </>
  );
};

export default SliderSeeAll;
