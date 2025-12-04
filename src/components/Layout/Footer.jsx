import { useNavigate } from "react-router-dom";
import { useState } from "react";
import IconLine from "/src/assets/svg/line.svg";
import IconCasino from "/src/assets/svg/casino.svg";
import IconDeposit from "/src/assets/svg/deposit.svg";
import IconHome from "/src/assets/svg/home.svg";
import IconMenu from "/src/assets/svg/menu.svg";

const Footer = ({ isLogin, isSlotsOnly, userBalance, handleLoginClick }) => {
    const navigate = useNavigate();
    const [showSideMenu, setShowSideMenu] = useState(false);

    return (
        <>
            <div className="footer">
                <div className="wrap_content">
                    <div className="middle_seporator"></div>
                    <div className="footer_content">
                        <div>
                            <a onClick={() => navigate("/home")}>Inicio</a>
                            <a onClick={() => navigate("/casino")}><b><u>CASINO</u></b></a>
                            {
                                isSlotsOnly === "false" && <>
                                    <a onClick={() => navigate("/live-casino")}>Casino EN VIVO</a>
                                    <a onClick={() => navigate("/sports")}>APUESTAS DEPORTIVAS</a>
                                    <a onClick={() => navigate("/live-sports")}>EN VIVO</a>
                                </>
                            }
                        </div>
                    </div>
                    <div className="middle_seporator"></div>
                    <div className="footer_company">
                        Derechos reservados | Reyes de las Apuestas
                    </div>
                    <div className="middle_seporator"></div>
                    <div className="footer_copy">
                    </div>
                </div>
            </div>
            <div className="foot_menu mobile">
                <div>
                    <a onClick={() => navigate("/sports")} className="">
                        <div><img src={IconLine} alt="" /></div>
                        <div>APUESTAS DEPORTIVAS</div>
                    </a>
                </div>
                <div>
                    <a onClick={() => navigate("/casino")} className="">
                        <img src={IconCasino} alt="" style={{ height: 23, fill: "#fff" }} />
                        <div><b><u>CASINO</u></b></div>
                    </a>
                </div>
                <div>
                    <a onClick={() => navigate("/live-casino")} className="for_auth">
                        <div><img src={IconDeposit} alt="" /></div>
                        <div>Live-casino</div>
                    </a>
                </div>
                <div>
                    <a onClick={() => navigate("/home")} className="">
                        <img src={IconHome} alt="" style={{ color: "#fff" }} />
                        <div>Lobby</div>
                    </a>
                </div>
                <div>
                    <a href="#" onClick={(e) => {
                        e.preventDefault();
                        setShowSideMenu(!showSideMenu);
                    }} className="sidebar">
                        <img src={IconMenu} alt="" style={{ fill: "#fff" }} />
                        <div>Menu</div>
                    </a>
                </div>
            </div>
            {showSideMenu && <div className="backblur" onClick={() => setShowSideMenu(false)}></div>}
            <aside id="side_menu" data-side="right" className={showSideMenu ? "side_active" : ""}>
                <div>
                    {
                        isLogin ? <div className="side_menu_user">
                            <div className="menu_balance" onClick={() => navigate("/profile")}>
                                <div className="upd_symbol">$</div>
                                <div className="upd_balance">{userBalance}</div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" strokeWidth="2">
                                    <path d="M6 9l6 6l6 -6"></path>
                                </svg>
                            </div>
                            <a href="#" onClick={() => navigate("/sports")} className="for_auth">APUESTAS DEPORTIVAS</a>
                            <div className="middle_seporator"></div>
                            <a href="#" onClick={() => navigate("/live-sports")} className="for_auth">EN VIVO</a>
                            <div className="middle_seporator"></div>
                            <a href="#" onClick={() => navigate("/sports-history")} className="for_auth">Mis apuestas</a>
                            <a href="#" onClick={() => navigate("/casino")} className="header__link"><b><u>CASINO</u></b></a>
                            <a href="#" onClick={() => navigate("/live-casino")} className="header__link">Live-casino</a>
                            <div className="middle_seporator"></div>
                            <div className="middle_seporator"></div>
                        </div> :
                        <div className="side_menu_btns">
                            <button className="menu-button menu-button--auth" onClick={handleLoginClick}>Ingresar</button>
                        </div>
                    }

                    <div className="side_menu_links">
                        <a href="#" onClick={() => navigate("/home")}>Inicio</a>
                        <div className="middle_seporator"></div>
                        <a href="#" onClick={() => navigate("/sports")} className="core_sport_line">APUESTAS DEPORTIVAS</a>
                        <div className="middle_seporator"></div>
                        <a href="#" onClick={() => navigate("/live-sports")} className="core_sport_live">EN VIVO</a>
                        <div className="middle_seporator"></div>
                        <a href="#" onClick={() => navigate("/casino")}><b><u>CASINO</u></b></a>
                        <div className="middle_seporator"></div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Footer;