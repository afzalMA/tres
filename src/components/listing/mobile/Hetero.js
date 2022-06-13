const Hetero = ({ data }) => {
  return (
    <>
      <div>
        <div className="w-full">
          {data[0].catalog_list_items[0].display_title}
        </div>
        <div className="w-full flex space-x-2">
          <SquareCard
            className="w-1/2 bg-white"
            article={data[0].catalog_list_items[1]}
          />

          <SquareCard
            className="w-1/2 bg-white"
            article={data[0].catalog_list_items[2]}
          />
        </div>
      </div>
      {data.slice(1).map((subList, ind) => {
        return renderLayout(subList, ind);
      })}
    </>
  );
};
export default Hetero;
