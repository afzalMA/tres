/* eslint-disable no-console */
const express = require('express');
const next = require('next');
const fetch = require('node-fetch');
const compression = require('compression');

const shouldCompress = (req, res) => {
  // don't compress responses asking explicitly not
  if (req.headers['x-no-compression']) {
    return false;
  }

  // use compression filter function
  return compression.filter(req, res);
};

const devProxy = {
  '/apis/v2': {
    target: 'https://prod.suv.etvbharat.com/',
    pathRewrite: { '^/apis/v2': '/v2' },
    changeOrigin: true,
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'http://localhost:3000': 'https://www.etvbharat.com',
    },
  },
  '/apis': {
    target: 'https://prod.api.etvbharat.com/',
    pathRewrite: { '^/apis': '/' },
    changeOrigin: true,
    router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'http://localhost:3000': 'https://www.etvbharat.com',
    },
  },
};

const port = parseInt(process.env.PORT, 10) || 3000;
const env = process.env.NEXT_PUBLIC_APP_ENV;
const dev = env !== 'production' && env !== 'staging';

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const app = next({
  dir: '.', // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

let server;
app
  .prepare()
  .then(() => {
    server = express();

    server.use(compression({ filter: shouldCompress }));

    // Set up the proxy.
    if ((dev && devProxy) || process.env.NEXT_TEST) {
      const { createProxyMiddleware } = require('http-proxy-middleware');
      Object.keys(devProxy).forEach(function (context) {
        server.use(context, createProxyMiddleware(devProxy[context]));
      });
    }

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all('*', (req, res) => {
      if (req.url.startsWith('/amp/')) {
        const id = req.url.split('/').slice(-1)[0];
        const state = stateCodeConverter(req.url.split('/')[3]);
        const re = new RegExp('(' + state + '|na)\\d+', 'gi');
        let url = '';
        let listing = false;
        if (re.test(id)) {
          url = `http://prod.api.etvbharat.com/amp/${id}?auth_token=fLd6UcV8zesqNpVRif8N`;
        } else {
          listing = true;
          url = `https://prod.api.etvbharat.com/amp_listing_pages?url=/${
            req.url.split('/amp/')[1]
          }&auth_token=kmAJAH4RTtqHjgoauC4o&access_token=woB1UukKSzZ5aduEUxwt`;
        }

        fetch(url, { headers: { 'Content-Type': 'application/json' } })
          .then((response) => {
            return response.json();
          })
          .then(function (rest) {
            res.set('Content-Type', 'text/html');
            if (listing) {
              const resp = JSON.parse(rest.data);
              if (resp !== 'NotFound') {
                res.send(resp.amp_html);
              } else {
                res.sendStatus(404);
              }
            } else {
              if (rest.data && rest.data.amp != '') {
                res.send(rest.data.amp);
              } else {
                res.sendStatus(404);
              }
            }
          })
          .catch((e) => {
            return handle(req, res);
          });
      } else {
        return handle(req, res);
      }
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on port ${port} [${env}]`);
    });
  })
  .catch((err) => {
    console.log('An error occurred, unable to start the server');
    console.log(err);
  });

const stateCodeConverter = (e) => {
  if (!e) {
    return 'english';
  }
  return {
    assam: 'assam',
    odisha: 'or',
    punjab: 'pb',
    rajasthan: 'rj',
    sikkim: 'sk',
    telangana: 'ts',
    'uttar-pradesh': 'up',
    'andhra-pradesh': 'ap',
    'arunachal-pradesh': 'ar',
    bihar: 'bh',
    chhattisgarh: 'ct',
    chandigarh: 'ch',
    delhi: 'dl',
    gujarat: 'gj',
    haryana: 'haryana',
    'himachal-pradesh': 'hp',
    jharkhand: 'jh',
    karnataka: 'ka',
    'madhya-pradesh': 'mp',
    maharastra: 'mh',
    maharashtra: 'mh',
    manipur: 'mn',
    'west-bengal': 'wb',
    national: 'na',
    'jammu-and-kashmir': 'na',
    'tamil-nadu': 'tamil-nadu',
    kerala: 'kerala',
    uttarakhand: 'uttarakhand',
  }[e.toLowerCase()];
};
