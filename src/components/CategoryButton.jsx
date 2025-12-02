const CategoryButton = (props) => {
  let customClass = "";
  if (props.active == true) {
    customClass += " router-link-exact-active router-link-active";
  }

  return (
    <a className={customClass} href={"#" + props.code}>
      <div onClick={props.onClick}>
        <div style={{ backgroundImage: `url(${props.image})` }}></div>
        <div>{props.name}</div>
      </div>
    </a>
  );
};

export default CategoryButton;
