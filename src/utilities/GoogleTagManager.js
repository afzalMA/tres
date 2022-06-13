import { languageMap } from '@utils/Constants';
import { stateCodeConverter } from '@utils/Helpers';

export const languageChange = (e) => {
  if (!window['dataLayer']) return;
  var t = languageMap[e],
    a = languageMap[location.pathname.split('/')[1]],
    n = window.location.href;
  'en' != a &&
    'en' == t &&
    window['dataLayer'].push({
      event: 'native_to_english',
      from_language: a,
      current_page_url: n,
    }),
    'en' == a &&
      'en' != t &&
      window['dataLayer'].push({
        event: 'english_to_native',
        to_language: t,
        current_page_url: n,
      }),
    'en' != a &&
      'en' != t &&
      a != t &&
      window['dataLayer'].push({
        event: 'native_to_native',
        from_language: a,
        to_language: t,
        current_page_url: n,
      });
};
export const menuClick = (e, t) => {
  if (!window['dataLayer']) return;

  var a = (t + '|' + e.ml_title[0].text).toLowerCase();
  window['dataLayer'].push({
    event: 'menu_clicks',
    clicked_menu_item: a,
    current_page_url: window.location.href,
  });
};
export const subMenuClick = (e, t) => {
  if (!window['dataLayer']) return;

  var a = e.url.split('/')[4],
    n = window.location.href.split('/')[6];
  if ('' != t && void 0 != t) {
    s = 'sidemenu|' + t.ml_title[0].text + '|' + e.ml_title[0].text;
    'state' == e.url.split('/')[3] &&
      a != n &&
      window['dataLayer'].push({
        event: 'change_state',
        current_page_url: window.location.href,
      });
  } else var s = 'headermenu|' + e.ml_title[0].text + '|' + e.ml_title[0].text;
  if (a != n) {
    var r = s.toLowerCase();
    window['dataLayer'].push({
      event: 'menu_clicks',
      clicked_menu_item: r,
      current_page_url: window.location.href,
    });
  }
};
export const stateChange = (e) => {
  if (!window['dataLayer']) return;

  var t = e.item_languages[0],
    a = stateCodeConverter(e.state),
    n = window.location.href.split('/')[3],
    r = languageMap[t],
    o = stateCodeConverter(location.pathname.split('/')[2]);

  n == t &&
    o != a &&
    window['dataLayer'].push({
      event: 'state_change',
      from_state: o,
      to_state: a,
      common_language: r,
      current_page_url: window.location.href,
    });
};
export const share = (e) => {
  if (!window['dataLayer']) return;

  var t = 'INDIA',
    a = 'INDIA',
    n = 'INDIA',
    i = 'INDIA',
    s = 'en',
    r = e.title,
    o = e.content_id,
    f = { detailsUrl: [] };

  if (!e.web_url) {
    f.detailsUrl = new URL(window.location.href).pathname.split('/').slice(1);
  } else {
    f.detailsUrl = e.web_url.split('/');
  }
  void 0 != e.city && '' != e.city
    ? void 0 != e.city[0] && '' != e.city[0] && (t = e.city[0])
    : (t = 'INDIA'),
    void 0 != e.district && '' != e.district
      ? void 0 != e.district[0] && '' != e.district[0] && (a = e.district[0])
      : (a = 'INDIA'),
    void 0 != e.state && '' != e.state
      ? void 0 != e.state[0] && '' != e.state[0] && (n = e.state[0])
      : (n = 'INDIA'),
    void 0 != e.constituency && '' != e.constituency
      ? void 0 != e.constituency[0] &&
        '' != e.constituency[0] &&
        (i = e.constituency[0])
      : (i = 'INDIA'),
    void 0 != e.item_languages && '' != e.item_languages
      ? void 0 != e.item_languages[0] &&
        '' != e.item_languages[0] &&
        (s = e.item_languages[0])
      : (s = 'en'),
    window['dataLayer'].push({
      event: 'article_share',
      item_id: o,
      item_name: r,
      item_category: f.detailsUrl[2],
      item_sub_category: f.detailsUrl.length <= 5 ? 'INDIA' : f.detailsUrl[3],
      state: n,
      city: t,
      district: a,
      constituency: i,
      app_language: s,
      current_page_url: window.location.href,
    });
};
export const comment = (e) => {
  if (!window['dataLayer']) return;

  var t = 'INDIA',
    a = 'INDIA',
    n = 'INDIA',
    i = 'INDIA',
    s = 'en',
    r = e.title,
    o = e.content_id,
    f = { detailsUrl: [] };
  if (!e.web_url) {
    f.detailsUrl = new URL(window.location.href).pathname.split('/').slice(1);
  } else {
    f.detailsUrl = e.web_url.split('/');
  }
  void 0 != e.city && '' != e.city
    ? void 0 != e.city[0] && '' != e.city[0] && (t = e.city[0])
    : (t = 'INDIA'),
    void 0 != e.district && '' != e.district
      ? void 0 != e.district[0] && '' != e.district[0] && (a = e.district[0])
      : (a = 'INDIA'),
    void 0 != e.state && '' != e.state
      ? void 0 != e.state[0] && '' != e.state[0] && (n = e.state[0])
      : (n = 'INDIA'),
    void 0 != e.constituency && '' != e.constituency
      ? void 0 != e.constituency[0] &&
        '' != e.constituency[0] &&
        (i = e.constituency[0])
      : (i = 'INDIA'),
    void 0 != e.item_languages && '' != e.item_languages
      ? void 0 != e.item_languages[0] &&
        '' != e.item_languages[0] &&
        (s = e.item_languages[0])
      : (s = 'en'),
    window['dataLayer'].push({
      event: 'add_comment',
      item_id: o,
      item_name: r,
      item_category: f.detailsUrl[2],
      item_sub_category: f.detailsUrl.length <= 5 ? 'INDIA' : f.detailsUrl[3],
      state: n,
      city: t,
      district: a,
      constituency: i,
      app_language: s,
      current_page_url: window.location.href,
    });
};
export const searchItem = (searchTerm) => {
  if (!window['dataLayer']) return;

  if ('' != searchTerm.trim()) {
    var e = window.location.href,
      n = searchTerm;
    window['dataLayer'].push({
      event: 'search',
      search_term: n,
      current_page_url: e,
    });
  }
};
export const articleClick = (e) => {
  if (!window['dataLayer']) return;

  if (e && e.web_url) {
    var t = e.content_id,
      a = e.title,
      n = e.web_url.split('/'),
      i = window.location.href,
      s = 'INDIA',
      r = 'INDIA',
      o = 'INDIA',
      l = 'INDIA',
      c = 'en';

    void 0 != e.city && '' != e.city
      ? void 0 != e.city[0] && '' != e.city[0] && (s = e.city[0])
      : (s = 'INDIA'),
      void 0 != e.district && '' != e.district
        ? void 0 != e.district[0] && '' != e.district[0] && (r = e.district[0])
        : (r = 'INDIA'),
      void 0 != e.state && '' != e.state
        ? void 0 != e.state[0] && '' != e.state[0] && (o = e.state[0])
        : (o = 'INDIA'),
      void 0 != e.constituency && '' != e.constituency
        ? void 0 != e.constituency[0] &&
          '' != e.constituency[0] &&
          (l = e.constituency[0])
        : (l = 'INDIA'),
      void 0 != e.item_languages && '' != e.item_languages
        ? void 0 != e.item_languages[0] &&
          '' != e.item_languages[0] &&
          (c = e.item_languages[0])
        : (c = 'en'),
      window['dataLayer'].push({
        event: 'click_item',
        item_id: t,
        item_name: a,
        item_category: n[2],
        item_sub_category: n.length <= 5 ? 'INDIA' : n[3],
        state: o,
        city: s,
        district: r,
        constituency: l,
        app_language: c,
        current_page_url: window.location.href,
        destination_page_url: window.location.origin + e.web_url,
      });
  }
};
export const articleViewScroll = (e, f, scrolled = null) => {
  if (!window['dataLayer']) return;

  var t = 'INDIA',
    a = 'INDIA',
    n = 'INDIA',
    i = 'INDIA',
    s = 'en',
    r = e.title,
    o = e.content_id;
  void 0 != e.state && '' != e.state
    ? void 0 != e.state[0] && '' != e.state[0] && (n = e.state[0])
    : (n = 'INDIA'),
    void 0 != e.city && '' != e.city
      ? void 0 != e.city[0] && '' != e.city[0] && (t = e.city[0])
      : (t = 'INDIA'),
    void 0 != e.district && '' != e.district
      ? void 0 != e.district[0] && '' != e.district[0] && (a = e.district[0])
      : (a = 'INDIA'),
    void 0 != e.constituency && '' != e.constituency
      ? void 0 != e.constituency[0] &&
        '' != e.constituency[0] &&
        (i = e.constituency[0])
      : (i = 'INDIA'),
    void 0 != e.item_languages && '' != e.item_languages
      ? void 0 != e.item_languages[0] &&
        '' != e.item_languages[0] &&
        (s = e.item_languages[0])
      : (s = 'en'),
    (f.detailsUrl = e.web_url
      ? e.web_url.split('/')
      : location.pathname.split('/'));
  if (!scrolled) {
    window['dataLayer'].push({
      event: 'pageview',
      item_id: o,
      item_name: r,
      item_category: f.detailsUrl[2],
      item_sub_category: f.length <= 5 ? 'INDIA' : f.detailsUrl[3],
      state: n,
      city: t,
      district: a,
      constituency: i,
      app_language: s,
      current_page_url: f.location || window.location.href,
    });

    window['dataLayer'].push({
      event: 'view_item',
      item_id: o,
      item_name: r,
      item_category: f.detailsUrl[2],
      item_sub_category: f.length <= 5 ? 'INDIA' : f.detailsUrl[3],
      state: n,
      city: t,
      district: a,
      constituency: i,
      app_language: s,
      current_page_url: window.location.href,
    });
  } else {
    if (window.innerHeight > 768) {
      window['dataLayer'].push({
        event: 'article_scroll_count',
        item_id: o,
        item_name: r,
        item_category: f.detailsUrl[2],
        item_sub_category: f.detailsUrl.length <= 5 ? 'INDIA' : f.detailsUrl[3],
        state: n,
        city: t,
        district: a,
        constituency: i,
        app_language: s,
        current_page_url: window.location.href,
        article_scroll_count: scrolled,
      });
    }
  }
};

export const appInstall = (t) => {
  if (!window['dataLayer']) return;

  window['dataLayer'].push({
    event: 'app_install',
    current_page_url: window.location.href,
    operating_system: t,
  });
};

export const backToTop = () => {
  if (!window['dataLayer']) return;

  window['dataLayer'].push({
    event: 'back_to_top',
    destination_page_url: window.location.href,
  });
};

export const wallMenuClick = (response) => {
  const splitUrl = window.location.pathname.split('/');
  const wallMenuItem = response.friendly_id,
    itemCategory = splitUrl[3],
    currentPageUrl = window.location.href,
    appLanguage = languageMap[splitUrl[1]],
    state = (state =
      response.state != undefined && response.state != ''
        ? response.state[0]
        : 'INDIA');

  if (itemCategory == undefined || itemCategory == '' || itemCategory == 'v2') {
    itemCategory = 'Headlines';
  }

  window.dataLayer.push({
    event: 'click_wallmenu',
    clicked_wallmenu_item: wallMenuItem,
    item_category: itemCategory,
    current_page_url: currentPageUrl,
    state: state,
    app_language: appLanguage,
  });
};
export const dropgtm = (response, itemCategory) => {
  var dropdownName = itemCategory;
  var dropDownValue = response.friendly_id;
  var currentPageUrl = window.location.href;
  var state = StorageFactory.getStateCode();
  var appLanguage = StorageFactory.getLanguageCode();
  var itemCategory = window.location.href.split('/')[5];

  if (itemCategory == undefined || itemCategory == '' || itemCategory == 'v2') {
    itemCategory = 'Headlines';
  }

  if (state == undefined || state == '' || state == null) {
    state = 'INDIA';
  }

  window.dataLayer.push({
    event: 'select_dropdown',
    dropdown_name: dropdownName,
    selected_dropdown_value: dropDownValue,
    current_page_url: currentPageUrl,
    item_category: itemCategory,
    state: state,
    app_language: appLanguage,
  });
};
export const carousalItemClick = (newsItem, type) => {
  const splitUrl = window.location.pathname.split('/');
  const carousalItem = 'carousal_article',
    currentPageUrl = newsItem.url,
    state = stateCodeConverter(splitUrl[2]),
    appLanguage = languageMap[splitUrl[1]];
  let itemCategory = 'state_carousal';

  if (newsItem.has_videos) {
    carousalItem = 'carousal_vod';
  }

  switch (type) {
    case 'district':
      itemCategory = 'district_carousal';
      break;
    case 'city':
      itemCategory = 'city_carousal';
      break;
  }

  if (state == undefined || state == '' || state == null) {
    state = 'INDIA';
  }

  window.dataLayer.push({
    event: 'click_carousal',
    carousal_name: itemCategory,
    carousal_item_clicked: carousalItem,
    destination_page_url: currentPageUrl,
    item_category: itemCategory,
    state: state,
    app_language: appLanguage,
  });
};
export const seeAll = (newsItem, stateLanguageInfo, type) => {
  const splitUrl = window.location.pathname.split('/');
  const carousalItem = 'carousal_viewall',
    destinationPageUrl = newsItem.as,
    state = stateCodeConverter(splitUrl[2]),
    appLanguage = languageMap[splitUrl[1]];
  let itemCategory = 'state_carousal';

  switch (type) {
    case 'district':
      itemCategory = 'district_carousal';
      break;
    case 'city':
      itemCategory = 'city_carousal';
      break;
  }

  if (state == undefined || state == '' || state == null) {
    state = 'INDIA';
  }

  window.dataLayer.push({
    event: 'click_carousal',
    carousal_name: itemCategory,
    carousal_item_clicked: carousalItem,
    destination_page_url: window.location.origin + destinationPageUrl,
    item_category: itemCategory,
    state: state,
    app_language: appLanguage,
  });
};

export const gtmButtonCall = (response) => {
  var itemId = response.title;
  var itemName = response.title;
  var detailsUrl = response.url.split('/');
  var destination_page_url = window.location.origin + response.url;
  var city = 'INDIA';
  var district = 'INDIA';
  var state = 'INDIA';
  var constituency = 'INDIA';
  var itemCategory = detailsUrl[3];
  var itemSubCategory = detailsUrl[4];
  var appLanguage = StorageFactory.getLanguageCode();

  if (response.dynamic_state != undefined && response.dynamic_state != '') {
    state = response.dynamic_state;
  } else {
    state = 'INDIA';
  }
  if (response.dynamic_city != undefined && response.dynamic_city != '') {
    city = response.dynamic_city;
  } else {
    city = 'INDIA';
  }
  if (
    response.dynamic_district != undefined &&
    response.dynamic_district != ''
  ) {
    district = response.dynamic_district;
  } else {
    district = 'INDIA';
  }
  if (
    response.dynamic_constituency != undefined &&
    response.dynamic_constituency != ''
  ) {
    constituency = response.dynamic_constituency;
  } else {
    constituency = 'INDIA';
  }
  if (itemCategory != undefined && itemCategory != '') {
    itemCategory = itemCategory;
  } else {
    itemCategory = 'INDIA';
  }
  if (itemSubCategory != undefined && itemSubCategory != '') {
    itemSubCategory = itemSubCategory;
  } else {
    itemSubCategory = 'INDIA';
  }

  window.dataLayer.push({
    event: 'more_click',
    item_id: itemId,
    item_name: itemName,
    item_category: itemCategory,
    item_sub_category: itemSubCategory,
    state: state,
    city: city,
    district: district,
    constituency: constituency,
    app_language: appLanguage,
    destination_page_url: destination_page_url,
  });
};
export const gtmBrief = (newsItem) => {
  if (newsItem && newsItem.web_url) {
    var city = 'INDIA';
    var district = 'INDIA';
    var state = 'INDIA';
    var constituency = 'INDIA';
    var appLanguage = 'en';

    var itemName = newsItem.title;
    var itemId = newsItem.content_id;
    var detailsUrl = newsItem.web_url.split('/');

    if (newsItem.city != undefined && newsItem.city != '') {
      if (newsItem.city[0] != undefined && newsItem.city[0] != '') {
        city = newsItem.city[0];
      }
    } else {
      city = 'INDIA';
    }
    if (newsItem.district != undefined && newsItem.district != '') {
      if (newsItem.district[0] != undefined && newsItem.district[0] != '') {
        district = newsItem.district[0];
      }
    } else {
      district = 'INDIA';
    }
    if (newsItem.state != undefined && newsItem.state != '') {
      if (newsItem.state[0] != undefined && newsItem.state[0] != '') {
        state = newsItem.state[0];
      }
    } else {
      state = 'INDIA';
    }
    if (newsItem.constituency != undefined && newsItem.constituency != '') {
      if (
        newsItem.constituency[0] != undefined &&
        newsItem.constituency[0] != ''
      ) {
        constituency = newsItem.constituency[0];
      }
    } else {
      constituency = 'INDIA';
    }
    if (newsItem.item_languages != undefined && newsItem.item_languages != '') {
      if (
        newsItem.item_languages[0] != undefined &&
        newsItem.item_languages[0] != ''
      ) {
        appLanguage = newsItem.item_languages[0];
      }
    } else {
      appLanguage = 'en';
    }
    window.dataLayer.push({
      event: 'brief_article_viewed',
      item_id: itemId,
      item_name: itemName,
      item_category: detailsUrl[2],
      item_sub_category: detailsUrl[3],
      state: state,
      city: city,
      district: district,
      constituency: constituency,
      app_language: appLanguage,
      current_page_url: window.location.href,
    });
  }
};
