import SquareCard from '@components/listing/mobile/SquareCard';
import { useContext } from 'react';
import { RTLContext } from '@components/layout/Layout';

const MainArticles = ({ list, className }) => {
  const isRTL = useContext(RTLContext);

  return (
    <>
      {/*   <div className="w-1/2"  style={{ height: '330px' }}>
        <LargeSquareCard article={list[0]} className="bg-white" />
      </div> */}
      <div
        className={`flex w-full justify-between space-x-4 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
        style={{ margin: '5px' }}
      >
        <SquareCard
          className="w-1/3 bg-white"
          article={list[0]}
          lineClamp="2"
          main={true}
        />
        <SquareCard
          className="w-1/3 bg-white"
          article={list[1]}
          lineClamp="2"
          main={true}

        />
        <SquareCard
          className="w-1/3 bg-white"
          article={list[2]}
          lineClamp="2"
          main={true}

        />
      </div>
    </>
  );
};

export default MainArticles;
