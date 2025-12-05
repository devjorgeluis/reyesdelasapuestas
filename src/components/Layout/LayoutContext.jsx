import { createContext } from "react";

export const LayoutContext = createContext({
    isLogin: false,
    userBalance: 0,
    handleLoginClick: () => { },
    handleLogoutClick: () => { },
    handleChangePasswordClick: () => { },
    refreshBalance: () => { },
    setShowFullDivLoading: () => { },
    isSidebarExpanded: true,
    toggleSidebar: () => { },
});
