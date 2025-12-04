import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutContext } from "./LayoutContext";
import LoadApi from "../Loading/LoadApi";
import ImgLogo from "/src/assets/img/logo.png";
import IconLine from "/src/assets/svg/line.svg";
import IconCasino from "/src/assets/svg/casino.svg";
import IconDeposit from "/src/assets/svg/deposit.svg";
import IconHome from "/src/assets/svg/home.svg";
import IconMenu from "/src/assets/svg/menu.svg";

const Header = ({
    isLogin,
    isMobile,
    isSlotsOnly,
    userBalance,
    handleLoginClick,
    handleLogoutClick
}) => {
    const { isSidebarExpanded } = useContext(LayoutContext);
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMenuContainer, setShowMenuContainer] = useState(false);

    const closeUserMenu = () => {
        setShowUserMenu(false);
    };

    const closeMenuContainer = () => {
        setShowMenuContainer(false);
    };

    const handleClickOutside = (event) => {
        if (!event.target.closest('.dropdown') && !event.target.closest('.user-menu-container') && !event.target.closest('.account-button') && !event.target.closest('.menuContainer')) {
            closeUserMenu();
            closeMenuContainer();
        }
    };

    useState(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="header">
            <div className="header__content desktop">
                <a href="/home" className="logo">
                    <img src={ImgLogo} alt="" />
                </a>
                <a href="/home" className="header__link">Inicio</a>
                {
                    isSlotsOnly === "false" &&
                    <>
                        <a href="/sports" className="header__link ">APUESTAS DEPORTIVAS</a>
                        <a href="/live-sports" className="header__link ">EN VIVO</a>
                        <a href="/sports-history" className="header__link ">Mis apuestas</a>
                    </>
                }

                <a href="/casino" className="header__link "><b><u>CASINO</u></b></a>
                {
                    isSlotsOnly === "false" && <a href="/live-casino" className="header__link ">Live-casino</a>
                }

                <div className="header__space"></div>
                {
                    isLogin ? (
                        <>
                            <div className="header__balance">
                                <div className="menu_balance">
                                    <div className="upd_symbol">$</div>
                                    <div className="upd_balance">{userBalance}</div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" strokeWidth="2">
                                        <path d="M6 9l6 6l6 -6"></path>
                                    </svg>
                                </div>
                            </div>
                            <a href="/profile" className="header__user">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14" viewBox="0 0 11 14" aria-hidden="true" role="img">
                                    <path fill="#FFF" fillRule="evenodd" d="M9.808 10.007L7.523 8.893a.614.614 0 01-.35-.552v-.789a5.261 5.261 0 00.879-1.575.923.923 0 00.557-.844V4.2a.916.916 0 00-.24-.613v-1.24c.014-.129.067-.893-.5-1.523C7.38.277 6.581 0 5.5 0 4.419 0 3.622.277 3.13.824c-.566.63-.513 1.394-.5 1.522v1.241a.918.918 0 00-.239.613v.933c0 .284.133.55.358.726.22.846.678 1.484.838 1.688v.773a.61.61 0 01-.33.54L1.125 9.997A2.096 2.096 0 000 11.844v.756C0 13.707 3.598 14 5.5 14c1.902 0 5.5-.293 5.5-1.4v-.71a2.09 2.09 0 00-1.192-1.883z"></path>
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" strokeWidth="2">
                                    <path d="M6 9l6 6l6 -6"></path>
                                </svg>
                            </a>
                        </>
                    ) : (
                        <button className="menu-button menu-button--auth" onClick={handleLoginClick}>Ingresar</button>
                    )
                }
            </div>
            <div className="header__content mobile">
                <a href="/home" className="logo">
                    <img src={ImgLogo} alt="" />
                </a>
                <div className="header__space"></div>
                <button className="menu-button menu-button--auth" onClick={handleLoginClick}>Ingresar</button>
                {/* <button onClick="open_reg()" className="menu-button" style="display: none;">Registrarse</button> */}
            </div>
            <aside id="side_menu" data-side="right">
                <div>
                    <div className="side_menu_btns">
                        <button className="menu-button menu-button--auth" onClick={handleLoginClick}>Ingresar</button>
                        {/* <button onClick="open_reg()" className="menu-button" style="display: none;">Registrarse</button> */}
                    </div>
                    <div className="side_menu_links">
                        <a href="/home">Inicio</a>
                        <div className="middle_seporator"></div>
                        <a href="/sport/" className="core_sport_line">APUESTAS DEPORTIVAS</a>
                        <div className="middle_seporator"></div>
                        <a href="/sport/live" className="core_sport_live">EN VIVO</a>
                        <div className="middle_seporator"></div>
                        <a href="/casino"><b><u>CASINO</u></b></a>
                        <div className="middle_seporator"></div>
                    </div>
                </div>
            </aside>
            <div className="foot_menu mobile">
                <div>
                    <a href="/sports" className="">
                        <div><img src={IconLine} alt="" /></div>
                        <div>APUESTAS DEPORTIVAS</div>
                    </a>
                </div>
                <div>
                    <a href="/casino" className="">
                        <img src={IconCasino} alt="" style={{ height: 23, fill: "#fff" }} />
                        <div><b><u>CASINO</u></b></div>
                    </a>
                </div>
                <div>
                    <a className="for_auth" onClick={handleLoginClick}>
                        <div><img src={IconDeposit} alt="" /></div>
                        <div>Recargar</div>
                    </a>
                </div>
                <div>
                    <a href="/" className="">
                        <img src={IconHome} alt="" style={{ color: "#fff" }} />
                        <div>Lobby</div>
                    </a>
                </div>
                <div>
                    <a href="#side_menu" className="sidebar">
                        <img src={IconMenu} alt="" style={{ height: 23, fill: "#fff" }} />
                        <div>Menu</div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Header;
