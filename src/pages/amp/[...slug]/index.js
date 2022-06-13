import { stateCodeConverter } from '@utils/Helpers';
import { useRouter } from 'next/router';

const slug = () => {
  const router = useRouter();

  if (router.isFallback) {
    return <h2 className="loading"></h2>;
  }
  return <div></div>;
};

// This gets called on every request
export async function getServerSideProps({ query, req, res, ...args }) {
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

  await fetch(url, { headers: { 'Content-Type': 'application/json' } })
    .then((response) => {
      return response.json();
    })
    .then(function (rest) {
      res.set('Content-Type', 'text/html');
      if (listing) {
        if (rest.data === 'Not Found') {
          res.sendStatus(404);
          res.end();
        }
        res.send(JSON.parse(rest.data).amp_html);
      } else {
        if (rest.data && rest.data.amp != '') {
          res.send(rest.data.amp);
        } else {
          res.sendStatus(404);
        }
      }
      res.end();
    });
  // Pass data to the page via props
  return { props: { ABC: '' } };
}

export default slug;
