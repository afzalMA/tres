import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import Constants from '@utils/Constants';

import footer from './Footer.module.scss';

import NavLink from '@components/common/NavLink';
import LanguageList from '@components/footer/LanguageList';
import { RTLContext } from '@components/layout/Layout';
import { getSocialLinks } from '@utils/Helpers';

const DesktopFooter = ({ data, t }) => {
  const router = useRouter();
  const isRTL = useContext(RTLContext);

  const path = router.asPath;
  const splitPath = path.split('/');
  const lang = splitPath[1];
  const state = splitPath[2];

  const [socialHandlers, setSocialHandlers] = useState({
    twitter: '',
    fb: '',
    koo:''
  });
  const openFeedback = () => {};
  useEffect(() =>{
    const splitPath = location.pathname.split('/');
    const state = splitPath[2];
    const language = splitPath[1];
     
     let finalkey = language === 'urdu' && state === 'national' ? "urdunational":state;
      const socialLinks = getSocialLinks(finalkey);
      setSocialHandlers(socialLinks);
  },[])
  useEffect(() => {
    const splitPath = location.pathname.split('/');
    const state = splitPath[2];
    const language = splitPath[1];
     
     let finalkey = language === 'urdu' && state === 'national' ? "urdunational":state;
      const socialLinks = getSocialLinks(finalkey);
      setSocialHandlers(socialLinks);

    const handleRouteChange = (url) => {
      const splitPath = location.pathname.split('/');
      const state = splitPath[2];
      const language = splitPath[1];
     
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
    <footer className="eb-footer footer">
    
      <div className="desktop-footer absolute bottom-0 w-full divide-y md:block hidden font-english mb-4">
        {/* {t('top_news')} */}
        <div className="border-t">
          <div
            className={`lg:container lg:mx-auto flex justify-center py-1 self-center ${
              isRTL ? 'flex-row-reverse rtl' : ''
            }`}
          >
            <NavLink
              href={{
                pathname: '/[language]/[state]',
                query: {
                  language: lang,
                  state: state,
                },
              }}
              as={`/${lang}/${state}`}
              passHref
            >
              <div className={`logo ${lang}`}></div>
            </NavLink>

            <LanguageList languages={data} />
          </div>
        </div>
        <div>
          <div className="lg:container lg:mx-auto flex justify-center">
            <ul className={footer['eb-footer-icons']}>
              <li
                onClick={() => {
                  window.location.href = Constants.appURLs.android;
                }}
              >
                <a href={Constants.appURLs.android}>
                  <p className={footer.img2}></p>
                  <p className={footer.img1}></p>
                </a>
              </li>
              <li
                onClick={() => {
                  window.location.href = Constants.appURLs.ios;
                }}
              >
                <a href={Constants.appURLs.ios}>
                  <p className={footer.img4}></p>
                  <p className={footer.img3}></p>
                </a>
              </li>
              <li
                onClick={() => {
                  window.location.href = socialHandlers.fb;
                }}
              >
                <a href={socialHandlers.fb}>
                  <p className={footer.img6}></p>
                  <p className={footer.img5}></p>
                </a>
              </li>
              <li
                onClick={() => {
                  window.location.href = socialHandlers.twitter;
                }}
              >
                <a href={socialHandlers.twitter}>
                  <p className={footer.img8}></p>
                  <p className={footer.img7}></p>
                </a>
              </li>
              <li
                onClick={() => {
                  window.location.href = socialHandlers.koo;
                }}
              >
                <a href={socialHandlers.koo}>
                  
                  <p className={footer.img9}></p>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="lg:container lg:mx-auto ">
            <ul className="flex justify-around font-medium text-gray-600 w-full lg:w-6/12 mx-auto my-2">
              <li>
                <NavLink
                  href="/english/aboutUs"
                  as={`/english/aboutUs`}
                  passHref
                  prefetch={false}
                  title="About us"
                />
              </li>
              <li>
                <NavLink
                  href="/english/privacyPolicy"
                  as={`/english/privacyPolicy`}
                  passHref
                  prefetch={false}
                  title="Privacy Policy"
                />
              </li>
              <li>
                <NavLink
                  href="/english/termsOfService"
                  as={`/english/termsOfService`}
                  passHref
                  prefetch={false}
                  title="Terms & Conditions"
                />
              </li>
              <li>
                <NavLink
                  href="/english/contactUs"
                  as={`/english/contactUs`}
                  passHref
                  prefetch={false}
                  title="Contact us"
                />
              </li>
              {/* <li>
                <p onClick={openFeedback}>Feedback</p>
              </li> */}
            </ul>
          </div>
          {
            console.log('cgj',state)
          }
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
              __html:`<noscript>		<iframe id='adg_footer_pixel_script' src="//adgebra.co.in/afpf/afpf?p1=5795&amp;p2=0&amp;p3=1&amp;p4=&amp;p5=" width="0" height="0" frameBorder="0" scrolling="no" marginheight="0" marginwidth="0">
            </iframe></noscript>
            `}} /></>):null
          }
          
          <div className="text-center text-sm text-gray-500">
            Copyright © 2021 Ushodaya Enterprises Pvt. Ltd., All Rights
            Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
