import IconLoading from "/src/assets/img/miniloader.png";

const LoadApi = ({ width }) => {
  return (
    <div className="home-block__loader">
      <img src={IconLoading} width={width ? width : 100} />
    </div>
  );
};

export default LoadApi;
