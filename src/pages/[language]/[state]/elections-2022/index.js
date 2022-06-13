import React from 'react';
import { NextSeo } from 'next-seo';

import { Media, MediaContextProvider } from '@media';
import Head from 'next/head';
import Error from 'next/error';
import { getElectionInfo } from '@utils/Helpers';
import {fetchMenuData} from '@utils/MenuData';
import API from '@api/API';
import { getAmpUrl, stateCodeConverter } from '@utils/Helpers';
import { languageMap } from '@utils/Constants';
import APIEnum from '@api/APIEnum';
const slug = ({metainfo,language}) => {
      
    

  return (
    <>
     <Head>
              <title>{metainfo.title}</title>
              <link rel="canonical" href={"https://www.etvbharat.com/english/national/elections-2022"}></link>
              </Head>
              <NextSeo
              title={
                metainfo.title !== '' &&
                !metainfo.title.includes('canonical tag')
                  ? metainfo.title
                  : 'ETV Bharat'
              }
              description={metainfo.description}
              additionalMetaTags={[
                {
                  name: 'keywords',
                  content: metainfo.keywords,
                },
              ]}
              
              twitter={{
                handle: '@etvbharat',
                site: '@etvbharat',
                cardType: 'summary_large_image',
              }}
            />
        <MediaContextProvider>
       <Media at="xs">
       
       <iframe key={language} frameBorder={0} style={{height: '3900px', overflow: 'scroll', width: '100%'}} src="../../elections/index.html"  name={language} id={language} seamless="seamless" scrolling="no" allowTransparency="true" />
       </Media>
       <Media greaterThan="xs" >
       <iframe key={language} frameBorder={0} style={{height: '1700px', overflow: 'scroll', width: '100%'}} src="../../elections/index.html"  name={language} id={language} seamless="seamless" scrolling="no" allowTransparency="true" />
        </Media>
      </MediaContextProvider>
    </>
  );
};

export default slug;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params, ...args }) {
  return {
    notFound: true,
    
  };
  if(false){
  const lang = params.language;
  const statev = params.state;
  const url = `/${params.language}/${params.state}/${params.category}`;
  const language = languageMap[params.language];
  const state = stateCodeConverter(params.state);
  const api = API(APIEnum.Listing, APIEnum.CatalogList);
  const urlSplit = url.split('/');
 let headerData = await    fetchMenuData(api,urlSplit,language,state);
   let finalkey = lang === 'urdu' && statev === 'national' ? "urdunational":statev;
   let metadata = getElectionInfo(finalkey);
   if (headerData === undefined) {
    return {
      notFound: true,
      
    };
  }
  return{
    props:   {
      metainfo: metadata,
      language:lang,
      headerData:headerData
      }
  }
}
}