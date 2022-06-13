import NavLink from '@components/common/NavLink';
import { articleClick } from '@utils/GoogleTagManager';
import { linkInfoGenerator } from '@utils/Helpers';

const CatalogWall = ({ data, article, className }) => {
  return (
    <ul className="wallhead">
      {data.map((item) => {
        const linkInfo = linkInfoGenerator(item.url || item.web_url || '/');

        return (
          <li key={item.friendly_id}>
            <NavLink
              key={item.friendly_id}
              className={`flex flex-col pb-1 cursor-pointer rounded-md`}
              href={linkInfo.href}
              as={linkInfo.as}
              passHref
              onClick={() => {
                articleClick(item);
              }}
            >
              <div className="wall-image">
                <img
                  className="wall-icn"
                  alt=""
                  src={`/assets/images/menu_icon/${item.layout_type}.png`}
                ></img>
              </div>
              <div className="wall-title">
                <p className="title">{item.ml_title[0].text}</p>
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default CatalogWall;
