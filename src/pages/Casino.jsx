import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/Casino/Slideshow";
import CategoryContainer from "../components/CategoryContainer";
import ProviderContainer from "../components/ProviderContainer";
import GameModal from "../components/Modal/GameModal";
import LoadApi from "../components/Loading/LoadApi";
import SearchInput from "../components/SearchInput";
import LoginModal from "../components/Modal/LoginModal";
import "animate.css";

import IconFavorite from "/src/assets/svg/favorites.svg";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const Casino = () => {
  const pageTitle = "Casino";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [categoryType, setCategoryType] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [pageData, setPageData] = useState({});
  const [gameUrl, setGameUrl] = useState("");
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [txtSearch, setTxtSearch] = useState("");
  const [searchDelayTimer, setSearchDelayTimer] = useState();
  const [shouldShowGameModal, setShouldShowGameModal] = useState(false);
  const [isGameLoadingError, setIsGameLoadingError] = useState(false);
  const [mobileShowMore, setMobileShowMore] = useState(false);
  const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
  const [hasMoreGames, setHasMoreGames] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile } = useOutletContext();

  const lastLoadedTagRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);

  useEffect(() => {
    if (!location.hash || tags.length === 0) return;
    const hashCode = location.hash.replace('#', '');
    const tagIndex = tags.findIndex(t => t.code === hashCode);

    if (tagIndex !== -1 && selectedCategoryIndex !== tagIndex) {
      setSelectedCategoryIndex(tagIndex);
      setIsSingleCategoryView(false);
      setIsExplicitSingleCategoryView(false);
      getPage(hashCode);
    }
  }, [location.hash]);

  useEffect(() => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
    setActiveCategory({});
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    getPage("casino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const isSlotsOnlyFalse = isSlotsOnly === false || isSlotsOnly === "false";
    let tmpTags = isSlotsOnlyFalse
      ? [
        { name: "Lobby", code: "home", image: "/src/assets/img/category_bonus.png" },
        { name: "Hot", code: "hot", image: "/src/assets/img/category_popular.png" },
        { name: "Jokers", code: "joker", image: "/src/assets/svg/category_blackjack.svg" },
        { name: "Juegos de crash", code: "arcade", image: "/src/assets/img/category_live.png" },
        { name: "Megaways", code: "megaways", image: "/src/assets/img/category_slots.png" },
        { name: "Ruletas", code: "roulette", image: "/src/assets/svg/category_roulette.svg" },
      ]
      : [
        { name: "Lobby", code: "home", image: "/src/assets/img/category_bonus.png" },
        { name: "Hot", code: "hot", image: "/src/assets/img/category_popular.png" },
        { name: "Jokers", code: "joker", image: "/src/assets/svg/category_blackjack.svg" },
        { name: "Megaways", code: "megaways", image: "/src/assets/img/category_slots.png" },
      ];

    setTags(tmpTags);
  }, [isSlotsOnly]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    setIsSingleCategoryView(false);
    setIsExplicitSingleCategoryView(false);
    callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
  };

  const callbackGetPage = (result, page) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      setCategoryType(result.data.page_group_type);
      setSelectedProvider(null);
      setPageData(result.data);

      const hashCode = location.hash.replace('#', '');
      const tagIndex = tags.findIndex(t => t.code === hashCode);
      setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

      if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
        setCategories(result.data.categories);
        if (page === "casino") {
          setMainCategories(result.data.categories);
        }
        const firstCategory = result.data.categories[0];
        setActiveCategory(firstCategory);

        const firstFiveCategories = result.data.categories.slice(0, 5);
        if (firstFiveCategories.length > 0) {
          setFirstFiveCategoriesGames([]);
          pendingCategoryFetchesRef.current = firstFiveCategories.length;
          setIsLoadingGames(true);
          firstFiveCategories.forEach((item, index) => {
            fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
          });
        }
      } else if (result.data && result.data.page_group_type === "games") {
        setIsSingleCategoryView(true);
        setIsExplicitSingleCategoryView(false);
        setCategories(mainCategories.length > 0 ? mainCategories : []);
        configureImageSrc(result);
        setGames(result.data.categories || []);
        setActiveCategory(tags[tagIndex] || { name: page });
        setHasMoreGames(result.data.categories && result.data.categories.length === 30);
        pageCurrent = 1;
      }

      setIsLoadingGames(false);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    const pageSize = 12;
    const groupCode = pageGroupCode || pageData.page_group_code;

    const apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=0&length=" +
      pageSize +
      (selectedProvider && selectedProvider.id ? "&provider=" + selectedProvider.id : "");

    callApi(contextData, "GET", apiUrl, (result) => callbackFetchContentForCategory(result, category, categoryIndex), null);
  };

  const callbackFetchContentForCategory = (result, category, categoryIndex) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url,
      }));

      const categoryGames = {
        category: category,
        games: gamesWithImages,
      };

      setFirstFiveCategoriesGames((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = categoryGames;
        return updated;
      });
    }

    pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
    if (pendingCategoryFetchesRef.current === 0) {
      setIsLoadingGames(false);
    }
  };

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    if (isMobile) {
      setMobileShowMore(true);
    }

    setIsSingleCategoryView(true);
    setIsExplicitSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);

    // Pass `false` → do NOT reset games/page
    fetchContent(category, category.id, category.table_name, categoryIndex, false);
    window.scrollTo(0, 0);
  };

  const loadMoreGames = () => {
    if (!activeCategory) return;
    fetchContent(activeCategory, activeCategory.id, activeCategory.table_name, selectedCategoryIndex, false);
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode) => {
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    const groupCode = categoryType === "categories" ? pageGroupCode || pageData.page_group_code : "default_pages_home"

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      groupCode +
      "&table_name=" +
      tableName +
      "&apigames_category_id=" +
      categoryId +
      "&page=" +
      pageCurrent +
      "&length=" +
      pageSize;

    if (selectedProvider && selectedProvider.id) {
      apiUrl += "&provider=" + selectedProvider.id;
    }

    callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
  };

  const callbackFetchContent = (result) => {
    if (result.status === 500 || result.status === 422) {
      setHasMoreGames(false);
    } else {
      configureImageSrc(result);
      const newGames = result.content || [];

      setGames((prevGames) => {
        return pageCurrent === 0 ? newGames : [...prevGames, ...newGames];
      });

      setHasMoreGames(newGames.length === 30);

      if (newGames.length > 0) {
        pageCurrent += 1;
      }
    }
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      element.imageDataSrc = element.image_local !== null ? contextData.cdnUrl + element.image_local : element.image_url;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    setActiveCategory(null);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : game.image_url;
    callApi(contextData, "GET", "/get-game-url?game_id=" + selectedGameId, callbackLaunchGame, null);
  };

  const callbackLaunchGame = (result) => {
    setShowFullDivLoading(false);
    if (result.status == "0") {
      switch (selectedGameLauncher) {
        case "modal":
        case "tab":
          setGameUrl(result.url);
          break;
      }
    } else {
      setIsGameLoadingError(true);
    }
  };

  const closeGameModal = () => {
    selectedGameId = null;
    selectedGameType = null;
    selectedGameLauncher = null;
    selectedGameName = null;
    selectedGameImg = null;
    setGameUrl("");
    setShouldShowGameModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    setSelectedProvider(null);
    setTxtSearch("");
  };

  const handleProviderSelect = (provider, index = 0) => {
    setSelectedProvider(provider);
    setTxtSearch("");
    setIsExplicitSingleCategoryView(true);

    if (provider) {
      setActiveCategory(null);
      setSelectedCategoryIndex(-1);

      fetchContent(
        provider,
        provider.id,
        provider.table_name,
        index,
        true
      );

      if (isMobile) {
        setMobileShowMore(true);
      }
    } else {
      const firstCategory = categories[0];
      if (firstCategory) {
        setActiveCategory(firstCategory);
        setSelectedCategoryIndex(0);
        fetchContent(firstCategory, firstCategory.id, firstCategory.table_name, 0, true);
      }
    }
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);
    setIsExplicitSingleCategoryView(true);

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
      let keyword = e.target.value;
      do_search(keyword);
    } else {
      if (
        (e.keyCode >= 48 && e.keyCode <= 57) ||
        (e.keyCode >= 65 && e.keyCode <= 90) ||
        e.keyCode == 8 ||
        e.keyCode == 46
      ) {
        do_search(keyword);
      }
    }

    if (e.key === "Enter" || e.keyCode === 13 || e.key === "Escape" || e.keyCode === 27) {
      searchRef.current?.blur();
    }
  };

  const do_search = (keyword) => {
    clearTimeout(searchDelayTimer);

    if (keyword == "") {
      return;
    }

    setGames([]);
    setIsLoadingGames(true);

    let pageSize = 30;

    let searchDelayTimerTmp = setTimeout(function () {
      callApi(
        contextData,
        "GET",
        "/search-content?keyword=" + txtSearch + "&page_group_code=" + pageData.page_group_code + "&length=" + pageSize,
        callbackSearch,
        null
      );
    }, 1000);

    setSearchDelayTimer(searchDelayTimerTmp);
  };

  const callbackSearch = (result) => {
    if (result.status === 500 || result.status === 422) {

    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
    }
    setIsLoadingGames(false);
  };

  return (
    <>
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onConfirm={handleLoginConfirm}
        />
      )}
      {shouldShowGameModal && selectedGameId !== null ? (
        <GameModal
          gameUrl={gameUrl}
          gameName={selectedGameName}
          gameImg={selectedGameImg}
          reload={launchGame}
          launchInNewTab={() => launchGame(null, null, "tab")}
          ref={refGameModal}
          onClose={closeGameModal}
          isMobile={isMobile}
          categories={categories}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          onProviderSelect={handleProviderSelect}
          tags={tags}
          txtSearch={txtSearch}
          setTxtSearch={setTxtSearch}
          search={search}
          getPage={getPage}
        />
      ) : (
        <>
          <div className="casino">
            <div className="casino-menu">
              <div className="casino-menu__search">
                <SearchInput
                  txtSearch={txtSearch}
                  setTxtSearch={setTxtSearch}
                  searchRef={searchRef}
                  search={search}
                  isMobile={isMobile}
                />
                <a href="#" className="favorites">
                  <div><img src={IconFavorite} alt="" /></div>
              </a>
              </div>
              <div className="casino-menu__shadow">
                <div className="casino-menu__scroll">
                  <div className="casino-menu-block categories">
                    <div className="casino-menu-block__title">Categorías</div>
                    {
                      tags.length > 0 && (
                        <CategoryContainer
                          categories={tags}
                          selectedCategoryIndex={selectedCategoryIndex}
                          selectedProvider={selectedProvider}
                          onCategoryClick={(tag, _id, _table, index) => {
                            if (window.location.hash !== `#${tag.code}`) {
                              window.location.hash = `#${tag.code}`;
                            } else {
                              setSelectedCategoryIndex(index);
                              getPage(tag.code);
                            }
                          }}
                          onCategorySelect={handleCategorySelect}
                          isMobile={isMobile}
                          pageType="casino"
                        />
                      )
                    }
                  </div>
                  <div className="casino-menu-block">
                    <div className="casino-menu-block__title">Proveedores</div>
                    <div className="casino-menu-block__content">
                      <ProviderContainer
                        categories={categories}
                        selectedProvider={selectedProvider}
                        setSelectedProvider={setSelectedProvider}
                        onProviderSelect={handleProviderSelect}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="casino_content">
              <Slideshow />
              <div className="casino_mobile_nav">
                <div className="casino_mobile_nav_btns">
                  <div>
                    <a href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileSidebar(true);
                      }}
                      className="sidebar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="19" height="19" x="0" y="0" viewBox="0 0 24 24" xmlSpace="preserve">
                        <g transform="matrix(1.5,0,0,1.5,-6.000000000000002,-6.000000000000002)">
                          <path fill="#ffffff" fillRule="evenodd" d="M19 7a1 1 0 0 0-1-1H6a1 1 0 0 0 0 2h12a1 1 0 0 0 1-1zm0 5a1 1 0 0 0-1-1h-8a1 1 0 1 0 0 2h8a1 1 0 0 0 1-1zm-1 4a1 1 0 1 1 0 2H6a1 1 0 1 1 0-2z" clipRule="evenodd"></path>
                        </g>
                      </svg>
                      Categorías
                    </a>
                  </div>
                  <div>
                    <a href="#" className="favorites">
                      <div><img src={IconFavorite} /></div>
                    </a>
                  </div>
                </div>
                <div>
                  <div className="casino-menu__search">
                    <SearchInput
                      txtSearch={txtSearch}
                      setTxtSearch={setTxtSearch}
                      searchRef={searchRef}
                      search={search}
                      isMobile={isMobile}
                    />
                  </div>
                </div>
              </div>
              {showMobileSidebar && <div className="backblur" onClick={() => setShowMobileSidebar(false)}></div>}
              <aside id="casino_mobile_side" data-side="left" className={showMobileSidebar ? "side_active" : ""}>
                <div className="casino-menu">
                  <div className="casino-menu__scroll">
                    <div className="casino-menu-block categories">
                      <div className="casino-menu-block__title">Categorías</div>
                      {
                        tags.length > 0 && (
                          <CategoryContainer
                            categories={tags}
                            selectedCategoryIndex={selectedCategoryIndex}
                            selectedProvider={selectedProvider}
                            onCategoryClick={(tag, _id, _table, index) => {
                              if (window.location.hash !== `#${tag.code}`) {
                                window.location.hash = `#${tag.code}`;
                              } else {
                                setSelectedCategoryIndex(index);
                                getPage(tag.code);
                              }
                            }}
                            onCategorySelect={handleCategorySelect}
                            isMobile={isMobile}
                            pageType="casino"
                          />
                        )
                      }
                    </div>
                    <div className="casino-menu-block">
                      <div className="casino-menu-block__title">Proveedores</div>
                      <ProviderContainer
                        categories={categories}
                        selectedProvider={selectedProvider}
                        setSelectedProvider={setSelectedProvider}
                        onProviderSelect={handleProviderSelect}
                      />
                    </div>
                  </div>
                </div>
              </aside>
              <div className="">
                {
                  (txtSearch !== "" || selectedProvider || isExplicitSingleCategoryView) ? (
                    <div className="casino-games-container">
                      <div className="casino-games-container__head">
                        <div className="casino-games-container__title">
                          <span>Resultados de la búsqueda</span>
                        </div>
                      </div>
                      <div className="casino-games-container__list">
                        {games.map((game) => (
                          <GameCard
                            key={game.id}
                            id={game.id}
                            title={game.name}
                            text={isLogin ? "Jugar" : "Ingresar"}
                            imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                            mobileShowMore={mobileShowMore}
                            onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                          />
                        ))}
                      </div>
                    </div>
                  ) :
                    <div className="casino-games-container">
                      {isSingleCategoryView ? (
                        <div className="casino-games-container__list">
                          {games.map((game) => (
                            <GameCard
                              key={game.id}
                              id={game.id}
                              title={game.name}
                              text={isLogin ? "Jugar" : "Ingresar"}
                              imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                              mobileShowMore={mobileShowMore}
                              onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                            />
                          ))}
                        </div>
                      ) : (
                        firstFiveCategoriesGames && firstFiveCategoriesGames.map((entry, catIndex) => {
                          if (!entry || !entry.games) return null;
                          const categoryKey = entry.category?.id || `cat-${catIndex}`;

                          return (
                            <div className="casino-games-container" key={categoryKey}>
                              <div className="casino-games-container__head">
                                <div className="casino-games-container__title">
                                  {entry?.category?.name || ''}
                                </div>
                                <a className="casino-games-container__more" onClick={() => loadMoreContent(entry.category, catIndex)}>Todos</a>
                              </div>
                              <div className="casino-games-container__list">
                                {entry.games.slice(0, 30).map((game) => (
                                  <GameCard
                                    key={game.id}
                                    id={game.id}
                                    provider={entry.category || 'Casino'}
                                    title={game.name}
                                    text={isLogin ? "Jugar" : "Ingresar"}
                                    imageSrc={game.image_local !== null ? contextData.cdnUrl + game.image_local : game.image_url}
                                    mobileShowMore={mobileShowMore}
                                    onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                }
                <div className="mt-5">
                  {isLoadingGames && <LoadApi width={60} />}
                  {txtSearch !== "" && !isLoadingGames && hasMoreGames && (
                    <div className="text-center">
                      <a className="btn btn-success load-more" onClick={loadMoreGames}>
                        Mostrar todo
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {isGameLoadingError && (
        <div className="container">
          <div className="row">
            <div className="col-md-6 error-loading-game">
              <div className="alert alert-warning">Error al cargar el juego. Inténtalo de nuevo o ponte en contacto con el equipo de soporte.</div>
              <a className="btn btn-primary" onClick={() => window.location.reload()}>
                Volver a la página principal
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Casino;