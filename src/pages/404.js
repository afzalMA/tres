import ErrorPage from 'next/error'
import { useRouter } from 'next/router';
import {fetchMenuData} from '@utils/MenuData';
import API from '@api/API';
import APIEnum from '@api/APIEnum';
import { applicationConfig, languageMap } from '@utils/Constants';
import {
    configStateCodeConverter,
    getAmpUrl,
    loadJS,
    stateCodeConverter,
    thumbnailExtractor,
  } from '@utils/Helpers';
const Custom404 = () => {
  
  return <div className="not-found"><ErrorPage statusCode={404} /></div>;
};




export default Custom404;
