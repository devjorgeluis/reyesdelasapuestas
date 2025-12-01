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
                <a href="/sport/" className="header__link ">APUESTAS DEPORTIVAS</a>
                <a href="/sport/live" className="header__link ">EN VIVO</a>
                <a href="/casino" className="header__link "><b><u>CASINO</u></b></a>
                <a href="/casino/categories/Live" className="header__link ">Live-casino</a>
                <a href="/bonuses" className="header__link ">Bonos</a>
                <div className="header__space"></div>
                <button className="menu-button menu-button--auth">Ingresar</button>
                {/* <button onClick="open_reg()" className="menu-button" style="display: none;">Registrarse</button> */}
            </div>
            <div className="header__content mobile">
                <a href="/home" className="logo">
                    <img src={ImgLogo} alt="" />
                </a>
                <div className="header__space"></div>
                <button className="menu-button menu-button--auth">Ingresar</button>
                {/* <button onClick="open_reg()" className="menu-button" style="display: none;">Registrarse</button> */}
            </div>
            <aside id="side_menu" data-side="right">
                <div>
                    <div className="side_menu_btns">
                        <button className="menu-button menu-button--auth">Ingresar</button>
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
                    <a href="/sport/" className="">
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
                    <a className="for_auth">
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
