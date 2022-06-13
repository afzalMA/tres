import getConfig from 'next/config';
const fs = require('fs');

const getRobots = (config) => {
  return fs.readFileSync(
    `public/static/${
      config.APP_ENV === 'staging' ? 'staging-' : 'prod-'
    }robots.txt`
  );
};

/* class Sitemap extends React.Component {
  static async getInitialProps({ res }) {

    res.setHeader('Content-Type', 'text/plain');
    res.write(getRobots(publicRuntimeConfig));
    res.end();
  }
}

export default Sitemap; */

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  const { publicRuntimeConfig } = getConfig();

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.write(getRobots(publicRuntimeConfig));
  res.end();
};
