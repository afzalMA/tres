export const isEmpty = (obj) => {
  if (!obj) return true;
  for (var i in obj) return false;
  return true;
};

export const linkInfoGenerator = (url, state) => {
  if (!url) {
    return {
      href: '/',
      as: `/`,
    };
  }
  if (url.startsWith('/')) {
    url = url.slice(1);
  }
  const splitUrl = url.split('/');
  if (splitUrl[0].toLowerCase() === 'urdu') {
    splitUrl[1] = state;
  }
  if (
    ['gallery', 'video', 'videos', 'live-streaming'].indexOf(splitUrl[2]) >= 0
  ) {
    if (splitUrl.length === 3) {
      return {
        href: {
          pathname: `/[language]/[state]/${splitUrl[2]}`,
          query: {
            language: splitUrl[0],
            state: splitUrl[1],
          },
        },
        as: `/${splitUrl.join('/')}`,
      };
    }
    return {
      href: {
        pathname: `/[language]/[state]/${splitUrl[2]}/[...slug]`,
        query: {
          language: splitUrl[0],
          state: splitUrl[1],
          slug: splitUrl.slice(2).join('/'),
        },
      },
      as: `/${splitUrl.join('/')}`,
    };
  }

  let href = {
    pathname: '/[language]/[state]/[category]/[subcategory]/[...slug]',
    query: {
      language: splitUrl[0],
      state: splitUrl[1],
      category: splitUrl[2],
      subcategory: splitUrl[3],
      slug: splitUrl.slice(4).join('/'),
    },
  };
  switch (splitUrl.length) {
    case 2:
      href = {
        pathname: '/[language]/[state]',
        query: {
          language: splitUrl[0],
          state: splitUrl[1],
        },
      };
      break;

    case 3:
      href = {
        pathname: '/[language]/[state]/[category]',
        query: {
          language: splitUrl[0],
          state: splitUrl[1],
          category: splitUrl[2],
        },
      };
      break;
    case 4:
      href = {
        pathname: '/[language]/[state]/[category]/[subcategory]',
        query: {
          language: splitUrl[0],
          state: splitUrl[1],
          category: splitUrl[2],
          subcategory: splitUrl[3],
        },
      };
      break;
  }

  return {
    href: href,
    as: `/${splitUrl.join('/')}`,
  };
};

export const thumbnailExtractor = (
  thumbnailObj,
  ratio = '3_2',
  extractionOrder = 's2b',
  mediaType
) => {
  const thumbnailKeys = [
    /* 'small_3_2',
    'small_1_1',
    'small_2_1', */
    'medium_3_2',
    'medium_2_1',
    'medium_1_1',
    'web_3_2',
    'web_2_1',
    'web_1_1',
    'high_3_2',
    'high_2_1',
    'high_1_1',
  ];

  if (isEmpty(thumbnailObj)) {
    return !mediaType
      ? {
          alt_tags: '',
          caption: '',
          url:
            'https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/placeholder.png',
        }
      : {
          alt_tags: 'Breaking News',
          url:
            'https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/breakingplate.jpg',
        };
  }

  const order = (extractionOrder === 's2b'
    ? thumbnailKeys
    : thumbnailKeys.reverse()
  ).filter((v) => v.endsWith(ratio));

  for (var i of order) {
    if (thumbnailObj[i]) {
      return thumbnailObj[i];
    }
  }
  return {
    alt_tags: '',
    caption: '',
    url:
      'https://etvbharatimages.akamaized.net/etvbharat/static/assets/images/placeholder.png',
  };
};

export const stateCodeConverter = (e) => {
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
    'jammu-and-kashmir': 'jk',
    'tamil-nadu': 'tamil-nadu',
    kerala: 'kerala',
    uttarakhand: 'uttarakhand',
  }[e.toLowerCase()];
};

export const configStateCodeConverter = (e) => {
  if (!e) {
    return 'english';
  }
  const state = {
    'andhra-pradesh': 'ap',
    assam: 'assam',
    bihar: 'bh',
    chhattisgarh: 'ct',
    delhi: 'dl',
    national: 'english',
    gujarat: 'gj',
    haryana: 'haryana',
    'himachal-pradesh': 'hp',
    jharkhand: 'jh',
    'jammu-and-kashmir': 'jk',
    karnataka: 'ka',
    kerala: 'kerala',
    maharashtra: 'mh',
    'madhya-pradesh': 'mp',
    odisha: 'or',
    punjab: 'pb',
    rajasthan: 'rj',
    'tamil-nadu': 'tamil-nadu',
    telangana: 'ts',
    'uttar-pradesh': 'up',
    urdu: 'urdu',
    uttarakhand: 'uttarakhand',
    'west-bengal': 'wb',
  }[e.toLowerCase()];

  return state || 'english';
};

export const loadJS = (file, part) => {
  const name = getFilename(file);
  if (document.querySelector(`script[id=${name}]`)) {
    return;
  }
  // DOM: Create the script element
  var jsElm = document.createElement('script');
  // set the type attribute
  jsElm.type = 'application/javascript';
  jsElm['id'] = name;
  // make the script element load file
  jsElm.src = file;
  jsElm.async = 'async';
  // finally insert the element to the body element in order to load the script
  document[part || 'body'].appendChild(jsElm);
};

export const getFilename = (url) => {
  if (url) {
    var m = url.toString().match(/.*\/(.+?)\./);
    if (m && m.length > 1) {
      return m[1];
    }
  }
  return '';
};

export const createHash = function (r) {
  if (null === r) return null;
  var n,
    t,
    e,
    u,
    o,
    i,
    a,
    d,
    f,
    c,
    l = function (r, n) {
      return (r << n) | (r >>> (32 - n));
    },
    g = function (r, n) {
      var t, e, u, o, i;
      return (
        (u = 2147483648 & r),
        (o = 2147483648 & n),
        (t = 1073741824 & r),
        (e = 1073741824 & n),
        (i = (1073741823 & r) + (1073741823 & n)),
        t & e
          ? 2147483648 ^ i ^ u ^ o
          : t | e
          ? 1073741824 & i
            ? 3221225472 ^ i ^ u ^ o
            : 1073741824 ^ i ^ u ^ o
          : i ^ u ^ o
      );
    },
    m = function (r, n, t) {
      return (r & n) | (~r & t);
    },
    s = function (r, n, t) {
      return (r & t) | (n & ~t);
    },
    v = function (r, n, t) {
      return r ^ n ^ t;
    },
    h = function (r, n, t) {
      return n ^ (r | ~t);
    },
    p = function (r, n, t, e, u, o, i) {
      return (r = g(r, g(g(m(n, t, e), u), i))), g(l(r, o), n);
    },
    w = function (r, n, t, e, u, o, i) {
      return (r = g(r, g(g(s(n, t, e), u), i))), g(l(r, o), n);
    },
    C = function (r, n, t, e, u, o, i) {
      return (r = g(r, g(g(v(n, t, e), u), i))), g(l(r, o), n);
    },
    x = function (r, n, t, e, u, o, i) {
      return (r = g(r, g(g(h(n, t, e), u), i))), g(l(r, o), n);
    },
    y = function (r) {
      for (
        var n,
          t = r.length,
          e = t + 8,
          u = (e - (e % 64)) / 64,
          o = 16 * (u + 1),
          i = new Array(o - 1),
          a = 0,
          d = 0;
        t > d;

      )
        (n = (d - (d % 4)) / 4),
          (a = (d % 4) * 8),
          (i[n] = i[n] | (r.charCodeAt(d) << a)),
          d++;
      return (
        (n = (d - (d % 4)) / 4),
        (a = (d % 4) * 8),
        (i[n] = i[n] | (128 << a)),
        (i[o - 2] = t << 3),
        (i[o - 1] = t >>> 29),
        i
      );
    },
    H = function (r) {
      var n,
        t,
        e = '',
        u = '';
      for (t = 0; 3 >= t; t++)
        (n = (r >>> (8 * t)) & 255),
          (u = '0' + n.toString(16)),
          (e += u.substr(u.length - 2, 2));
      return e;
    },
    L = [],
    S = 7,
    A = 12,
    b = 17,
    M = 22,
    j = 5,
    k = 9,
    q = 14,
    z = 20,
    B = 4,
    D = 11,
    E = 16,
    F = 23,
    G = 6,
    I = 10,
    J = 15,
    K = 21;
  for (
    L = y(r),
      a = 1732584193,
      d = 4023233417,
      f = 2562383102,
      c = 271733878,
      n = L.length,
      t = 0;
    n > t;
    t += 16
  )
    (e = a),
      (u = d),
      (o = f),
      (i = c),
      (a = p(a, d, f, c, L[t + 0], S, 3614090360)),
      (c = p(c, a, d, f, L[t + 1], A, 3905402710)),
      (f = p(f, c, a, d, L[t + 2], b, 606105819)),
      (d = p(d, f, c, a, L[t + 3], M, 3250441966)),
      (a = p(a, d, f, c, L[t + 4], S, 4118548399)),
      (c = p(c, a, d, f, L[t + 5], A, 1200080426)),
      (f = p(f, c, a, d, L[t + 6], b, 2821735955)),
      (d = p(d, f, c, a, L[t + 7], M, 4249261313)),
      (a = p(a, d, f, c, L[t + 8], S, 1770035416)),
      (c = p(c, a, d, f, L[t + 9], A, 2336552879)),
      (f = p(f, c, a, d, L[t + 10], b, 4294925233)),
      (d = p(d, f, c, a, L[t + 11], M, 2304563134)),
      (a = p(a, d, f, c, L[t + 12], S, 1804603682)),
      (c = p(c, a, d, f, L[t + 13], A, 4254626195)),
      (f = p(f, c, a, d, L[t + 14], b, 2792965006)),
      (d = p(d, f, c, a, L[t + 15], M, 1236535329)),
      (a = w(a, d, f, c, L[t + 1], j, 4129170786)),
      (c = w(c, a, d, f, L[t + 6], k, 3225465664)),
      (f = w(f, c, a, d, L[t + 11], q, 643717713)),
      (d = w(d, f, c, a, L[t + 0], z, 3921069994)),
      (a = w(a, d, f, c, L[t + 5], j, 3593408605)),
      (c = w(c, a, d, f, L[t + 10], k, 38016083)),
      (f = w(f, c, a, d, L[t + 15], q, 3634488961)),
      (d = w(d, f, c, a, L[t + 4], z, 3889429448)),
      (a = w(a, d, f, c, L[t + 9], j, 568446438)),
      (c = w(c, a, d, f, L[t + 14], k, 3275163606)),
      (f = w(f, c, a, d, L[t + 3], q, 4107603335)),
      (d = w(d, f, c, a, L[t + 8], z, 1163531501)),
      (a = w(a, d, f, c, L[t + 13], j, 2850285829)),
      (c = w(c, a, d, f, L[t + 2], k, 4243563512)),
      (f = w(f, c, a, d, L[t + 7], q, 1735328473)),
      (d = w(d, f, c, a, L[t + 12], z, 2368359562)),
      (a = C(a, d, f, c, L[t + 5], B, 4294588738)),
      (c = C(c, a, d, f, L[t + 8], D, 2272392833)),
      (f = C(f, c, a, d, L[t + 11], E, 1839030562)),
      (d = C(d, f, c, a, L[t + 14], F, 4259657740)),
      (a = C(a, d, f, c, L[t + 1], B, 2763975236)),
      (c = C(c, a, d, f, L[t + 4], D, 1272893353)),
      (f = C(f, c, a, d, L[t + 7], E, 4139469664)),
      (d = C(d, f, c, a, L[t + 10], F, 3200236656)),
      (a = C(a, d, f, c, L[t + 13], B, 681279174)),
      (c = C(c, a, d, f, L[t + 0], D, 3936430074)),
      (f = C(f, c, a, d, L[t + 3], E, 3572445317)),
      (d = C(d, f, c, a, L[t + 6], F, 76029189)),
      (a = C(a, d, f, c, L[t + 9], B, 3654602809)),
      (c = C(c, a, d, f, L[t + 12], D, 3873151461)),
      (f = C(f, c, a, d, L[t + 15], E, 530742520)),
      (d = C(d, f, c, a, L[t + 2], F, 3299628645)),
      (a = x(a, d, f, c, L[t + 0], G, 4096336452)),
      (c = x(c, a, d, f, L[t + 7], I, 1126891415)),
      (f = x(f, c, a, d, L[t + 14], J, 2878612391)),
      (d = x(d, f, c, a, L[t + 5], K, 4237533241)),
      (a = x(a, d, f, c, L[t + 12], G, 1700485571)),
      (c = x(c, a, d, f, L[t + 3], I, 2399980690)),
      (f = x(f, c, a, d, L[t + 10], J, 4293915773)),
      (d = x(d, f, c, a, L[t + 1], K, 2240044497)),
      (a = x(a, d, f, c, L[t + 8], G, 1873313359)),
      (c = x(c, a, d, f, L[t + 15], I, 4264355552)),
      (f = x(f, c, a, d, L[t + 6], J, 2734768916)),
      (d = x(d, f, c, a, L[t + 13], K, 1309151649)),
      (a = x(a, d, f, c, L[t + 4], G, 4149444226)),
      (c = x(c, a, d, f, L[t + 11], I, 3174756917)),
      (f = x(f, c, a, d, L[t + 2], J, 718787259)),
      (d = x(d, f, c, a, L[t + 9], K, 3951481745)),
      (a = g(a, e)),
      (d = g(d, u)),
      (f = g(f, o)),
      (c = g(c, i));
  var N = H(a) + H(d) + H(f) + H(c);
  return N.toLowerCase();
};

export const dateFormatter = (uts, amp = false) => {
  const current = new Date().getTime();
  const date = new Date(uts * 1000);
  if (amp) {
    return (
      date.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      }) + ' IST'
    );
  }
  const previous = date.getTime();
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else {
    return (
      date.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      }) + ' IST'
    );
  }
};

const stateSocialLinks = [
  {
    state: 'National',
    twitter: 'https://twitter.com/ETVBharatEng',
    fb: 'https://www.facebook.com/ETVBharatEnglish',
    koo: 'https://www.kooapp.com/profile/etvbharat',
  },
  {
    state: 'goa',
    twitter: 'https://twitter.com/ETVBharatEng',
    fb: 'https://www.facebook.com/ETV-Bharat-Goa-176846926538180',
    koo:''
  },
  {
    state: 'punjab',
    twitter: 'https://twitter.com/ETVBharatPB',
    fb: 'https://www.facebook.com/ETVbharatPunjab',
    koo:'https://www.kooapp.com/profile/etvbharatpunjab',
  },
  {
    state: 'himachal-pradesh',
    twitter: 'https://twitter.com/ETVBharatHP',
    fb: 'https://www.facebook.com/ETVBharatHimachalPradesh',
    koo:'https://www.kooapp.com/profile/etvbharathimachalpradesh',
  },
  {
    state: 'Urdu',
    twitter: 'https://twitter.com/ETVBharatUrdu',
    fb: 'https://www.facebook.com/ETVBharatUrdu',
    koo: 'https://www.kooapp.com/profile/etvbharaturdu',
  },
  {
    state: 'telangana',
    twitter: 'https://twitter.com/ETVBharat_ts',
    fb: 'https://www.facebook.com/ETVBharatTelangana',
    koo: 'https://www.kooapp.com/profile/etvbharattelangana',
  },
  {
    state: 'andhra-pradesh',
    twitter: 'https://twitter.com/ETVBharatAP',
    fb: 'https://www.facebook.com/ETVBharatAndhraPradesh',
    koo: 'https://www.kooapp.com/profile/etvbharatandhrapradesh',
  },
  {
    state: 'hindi',
    twitter: 'https://twitter.com/ETVBharatHindi',
    fb: 'https://www.facebook.com/Etv-Bharat-Tripura-1155623571198468',
    koo: ''
  },
  {
    state: 'tripura',
    twitter: 'https://twitter.com/ETVBharatHindi',
    fb: 'https://www.facebook.com/Etv-Bharat-Tripura-1155623571198468',
    koo:''
  },
  {
    state: 'assam',
    twitter: 'https://twitter.com/ETVBharatAS',
    fb: 'https://www.facebook.com/ETVBharatAssam',
    koo: 'https://www.kooapp.com/profile/etvbharatassam',
  },
  {
    state: 'tamil-nadu',
    twitter: 'https://twitter.com/ETVBharatTN',
    fb: 'https://www.facebook.com/ETVBharatTamilnadu',
    koo: 'https://www.kooapp.com/profile/etvbharattamilnadu',
  },
  {
    state: 'maharashtra',
    twitter: 'https://twitter.com/ETVBharatMA',
    fb: 'https://www.facebook.com/ETVBharatMaharashtra',
    koo: 'https://www.kooapp.com/profile/etvbharatmaharashtra',
  },
  {
    state: 'west-bengal',
    twitter: 'https://twitter.com/ETVBharatWB',
    fb: 'https://www.facebook.com/ETVBharatWestBengal',
    koo: 'https://www.kooapp.com/profile/etvbharatwestbengal',
  },
  {
    state: 'karnataka',
    twitter: 'https://twitter.com/ETVBharatKA',
    fb: 'https://www.facebook.com/ETVBharatKarnataka',
    koo: 'https://www.kooapp.com/profile/etvbharatkarnataka',
  },
  {
    state: 'odisha',
    twitter: 'https://twitter.com/ETVBharatOD',
    fb: 'https://www.facebook.com/ETVBharatOdisha',
    koo: 'https://www.kooapp.com/profile/etvbharatodisha',
  },
  {
    state: 'gujarat',
    twitter: 'https://twitter.com/ETVBharatGJ',
    fb: 'https://www.facebook.com/ETVBharatGujarat',
    koo: 'https://www.kooapp.com/profile/etvbharatgujarat',
  },
  {
    state: 'rajasthan',
    twitter: 'https://twitter.com/ETVBharatRJ',
    fb: 'https://www.facebook.com/ETVBharatRajasthan',
    koo: 'https://www.kooapp.com/profile/etvbharatrajasthan',
  },
  {
    state: 'haryana',
    twitter: 'https://twitter.com/ETVBharatHR',
    fb: 'https://www.facebook.com/ETVBharatHaryana',
    koo: 'https://www.kooapp.com/profile/etvbharatharyana',
  },
  {
    state: 'jharkhand',
    twitter: 'https://twitter.com/ETVBharatJH',
    fb: 'https://www.facebook.com/ETVBharatJharkhand',
    koo: 'https://www.kooapp.com/profile/etvbharatjharkhand',
  },
  {
    state: 'bihar',
    twitter: 'https://twitter.com/ETVBharatBR',
    fb: 'https://www.facebook.com/ETVBharatBihar',
    koo: 'https://www.kooapp.com/profile/etvbharatbihar',
  },
  {
    state: 'madhya-pradesh',
    twitter: 'https://twitter.com/ETVBharatMP',
    fb: 'https://www.facebook.com/ETVBharatMadhyaPradesh',
    koo: 'https://www.kooapp.com/profile/etvbharatmadhyapradesh',
  },
  {
    state: 'kerala',
    twitter: 'https://twitter.com/ETVBharatKL',
    fb: 'https://www.facebook.com/ETVBharatKerala',
    koo: 'https://www.kooapp.com/profile/etvbharatkerala',
  },
  {
    state: 'chhattisgarh',
    twitter: 'https://twitter.com/ETVBharatCG',
    fb: 'https://www.facebook.com/ETVBharatChattisgarh',
    koo: 'https://www.kooapp.com/profile/etvbharatchhattisgarh',
  },
  {
    state: 'delhi',
    twitter: 'https://twitter.com/ETVBharatDelhi',
    fb: 'https://www.facebook.com/ETVBharatDelhi',
    koo: 'https://www.kooapp.com/profile/etvbharatdelhi',
  },
  {
    state: 'uttar-pradesh',
    twitter: 'https://twitter.com/ETVBharatUP',
    fb: 'https://www.facebook.com/ETVBharatUttarPradesh',
    koo: 'https://www.kooapp.com/profile/etvbharatuttarpradesh',
  },
  {
    state: 'uttarakhand',
    twitter: 'https://twitter.com/ETVBharatUK',
    fb: 'https://www.facebook.com/ETVBharatUttarakhand',
    koo: 'https://www.kooapp.com/profile/etvbharatuttarakhand',
  },
  {
    state: 'urdunational',
    twitter: 'https://twitter.com/ETVBharatUrdu',
    fb: 'https://www.facebook.com/ETVBharatUrdu',
    koo: 'https://www.kooapp.com/profile/etvbharaturdu',
  },
  {
    state: 'jammu-and-kashmir',
    twitter: 'https://twitter.com/ETVBharatJK',
    fb: 'https://www.facebook.com/ETVBharatJammuandKashmir',
    koo: 'https://www.kooapp.com/profile/etvbharatjammukashmir',
  },
];

export const getSocialLinks = (state) => {
  let links;
  if (state) {
    links = stateSocialLinks.find(
      (v) => v.state.toLowerCase() === state.toLowerCase()
    );
  }
  return links ? links : stateSocialLinks[0];
};

export const getElectionInfo = (state) => {
  let info;
  if(state){
    info = electionMetainfo.find(
      (v) => v.state.toLowerCase() === state.toLowerCase()
    );
  }
  return info ? info : electionMetainfo[0];
  
}

export const getAmpUrl = (dynamic_purl, listing) => {
  var amphtml_fields = dynamic_purl.split('/');
  var ampHTML_category = amphtml_fields[3];
  var ampHTML_slug = amphtml_fields[amphtml_fields.length - 2];
  var ampHTML_contentid = amphtml_fields[amphtml_fields.length - 1];
  var ampHTML_baseurl = '';

  if (listing) {
    if (ampHTML_category == 'english') {
      return 'https://englishamp.etvbharat.com/';
    } else if (ampHTML_category == 'hindi') {
      return 'https://hindiamp.etvbharat.com/';
    }
  }

  if (ampHTML_category == 'english') {
    ampHTML_baseurl = 'https://englishamp.etvbharat.com/article/';
  } else if (ampHTML_category == 'hindi') {
    ampHTML_baseurl = 'https://hindiamp.etvbharat.com/article/';
  }
  var final_AMPHTML_url =
    ampHTML_baseurl +
    ampHTML_category +
    '/' +
    ampHTML_slug +
    '/' +
    ampHTML_contentid;
  return final_AMPHTML_url;
};
