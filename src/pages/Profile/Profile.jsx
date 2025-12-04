import { useContext, useEffect } from "react";
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import { NavigationContext } from "../../components/Layout/NavigationContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";
import '../../css/profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const { isMobile } = useOutletContext();
    const { setShowFullDivLoading } = useContext(NavigationContext);

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const handleLogoutClick = () => {
        setShowFullDivLoading(true);
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    return (
        <div className="profile">
            <div className="profile__left">
                <div className="profile__menu">
                    <div className="profile-info">
                        <div className="profile-info__id">ID: {contextData?.session?.user?.id || '******'}</div>
                        <div className="profile-info__login">{contextData?.session?.user?.username || '-'}</div>
                    </div>

                    <div className="profile-menu">
                        <a
                            href="#"
                            className="active router-link-exact-active menu__row"
                            aria-current="page"
                        >
                            <div className="menu__row--icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="5.25 2.25 13.5 19.5"
                                >
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                </svg>
                            </div>
                            <div className="menu__row--title">Mi cuenta</div>
                        </a>

                        <a onClick={() => navigate("/profile/history")} className="menu__row">
                            <div className="menu__row--icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="4.25 2.25 15.5 19.5"
                                >
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                                    <path d="M17 21H7a2 2 0 0 1 -2 -2V5a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                                    <path d="M14 11h-2.5a1.5 1.5 0 000 3h1a1.5 1.5 0 010 3h-2.5"></path>
                                    <path d="M12 17v1m0 -8v1"></path>
                                </svg>
                            </div>
                            <div className="menu__row--title">Historial financiero</div>
                        </a>

                        <div className="menu__row logout" onClick={handleLogoutClick}>
                            <div className="menu__row--icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    version="1.1"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    width="512"
                                    height="512"
                                    x="0"
                                    y="0"
                                    viewBox="0 0 512 512"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path
                                            d="M363.335 488a24 24 0 0 1-24 24H113.082a80.09 80.09 0 0 1-80-80V80a80.09 80.09 0 0 1 80-80h226.253a24 24 0 0 1 0 48H113.082a32.035 32.035 0 0 0-32 32v352a32.034 32.034 0 0 0 32 32h226.253a24 24 0 0 1 24 24zm108.553-248.97L357.837 124.978a24 24 0 1 0-33.937 33.941L396.977 232H208.041a24 24 0 1 0 0 48h188.935l-73.08 73.08a24 24 0 1 0 33.941 33.941l114.051-114.05a24 24 0 0 0 0-33.941z"
                                            fill="currentColor"
                                            opacity="1"
                                        />
                                    </g>
                                </svg>
                            </div>
                            <div className="menu__row--title">Salir de cuenta</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`profile__right ${isMobile ? '' : ''}`}>
                <div className="profile__content">
                    <div className="settings">
                        <div className="page__title">
                            <a href="/profile" className="page__back">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                    viewBox="8.25 5.25 7.5 13.5"
                                >
                                    <path d="M15 6l-6 6l6 6"></path>
                                </svg>
                            </a>
                            <span>Mi cuenta</span>
                        </div>

                        <div className="page__content">
                            <form>
                                <div className="settings__columns">
                                    <div className="settings__column">
                                        <div className="input-block">
                                            <input type="text" disabled required />
                                            <span className="placeholder">{contextData?.session?.user?.username || 'Tu Nombre / Apellido'}</span>
                                        </div>

                                        <div className="input-block phonePluginReg">
                                            <div className="iti iti--allow-dropdown iti--show-flags iti--inline-dropdown">
                                                <input
                                                    className="input iti__tel-input"
                                                    type="text"
                                                    disabled
                                                    placeholder="+54 9 11 2345-6789"
                                                    autoComplete="off"
                                                    value={contextData?.session?.user?.phone || '-'}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-block">
                                            <input type="email" disabled required />
                                            <span className="placeholder">{contextData?.session?.user?.email || 'Tu correo E-mail'}</span>
                                        </div>

                                        <div className="input-block">
                                            <input type="text" disabled />
                                            <span className="placeholder">{contextData?.session?.user?.birthday || 'Fecha de nacimiento'}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="button" type="submit" disabled>
                                    Guardar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
