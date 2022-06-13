import DesktopFooter from '@components/footer/DesktopFooter';
import MobileFooter from '@components/footer/MobileFooter';
import { Media, MediaContextProvider } from 'media';

export default function Footer({ data, menu,language,state }) {
  return (
    <MediaContextProvider>
     
      <Media at="xs">
        {' '}
        <MobileFooter data={data} menu={menu} language={language} state={state}/>
      </Media>
      <Media greaterThan="xs">
        <DesktopFooter data={data} language={language} state={state}/>
      </Media>
    </MediaContextProvider>
  );
}
