import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/modules/CanjePuntos/pages/CanjePuntosForm.tsx
import { useId, useMemo, useState } from "react";
import "../Components/Styles/CanjePuntos.scss";
export default function CanjePuntosForm({ embedded = false, puntosDisponibles: puntosDisponiblesProp, onValidate, onConfirm, }) {
    // ID único para modal
    const uid = useId().replace(/:/g, "-");
    const modalId = `confirmCanjeModal-${uid}`;
    // Estado del formulario
    const [identidad, setIdentidad] = useState("");
    const [correo, setCorreo] = useState("");
    const [puntos, setPuntos] = useState("");
    const [validating, setValidating] = useState(false);
    const [validated, setValidated] = useState("idle");
    const [pDisp, setPDisp] = useState(puntosDisponiblesProp);
    // Validaciones
    const correoValido = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo), [correo]);
    const identidadValida = useMemo(() => /^\d{4}-\d{4}-\d{5}$/.test(identidad), [identidad]);
    const puntosNum = useMemo(() => {
        const n = Number(puntos);
        return Number.isFinite(n) && n >= 0 ? Math.floor(n) : NaN;
    }, [puntos]);
    const puntosValidos = Number.isFinite(puntosNum);
    const dentroDeDisponibles = pDisp === undefined || (puntosValidos && puntosNum <= pDisp);
    const puedeContinuar = correoValido && identidadValida && puntosValidos && dentroDeDisponibles;
    async function handleValidate() {
        if (!correoValido || !identidadValida) {
            setValidated("error");
            return;
        }
        if (!onValidate) {
            setValidated("ok");
            return;
        }
        try {
            setValidating(true);
            const res = await onValidate(correo, identidad);
            setValidated(res.ok ? "ok" : "error");
            if (res.ok && typeof res.puntos === "number")
                setPDisp(res.puntos);
        }
        finally {
            setValidating(false);
        }
    }
    function handleReset() {
        setIdentidad("");
        setCorreo("");
        setPuntos("");
        setValidated("idle");
        setPDisp(puntosDisponiblesProp);
    }
    async function handleConfirm() {
        if (!puedeContinuar || !onConfirm)
            return;
        await onConfirm({ correo, identidad, puntos: puntosNum });
    }
    // Wrapper 
    const wrapperClass = embedded
        ? "canje-form embedded"
        : "container my-4 canje-form";
    const puntosDispMostrar = typeof pDisp === "number" ? pDisp : "—";
    const puntosMostrar = puntos === "" ? "—" : puntos;
    return (_jsxs("div", { className: wrapperClass, children: [_jsxs("div", { className: embedded ? "row g-4" : "row g-4 justify-content-center", children: [_jsx("div", { className: embedded ? "col-12 col-lg-7" : "col-12 col-md-10 col-lg-7", children: _jsxs("div", { className: "card shadow-sm", children: [_jsx("div", { className: "card-header", children: _jsx("h1", { className: "h5 mb-0", children: "Canje de Puntos" }) }), _jsx("div", { className: "card-body p-4", children: _jsxs("form", { noValidate: true, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: "identidad", className: "form-label fw-semibold", children: "Identidad" }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: "#" }), _jsx("input", { id: "identidad", name: "identidad", type: "text", inputMode: "numeric", className: `form-control ${identidad && !identidadValida ? "is-invalid" : ""}`, placeholder: "0801-1990-12345", value: identidad, maxLength: 15, onChange: (e) => setIdentidad(e.target.value) })] }), _jsx("div", { className: "form-text", children: "Formato sugerido: ####-####-#####." })] }), _jsxs("div", { className: "mb-1", children: [_jsx("label", { htmlFor: "correo", className: "form-label fw-semibold", children: "Correo electr\u00F3nico" }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: "@" }), _jsx("input", { id: "correo", name: "correo", type: "email", className: `form-control ${correo && !correoValido ? "is-invalid" : ""}`, placeholder: "cliente@correo.com", value: correo, onChange: (e) => setCorreo(e.target.value) })] })] }), _jsx("div", { className: "d-flex justify-content-end mb-3", children: _jsx("button", { type: "button", className: `btn btn-outline-${validated === "ok" ? "success" : "primary"} btn-sm`, onClick: handleValidate, disabled: validating || !correoValido || !identidadValida, children: validating ? "Validando…" : validated === "ok" ? "✓ Validado" : "Validar" }) }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "d-flex justify-content-between align-items-end", children: [_jsx("label", { htmlFor: "puntos", className: "form-label fw-semibold mb-0", children: "Puntos a canjear" }), _jsx("span", { className: "small text-secondary", children: "M\u00EDn. 0 \u2022 M\u00E1x. disponible" })] }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: "PTS" }), _jsx("input", { id: "puntos", name: "puntos", type: "number", min: 0, step: 1, className: `form-control ${puntos !== "" && !puntosValidos ? "is-invalid" : ""}`, placeholder: "0", value: puntos, onChange: (e) => setPuntos(e.target.value) })] }), _jsx("div", { className: "form-text", children: "Ingrese la cantidad a canjear." }), !dentroDeDisponibles && (_jsx("div", { className: "text-danger small mt-1", children: "Excede los puntos disponibles." }))] }), _jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [_jsx("button", { type: "reset", className: "btn btn-light", onClick: handleReset, children: "Limpiar" }), _jsx("button", { type: "button", className: "btn btn-primary", "data-bs-toggle": "modal", "data-bs-target": `#${modalId}`, disabled: !puedeContinuar, children: "Continuar" })] })] }) }), _jsx("div", { className: "card-footer small text-secondary", children: "* La validaci\u00F3n y carga de datos reales se implementar\u00E1n posteriormente." })] }) }), _jsx("div", { className: embedded ? "col-12 col-lg-5" : "col-12 col-md-10 col-lg-5", children: _jsx("div", { className: "card shadow-sm h-100", children: _jsxs("div", { className: "card-body p-4", "aria-live": "polite", children: [_jsxs("div", { className: "d-flex align-items-center justify-content-between mb-3", children: [_jsx("h2", { className: "h6 m-0", children: "Resumen del Cliente" }), _jsx("span", { className: "badge bg-light text-secondary", children: "Vista previa" })] }), _jsxs("div", { className: "summary-tile", children: [_jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx("div", { className: "avatar bg-primary-subtle rounded-circle", "aria-hidden": "true" }), _jsxs("div", { children: [_jsx("div", { className: "fw-semibold", children: correo ? correo.split("@")[0] : "Nombre del cliente" }), _jsx("div", { className: "text-secondary small", children: correo || "cliente@correo.com" })] })] }), _jsx("hr", { className: "my-3" }), _jsxs("div", { className: "row g-3", children: [_jsx("div", { className: "col-6", children: _jsxs("div", { className: "stat border rounded-3 p-3", children: [_jsx("div", { className: "text-secondary small", children: "Puntos disponibles" }), _jsx("div", { className: "fs-5 fw-bold", children: puntosDispMostrar })] }) }), _jsx("div", { className: "col-6", children: _jsxs("div", { className: "stat border rounded-3 p-3", children: [_jsx("div", { className: "text-secondary small", children: "Puntos a canjear" }), _jsx("div", { className: "fs-5 fw-bold", children: puntosMostrar })] }) }), _jsx("div", { className: "col-12", children: _jsxs("div", { className: "stat border rounded-3 p-3 bg-light-subtle", children: [_jsx("div", { className: "text-secondary small", children: "Observaciones" }), _jsx("div", { className: "fw-medium", children: correo ? "Presione “Validar” para cargar datos del cliente." : "Ingrese correo y valide para ver datos." })] }) })] }), _jsxs("div", { className: "mt-3 small text-secondary", children: [_jsx("span", { className: "me-1", children: "Identidad:" }), _jsx("span", { className: "fw-semibold", children: identidad || "—" })] })] }), _jsx("p", { className: "small text-secondary mt-3 mb-0", children: "Este panel mostrar\u00E1 los datos reales una vez se valide el cliente." })] }) }) })] }), _jsx("div", { className: "modal fade", id: modalId, "aria-hidden": "true", "aria-labelledby": `${modalId}-label`, tabIndex: -1, children: _jsx("div", { className: "modal-dialog modal-dialog-centered", children: _jsxs("div", { className: "modal-content", children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { className: "modal-title h5", id: `${modalId}-label`, children: "Confirmar canje" }), _jsx("button", { type: "button", className: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Cerrar" })] }), _jsxs("div", { className: "modal-body", children: ["Revise los datos antes de confirmar:", _jsxs("ul", { className: "mt-2 mb-0", children: [_jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Cliente:" }), " ", correo ? correo.split("@")[0] : "—"] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Correo:" }), " ", correo || "—"] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Puntos a canjear:" }), " ", puntosMostrar] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Identidad:" }), " ", identidad || "—"] })] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", className: "btn btn-light", "data-bs-dismiss": "modal", children: "Cancelar" }), _jsx("button", { type: "button", className: "btn btn-primary", "data-bs-dismiss": "modal", disabled: !puedeContinuar, onClick: handleConfirm, children: "Confirmar" })] })] }) }) })] }));
}
