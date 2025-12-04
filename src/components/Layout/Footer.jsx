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
                        <div>
                            <a href="https://www.facebook.com/reyes.de.las.apuestas.2024" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="23" height="23" x="0" y="0" viewBox="0 0 512 512" xmlSpace="preserve" className="hovered-paths">
                                    <g>
                                        <path d="M437 0H75C33.648 0 0 33.648 0 75v362c0 41.352 33.648 75 75 75h151V331h-60v-90h60v-61c0-49.629 40.371-90 90-90h91v90h-91v61h91l-15 90h-76v181h121c41.352 0 75-33.648 75-75V75c0-41.352-33.648-75-75-75zm0 0" opacity="1" className="hovered-path"></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/losreyes.delasapuestas?igsh=MWJlcW90NmFjaGNzZg==" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="25" height="25" x="0" y="0" viewBox="0 0 60 60" xmlSpace="preserve">
                                    <g transform="matrix(1.1800000000000004,0,0,1.1800000000000004,-5.399999999999999,-5.399999999999999)">
                                        <path d="M30 20.83c-5.06 0-9.17 4.11-9.17 9.17s4.11 9.18 9.17 9.18 9.18-4.12 9.18-9.18-4.12-9.17-9.18-9.17z" opacity="1"></path>
                                        <path d="M43.84 5H16.16C10.01 5 5 10.01 5 16.16v27.68C5 50 10.01 55 16.16 55h27.68C50 55 55 50 55 43.84V16.16C55 10.01 50 5 43.84 5zM30 46.2c-8.93 0-16.2-7.27-16.2-16.2S21.07 13.81 30 13.81 46.2 21.07 46.2 30 38.93 46.2 30 46.2zm16.54-29.45c-1.89 0-3.43-1.53-3.43-3.42s1.54-3.43 3.43-3.43 3.43 1.54 3.43 3.43-1.54 3.42-3.43 3.42z" opacity="1"></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@ReyesdelasapuestasCasino" target="_blank">
                                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="30" height="30" x="0" y="0" viewBox="0 0 310 310" xmlSpace="preserve" className="hovered-paths">
                                    <g>
                                        <path d="M297.917 64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359 0-61.369 5.776-72.517 19.938C0 79.663 0 100.008 0 128.166v53.669c0 54.551 12.896 82.248 83.386 82.248h143.226c34.216 0 53.176-4.788 65.442-16.527C304.633 235.518 310 215.863 310 181.835v-53.669c0-29.695-.841-50.16-12.083-63.521zm-98.896 97.765-65.038 33.991a9.997 9.997 0 0 1-14.632-8.863v-67.764a10 10 0 0 1 14.609-8.874l65.038 33.772a10 10 0 0 1 .023 17.738z" opacity="1" className="hovered-path"></path>
                                    </g>
                                </svg>
                            </a>
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