import { useContext, useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { LayoutContext } from "./LayoutContext";
import { callApi } from "../../utils/Utils";
import Header from "./Header";
import Footer from "./Footer";
import LoginModal from "../Modal/LoginModal";
import { NavigationContext } from "./NavigationContext";
import ChatButton from "../ChatButton";
import FullDivLoading from "../Loading/FullDivLoading";

const Layout = () => {
    const { contextData } = useContext(AppContext);
    const [selectedPage, setSelectedPage] = useState("lobby");
    const [isLogin, setIsLogin] = useState(contextData.session !== null);
    const [isMobile, setIsMobile] = useState(false);
    const [userBalance, setUserBalance] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isSlotsOnly, setIsSlotsOnly] = useState("");
    const [showFullDivLoading, setShowFullDivLoading] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const navigate = useNavigate();

    const location = useLocation();
    const isSportsPage = location.pathname === "/sports" || location.pathname === "/live-sports";

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    useEffect(() => {
        if (contextData.session != null) {
            setIsLogin(true);
            if (contextData.session.user && contextData.session.user.balance) {
                const parsed = parseFloat(contextData.session.user.balance);
                setUserBalance(Number.isFinite(parsed) ? parsed : 0);
            }

            refreshBalance();
        }
        getStatus();
    }, [contextData.session]);

    useEffect(() => {
        const checkIsMobile = () => {
            return window.innerWidth <= 767;
        };

        const checkShouldCollapseSidebar = () => {
            return window.innerWidth < 1024;
        };

        setIsMobile(checkIsMobile());

        if (checkShouldCollapseSidebar()) {
            setIsSidebarExpanded(false);
        }

        const handleResize = () => {
            setIsMobile(checkIsMobile());

            if (checkShouldCollapseSidebar()) {
                setIsSidebarExpanded(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const refreshBalance = () => {
        setUserBalance(0);
        callApi(contextData, "GET", "/get-user-balance", callbackRefreshBalance, null);
    };

    const callbackRefreshBalance = (result) => {
        const parsed = result && result.balance ? parseFloat(result.balance) : 0;
        setUserBalance(Number.isFinite(parsed) ? parsed : 0);
        console.log(result && result.balance);
    };

    const getStatus = () => {
        callApi(contextData, "GET", "/get-status", callbackGetStatus, null);
    };

    const getPage = (page) => {
        setSelectedPage(page);
        setShowFullDivLoading(true);
        callApi(contextData, "GET", "/get-page?page=" + page, callbackGetPage, null);
        navigate("/" + (page === "home" ? "" : page));
    };

    const callbackGetPage = () => {
        setShowFullDivLoading(false);
    };

    const callbackGetStatus = (result) => {
        if ((result && result.slots_only == null) || (result && result.slots_only == false)) {
            setIsSlotsOnly("false");
        } else {
            setIsSlotsOnly("true");
        }

        if (result && result.user === null) {
            localStorage.removeItem("session");
        }
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleLoginSuccess = (balance) => {
        const parsed = balance ? parseFloat(balance) : 0;
        setUserBalance(Number.isFinite(parsed) ? parsed : 0);
    };

    const handleLogoutClick = () => {
        callApi(contextData, "POST", "/logout", (result) => {
            if (result.status === "success") {
                setTimeout(() => {
                    localStorage.removeItem("session");
                    window.location.href = "/";
                }, 200);
            }
        }, null);
    };

    const layoutContextValue = {
        isLogin,
        userBalance,
        handleLoginClick,
        handleLogoutClick,
        refreshBalance,
        isSidebarExpanded,
        toggleSidebar
    };

    return (
        <LayoutContext.Provider value={layoutContextValue}>
            <NavigationContext.Provider
                value={{ selectedPage, setSelectedPage, getPage, showFullDivLoading, setShowFullDivLoading }}
            >
                <>
                    <FullDivLoading show={showFullDivLoading} />
                    {showLoginModal && (
                        <LoginModal
                            isMobile={isMobile}
                            isOpen={showLoginModal}
                            onClose={() => setShowLoginModal(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    )}
                    <div className="page">
                        <Header
                            isLogin={isLogin}
                            isMobile={isMobile}
                            isSlotsOnly={isSlotsOnly}
                            userBalance={userBalance}
                            handleLoginClick={handleLoginClick}
                        />
                        {/* <Sidebar isSlotsOnly={isSlotsOnly} isMobile={isMobile} /> */}
                        <main className="content">
                            <Outlet context={{ isSlotsOnly, isMobile }} />
                        </main>
                        {!isSportsPage && <Footer
                            isLogin={isLogin}
                            isSlotsOnly={isSlotsOnly}
                            userBalance={userBalance}
                            handleLoginClick={handleLoginClick}
                        />}
                    </div>
                </>
            </NavigationContext.Provider>
        </LayoutContext.Provider>
    );
};

export default Layout;
