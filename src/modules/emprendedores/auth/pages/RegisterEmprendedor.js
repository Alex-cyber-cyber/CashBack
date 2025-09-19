import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "../Styles/RegistroEmprendedor.scss";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../../../firebase/firebase.config";
import { ensureEntrepreneurProfile } from "../services/emprendedor.services";
const RegisterEmprendedor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombrePropietario: "",
        email: "",
        telefono: "",
        password: "",
        confirmarPassword: "",
        nombreComercial: "",
        razonSocial: "",
        rtn: "",
        categoria: "",
        descripcion: "",
        pais: "",
        departamento: "",
        ciudad: "",
        direccion: "",
        logo: null,
        maximoCredito: 0,
    });
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files
                ? files[0]
                : name === "maximoCredito"
                    ? Number(value)
                    : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmarPassword) {
            alert("Las contraseñas no coinciden 🚨");
            return;
        }
        try {
            const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await ensureEntrepreneurProfile({
                uid: user.uid,
                email: formData.email,
                displayName: formData.nombreComercial,
                phone: formData.telefono,
                nombrePropietario: formData.nombrePropietario,
                nombreComercial: formData.nombreComercial,
                razonSocial: formData.razonSocial,
                rtn: formData.rtn,
                categoria: formData.categoria,
                descripcion: formData.descripcion,
                pais: formData.pais,
                departamento: formData.departamento,
                ciudad: formData.ciudad,
                direccion: formData.direccion,
                logo: formData.logo ? formData.logo.name : "",
                provider: "password",
                emailVerified: false,
                role: "Emprendedor",
                maximoCredito: formData.maximoCredito,
            });
            alert("Registro exitoso 🎉");
            navigate("/login/emprendedor");
        }
        catch (error) {
            console.error("Error registrando emprendedor:", error.code, error.message);
            alert("Hubo un error: " + error.message);
        }
    };
    return (_jsx("div", { className: "register-emprendedor", children: _jsxs("div", { className: "auth-container", children: [_jsxs("div", { className: "auth-left-panel", children: [_jsx("button", { className: "back-button", onClick: () => navigate("/login/emprendedor"), children: _jsx(ChevronLeft, { size: 48, color: "white" }) }), _jsxs("div", { className: "brand-content", children: [_jsxs("h1", { className: "brand-title", children: ["\uD83D\uDE80 Registra tu ", _jsx("span", { className: "highlight", children: "emprendimiento" })] }), _jsx("p", { className: "brand-subtitle", children: "Llena los datos y empieza a crecer con nosotros." })] })] }), _jsx("div", { className: "auth-right-panel", children: _jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [_jsxs("div", { className: "form-header", children: [_jsx("h2", { className: "welcome-title", children: "Registro Emprendedor" }), _jsx("p", { className: "welcome-subtitle", children: "Completa la informaci\u00F3n b\u00E1sica" })] }), _jsx("h3", { className: "section-title", children: "Cuenta y contacto" }), _jsxs("div", { className: "inputs-grid", children: [_jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "nombrePropietario", placeholder: " ", value: formData.nombrePropietario, onChange: handleChange, required: true }), _jsx("label", { children: "Nombre del propietario / representante" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "email", name: "email", placeholder: " ", value: formData.email, onChange: handleChange, required: true }), _jsx("label", { children: "Correo electr\u00F3nico" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "tel", name: "telefono", placeholder: " ", value: formData.telefono, onChange: handleChange, required: true }), _jsx("label", { children: "Tel\u00E9fono" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "password", name: "password", placeholder: " ", value: formData.password, onChange: handleChange, required: true }), _jsx("label", { children: "Contrase\u00F1a" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "password", name: "confirmarPassword", placeholder: " ", value: formData.confirmarPassword, onChange: handleChange, required: true }), _jsx("label", { children: "Confirmar contrase\u00F1a" }), _jsx("div", { className: "input-highlight" })] })] }), _jsx("h3", { className: "section-title", children: "Datos del negocio" }), _jsxs("div", { className: "inputs-grid", children: [_jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "nombreComercial", placeholder: " ", value: formData.nombreComercial, onChange: handleChange, required: true }), _jsx("label", { children: "Nombre comercial" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "razonSocial", placeholder: " ", value: formData.razonSocial, onChange: handleChange, required: true }), _jsx("label", { children: "Raz\u00F3n social" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "rtn", placeholder: " ", value: formData.rtn, onChange: handleChange, required: true }), _jsx("label", { children: "RTN / ID tributario" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsxs("select", { name: "categoria", value: formData.categoria, onChange: handleChange, required: true, children: [_jsx("option", { value: "", children: "Selecciona una categor\u00EDa" }), _jsx("option", { value: "alimentacion", children: "Alimentaci\u00F3n" }), _jsx("option", { value: "tecnologia", children: "Tecnolog\u00EDa" }), _jsx("option", { value: "moda", children: "Moda" }), _jsx("option", { value: "servicios", children: "Servicios" }), _jsx("option", { value: "otros", children: "Otros" })] }), _jsx("label", { children: "Categor\u00EDa del negocio" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input full-width", children: [_jsx("textarea", { name: "descripcion", placeholder: " ", value: formData.descripcion, onChange: handleChange, required: true }), _jsx("label", { children: "Descripci\u00F3n del negocio" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "pais", placeholder: " ", value: formData.pais, onChange: handleChange, required: true }), _jsx("label", { children: "Pa\u00EDs" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsxs("select", { name: "departamento", value: formData.departamento, onChange: handleChange, required: true, children: [_jsx("option", { value: "", children: "Selecciona un departamento" }), _jsx("option", { value: "francisco-morazan", children: "Francisco Moraz\u00E1n" }), _jsx("option", { value: "cortes", children: "Cort\u00E9s" }), _jsx("option", { value: "atlantida", children: "Atl\u00E1ntida" }), _jsx("option", { value: "choluteca", children: "Choluteca" }), _jsx("option", { value: "otros", children: "Otros" })] }), _jsx("label", { children: "Departamento" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "ciudad", placeholder: " ", value: formData.ciudad, onChange: handleChange, required: true }), _jsx("label", { children: "Ciudad" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "text", name: "direccion", placeholder: " ", value: formData.direccion, onChange: handleChange, required: true }), _jsx("label", { children: "Direcci\u00F3n" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group floating-input", children: [_jsx("input", { type: "number", name: "maximoCredito", placeholder: " ", value: formData.maximoCredito, onChange: handleChange, required: true, min: "0", max: "100" }), _jsx("label", { children: "Porcentaje cashback (%)" }), _jsx("div", { className: "input-highlight" })] }), _jsxs("div", { className: "input-group full-width", children: [_jsx("input", { type: "file", name: "logo", accept: "image/*", onChange: handleChange }), _jsx("label", { children: "Logo del negocio" })] })] }), _jsx("button", { type: "submit", className: "login-button", children: "Registrarme" })] }) })] }) }));
};
export default RegisterEmprendedor;
