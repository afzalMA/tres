import VideoPlayer from './VideoPlayer';

const MainArticle = ({ article, className }) => {
  switch (article.media_type) {
    case 'live_news':
      return (
        <div className={`${className} md:pl-2 md:pr-8`}>
          <VideoPlayer article={article} />
        </div>
      );

    default:
      return null;
  }
};

export default MainArticle;
