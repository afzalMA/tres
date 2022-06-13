import NavLink from '@components/common/NavLink';
import StickyAd from '@components/common/StickyAd';
import DesktopSidebar from '@components/header/DesktopSidebar';
import Constants from '@utils/Constants';
import { backToTop, appInstall } from '@utils/GoogleTagManager';
import { useEffect, useState } from 'react';
import footer from './Footer.module.scss';
import { getSocialLinks } from '@utils/Helpers';
import eventBus from '@utils/EventBus';
import { useRouter } from 'next/router';
import useTranslator from '@hooks/useTranslator';

const MobileFooter = ({ data, menu,language, state }) => {
  const router = useRouter();
  const { t } = useTranslator();

  const isiOS = false;

  const [socialHandlers, setSocialHandlers] = useState({
    twitter: '',
    fb: '',
    koo: ''
  });
  const [searchBox, toggleSearchBox] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [sidebar, toggleSidebar] = useState(false);

  const backToTopp = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    backToTop();
  };

  const searchitem = (e) => {
    let value = searchInput;
    setSearchInput('');
    const goTo = () => {
      toggleSearchBox(false);
      router.push(
        `/${router.query.language}/${router.query.state}/search/${value}`
      );
    };
    if (e) {
      if (e.key === 'Enter') {
        goTo();
      }
    } else {
      goTo();
    }
  };
  useEffect(() =>{
    const splitPath = location.pathname.split('/');
    
     
     let finalkey = language === 'urdu' && state === 'national' ? "urdunational":state;
      const socialLinks = getSocialLinks(finalkey);
      setSocialHandlers(socialLinks);
  },[])
  const openSideMenu = () => {};

  useEffect(() => {
    const splitPath = location.pathname.split('/');
  

    const socialLinks = getSocialLinks(state);
    setSocialHandlers(socialLinks);

    const handleRouteChange = (url) => {
      const splitPath = location.pathname.split('/');
      
     
     let finalkey = language === 'urdu' && state === 'national' ? "urdunational":state;
      const socialLinks = getSocialLinks(finalkey);
      setSocialHandlers(socialLinks);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  return (
    <>
      {menu && menu.mobile ? (
        <>
          {sidebar ? (
            <DesktopSidebar
              data={{ menu: menu }}
              isMobile={true}
              onClose={() => toggleSidebar(false)}
            />
          ) : null}
          <div
            next-page-hide="1"
            className="mobile-footer w-full block md:hidden bg-mbg text-white relative bottom-0"
          >
            <div className="footer-sticky-ad-close">X</div>

            <div className="footer-sticky-ad">
              <StickyAd />
            </div>
            <div className="eb-navbar mb-24 pb-1">
              <button
                className="btot text-center relative bg-red-700 w-40 px-4 py-3 rounded-full"
                style={{
                  top: '-2.5rem',
                  left: 'calc(50% - 5rem)',
                }}
                onClick={() => {
                  backToTopp();
                }}
              >
                {router.query.language ? t('back_to_top') : 'BACK TO TOP'}
              </button>

              <div className="bottom-section mx-8">
                <div className="text-center img-block">
                  <div className="footer-icon"></div>
                </div>
                <div>
                  <div className="pt-6 pb-4 text-tiny space-y-2">
                    <div className="flex justify-between w-full">
                      <NavLink
                        href="/english/aboutUs"
                        as={`/english/aboutUs`}
                        passHref
                        prefetch={false}
                        title="About us"
                      />
                      <NavLink
                        href="/english/privacyPolicy"
                        as={`/english/privacyPolicy`}
                        passHref
                        prefetch={false}
                        title="Privacy Policy"
                      />
                    </div>
                    <div className="flex justify-between w-full">
                      <NavLink
                        href="/english/termsOfService"
                        as={`/english/termsOfService`}
                        passHref
                        prefetch={false}
                        title="Terms & Conditions"
                      />
                      <NavLink
                        href="/english/contactUs"
                        as={`/english/contactUs`}
                        passHref
                        prefetch={false}
                        title="Contact us"
                      />{' '}
                    </div>
                  </div>
                  <hr className="custom-hr" />
                  <ul className="flex w-48 mx-auto justify-around my-4">
                    <li>
                      <NavLink
                        onClick={() => appInstall('Android')}
                        href={Constants.appURLs.android}
                        passHref
                        prefetch={false}
                      >
                        <img
                          loading="lazy"
                          className="h-6"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/android_icon-2x.png"
                        />
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => appInstall('IOS')}
                        href={Constants.appURLs.ios}
                        passHref
                        prefetch={false}
                      >
                        <img
                          loading="lazy"
                          className="h-6"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/apple_icon-2x.png"
                        />
                      </NavLink>
                    </li>
                    <li className="border-r"></li>
                    <li>
                      <NavLink
                        href={socialHandlers.fb}
                        passHref
                        prefetch={false}
                      >
                        <img
                          loading="lazy"
                          className="h-6"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/facebook_icon-2x.png"
                        />
                        
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        href={socialHandlers.twitter}
                        passHref
                        prefetch={false}
                      >
                        <img
                          loading="lazy"
                          className="h-6"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/twitter_icon-2x.png"
                        />
                      </NavLink>
                    </li><li>
                   
                      <NavLink
                        href={socialHandlers.koo}
                        passHref
                        prefetch={false}
                      >
                        <img
                          loading="lazy"
                          className="h-6"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/koo.svg"
                        />
                      </NavLink>
                    </li>
                  </ul>
                  <hr className="custom-hr" />
                </div>
                {
            state === 'haryana' ? (<>
             <script
            dangerouslySetInnerHTML={{
              __html: `var adgf_p1 = "5795";
              var adgf_p2 = "0";
              var adgf_p3 = "0";
              var adgf_p4 = "";
              var adgf_p5 = "";
              var adgFtSc = document.createElement("script");
              adgFtSc.id = "adg_pixel_footer_script";
              document.body.appendChild(adgFtSc);
              adgFtSc.async = true;
              var adgScParam = "p1=" + adgf_p1 + "&amp;p2=" + adgf_p2 + "&amp;p3=" + adgf_p3 + "&amp;p4=" + adgf_p4 + "&amp;p5=" + adgf_p5;
              adgFtSc.src = "//adgebra.co.in/afpf/afpf.js?" + adgScParam;`
            }}>
            </script>
            <div dangerouslySetInnerHTML={{
              __html:`	<iframe id='adg_footer_pixel_script' src="//adgebra.co.in/afpf/afpf?p1=5795&amp;p2=0&amp;p3=1&amp;p4=&amp;p5=" width="0" height="0" frameBorder="0" scrolling="no" marginheight="0" marginwidth="0">
            </iframe>
            `}} /></>):null
          }
                <div className="copyright w-full px-6 py-2 opacity-75 text-tiny text-center">
                  Copyright © 2021 Ushodaya Enterprises Pvt. Ltd., All Rights
                  Reserved.
                </div>
              </div>
            </div>

            {searchBox ? (
              <div
                className="fixed text-black w-full h-10"
                style={{ bottom: '47px', zIndex: 200 }}
              >
                <input
                  placeholder="Search stories"
                  value={searchInput}
                  onInput={(e) => setSearchInput(e.target['value'])}
                  onChange={(e) => setSearchInput(e.target['value'])}
                  type="text"
                  className="relative h-10 border border-gray-300 rounded-sm p-2 pr-12 w-full"
                />

                <button
                  onClick={() => searchitem(null)}
                  className="btn absolute right-0 top-0 h-10 p-0 m-0 bg-gray-300 text-lg w-12"
                  style={{
                    borderRadius: '0 3px 3px 0',
                    color: '#595959',
                    lineHeight: 1,
                  }}
                >
                  {/* ❱ */}
                  &#x25ba;
                </button>
              </div>
            ) : null}

            <div
              className={`${footer['action-menu']} w-full fixed bottom-0  z-20 pt-2 bg-white text-black`}
              style={{ boxShadow: '0px -3px 8px 0px rgb(128 128 128 / 53%)' }}
            >
              <div className="flex justify-around align-center">
                <div className="item w-1/4">
                  <div className="flex flex-col items-center justify-center whitespace-nowrap">
                    {!isiOS ? (
                      <NavLink
                        onClick={() => appInstall('Android')}
                        href={Constants.appURLs.android}
                        prefetch={false}
                        passHref
                      >
                        <img
                          className="h-6 mx-auto"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/android-grey.png"
                        />
                        <p>INSTALL APP</p>
                      </NavLink>
                    ) : (
                      <NavLink
                        onClick={() => appInstall('IOS')}
                        href={Constants.appURLs.ios}
                        passHref
                        prefetch={false}
                      >
                        <img
                          className="h-6 mx-auto"
                          width="24"
                          height="24"
                          alt="ETV"
                          src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/applegrey.png"
                        />
                        <p className="whitespace-nowrap">INSTALL APP</p>
                      </NavLink>
                    )}
                  </div>
                </div>
                <div className="item w-1/4">
                  <div
                    className="flex flex-col items-center justify-center"
                    on="tap:my-lightbox"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      eventBus.emit('state-selector', {
                        show: true,
                      });
                    }}
                  >
                    <img
                      className="h-6"
                      width="24"
                      height="24"
                      alt="ETV"
                      src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/etv-grey.png"
                    />
                    <p className="whitespace-nowrap">CHANGE STATE</p>
                  </div>
                </div>
                <div className="item w-1/4">
                  <div
                    className="flex flex-col items-center justify-center"
                    onClick={() => toggleSearchBox((searchBox) => !searchBox)}
                  >
                    <img
                      className="h-6"
                      width="24"
                      height="24"
                      alt="ETV"
                      src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/search-grey.png"
                    />
                    <p className="whitespace-nowrap">SEARCH</p>
                  </div>
                </div>
                <div className="item w-1/4">
                  <div
                    className="flex flex-col items-center justify-center"
                    onClick={openSideMenu}
                    on="tap:sidebar1"
                    role="button"
                    tabIndex={0}
                  >
                    <img
                      className="h-6"
                      width="24"
                      height="24"
                      alt="ETV"
                      src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/hamburger-grey.png"
                    />
                    <p
                      className="whitespace-nowrap"
                      onClick={() => toggleSidebar(true)}
                    >
                      MORE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default MobileFooter;
