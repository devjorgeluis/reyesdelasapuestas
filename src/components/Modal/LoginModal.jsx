import { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { callApi } from "../../utils/Utils";

const LoginModal = ({ isMobile, isOpen, onClose, onConfirm, onLoginSuccess }) => {
    const { contextData, updateSession } = useContext(AppContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setIsLoading(true);

            let body = {
                username: username,
                password: password,
            };
            callApi(
                contextData,
                "POST",
                "/login/",
                callbackSubmitLogin,
                JSON.stringify(body)
            );
        }
    };

    const callbackSubmitLogin = (result) => {
        setIsLoading(false);
        if (result.status === "success") {
            localStorage.setItem("session", JSON.stringify(result));
            updateSession(result);

            if (onLoginSuccess) {
                onLoginSuccess(result.user.balance);
            }
            setTimeout(() => {
                onClose();
                onConfirm();
            }, 1000);
        } else {
            setErrorMsg("Correo electrónico o contraseña no válidos");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="jquery-modal blocker current" style={{ opacity: 1 }}>
            <div id="auth" className="modal" style={{ opacity: 1, display: "inline-block" }}>
                <div className="modal_head">
                    <div>Ingresar</div>
                    <a href="#" rel="modal:close" onClick={() => onClose()}></a>
                </div>
                <div className="modal_content">
                    <form method="post" id="auth_form" onSubmit={handleSubmit}>
                        {
                            errorMsg !== "" && <div className="alert alert-danger">
                                {errorMsg}
                            </div>
                        }
                        <div className="input-block">
                            <input
                                className="form-control"
                                type="text"
                                name="username"
                                placeholder="Nombre de usuario"
                                autoComplete="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <span className="placeholder">Nombre de usuario</span>
                        </div>
                        <div className="input-block">
                            <input
                                id="password"
                                className="form-control"
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                autoComplete="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span className="placeholder">Contraseña</span>
                        </div>
                        <div className="auth_forgot">
                            <a href="#forgot" className="modal_link">¿Ha olvidado su contraseña?</a>
                        </div>
                        <div className="notifications"></div>
                        <button type="submit">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;