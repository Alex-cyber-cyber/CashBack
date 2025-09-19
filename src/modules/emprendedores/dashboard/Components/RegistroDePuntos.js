import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/modules/CanjePuntos/pages/RegistroPuntosForm.tsx
import { useEffect, useId, useMemo, useState } from "react";
import "../Components/Styles/CanjePuntos.scss";
export default function RegistroPuntosForm({ embedded = false, currency = "L", pointsFormula = (total) => Math.max(0, Math.floor(total / 10)), onValidate, onConfirm, }) {
    const uid = useId().replace(/:/g, "-");
    const modalId = `confirmRegistroModal-${uid}`;
    const [identidad, setIdentidad] = useState("");
    const [correo, setCorreo] = useState("");
    const [totalFactura, setTotalFactura] = useState("");
    const [validating, setValidating] = useState(false);
    const [validated, setValidated] = useState("idle");
    // Validaciones básicas
    const correoValido = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo), [correo]);
    const identidadValida = useMemo(() => /^\d{4}-\d{4}-\d{5}$/.test(identidad), [identidad]);
    const totalFacturaNum = useMemo(() => {
        const n = Number(totalFactura);
        return Number.isFinite(n) && n > 0 ? n : NaN;
    }, [totalFactura]);
    const totalFacturaValido = Number.isFinite(totalFacturaNum) && totalFacturaNum > 0;
    const totalPts = useMemo(() => (totalFacturaValido ? pointsFormula(totalFacturaNum) : 0), [totalFacturaNum, totalFacturaValido, pointsFormula]);
    const puedeContinuar = correoValido && identidadValida && totalFacturaValido;
    useEffect(() => {
        const els = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const instances = window.bootstrap ? els.map((el) => new window.bootstrap.Tooltip(el)) : [];
        return () => instances.forEach((i) => i.dispose());
    }, []);
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
        }
        finally {
            setValidating(false);
        }
    }
    function handleReset() {
        setIdentidad("");
        setCorreo("");
        setTotalFactura("");
        setValidated("idle");
    }
    async function handleConfirm() {
        if (!puedeContinuar || !onConfirm)
            return;
        await onConfirm({ correo, identidad, totalFactura: totalFacturaNum, totalPts });
    }
    // Wrapper simplificado
    const wrapperClass = embedded ? "canje-form embedded" : "container my-4 canje-form";
    const totalFacturaMostrar = totalFacturaValido
        ? new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" }).format(totalFacturaNum)
        : `${currency} 0.00`;
    return (_jsxs("div", { className: wrapperClass, children: [_jsxs("div", { className: embedded ? "row g-4" : "row g-4 justify-content-center", children: [_jsx("div", { className: embedded ? "col-12 col-lg-7" : "col-12 col-md-10 col-lg-7", children: _jsxs("div", { className: "card shadow-sm", children: [_jsx("div", { className: "card-header", children: _jsx("h1", { className: "h5 mb-0", children: "Registro de Puntos" }) }), _jsx("div", { className: "card-body p-4", children: _jsxs("form", { noValidate: true, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: `identidad-${uid}`, className: "form-label fw-semibold", children: "Identidad" }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: "#" }), _jsx("input", { id: `identidad-${uid}`, name: "identidad", type: "text", inputMode: "numeric", className: `form-control ${identidad && !identidadValida ? "is-invalid" : ""}`, placeholder: "0801-1990-12345", value: identidad, maxLength: 15, onChange: (e) => setIdentidad(e.target.value) })] }), _jsx("div", { className: "form-text", children: "Formato: ####-####-#####." })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: `correo-${uid}`, className: "form-label fw-semibold", children: "Correo electr\u00F3nico" }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: "@" }), _jsx("input", { id: `correo-${uid}`, name: "correo", type: "email", className: `form-control ${correo && !correoValido ? "is-invalid" : ""}`, placeholder: "cliente@correo.com", value: correo, onChange: (e) => setCorreo(e.target.value) })] })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { htmlFor: `totalFactura-${uid}`, className: "form-label fw-semibold", children: "Total factura" }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: currency }), _jsx("input", { id: `totalFactura-${uid}`, name: "totalFactura", type: "number", min: 0, step: "0.01", className: `form-control ${totalFactura !== "" && !totalFacturaValido ? "is-invalid" : ""}`, placeholder: "0.00", value: totalFactura, onChange: (e) => setTotalFactura(e.target.value) })] }), _jsx("div", { className: "form-text", children: "Ingrese el monto total de la compra." })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: `totalPts-${uid}`, className: "form-label fw-semibold", children: "Total PTS" }), _jsxs("div", { className: "input-group", children: [_jsx("span", { className: "input-group-text", children: "PTS" }), _jsx("input", { id: `totalPts-${uid}`, name: "totalPts", type: "number", className: "form-control", value: totalPts, disabled: true, readOnly: true })] }), _jsx("div", { className: "form-text", children: "* Campo calculado autom\u00E1ticamente." })] }), _jsxs("div", { className: "d-flex gap-2 justify-content-end", children: [_jsx("button", { type: "reset", className: "btn btn-light", onClick: handleReset, children: "Limpiar" }), _jsx("button", { type: "button", className: "btn btn-primary", "data-bs-toggle": "modal", "data-bs-target": `#${modalId}`, disabled: !puedeContinuar, children: "Continuar" })] })] }) }), _jsx("div", { className: "card-footer small text-secondary", children: "* La validaci\u00F3n y registro real se implementar\u00E1n posteriormente." })] }) }), _jsx("div", { className: embedded ? "col-12 col-lg-5" : "col-12 col-md-10 col-lg-5", children: _jsx("div", { className: "card shadow-sm h-100", children: _jsxs("div", { className: "card-body p-4", "aria-live": "polite", children: [_jsxs("div", { className: "d-flex align-items-center justify-content-between mb-3", children: [_jsx("h2", { className: "h6 m-0", children: "Resumen del Registro" }), _jsx("span", { className: "badge bg-light text-secondary", children: "Vista previa" })] }), _jsxs("div", { className: "summary-tile", children: [_jsxs("div", { className: "d-flex align-items-center gap-2", children: [_jsx("div", { className: "avatar bg-primary-subtle rounded-circle", "aria-hidden": "true" }), _jsxs("div", { children: [_jsx("div", { className: "fw-semibold", children: correo ? correo.split("@")[0] : "Nombre del cliente" }), _jsx("div", { className: "text-secondary small", children: correo || "cliente@correo.com" })] })] }), _jsx("hr", { className: "my-3" }), _jsxs("div", { className: "row g-3", children: [_jsx("div", { className: "col-6", children: _jsxs("div", { className: "stat border rounded-3 p-3", children: [_jsx("div", { className: "text-secondary small", children: "Total factura" }), _jsx("div", { className: "fw-bold", children: totalFacturaMostrar })] }) }), _jsx("div", { className: "col-6", children: _jsxs("div", { className: "stat border rounded-3 p-3", children: [_jsx("div", { className: "text-secondary small", children: "Total PTS" }), _jsx("div", { className: "fw-bold", children: totalPts })] }) }), _jsx("div", { className: "col-12", children: _jsxs("div", { className: "stat border rounded-3 p-3 bg-light-subtle", children: [_jsx("div", { className: "text-secondary small", children: "Observaciones" }), _jsx("div", { className: "fw-medium", children: validated === "ok"
                                                                        ? "Cliente validado. Puede continuar con el registro."
                                                                        : "Ingrese identidad/correo y valide al cliente." })] }) })] }), _jsxs("div", { className: "mt-3 small text-secondary", children: [_jsx("span", { className: "me-1", children: "Identidad:" }), _jsx("span", { className: "fw-semibold", children: identidad || "—" })] })] }), _jsx("p", { className: "small text-secondary mt-3 mb-0", children: "Este panel refleja los datos ingresados y los puntos calculados." })] }) }) })] }), _jsx("div", { className: "modal fade", id: modalId, "aria-hidden": "true", "aria-labelledby": `${modalId}-label`, tabIndex: -1, children: _jsx("div", { className: "modal-dialog modal-dialog-centered", children: _jsxs("div", { className: "modal-content", children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { className: "modal-title h5", id: `${modalId}-label`, children: "Confirmar registro" }), _jsx("button", { type: "button", className: "btn-close", "data-bs-dismiss": "modal", "aria-label": "Cerrar" })] }), _jsxs("div", { className: "modal-body", children: ["Revise los datos antes de confirmar:", _jsxs("ul", { className: "mt-2 mb-0", children: [_jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Cliente:" }), " ", correo ? correo.split("@")[0] : "—"] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Correo:" }), " ", correo || "—"] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Identidad:" }), " ", identidad || "—"] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Total factura:" }), " ", totalFacturaMostrar] }), _jsxs("li", { children: [_jsx("span", { className: "text-secondary", children: "Total PTS:" }), " ", totalPts] })] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", className: "btn btn-light", "data-bs-dismiss": "modal", children: "Cancelar" }), _jsx("button", { type: "button", className: "btn btn-primary", "data-bs-dismiss": "modal", disabled: !puedeContinuar, onClick: handleConfirm, children: "Confirmar" })] })] }) }) })] }));
}
