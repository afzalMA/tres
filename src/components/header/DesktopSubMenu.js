import NavLink from '@components/common/NavLink';
import Thumbnail1 from '@components/common/Thumbnail1';
import API from '@services/api/API';
import APIEnum from '@services/api/APIEnum';
import { languageMap } from '@utils/Constants';
import { articleClick } from '@utils/GoogleTagManager';
import {
  linkInfoGenerator,
  stateCodeConverter,
  thumbnailExtractor,
} from '@utils/Helpers';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import getConfig from 'next/config';

const country = 'IN';

export default function DesktopSubMenu({ category }) {
  const api = API(APIEnum.CatalogList);
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();

  const path = router.asPath;
  const splitPath = path.split('/');
  const lang = splitPath[1];
  const language = languageMap[lang] || 'en';
  const state = splitPath[2];

  let response = null;
  const catalogFetcher = (...args) => {
    const [apiEnum, methodName, params] = args;
    return api[apiEnum][methodName]({
      params: JSON.parse(params),
      query: {
        region: country,
        response: 'r2',
        item_languages: language,
        portal_state: stateCodeConverter(location.pathname.split('/')[2]),
      },
    }).then((res) => {
      return res.data.data;
    });
  };

  if (category) {
    if (category.title === 'State' && category.catalog_list_items.length > 0) {
      response = { data: category };
    } else {
      response = useSWR(
        [
          'CatalogList',
          'getSubMenuDetails',
          JSON.stringify({ key: category.home_link }),
        ],
        catalogFetcher,
        { dedupingInterval: 5 * 60 * 1000 }
      );
    }
  }

  return (
    <>
      {response &&
      response.data &&
      response.data.catalog_list_items &&
      response.data.catalog_list_items[0]
        ? response.data.catalog_list_items[0].catalog_list_items
            .slice(0, 3)
            .map((item) => {
              const splitUrl = item.web_url ? item.web_url.split('/') : [];
              const thumbnail = thumbnailExtractor(
                item.thumbnails,
                '3_2',
                publicRuntimeConfig.IMG_SIZE === 'sm' ? 's2b' : 'b2s',
                ''
              );
              const linkInfo = linkInfoGenerator(
                item.web_url,
                router.query.state
              );

              return !splitUrl.length ? (
                <div></div>
              ) : (
                <NavLink
                  key={item.content_id}
                  className="p-3 pt-0 flex-grow-0 flex flex-shrink-0 whitespace-pre-wrap"
                  style={{ flexBasis: '27%' }}
                  href={linkInfo.href}
                  as={linkInfo.as}
                  passHref
                  onClick={() => {
                    articleClick(item);
                  }}
                >
                  <div className="relative w-full p-4 pt-0">
                    {item.thumbnails ? (
                      <>
                        <div className="relative">
                          <Thumbnail1
                            thumbnail={thumbnail}
                            className={`w-full rounded-md`}
                            type={''}
                            creditSize={'medium'}
                          />
                        </div>

                        <div className="text-sm mt-1 capitalize font-semibold">
                          {item.ml_title[0].text}
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="relative"
                          style={{ width: '100%', paddingTop: '75.25%' }}
                        >
                          <img
                            loading="lazy"
                            className="w-full rounded-md"
                            src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/placeholder.png"
                            alt="placeholder image"
                          />
                        </div>

                        <div className="invisible">
                          asdfja jahsd fjasjd asjdhfa jsdfhasd ajdhf ajsdhf
                          jasdh
                        </div>
                      </>
                    )}
                  </div>
                </NavLink>
              );
            })
        : [0, 1, 2].map((item) => {
            return (
              <div
                key={item}
                className="p-3 pt-0 flex-grow-0 flex flex-shrink-0 whitespace-pre-wrap"
                style={{ flexBasis: '27%' }}
              >
                <img
                  loading="lazy"
                  className="w-full rounded-md"
                  src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/placeholder.png"
                  alt="placeholder image"
                />
                <div className="text-sm mt-1"></div>
              </div>
            );
          })}
    </>
  );
}
