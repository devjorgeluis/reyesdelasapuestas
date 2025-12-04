import { useEffect } from "react";
import ImgLoader from "/src/assets/img/miniloader.png";

const FullDivLoading = (props) => {
  useEffect(() => {
    if (props.show == true) {
      document
        .getElementById("pageloader").classList.remove("d-none");
    } else {
      document
        .getElementById("pageloader").classList.add("d-none");
    }
  }, [props.show]);

  return (
    <div id="pageloader" className="pageloader d-none">
      <img src={ImgLoader} />
    </div>
  );
};

export default FullDivLoading;
