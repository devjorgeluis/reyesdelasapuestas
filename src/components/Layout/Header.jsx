import { useNavigate, useLocation } from "react-router-dom";
import ImgLogo from "/src/assets/img/logo.png";
import ImgSupport from "/src/assets/svg/support-black.svg";

const Header = ({
    isLogin,
    isMobile,
    isSlotsOnly,
    userBalance,
    handleLoginClick,
    supportParent,
    openSupportModal
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const getLinkClass = (path) => {
        const current = location.pathname.replace(/\/$/, "");
        const target = path.replace(/\/$/, "");
        return `header__link ${current === target ? 'active' : ''}`.trim();
    };

    return (
        <div className="header">
            <div className={`header__content ${isMobile ? 'mobile' : 'desktop'}`}>
                <a href="#" onClick={() => navigate("/home")} className="logo">
                    <img src={ImgLogo} alt="" />
                </a>
                {
                    !isMobile && <>
                        <a href="#" onClick={() => navigate("/home")} className={getLinkClass('/home')}>Inicio</a>
                        {isSlotsOnly === "false" &&
                            <>
                                <a href="#" onClick={() => navigate("/sports")} className={getLinkClass('/sports')}>APUESTAS DEPORTIVAS</a>
                                <a href="#" onClick={() => navigate("/live-sports")} className={getLinkClass('/live-sports')}>EN VIVO</a>
                                <a href="#" onClick={() => navigate("/sports-history")} className={getLinkClass('/sports-history')}>Mis apuestas</a>
                            </>
                        }
                        <a href="#" onClick={() => navigate("/casino")} className={getLinkClass('/casino')}><b><u>CASINO</u></b></a>
                        {isSlotsOnly === "false" && <a href="#" onClick={() => navigate("/live-casino")} className={getLinkClass('/live-casino')}>Live-casino</a>}
                    </>
                }

                <div className="header__space"></div>
                {
                    isLogin ? (
                        <>
                            <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                <img src={ImgSupport} />
                            </button>                        
                            <div className="header__balance">
                                <div className="menu_balance">
                                    <div className="upd_symbol">$</div>
                                    <div className="upd_balance">{Number.isFinite(Number(userBalance)) ? Number(userBalance).toFixed(2) : "0.00"}</div>
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
                        <>
                            <button className="button-support" onClick={() => { openSupportModal(false); }}>
                                <img src={ImgSupport} />
                            </button>
                            <button className="menu-button menu-button--auth" onClick={handleLoginClick}>Ingresar</button>
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Header;
