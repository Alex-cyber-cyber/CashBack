import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import "../Styles/styles.scss";
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { loginWithGoogle, handleAuthRedirectResult } from '../services/auth.service';
import SocialButtons from '../components/SocialButtons';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../../../../../firebase/firebase.config';
import { getRedirectResult } from 'firebase/auth';
const Login = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        handleAuthRedirectResult().catch(() => { });
    }, []);
    useEffect(() => {
        if (!isLoading && user)
            navigate("/dashboard", { replace: true });
    }, [user, isLoading, navigate]);
    useEffect(() => {
        getRedirectResult(auth).catch(() => { });
    }, []);
    useEffect(() => {
        if (user)
            navigate(from, { replace: true });
    }, [user, from, navigate]);
    const handleGoogleLogin = async () => { await loginWithGoogle(); };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1500);
    };
    return (_jsxs("div", { className: "auth-container", children: [_jsxs("div", { className: "auth-left-panel", children: [_jsx("button", { className: "back-button", onClick: () => navigate("/register"), children: _jsx(ChevronLeft, { size: 48, color: "white" }) }), _jsxs("div", { className: "brand-content", children: [_jsxs("h1", { className: "brand-title", children: ["Transforma tus compras en ", _jsx("span", { className: "highlight", children: "recompensas" })] }), _jsxs("p", { className: "brand-subtitle", children: ["Cada vez que consumes en comercios afiliados, acumulas puntos que puedes canjear por beneficios exclusivos.", _jsx("span", { className: "pulse-animation", children: " \u00A1Empieza a disfrutar hoy!" })] }), _jsxs("div", { className: "floating-rewards", children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", children: [_jsx("path", { d: "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" }), _jsx("path", { d: "M12 6V17.5", stroke: "#a777e3" }), _jsx("circle", { cx: "12", cy: "12", r: "2", fill: "#6e8efb" })] }), _jsx("div", { className: "floating-points", children: "+500" }), _jsx("div", { className: "floating-points", children: "+200" }), _jsx("div", { className: "floating-points", children: "+100" })] })] })] }), _jsx("div", { className: "auth-right-panel", children: _jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [_jsxs("div", { className: "form-header", children: [_jsx("h2", { className: "welcome-title", children: "Bienvenido de vuelta" }), _jsx("p", { className: "welcome-subtitle", children: "Ingresa tus credenciales para acceder" })] }), _jsx(SocialButtons, { onGoogle: handleGoogleLogin }), _jsx("h1", {}), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "", required: true }), _jsx("label", { htmlFor: "email", children: "Email" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: " ", required: true }), _jsx("label", { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "form-options", children: [_jsxs("div", { className: "remember-me", children: [_jsx("input", { type: "checkbox", id: "remember", className: "custom-checkbox" }), _jsx("label", { htmlFor: "remember", children: "Recu\u00E9rdame" })] }), _jsx("a", { href: "/forgot-password", className: "forgot-password", children: "\u00BFOlvidaste tu contrase\u00F1a?" })] }), _jsx("button", { type: "submit", className: "login-button", disabled: isLoading, children: isLoading ? (_jsx("span", { className: "button-loader" })) : ('Iniciar sesión') }), _jsxs("div", { className: "signup-link", children: ["\u00BFNo tienes una cuenta? ", _jsx("a", { href: "/register/cliente", className: "signup-button", children: "Reg\u00EDstrate aqu\u00ED" })] })] }) })] }));
};
export default Login;
