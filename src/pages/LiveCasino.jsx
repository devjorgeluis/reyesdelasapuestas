import { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useOutletContext, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";
import { LayoutContext } from "../components/Layout/LayoutContext";
import { NavigationContext } from "../components/Layout/NavigationContext";
import { callApi } from "../utils/Utils";
import GameCard from "/src/components/GameCard";
import Slideshow from "../components/Casino/Slideshow";
import ProviderContainer from "../components/providerContainer";
import GameModal from "../components/Modal/GameModal";
import LoadApi from "../components/Loading/LoadApi";
import SearchInput from "../components/SearchInput";
import LoginModal from "../components/Modal/LoginModal";
import "animate.css";

let selectedGameId = null;
let selectedGameType = null;
let selectedGameLauncher = null;
let selectedGameName = null;
let selectedGameImg = null;
let pageCurrent = 0;

const LiveCasino = () => {
  const pageTitle = "Casino en Vivo";
  const { contextData } = useContext(AppContext);
  const { isLogin } = useContext(LayoutContext);
  const { setShowFullDivLoading } = useContext(NavigationContext);
  const navigate = useNavigate();
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [games, setGames] = useState([]);
  const [firstFiveCategoriesGames, setFirstFiveCategoriesGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const originalCategoriesRef = useRef([]);
  const [activeCategory, setActiveCategory] = useState({});
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
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
  const refGameModal = useRef();
  const location = useLocation();
  const searchRef = useRef(null);
  const { isSlotsOnly, isMobile } = useOutletContext();
  const hasFetchedContentRef = useRef(false);
  const prevHashRef = useRef("");
  const pendingCategoryFetchesRef = useRef(0);
  const lastLoadedCategoryRef = useRef(null); // Track last loaded category

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
    hasFetchedContentRef.current = false;
    lastLoadedCategoryRef.current = null; // Reset on page load
    getPage("livecasino");
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPage = (page) => {
    setIsLoadingGames(true);
    setGames([]);
    setFirstFiveCategoriesGames([]);
    callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
  };

  const callbackGetPage = (result) => {
    if (result.status === 500 || result.status === 422) {
      setIsLoadingGames(false);
    } else {
      const homeCategory = {
        name: "Lobby",
        code: "home",
        id: 0,
        table_name: "apigames_categories"
      };
      const updatedCategories = [homeCategory, ...(result.data.categories || [])];
      setCategories(updatedCategories);
      if (!originalCategoriesRef.current || originalCategoriesRef.current.length === 0) {
        originalCategoriesRef.current = updatedCategories;
      }
      setSelectedProvider(null);
      setPageData(result.data);
      const firstFiveCategories = updatedCategories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        setFirstFiveCategoriesGames([]);
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, result.data.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      setActiveCategory(homeCategory);
      setSelectedCategoryIndex(0);
    }
  };

  const fetchContentForCategory = (category, categoryId, tableName, categoryIndex, resetCurrentPage, pageGroupCode = null) => {
    if (!categoryId || !tableName) {
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
      return;
    }
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
      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    } else {
      const content = result.content || [];
      configureImageSrc(result);

      const gamesWithImages = content.map((game) => ({
        ...game,
        imageDataSrc: game.image_local != null ? contextData.cdnUrl + game.image_local : game.image_url,
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

      pendingCategoryFetchesRef.current = Math.max(0, pendingCategoryFetchesRef.current - 1);
      if (pendingCategoryFetchesRef.current === 0) {
        setIsLoadingGames(false);
      }
    }
  };

  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.startsWith('#')) {
      if (prevHashRef.current !== hash) {
        const categoryCode = hash.substring(1);
        if (categoryCode === "home") {
          setSelectedProvider(null);
          setActiveCategory(categories[0]);
          setSelectedCategoryIndex(0);
          setIsSingleCategoryView(false);
          setGames([]);
          setFirstFiveCategoriesGames([]);
          const firstFiveCategories = categories.slice(1, 6);
          if (firstFiveCategories.length > 0) {
            pendingCategoryFetchesRef.current = firstFiveCategories.length;
            setIsLoadingGames(true);
            firstFiveCategories.forEach((item, index) => {
              fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
            });
          } else {
            setIsLoadingGames(false);
          }
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = null; // Reset on hash navigation
          return;
        }
        const category = categories.find(cat => cat.code === categoryCode);
        if (category) {
          const categoryIndex = categories.indexOf(category);
          setSelectedProvider(null);
          setActiveCategory(category);
          setSelectedCategoryIndex(categoryIndex);
          setIsSingleCategoryView(true);
          fetchContent(category, category.id, category.table_name, categoryIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = category.code;
          return;
        }
      }
    }

    if (!hasFetchedContentRef.current) {
      const urlParams = new URLSearchParams(location.search);
      const providerName = urlParams.get('provider');
      const providerId = urlParams.get('providerId');

      if (providerName && providerId) {
        const provider = categories.find(cat => cat.id.toString() === providerId.toString());
        if (provider) {
          const providerIndex = categories.indexOf(provider);
          setSelectedProvider(provider);
          setActiveCategory(provider);
          setSelectedCategoryIndex(providerIndex);
          setIsSingleCategoryView(true);
          fetchContent(provider, provider.id, provider.table_name, providerIndex, true);
          prevHashRef.current = hash;
          hasFetchedContentRef.current = true;
          lastLoadedCategoryRef.current = provider.code;
          return;
        }
      }

      setActiveCategory(categories[0] || {});
      setSelectedCategoryIndex(0);
      setIsSingleCategoryView(false);
      hasFetchedContentRef.current = true;
      lastLoadedCategoryRef.current = null;
    }
  }, [categories, location.search, location.hash]);

  const loadMoreContent = (category, categoryIndex) => {
    if (!category) return;
    const isSameCategory = lastLoadedCategoryRef.current === category.code;
    const resetCurrentPage = !isSameCategory;
    if (category.code === "home") {
      setIsSingleCategoryView(true);
      setSelectedCategoryIndex(0);
      setActiveCategory(category);
      if (resetCurrentPage) {
        setGames([]);
      }
      fetchContent(category, category.id, category.table_name, categoryIndex, resetCurrentPage);
      if (isMobile) {
        setMobileShowMore(true);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = category.code;
      return;
    }
    if (isMobile) {
      setMobileShowMore(true);
    }
    setIsSingleCategoryView(true);
    setSelectedCategoryIndex(categoryIndex);
    setActiveCategory(category);
    fetchContent(category, category.id, category.table_name, categoryIndex, resetCurrentPage);
    lastLoadedCategoryRef.current = category.code;
  };

  const fetchContent = (category, categoryId, tableName, categoryIndex, resetCurrentPage) => {
    if (!categoryId || !tableName) {
      if (category.code === "home") {
        const pageSize = 30;
        setIsLoadingGames(true);
        if (resetCurrentPage) {
          pageCurrent = 0;
          setGames([]);
        }
        const apiUrl =
          "/get-content?page_group_type=categories&page_group_code=" +
          pageData.page_group_code +
          "&page=" +
          pageCurrent +
          "&length=" +
          pageSize;
        callApi(contextData, "GET", apiUrl, callbackFetchContent, null);
        return;
      }
      setIsLoadingGames(false);
      return;
    }
    let pageSize = 30;
    setIsLoadingGames(true);

    if (resetCurrentPage) {
      pageCurrent = 0;
      setGames([]);
    }

    setActiveCategory(category);
    setSelectedCategoryIndex(categoryIndex);

    let apiUrl =
      "/get-content?page_group_type=categories&page_group_code=" +
      pageData.page_group_code +
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
      setIsLoadingGames(false);
    } else {
      if (pageCurrent == 0) {
        configureImageSrc(result);
        setGames(result.content);
      } else {
        configureImageSrc(result);
        setGames([...games, ...result.content]);
      }
      pageCurrent += 1;
    }
    setIsLoadingGames(false);
  };

  const configureImageSrc = (result) => {
    (result.content || []).forEach((element) => {
      let imageDataSrc = element.image_url;
      if (element.image_local != null) {
        imageDataSrc = contextData.cdnUrl + element.image_local;
      }
      element.imageDataSrc = imageDataSrc;
    });
  };

  const launchGame = (game, type, launcher) => {
    setShouldShowGameModal(true);
    setShowFullDivLoading(true);
    selectedGameId = game.id != null ? game.id : selectedGameId;
    selectedGameType = type != null ? type : selectedGameType;
    selectedGameLauncher = launcher != null ? launcher : selectedGameLauncher;
    selectedGameName = game?.name;
    selectedGameImg = game?.image_local != null ? contextData.cdnUrl + game?.image_local : null;
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

  const handleCategorySelect = (category, index) => {
    setSelectedProvider(null);
    setTxtSearch("");
    setSelectedCategoryIndex(index);
    if (category.code === "home") {
      setIsSingleCategoryView(false);
      setActiveCategory(category);
      setGames([]);
      setFirstFiveCategoriesGames([]);
      const firstFiveCategories = categories.slice(1, 6);
      if (firstFiveCategories.length > 0) {
        pendingCategoryFetchesRef.current = firstFiveCategories.length;
        setIsLoadingGames(true);
        firstFiveCategories.forEach((item, index) => {
          fetchContentForCategory(item, item.id, item.table_name, index, true, pageData.page_group_code);
        });
      } else {
        setIsLoadingGames(false);
      }
      navigate("/live-casino#home");
      lastLoadedCategoryRef.current = null;
    } else {
      setIsSingleCategoryView(true);
      setActiveCategory(category);
      fetchContent(category, category.id, category.table_name, index, true);
      lastLoadedCategoryRef.current = category.code;
    }
  };

  const handleProviderSelect = (provider, index = 0) => {
    if (!provider) {
      // "All providers" case
      setSelectedProvider(null);
      setActiveCategory(categories[0]); // Lobby
      setSelectedCategoryIndex(0);
      setIsExplicitSingleCategoryView(false);
      setIsSingleCategoryView(false);
      setGames([]);
      setFirstFiveCategoriesGames([]);
      // Reload first 5 categories
      const firstFive = categories.slice(1, 6);
      if (firstFive.length > 0) {
        pendingCategoryFetchesRef.current = firstFive.length;
        setIsLoadingGames(true);
        firstFive.forEach((cat, i) => {
          fetchContentForCategory(cat, cat.id, cat.table_name, i, true, pageData.page_group_code);
        });
      }
      navigate("/live-casino#home");
      return;
    }

    // ← SELECTING A REAL PROVIDER
    setSelectedProvider(provider);
    setActiveCategory(provider);           // ← This is CRITICAL
    setSelectedCategoryIndex(-1);
    setIsExplicitSingleCategoryView(true);
    setIsSingleCategoryView(true);
    setTxtSearch("");

    fetchContent(provider, provider.id, provider.table_name, index, true);

    if (isMobile) {
      setMobileShowMore(true);
    }

    // Update URL
    navigate(`/live-casino#${provider.code}`);
  };

  const search = (e) => {
    let keyword = e.target.value;
    setTxtSearch(keyword);
    setIsSingleCategoryView(true);
    lastLoadedCategoryRef.current = null; // Reset on search

    if (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i)) {
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

    if (keyword === "") {
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
      setIsLoadingGames(false);
    } else {
      configureImageSrc(result);
      setGames(result.content);
      pageCurrent = 0;
      lastLoadedCategoryRef.current = null; // Reset on search
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
        />
      ) : (
        <>
          <div className="casino">
            <div className="casino-menu">
              <SearchInput
                txtSearch={txtSearch}
                setTxtSearch={setTxtSearch}
                searchRef={searchRef}
                search={search}
                isMobile={isMobile}
              />
              <div className="casino-menu__shadow">
                <div className="casino-menu__scroll">
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
              <div className="casino-games-container">
                {(txtSearch !== "" || selectedProvider || isSingleCategoryView) ? (
                  <>
                    <div className="casino-games-container__list">
                      {games.map((game) => (
                        <GameCard
                          key={game.id}
                          id={game.id}
                          provider={activeCategory || 'Casino en vivo'}
                          title={game.name}
                          text={isLogin ? "Jugar" : "Ingresar"}
                          imageSrc={game.imageDataSrc || game.image_url}
                          mobileShowMore={mobileShowMore}
                          onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                        />
                      ))}
                    </div>
                    <div className="mt-5">
                      {isLoadingGames && <LoadApi />}
                      {(isSingleCategoryView || txtSearch !== "" || selectedProvider) && !isLoadingGames && (
                        <div className="text-center">
                          <a className="btn btn-success load-more" onClick={() => loadMoreContent(activeCategory, selectedCategoryIndex)}>
                            Mostrar todo
                          </a>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {firstFiveCategoriesGames && firstFiveCategoriesGames.map((entry, catIndex) => {
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
                            {entry.games.slice(0, 24).map((game) => (
                              <GameCard
                                key={game.id}
                                id={game.id}
                                provider={entry.category || 'Casino en vivo'}
                                title={game.name}
                                text={isLogin ? "Jugar" : "Ingresar"}
                                imageSrc={game.imageDataSrc || game.image_url}
                                mobileShowMore={mobileShowMore}
                                onClick={() => (isLogin ? launchGame(game, "slot", "tab") : handleLoginClick())}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {isLoadingGames && <LoadApi />}
                  </>
                )}
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

export default LiveCasino;