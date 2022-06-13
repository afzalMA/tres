import { useState, useEffect } from 'react';

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback(() => {
     // console.log('called back');
    });
  }, [isFetching]);

  function handleScroll() {
    let offsetHeight = document.body.offsetHeight;
    if (window.innerWidth < 769) {
      offsetHeight -= 350;
    }
    if (window.innerHeight + window.pageYOffset < offsetHeight-500 || isFetching)
      return;
    setIsFetching(true);
  }

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;
