const SearchInput = ({
    txtSearch,
    setTxtSearch,
    searchRef,
    search
}) => {

    const handleChange = (event) => {
        const value = event.target.value;
        setTxtSearch(value);
        search({ target: { value }, key: event.key, keyCode: event.keyCode });
    };

    return (
        <input
            ref={searchRef}
            placeholder="Buscar en..."
            value={txtSearch}
            onChange={handleChange}
            onKeyUp={search}
        />
    );
};

export default SearchInput;