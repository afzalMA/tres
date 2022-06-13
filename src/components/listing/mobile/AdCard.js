import { useEffect } from 'react';

const AdCard = ({ data, className }) => {
  const slotArr = '[300, 250]';
  const id = data.msite_gpt_id;
  const ad_id = data.msite_adunit_id;


  useEffect(() => {
    if (id && ad_id) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      var code = `
            if(window.googletag && googletag.apiReady) {
              googletag.cmd.push(function() {
                googletag.pubads().collapseEmptyDivs();
                googletag.defineSlot('${ad_id}', ${slotArr}, '${id}')
                  .addService(googletag.pubads());
                googletag.enableServices(); 
              }); 
              googletag.cmd.push(function() { 
                googletag.display('${id}'); 
              });
          }`;
      s.appendChild(document.createTextNode(code));
      // document.body.appendChild(s);
      el.innerHTML = adHTML;
      el.querySelector('#' + id).appendChild(s);
    }
  });

  return id && ad_id ? (
    <div id={id} style={{ width: '300px', height: '250px' }}></div>
  ) : null;
};

export default AdCard;
