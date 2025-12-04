import { useContext } from "react";
import { LayoutContext } from "./Layout/LayoutContext";

import IconFavorite from "/src/assets/svg/favorites.svg";

const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search,
    isMobile
}) => {
    const { setShowMobileSearch } = useContext(LayoutContext);

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        search({ target: { value }, key: event.key, keyCode: event.keyCode });
    };

    const handleFocus = () => {
        if (isMobile) {
            setShowMobileSearch(true);
        }
    };

    return (
        <input
            ref={searchRef}
            placeholder="Buscar en..."
            value={txtSearch}
            onChange={handleChange}
            onKeyUp={search}
            onFocus={handleFocus}
        />
    );
};

export default SearchInput;