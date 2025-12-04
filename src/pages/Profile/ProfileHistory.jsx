import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationContext } from "../../components/Layout/NavigationContext";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const ProfileHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);
    const { setShowFullDivLoading } = useContext(NavigationContext);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('wallet');
    const [pagination, setPagination] = useState({
        start: 0,
        length: 5,
        totalRecords: 0,
        currentPage: 1,
    });

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const fetchHistory = (tab) => {
        setLoading(true);

        let queryParams;
        let apiEndpoint;

        if (tab === 'casino') {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
                type: "slot"
            }).toString();
            apiEndpoint = `/get-history?${queryParams}`;
        } else {
            queryParams = new URLSearchParams({
                start: pagination.start,
                length: pagination.length,
            }).toString();
            apiEndpoint = `/get-transactions?${queryParams}`;
        }

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0") {
                    setTransactions(response.data);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setTransactions([]);
                    console.error("API error:", response);
                }
                setLoading(false);
            },
            null
        );
    };

    useEffect(() => {
        if (!contextData?.session) {
            navigate("/");
        }
    }, [contextData?.session, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    useEffect(() => {
        fetchHistory(activeTab);
    }, [pagination.start, pagination.length, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setPagination((prev) => ({ ...prev, start: 0, currentPage: 1 }));
    };

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

    const formatDateDisplay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        return date.toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    const formatBalance = (value) => {
        const num = parseFloat(value);
        return num.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length);

    const getVisiblePages = () => {
        const delta = 1;
        const visiblePages = [];
        let startPage = Math.max(1, pagination.currentPage - delta);
        let endPage = Math.min(totalPages, pagination.currentPage + delta);

        if (endPage - startPage + 1 < 2 * delta + 1) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2 * delta);
            } else {
                startPage = Math.max(1, endPage - 2 * delta);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            visiblePages.push(i);
        }

        return { visiblePages, startPage, endPage };
    };

    const { visiblePages } = getVisiblePages();

    const handlePrevPage = () => handlePageChange(pagination.currentPage - 1);
    const handleNextPage = () => handlePageChange(pagination.currentPage + 1);

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
                            onClick={() => navigate("/profile")}
                            className="menu__row"
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

                        <a href="#" className="active router-link-exact-active menu__row">
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
            <div className="profile__right">
                <div className="profile__content">
                    <div className="history">
                        <div className="page__title">
                            <div className="tab_selector">
                                <a className={`${activeTab === "wallet" ? "act" : ""}`} onClick={() => handleTabChange('wallet')}>Retiros</a>
                                <a className={`${activeTab === "casino" ? "act" : ""}`} onClick={() => handleTabChange('casino')}>Depositos</a>
                            </div>
                        </div>
                        <div className="page__content">
                            {loading ? (
                                <div className="text-center">
                                    <span>Cargando...</span>
                                </div>
                            ) : transactions.length > 0 ? (
                                activeTab === "wallet" ?
                                    transactions.map((txn, index) => (
                                        <div className="history-row" key={index}>
                                            <div className="history-row__info">
                                                <div className="history_tr_amount">
                                                    <div>
                                                        <svg viewBox="0 0 24 24" width="21px" height="21px" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 10c3.976 0 8-1.374 8-4s-4.024-4-8-4-8 1.374-8 4 4.024 4 8 4z"></path>
                                                            <path d="M4 10c0 2.626 4.024 4 8 4s8-1.374 8-4V8c0 2.626-4.024 4-8 4s-8-1.374-8-4v2z"></path>
                                                            <path d="M4 14c0 2.626 4.024 4 8 4s8-1.374 8-4v-2c0 2.626-4.024 4-8 4s-8-1.374-8-4v2z"></path>
                                                            <path d="M4 18c0 2.626 4.024 4 8 4s8-1.374 8-4v-2c0 2.626-4.024 4-8 4s-8-1.374-8-4v2z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div>$ {formatBalance(txn.amount)}</div>
                                                        <div className="history_tr_time">{formatDateDisplay(txn.created_at)}</div>
                                                    </div>
                                                </div>
                                                {
                                                    txn.type === 'add' ? (
                                                        <div className="status status_1">Realizado</div>
                                                    ) : (
                                                        <div className="status status_0">No pagado</div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    )) :
                                    transactions.map((txn, index) => (
                                        <div className="history-row" key={index}>
                                            <div className="history-row__info">
                                                <div className="history_tr_amount">
                                                    <div>
                                                        <svg viewBox="0 0 24 24" width="21px" height="21px" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 10c3.976 0 8-1.374 8-4s-4.024-4-8-4-8 1.374-8 4 4.024 4 8 4z"></path>
                                                            <path d="M4 10c0 2.626 4.024 4 8 4s8-1.374 8-4V8c0 2.626-4.024 4-8 4s-8-1.374-8-4v2z"></path>
                                                            <path d="M4 14c0 2.626 4.024 4 8 4s8-1.374 8-4v-2c0 2.626-4.024 4-8 4s-8-1.374-8-4v2z"></path>
                                                            <path d="M4 18c0 2.626 4.024 4 8 4s8-1.374 8-4v-2c0 2.626-4.024 4-8 4s-8-1.374-8-4v2z"></path>
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div>$ {formatBalance(txn.value)}</div>
                                                        <div className="history_tr_time">{formatDateDisplay(txn.created_at)}</div>
                                                    </div>
                                                </div>
                                                {
                                                    txn.value > 0 ? (
                                                        <div className="status status_1">Realizado</div>
                                                    ) : (
                                                        <div className="status status_0">No pagado</div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))
                            ) : <div className="history-row">
                                <div className="history-row__info">
                                    <div>Datos no encontrados.</div>
                                </div>
                            </div>
                            }

                            <div className="pagination">
                                <button onClick={handlePrevPage} disabled={pagination.currentPage <= 1 || totalPages <= 1}>
                                    Previo
                                </button>

                                {totalPages > 0 && visiblePages.map((page) => (
                                    <span
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </span>
                                ))}

                                <button onClick={handleNextPage} disabled={pagination.currentPage >= totalPages || totalPages <= 1}>
                                    Proximo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHistory;