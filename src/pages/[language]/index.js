import { useRouter } from 'next/router';

const language = () => {
  const router = useRouter();

  if (router.isFallback) {
    return <h2 className="loading"></h2>;
  }
  return <div></div>;
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  return {
    redirect: {
      destination: '/english/national',
      permanent: true,
    },
  };
}

export default language;
