import React from 'react';
import Head from 'next/head';

const Index = () => {
  return (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
};

Index.getInitialProps = async ({ query, req, res, ...args }) => {
  return {
    pageType: 'listing',
  };
};
export default Index;
