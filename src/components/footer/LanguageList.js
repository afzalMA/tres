import NavLink from '@components/common/NavLink';
import { RTLContext } from '@components/layout/Layout';
import { useContext } from 'react';
import { stateChange } from '@utils/GoogleTagManager';

export default function LanguageList({ languages }) {
  const isRTL = useContext(RTLContext);
  
  const listItems = languages.map((language, index) => {
    const state =
      language.state && language.state === 'Assam' ? 'assam' : language.state;
    return (
      <li
        key={language.display_title}
        className="flex-1 text-sm text-center whitespace-nowrap"
        style={{ flexBasis: '10%' }}
      >
        <NavLink
          href={{
            pathname: '/[language]/[state]',
            query: {
              language: language.item_languages[0],
              state: state || 'national',
            },
          }}
          as={`/${language.item_languages[0]}/${state || 'national'}`}
          passHref
          onClick={() => {
            stateChange(language);
          }}
          title={language.display_title}
        />
      </li>
    );
  });
  return (
    <ul
      className={`flex flex-wrap justify-center py-1 ${
        isRTL ? 'flex-row-reverse rtl' : ''
      }`}
    >
      {listItems}
    </ul>
  );
}
