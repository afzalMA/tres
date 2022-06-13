import { useContext, useEffect, useRef, useState } from 'react';
import useSkyScaperAd from '@components/article/useSkyScaperAd'
import MobileAd from '@components/article/MobileAd'
const SkyScaper = () => {
   
   return (
       <div className={`sticky top-0`}>
    <MobileAd
    
    key={`ad-lhs-`}
    adData={{ ad_unit: "/175434344/ETB-English-National-Home-300x600-1", gpt_id: "div-gpt-ad-1622546824910-1" }}
  />
    </div>
   )
  };
  export default SkyScaper;