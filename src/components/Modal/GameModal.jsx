import { useState, useEffect, useRef } from "react";
import CategoryContainer from "../CategoryContainer";
import ProviderContainer from "../ProviderContainer";
import SearchInput from "../SearchInput";
import LoadApi from "../Loading/LoadApi";

const GameModal = (props) => {
  const [url, setUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    if (props.gameUrl !== null && props.gameUrl !== "") {
      if (props.isMobile) {
        window.location.href = props.gameUrl;
      } else {
        setIsLoading(false);
        setUrl(props.gameUrl);
      }
    }
  }, [props.gameUrl, props.isMobile]);

  if (props.isMobile) {
    return null;
  }

  const handleCategoryClick = (tag, _id, _table, index) => {
    props.onClose && props.onClose();

    if (window.location.hash !== `#${tag.code}`) {
      window.location.hash = `#${tag.code}`;
    } else if (props.getPage) {
      props.getPage(tag.code);
    }
  };

  const handleProviderSelect = (provider) => {
    props.onClose && props.onClose();
    props.onProviderSelect && props.onProviderSelect(provider);
  };

  return (
    <>
      <div className="casino game">
        <div className="casino-menu">
          <SearchInput
            txtSearch={props.txtSearch}
            setTxtSearch={props.setTxtSearch}
            searchRef={searchRef}
            search={props.search}
            isMobile={props.isMobile}
          />
          <div className="casino-menu__shadow">
            <div className="casino-menu__scroll">
              {
                (props.tags || []).length > 0 && (
                  <>
                    <div className="casino-menu-block categories">
                      <div className="casino-menu-block__title">Categorías</div>
                      <CategoryContainer
                        categories={props.tags}
                        selectedCategoryIndex={-1}
                        selectedProvider={props.selectedProvider}
                        onCategoryClick={(tag, _id, _table, index) => handleCategoryClick(tag, _id, _table, index)}
                        onCategorySelect={() => { }}
                        isMobile={props.isMobile}
                        pageType="casino"
                      />
                    </div>
                  </>
                )
              }

              <div className="casino-menu-block">
                <div className="casino-menu-block__title">Proveedores</div>
                <div className="casino-menu-block__content">
                  <ProviderContainer
                    categories={props.categories}
                    selectedProvider={props.selectedProvider}
                    setSelectedProvider={props.setSelectedProvider}
                    onProviderSelect={(provider) => handleProviderSelect(provider)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="casino_game">
          <div className="game_interface">
            <div>
              <a onClick={() => props.onClose && props.onClose()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns:svgjs="http://svgjs.com/svgjs"
                  width="19"
                  height="19"
                  fill="#fff"
                  x="0"
                  y="0"
                  viewBox="0 0 240.823 240.823"
                  xmlSpace="preserve"
                >
                  <g>
                    <path
                      d="M57.633 129.007 165.93 237.268c4.752 4.74 12.451 4.74 17.215 0 4.752-4.74 4.752-12.439 0-17.179l-99.707-99.671 99.695-99.671c4.752-4.74 4.752-12.439 0-17.191-4.752-4.74-12.463-4.74-17.215 0L57.621 111.816c-4.679 4.691-4.679 12.511.012 17.191z"
                    ></path>
                  </g>
                </svg>
              </a>
            </div>
            <div>Slotham City</div>
            <div>
              <a onClick={() => props.onClose && props.onClose()} className="favorites router-link-active">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  xmlns:svgjs="http://svgjs.com/svgjs"
                  width="19"
                  height="19"
                  fill="#fff"
                  x="0"
                  y="0"
                  viewBox="0 0 100 100"
                  xmlSpace="preserve"
                >
                  <g transform="matrix(1.1600000000000001,0,0,1.1600000000000001,-7.999963912963871,-7.999999389648437)">
                    <path
                      d="M89.787 40.876 53.702 14.905a6.296 6.296 0 0 0-3.7-1.194 6.302 6.302 0 0 0-3.698 1.192L10.129 40.939c-3.294 2.372-3.631 7.346-.225 10.12 2.152 1.752 5.443 1.742 7.622.156l1.908-1.373v30.117a6.33 6.33 0 0 0 6.33 6.33h9.408a6.33 6.33 0 0 0 6.33-6.33V60.433a8.499 8.499 0 1 1 16.998 0v19.525a6.33 6.33 0 0 0 6.33 6.33h9.407a6.33 6.33 0 0 0 6.33-6.33V49.84l1.74 1.253c2.363 1.729 5.778 1.793 8.011-.213 3.226-2.897 2.729-7.656-.531-10.004z"
                    ></path>
                  </g>
                </svg>
              </a>
            </div>
            <div>
              <div className="game_favorite">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    xmlns:svgjs="http://svgjs.com/svgjs"
                    version="1.1"
                    width="19"
                    height="19"
                    x="0"
                    y="0"
                    viewBox="0 0 511.98685 511"
                    xmlSpace="preserve"
                    fill="#cccccc"
                  >
                    <g>
                      <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"
                      ></path>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="casino_iframe_wrap">
            <div
              id="play_content"
              className="game-window-iframe-wrapper"
            >
              {isLoading && <LoadApi width="60" />}
              <iframe
                allow="camera;microphone;fullscreen *"
                src={url}
                onLoad={() => setIsLoading(false)}
                className="game"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameModal;