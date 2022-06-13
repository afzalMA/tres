import path from 'path';
import { domainUrl } from '@utils/Constants';

export default async (req, res) => {
  const { fileName } = req.query;
  const pathname = path.join(
    __dirname,
    '..',
    '..',
    'public',
    'assets',
    fileName
  );
  // console.log(`${domainUrl}/assets/${fileName}`);
  const result = await fetch(`${domainUrl}/assets/${fileName}`).then((res) =>
    res.json()
  );
  res.json(result);
  res.statusCode = 200;
  res.end();
};
