const Loading = ({ isLoading } = { isLoading: false }) => {
  return isLoading ? (
    <div className="load-bar">
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  ) : null;
};

export default Loading;
