import { useContext, useRef } from "react";
import { AppContext } from "../AppContext";
import { useNavigate, useLocation } from "react-router-dom";

const ProviderContainer = ({
    categories,
    selectedProvider,
    setSelectedProvider,
    onProviderSelect
}) => {
    const { contextData } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const isLiveCasino = location.pathname === "/live-casino";
    const dropdownRef = useRef(null);

    const handleProviderSelect = (provider, index = 0) => {
        setSelectedProvider(provider);
        onProviderSelect(provider, index);
        if (isLiveCasino) {
            navigate("#" + provider.code);
        }
    };

    const isProviderSelected = (provider) => {
        if (!selectedProvider) return false;
        return selectedProvider.code === provider.code || selectedProvider.id === provider.id;
    };

    return (
        <div className="casino-menu-block__content" ref={dropdownRef}>
            {categories.map((provider, index) => {
                const isSelected = isProviderSelected(provider);

                return (
                    <a
                        key={index}
                        href="#"
                        className={isSelected ? "router-link-exact-active router-link-active" : ""}
                        onClick={(e) => {
                            e.preventDefault();
                            handleProviderSelect(provider, index);
                        }}
                    >
                        <div>
                            {provider.image_local || provider.image_url ? (
                                <>
                                    <div
                                        className="provider-image"
                                        style={{
                                            backgroundImage: `url(${
                                                provider.image_local
                                                    ? contextData.cdnUrl + provider.image_local
                                                    : provider.image_url
                                            })`
                                        }}
                                    ></div>
                                    <div className="provider-name">{provider.name}</div>
                                </>
                            ) : (
                                <i className="custom-icon-bp-home"></i>
                            )}
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

export default ProviderContainer;