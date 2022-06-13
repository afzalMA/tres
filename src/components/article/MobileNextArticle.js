import Head from 'next/head';
import { thumbnailExtractor } from '@utils/Helpers';
import Modal from '@components/modal/Modal';
import { useState } from 'react';
import useTranslator from '@hooks/useTranslator';

const MobileNextArticle = ({
  label,
  data,
  nextArticle,
  scrollToNextArticle,
  related,
  children,
}) => {
  const { t } = useTranslator();
  const query = {
    amp: 'false',
    elementsIndex: data.content_id,
    articleId: data.content_id,
    globalLang: 'en',
    img: thumbnailExtractor(data.thumbnails, '3_2', 's2b', ''),
    title: data.title,
    url: 'https://www.etvbharat.com' + data.web_url,
    emotesEnabled: 'true',
    link: 'https://[url]',
    maxChars: '3000',
    commentsToLoad: '5',
    spamLimit: '90',
    refHost: 'www.etvbharat.com',
    darkMode: 'false',
    d: 'false',
    l_d: 'false',
    totWideImg: 'false',
    hideArticles: 'false',
    gr: 'false',
    hideCommentBox: 'false',
    hideCommentBoxWithButton: 'false',
    hideCommentsWidget: 'false',
    wpSync: 'false',
    isCustomText: 'false',
  };
  const commentUrl = `https://cdn.vuukle.com/widgets/index.html?${new URLSearchParams(
    query
  )}`;
  const [isOpen, toggleOpen] = useState(false);
  return (
    <>
      {isOpen ? (
        <>
          <Modal
            title=""
            isMobile={true}
            open={!!isOpen}
            onClose={() => {
              toggleOpen(true);
            }}
            width="100vw"
            height="100vh"
          >
            <>
              <div
                className="commentBox mobile rounded-md w-full h-full  overflow-y-auto"
                style={{ background: '#f0f0f0' }}
              >
                <div className="flex justify-between pb-4">
                  <div className="text-gray-700 text-md pl-2"></div>
                  <div>
                    <button
                      type="button"
                      className="font-semibold text-gray-500 hover:text-gray-900 text-md"
                      onClick={() => toggleOpen(false)}
                    >
                      &#10005;
                    </button>
                  </div>
                </div>

                {/* <iframe className="w-full h-full" src={commentUrl} /> */}
                <div
                  className="w-full h-full"
                  id={`vuukle-comments-${query.articleId}`}
                ></div>
                <script
                  dangerouslySetInnerHTML={{
                    __html: `window.newVuukleWidgets(${query});`,
                  }}
                ></script>
              </div>
            </>
          </Modal>
        </>
      ) : null}
      {children}

      <div className="flex flex-col py-4 px-5  bg-mbg text-white cursor-pointer">
        <div className="flex items-center mb-1">
          <img
            alt="ETV"
            height="24"
            width="24"
            className="w-6"
            src="https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/nextarticle.png"
          />
          <span className="text-lg font-thin pl-2">{t(label)}</span>
        </div>
        <div
          className="text-gray-500 tracking-tighter pl-2"
          onClick={scrollToNextArticle}
        >
          {nextArticle ? nextArticle.ml_title[0].text : ''}
        </div>
      </div>
    </>
  );
};

export default MobileNextArticle;
