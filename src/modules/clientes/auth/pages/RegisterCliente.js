import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/styles.scss";
import { ChevronLeft } from "lucide-react";
import { handleAuthRedirectResult, loginWithFacebook, loginWithGithub, loginWithGoogle, signUpWithEmail, } from "../services/auth.service";
import { useAuth } from "../hooks/useAuth";
const RegisterCliente = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [formData, setFormData] = useState({
        nombreCompleto: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    // 1) Completar flujo si venimos de signInWithRedirect
    useEffect(() => {
        handleAuthRedirectResult().catch(() => { });
    }, []);
    // 2) Si ya hay sesión, manda al dashboard
    useEffect(() => {
        if (!loading && user)
            navigate("/dashboard", { replace: true });
    }, [user, loading, navigate]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!formData.terms)
            return setError("Debes aceptar los términos y condiciones.");
        if (formData.password !== formData.confirmPassword)
            return setError("Las contraseñas no coinciden.");
        try {
            setSubmitting(true);
            await signUpWithEmail({
                name: formData.nombreCompleto.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: formData.telefono.trim() || undefined,
            });
            // ya quedas logueado ⇒ directo al dashboard
            navigate("/dashboard", { replace: true });
        }
        catch (err) {
            setError(err?.message ?? "No se pudo crear la cuenta.");
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleGoogle = async () => {
        setError(null);
        try {
            setSubmitting(true);
            const u = await loginWithGoogle();
            if (u)
                navigate("/dashboard", { replace: true }); // popup ok
            // si fue redirect, el useEffect terminará el flujo y te llevará al dashboard
        }
        catch (err) {
            setError(err?.message ?? "No se pudo iniciar con Google.");
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleGithub = async () => {
        setError(null);
        try {
            setSubmitting(true);
            const u = await loginWithGithub();
            if (u)
                navigate("/dashboard", { replace: true });
        }
        catch (err) {
            setError(err?.message ?? "No se pudo iniciar con GitHub.");
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleFacebook = async () => {
        setError(null);
        try {
            setSubmitting(true);
            const u = await loginWithFacebook();
            if (u)
                navigate("/dashboard", { replace: true });
        }
        catch (err) {
            setError(err?.message ?? "No se pudo iniciar con Facebook.");
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "auth-container", children: [_jsxs("div", { className: "auth-left-panel", children: [_jsx("button", { className: "back-button", onClick: () => navigate("/login"), children: _jsx(ChevronLeft, { size: 48, color: "white" }) }), _jsxs("div", { className: "brand-content", children: [_jsxs("h1", { className: "brand-title", children: ["\uD83D\uDECD\uFE0F \u00DAnete como ", _jsx("span", { className: "highlight", children: "Cliente" })] }), _jsx("p", { className: "brand-subtitle", children: "Reg\u00EDstrate y comienza a disfrutar de cashback en tus compras favoritas." })] })] }), _jsx("div", { className: "auth-right-panel", children: _jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [_jsxs("div", { className: "form-header", children: [_jsx("h2", { className: "welcome-title", children: "Registro de Cliente" }), _jsx("p", { className: "welcome-subtitle", children: "Completa tus datos personales" })] }), _jsxs("div", { className: "d-flex justify-content-center gap-3 mt-3", children: [_jsx("button", { type: "button", className: "btn social-btn btn-google", "aria-label": "Google", onClick: handleGoogle, children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 48 48", "aria-hidden": "true", children: [_jsx("path", { fill: "#EA4335", d: "M24 9.5c3.7 0 7 1.3 9.6 3.8l6.4-6.4C35.7 2.5 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.9 6.1C12.3 14.7 17.6 9.5 24 9.5z" }), _jsx("path", { fill: "#4285F4", d: "M46.1 24.5c0-1.7-.2-3.3-.6-4.9H24v9.3h12.4c-.5 2.7-2 5-4.4 6.6l6.8 5.3c4-3.7 6.3-9.1 6.3-16.3z" }), _jsx("path", { fill: "#FBBC05", d: "M10.4 28.9a14.6 14.6 0 0 1 0-9.8l-7.9-6.1A24 24 0 0 0 0 24c0 3.8.9 7.3 2.5 10.5l7.9-5.6z" }), _jsx("path", { fill: "#34A853", d: "M24 48c6.5 0 11.9-2.1 15.8-5.7l-6.8-5.3c-2 1.4-4.6 2.2-9 2.2-6.4 0-11.7-5.2-13.6-12l-7.9 5.6C6.5 42.6 14.6 48 24 48z" })] }) }), _jsx("button", { type: "button", className: "btn social-btn btn-github", "aria-label": "GitHub", onClick: handleGithub, children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: "M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" }) }) }), _jsx("button", { type: "button", className: "btn social-btn btn-facebook", "aria-label": "Facebook", onClick: handleFacebook, children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { fill: "currentColor", d: "M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.8-4 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.45 2.9h-2.35v7A10 10 0 0 0 22 12z" }) }) })] }), _jsxs("div", { className: "inputs-grid", children: [_jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "nombreCompleto", value: formData.nombreCompleto, onChange: handleChange, required: true, placeholder: " " }), _jsx("label", { children: "Nombre completo" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, required: true, placeholder: " " }), _jsx("label", { children: "Correo electr\u00F3nico" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "tel", name: "telefono", value: formData.telefono, onChange: handleChange, placeholder: " " }), _jsx("label", { children: "Tel\u00E9fono (opcional)" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, required: true, placeholder: " " }), _jsx("label", { children: "Contrase\u00F1a" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleChange, required: true, placeholder: " " }), _jsx("label", { children: "Confirmar contrase\u00F1a" }), _jsx("div", { className: "input-highlight" })] }), _jsx("div", {})] }), _jsx("div", { className: "form-options", style: { marginTop: "2rem", justifyContent: "flex-start" }, children: _jsxs("label", { className: "remember-me", children: [_jsx("input", { type: "checkbox", name: "terms", checked: formData.terms, onChange: handleChange, className: "custom-checkbox", required: true }), _jsx("span", { children: "Acepto los t\u00E9rminos y condiciones" })] }) }), error && _jsx("p", { className: "text-danger mt-2", children: error }), _jsx("button", { type: "submit", className: "login-button", disabled: submitting, children: submitting ? "Creando..." : "Crear Cuenta" }), _jsx("div", { className: "signup-link", children: _jsxs("p", { children: ["\u00BFYa tienes una cuenta?", " ", _jsx("a", { href: "#", className: "signup-button", onClick: (e) => { e.preventDefault(); navigate("/login"); }, children: "Inicia sesi\u00F3n aqu\u00ED" })] }) })] }) })] }));
};
export default RegisterCliente;
