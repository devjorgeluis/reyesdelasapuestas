import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import CategoryContainer from "../CategoryContainer";
import ProviderContainer from "../ProviderContainer";
import SearchInput from "../SearchInput";

const Sidebar = ({ isSlotsOnly, isMobile }) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [activeCategory, setActiveCategory] = useState({});
    const [isSingleCategoryView, setIsSingleCategoryView] = useState(false);
    const [isExplicitSingleCategoryView, setIsExplicitSingleCategoryView] = useState(false);
    const [txtSearch, setTxtSearch] = useState("");
    const [searchDelayTimer, setSearchDelayTimer] = useState();
    const searchRef = useRef(null);
    const [isLoadingGames, setIsLoadingGames] = useState(false);

    const handleCategorySelect = (category) => {
        setActiveCategory(category);
        setSelectedProvider(null);
        setTxtSearch("");
    };

    useEffect(() => {
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

    const handleProviderSelect = (provider, index = 0) => {
        setSelectedProvider(provider);
        setTxtSearch("");
        // setIsExplicitSingleCategoryView(true);

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

    const getPage = (page) => {
        setIsLoadingGames(true);
        callApi(contextData, "GET", "/get-page?page=" + page, (result) => callbackGetPage(result, page), null);
    };

    const callbackGetPage = (result, page) => {
        if (result.status === 500 || result.status === 422) {

        } else {
            const hashCode = location.hash.replace('#', '');
            const tagIndex = tags.findIndex(t => t.code === hashCode);
            setSelectedCategoryIndex(tagIndex !== -1 ? tagIndex : 0);

            if (result.data && result.data.page_group_type === "categories" && result.data.categories && result.data.categories.length > 0) {
                setCategories(result.data.categories);
                if (page === "casino") {
                    setMainCategories(result.data.categories);
                }
            } else if (result.data && result.data.page_group_type === "games") {
                setCategories(mainCategories.length > 0 ? mainCategories : []);
            }
        }
    };

    const search = (e) => {
        let keyword = e.target.value;
        setTxtSearch(keyword);
        // setIsExplicitSingleCategoryView(true);

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
            pageCurrent = 0;
        }
        setIsLoadingGames(false);
    };

    return (
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
    );
};

export default Sidebar;
