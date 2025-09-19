import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import "../Styles/loginEmprendedor.scss";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";
const LoginEmprendedor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const docRef = doc(db, "Emprendedores", user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                alert("Perfil de emprendedor no encontrado 🚨");
                await auth.signOut();
                return;
            }
            const perfil = docSnap.data();
            if (perfil.role === "Emprendedor") {
                navigate("/dashboard/emprendedor");
            }
            else {
                alert("No tienes permisos para acceder como emprendedor 🚫");
                await auth.signOut();
            }
        }
        catch (error) {
            console.error(error);
            alert("Error al iniciar sesión: " + error.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "auth-container-emprendedor", children: [_jsxs("div", { className: "auth-left-panel-emprendedor", children: [_jsx("button", { className: "back-button", onClick: () => navigate("/register"), children: _jsx(ChevronLeft, { size: 48, color: "white" }) }), _jsxs("div", { className: "brand-content", children: [_jsxs("h1", { className: "brand-title", children: ["Transforma y dale nueva vida a tu ", _jsx("span", { className: "highlight", children: "emprendimiento" })] }), _jsx("p", { className: "brand-subtitle", children: "Crea, innova y crece con nosotros. Tu proyecto merece brillar." })] })] }), _jsx("div", { className: "auth-right-panel-emprendedor", children: _jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [_jsxs("div", { className: "form-header", children: [_jsx("h2", { className: "welcome-title", children: "Bienvenido Emprendedor" }), _jsx("p", { className: "welcome-subtitle", children: "Ingresa tus credenciales para continuar" })] }), _jsxs("div", { className: "d-flex justify-content-center gap-3 mt-3", children: [_jsx("button", { type: "button", className: "btn social-btn btn-google", "aria-label": "Google", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 48 48", "aria-hidden": "true", children: [_jsx("path", { fill: "#EA4335", d: "M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C35.7 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.9 6.1C12.3 14.7 17.6 9.5 24 9.5z" }), _jsx("path", { fill: "#4285F4", d: "M46.1 24.5c0-1.7-.2-3.3-.6-4.9H24v9.3h12.4c-.5 2.7-2 5-4.4 6.6l6.8 5.3c4-3.7 6.3-9.1 6.3-16.3z" }), _jsx("path", { fill: "#FBBC05", d: "M10.4 28.9a14.6 14.6 0 0 1 0-9.8l-7.9-6.1A24 24 0 0 0 0 24c0 3.8.9 7.3 2.5 10.5l7.9-5.6z" }), _jsx("path", { fill: "#34A853", d: "M24 48c6.5 0 11.9-2.1 15.8-5.7l-6.8-5.3c-2 1.4-4.6 2.2-9 2.2-6.4 0-11.7-5.2-13.6-12l-7.9 5.6C6.5 42.6 14.6 48 24 48z" })] }) }), _jsx("button", { type: "button", className: "btn social-btn btn-github", "aria-label": "GitHub", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: "M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38\r\n      0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01\r\n      1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95\r\n      0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09\r\n      2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54\r\n      1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" }) }) }), _jsx("button", { type: "button", className: "btn social-btn btn-facebook", "aria-label": "Facebook", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: "M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.8-4\r\n      1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.45 2.9h-2.35v7A10 10 0 0 0 22 12z" }) }) }), _jsx("button", { type: "button", className: "btn social-btn btn-x", "aria-label": "X", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: "M18.244 2H21l-6.52 7.45L22 22h-6.828l-5.35-6.96L3.89 22H2l7.02-8.03L2 2h6.828l4.98 6.56L18.244 2zm-1.196 18h2.06L7.01 4H4.85l12.198 16z" }) }) })] }), _jsx("h1", {}), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "email", required: true }), _jsx("label", { htmlFor: "email", children: "Email" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "password", id: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "password", required: true }), _jsx("label", { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "form-options", children: [_jsxs("div", { className: "remember-me", children: [_jsx("input", { type: "checkbox", id: "remember", className: "custom-checkbox" }), _jsx("label", { htmlFor: "remember", children: "Recu\u00E9rdame" })] }), _jsx("a", { href: "/forgot-password", className: "forgot-password", children: "\u00BFOlvidaste tu contrase\u00F1a?" })] }), _jsx("button", { type: "submit", className: "login-button", disabled: isLoading, children: isLoading ? (_jsx("span", { className: "button-loader" })) : ('Iniciar sesión') }), _jsxs("div", { className: "signup-link", children: ["\u00BFNo tienes una cuenta? ", _jsx("a", { href: "/register/emprendedor", className: "signup-button", children: "Reg\u00EDstrate aqu\u00ED" })] })] }) })] }));
};
export default LoginEmprendedor;
