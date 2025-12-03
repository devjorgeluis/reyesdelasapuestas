import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../AppContext";
import { callApi } from "../utils/Utils";
import "../css/sporsbook.css";
import IconArrowLeft from "../assets/svg/chevron-left.svg";
import IconArrowRight from "../assets/svg/chevron-right.svg";

const SportsHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { contextData } = useContext(AppContext);

    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        length: 10,
        totalRecords: 0,
        currentPage: 1,
    });
    
    // State for dropdown visibility
    const [topDropdownOpen, setTopDropdownOpen] = useState(false);
    const [bottomDropdownOpen, setBottomDropdownOpen] = useState(false);

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            start: (page - 1) * prev.length,
            currentPage: page,
        }));
    };

    const formatOperation = (operation) => {
        return operation === "create-ticket" ? "Crear" : "Actualizar";
    };

    const fetchHistory = () => {
        setLoading(true);

        let queryParams = new URLSearchParams({
            start: pagination.start,
            length: pagination.length,
            type: "sports"
        }).toString();
        let apiEndpoint = `/get-sports-history?${queryParams}`;

        callApi(
            contextData,
            "GET",
            apiEndpoint,
            (response) => {
                if (response.status === "0") {
                    setHistories(response.data);
                    setPagination((prev) => ({
                        ...prev,
                        totalRecords: response.recordsTotal || 0,
                    }));
                } else {
                    setHistories([]);
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
        fetchHistory();
    }, [pagination.start, pagination.length]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const topDropdown = document.querySelector('.top-dropdown-container');
            const bottomDropdown = document.querySelector('.bottom-dropdown-container');
            
            if (topDropdown && !topDropdown.contains(event.target)) {
                setTopDropdownOpen(false);
            }
            
            if (bottomDropdown && !bottomDropdown.contains(event.target)) {
                setBottomDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const totalPages = Math.ceil(pagination.totalRecords / pagination.length) || 1;

    const handlePrevPage = () => {
        if (pagination.currentPage > 1) {
            handlePageChange(pagination.currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (pagination.currentPage < totalPages) {
            handlePageChange(pagination.currentPage + 1);
        }
    };

    // Toggle dropdown functions
    const toggleTopDropdown = () => {
        setTopDropdownOpen(!topDropdownOpen);
        setBottomDropdownOpen(false);
    };

    const toggleBottomDropdown = () => {
        setBottomDropdownOpen(!bottomDropdownOpen);
        setTopDropdownOpen(false);
    };

    // Handle page selection from dropdown
    const handlePageSelect = (page) => {
        handlePageChange(page);
        setTopDropdownOpen(false);
        setBottomDropdownOpen(false);
    };

    // Generate page options for dropdown
    const generatePageOptions = () => {
        const options = [];
        for (let i = 1; i <= totalPages; i++) {
            options.push(
                <div 
                    key={i}
                    className={`dropdown-menu__row ${pagination.currentPage === i ? 'active' : ''}`}
                    onClick={() => handlePageSelect(i)}
                    style={{ cursor: 'pointer' }}
                >
                    Página {i} de {totalPages}
                </div>
            );
        }
        return options;
    };

    return (
        <div id="container">
            <div className="betcore-container dark">
                <div className="layout">
                    <div id="left-panel" className="left-panel"></div>
                    <div className="main-panel">
                        <div className="main-panel__content">
                            <div className="history-container">
                                <div className="history__header">
                                    <span className="history__title">Historial de apuestas</span>
                                    <div className="history__filters">
                                        <div className="history__pages">
                                            <img 
                                                src={IconArrowLeft} 
                                                style={{ 
                                                    width: 20, 
                                                    cursor: pagination.currentPage > 1 ? 'pointer' : 'not-allowed',
                                                    opacity: pagination.currentPage > 1 ? 1 : 0.5
                                                }} 
                                                onClick={handlePrevPage}
                                                alt="Previous page"
                                            />
                                            <div className="dropdown-container down top-dropdown-container">
                                                <div 
                                                    className="dropdown-toggle"
                                                    onClick={toggleTopDropdown}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    Página {pagination.currentPage} de {totalPages}
                                                </div>
                                                {topDropdownOpen && (
                                                    <div className="dropdown-menu" style={{ display: 'block' }}>
                                                        {generatePageOptions()}
                                                    </div>
                                                )}
                                            </div>
                                            <img 
                                                src={IconArrowRight} 
                                                style={{ 
                                                    width: 20, 
                                                    cursor: pagination.currentPage < totalPages ? 'pointer' : 'not-allowed',
                                                    opacity: pagination.currentPage < totalPages ? 1 : 0.5
                                                }} 
                                                onClick={handleNextPage}
                                                alt="Next page"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="history__table">
                                    <div className="table__header">
                                        <div className="header__empty">Fecha</div>
                                        <div className="header__amount">Tipo de apuesta</div>
                                        <div className="header__odd">Ganancia posible</div>
                                        <div className="header__possible_win">Identificación del historial</div>
                                    </div>
                                    {loading ? (
                                        <div className="text-center mt-5">Cargando...</div>
                                    ) : histories.length === 0 ? (
                                        <div className="text-center mt-5">No hay datos disponibles.</div>
                                    ) : (
                                        histories.map((history, index) => (
                                            <div className="table__body table__header" key={index}>
                                                <div className="header__empty">{formatDateDisplay(history.created_at)}</div>
                                                <div className="header__amount">{formatOperation(history.operation)}</div>
                                                <div className="header__odd">{formatBalance(history.value || 0)}</div>
                                                <div className="header__possible_win">{history.txn_id || ""}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="history__footer">
                                    <div className="history__pages">
                                        <img 
                                            src={IconArrowLeft} 
                                            style={{ 
                                                width: 20, 
                                                cursor: pagination.currentPage > 1 ? 'pointer' : 'not-allowed',
                                                opacity: pagination.currentPage > 1 ? 1 : 0.5
                                            }} 
                                            onClick={handlePrevPage}
                                            alt="Previous page"
                                        />
                                        <div className="dropdown-container up bottom-dropdown-container">
                                            <div 
                                                className="dropdown-toggle"
                                                onClick={toggleBottomDropdown}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Página {pagination.currentPage} de {totalPages}
                                            </div>
                                            {bottomDropdownOpen && (
                                                <div className="dropdown-menu" style={{ display: 'block' }}>
                                                    {generatePageOptions()}
                                                </div>
                                            )}
                                        </div>
                                        <img 
                                            src={IconArrowRight} 
                                            style={{ 
                                                width: 20, 
                                                cursor: pagination.currentPage < totalPages ? 'pointer' : 'not-allowed',
                                                opacity: pagination.currentPage < totalPages ? 1 : 0.5
                                            }} 
                                            onClick={handleNextPage}
                                            alt="Next page"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="right-panel" className="right-panel"></div>
                </div>
            </div>
        </div>
    );
};

export default SportsHistory;