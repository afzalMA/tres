export const pageView = () => {};
export const nextPageView = () => {
  setTimeout(() => {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (typeof window !== 'undefined') {
          window['comscoreDisplay'] = JSON.parse(this.response);
        }
      }
    };
    request.open(
      'GET',
      location.origin +
        '/comscore-pageview-candidate.json?' +
        new Date().getTime(),
      true
    );
    request.send();

    if (typeof window !== 'undefined' && window['COMSCORE']) {
      window['COMSCORE'] &&
        window['COMSCORE'].beacon({ c1: '2'});
    }
  }, 200);
};
