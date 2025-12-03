import { useContext } from "react";
import { AppContext } from "../AppContext";
import { useLocation } from "react-router-dom";

const ProviderContainer = ({
    categories,
    selectedProvider,
    onProviderSelect
}) => {
    const { contextData } = useContext(AppContext);
    const location = useLocation();
    const providers = categories.filter(cat => cat.code !== "home" && cat.code);
    
    const handleClick = (e, provider) => {
        e.preventDefault();
        onProviderSelect(provider);
    };
    
    const isSelected = (provider) => {
        const hashCode = location.hash.substring(1);
        return (selectedProvider && selectedProvider.id === provider.id) || 
               (hashCode === provider.code);
    };
        
    return (
        <div className="casino-menu-block__content">
            {providers.map((provider) => {
                const selected = isSelected(provider);
                return (
                    <a
                        key={provider.id}
                        href="#"
                        className={`provider-link ${selected ? "router-link-exact-active router-link-active active" : ""}`}
                        onClick={(e) => handleClick(e, provider)}
                    >
                        <div className="provider-content">
                            {provider.image_local || provider.image_url ? (
                                <>
                                    <div
                                        className="provider-image"
                                        style={{
                                            backgroundImage: `url(${provider.image_local
                                                ? contextData.cdnUrl + provider.image_local
                                                : provider.image_url
                                            })`
                                        }}
                                    />
                                    <div className="provider-name">{provider.name}</div>
                                </>
                            ) : (
                                <div className="provider-name">{provider.name}</div>
                            )}
                        </div>
                    </a>
                );
            })}
        </div>
    );
};

export default ProviderContainer;