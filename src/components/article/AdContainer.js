import dynamic from 'next/dynamic';
import { useContext } from 'react';
const options = {
  loading: () => <div>Loading...</div>,
};
import { ScrollContext } from '@components/layout/Layout';

const GridList = dynamic(() => import('@components/article/GridList'), options);
const PopularList = dynamic(
  () => import('@components/article/PopularList'),
  options
);
const MobileAd = dynamic(() => import('@components/article/MobileAd'), options);

const AdContainer = ({ data, className, type, index }) => {
  const isScrolled = useContext(ScrollContext);
  return !isScrolled ? null : (
    <>
      {data.map((val, i) => {
        if (val.layout_type.indexOf('ad_unit') >= 0 && val.ad_conf) {
          let adData = null;
          if (!type) {
            if (val.ad_conf.ads && val.ad_conf.ads[index + 1]) {
              adData = val.ad_conf.ads['' + (index + 1)];
            }
          } else if (type === 'listing') {
            adData = val.ad_conf ? val.ad_conf.responsive_ad : null;
          } else if (type === 'home_page') {
            adData =
              val.ad_conf && val.ad_conf.home_page
                ? val.ad_conf.home_page['1']
                : null;
            if (i === 4 && adData && adData.ad_unit_id) {
              adData.ad_unit_id = adData.ad_unit_id.replace(
                '300x250-1',
                '300x250-2'
              );
              // console.log(adData);
              adData.gpt_id = adData.gpt_id.replace('-1', '-2');
            }
          }

          return adData ? (
            <MobileAd
              className={className}
              key={`ad-rhs-${i}-${adData.gpt_id}`}
              adData={{ ad_unit: adData.ad_unit_id, gpt_id: adData.gpt_id }}
            />
          ) : null;
        } else {
          switch (val.layout_type) {
            case 'most_popular':
              return <PopularList key={val.list_id} data={val} />;
            case 'four_plus_four_list':
            case 'latest_video_list':
              return <GridList key={val.list_id} data={val} />;
          }
        }
      })}
    </>
  );
};

export default AdContainer;
