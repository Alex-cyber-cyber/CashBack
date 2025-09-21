import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiDownloadCloud, FiSearch, FiPlusCircle, FiGift, FiTrendingUp, FiRefreshCcw, } from "react-icons/fi";
import { useAuth as useClienteAuth } from "../../../clientes/auth/hooks/useAuth";
import { loadHistorialCanjes, loadHistorialRegistros, } from "../services/historial.service";
import "./Styles/HistorialEmp.scss";
const currencyFormatter = new Intl.NumberFormat("es-HN", {
    style: "currency",
    currency: "HNL",
});
const numberFormatter = new Intl.NumberFormat("es-HN", {
    maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});
const registroMeta = {
    acreditado: { label: "Acreditado", tone: "success" },
    pendiente: { label: "Pendiente", tone: "warning" },
    anulado: { label: "Anulado", tone: "danger" },
};
const canjeMeta = {
    completado: { label: "Completado", tone: "success" },
    pendiente: { label: "Pendiente", tone: "warning" },
    rechazado: { label: "Rechazado", tone: "danger" },
};
const columnsCount = 8;
const toCsvValue = (value) => {
    const str = String(value ?? "").replace(/\r?\n|\r/g, " ");
    if (str.includes(",") || str.includes("\"")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};
const HistorialEmp = () => {
    const { user, loading: authLoading } = useClienteAuth();
    const emprendedorId = user?.uid ?? null;
    const [tab, setTab] = useState("registro");
    const [search, setSearch] = useState("");
    const [registros, setRegistros] = useState([]);
    const [canjes, setCanjes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const loadData = useCallback(async (id) => {
        setLoading(true);
        try {
            const [registrosData, canjesData] = await Promise.all([
                loadHistorialRegistros(id),
                loadHistorialCanjes(id),
            ]);
            setRegistros(registrosData);
            setCanjes(canjesData);
            setLastUpdated(new Date());
            setError(null);
        }
        catch (err) {
            console.error("Error cargando historial", err);
            const message = err instanceof Error ? err.message : "No se pudo cargar el historial.";
            setError(message);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        if (authLoading)
            return;
        if (!emprendedorId) {
            setRegistros([]);
            setCanjes([]);
            setLoading(false);
            setError("Debes iniciar sesión como emprendedor para ver tu historial.");
            return;
        }
        loadData(emprendedorId);
    }, [authLoading, emprendedorId, loadData]);
    const handleRefresh = useCallback(() => {
        if (!emprendedorId)
            return;
        loadData(emprendedorId);
    }, [emprendedorId, loadData]);
    const filteredRegistros = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term)
            return registros;
        return registros.filter((item) => {
            const fields = [
                item.cliente,
                item.correo,
                item.identidad,
                item.comercio,
                item.factura,
                item.estado,
                String(item.puntos),
                String(item.total),
            ];
            return fields.some((field) => field.toLowerCase().includes(term));
        });
    }, [search, registros]);
    const filteredCanjes = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term)
            return canjes;
        return canjes.filter((item) => {
            const fields = [
                item.cliente,
                item.correo,
                item.identidad,
                item.premio,
                item.canal,
                item.estado,
                String(item.puntos),
                String(item.valor),
            ];
            return fields.some((field) => field.toLowerCase().includes(term));
        });
    }, [search, canjes]);
    const summary = useMemo(() => {
        const totalFactura = registros.reduce((acc, item) => acc + item.total, 0);
        const puntosGenerados = registros.reduce((acc, item) => acc + item.puntos, 0);
        const valorCanjeado = canjes.reduce((acc, item) => acc + item.valor, 0);
        const puntosCanjeados = canjes.reduce((acc, item) => acc + item.puntos, 0);
        return {
            registros: registros.length,
            totalFactura,
            puntosGenerados,
            canjes: canjes.length,
            valorCanjeado,
            puntosCanjeados,
            saldoEstimado: puntosGenerados - puntosCanjeados,
        };
    }, [registros, canjes]);
    const showingRegistro = tab === "registro";
    const rows = showingRegistro ? filteredRegistros : filteredCanjes;
    const totalRows = showingRegistro ? registros.length : canjes.length;
    const busy = loading || authLoading;
    const exportDisabled = busy || rows.length === 0;
    const handleExport = useCallback(() => {
        if (rows.length === 0)
            return;
        const headers = showingRegistro
            ? [
                "Tipo",
                "Fecha",
                "Cliente",
                "Correo",
                "Identidad",
                "Comercio",
                "Factura",
                "Total",
                "Puntos",
                "Estado",
            ]
            : [
                "Tipo",
                "Fecha",
                "Cliente",
                "Correo",
                "Identidad",
                "Beneficio",
                "Canal",
                "Valor",
                "Puntos",
                "Estado",
            ];
        const csvBody = rows.map((item) => {
            if (showingRegistro) {
                const registro = item;
                return [
                    "Registro",
                    dateFormatter.format(registro.fecha),
                    toCsvValue(registro.cliente),
                    toCsvValue(registro.correo),
                    toCsvValue(registro.identidad),
                    toCsvValue(registro.comercio),
                    toCsvValue(registro.factura),
                    currencyFormatter.format(registro.total),
                    numberFormatter.format(registro.puntos),
                    registro.estado,
                ].join(",");
            }
            const canje = item;
            return [
                "Canje",
                dateFormatter.format(canje.fecha),
                toCsvValue(canje.cliente),
                toCsvValue(canje.correo),
                toCsvValue(canje.identidad),
                toCsvValue(canje.premio),
                toCsvValue(canje.canal),
                currencyFormatter.format(canje.valor),
                numberFormatter.format(canje.puntos),
                canje.estado,
            ].join(",");
        });
        const csvContent = [headers.join(","), ...csvBody].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = showingRegistro
            ? "historial_registros.csv"
            : "historial_canjes.csv";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    }, [rows, showingRegistro]);
    const renderMeta = (estado, mapSource) => {
        const meta = mapSource[estado] ?? {
            label: estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "Pendiente",
            tone: "warning",
        };
        return (_jsx("span", { className: `status-badge tone-${meta.tone}`, children: meta.label }));
    };
    return (_jsxs("div", { className: "historial-emp", children: [_jsxs("div", { className: "page-header", children: [_jsxs("div", { children: [_jsx("h1", { className: "h4 mb-1", children: "Historial de movimientos" }), _jsx("p", { className: "text-secondary mb-0", children: "Visualiza el detalle de registros de puntos y canjes realizados por tu negocio." })] }), _jsxs("button", { type: "button", className: "btn btn-light border d-inline-flex align-items-center gap-2 export-btn", onClick: handleExport, disabled: exportDisabled, children: [_jsx(FiDownloadCloud, {}), _jsx("span", { children: "Exportar CSV" })] })] }), error && (_jsxs("div", { className: "historial-warning", role: "alert", children: [_jsx("span", { children: error }), emprendedorId && (_jsxs("button", { type: "button", onClick: handleRefresh, disabled: busy, children: [_jsx(FiRefreshCcw, {}), "Reintentar"] }))] })), _jsxs("div", { className: "row g-3 summary-cards", children: [_jsx("div", { className: "col-12 col-md-4", children: _jsx("div", { className: "card h-100", children: _jsxs("div", { className: "card-body", children: [_jsx("div", { className: "summary-icon primary", children: _jsx(FiPlusCircle, {}) }), _jsx("div", { className: "summary-label", children: "Registros de puntos" }), _jsx("div", { className: "summary-value", children: summary.registros }), _jsxs("div", { className: "summary-sub", children: [numberFormatter.format(summary.puntosGenerados), " pts generados"] })] }) }) }), _jsx("div", { className: "col-12 col-md-4", children: _jsx("div", { className: "card h-100", children: _jsxs("div", { className: "card-body", children: [_jsx("div", { className: "summary-icon warning", children: _jsx(FiGift, {}) }), _jsx("div", { className: "summary-label", children: "Canjes completados" }), _jsx("div", { className: "summary-value", children: summary.canjes }), _jsxs("div", { className: "summary-sub", children: [numberFormatter.format(summary.puntosCanjeados), " pts canjeados"] })] }) }) }), _jsx("div", { className: "col-12 col-md-4", children: _jsx("div", { className: "card h-100", children: _jsxs("div", { className: "card-body", children: [_jsx("div", { className: "summary-icon success", children: _jsx(FiTrendingUp, {}) }), _jsx("div", { className: "summary-label", children: "Saldo estimado" }), _jsxs("div", { className: "summary-value", children: [numberFormatter.format(summary.saldoEstimado), " pts"] }), _jsxs("div", { className: "summary-sub", children: [currencyFormatter.format(summary.totalFactura), " en compras"] })] }) }) })] }), _jsx("div", { className: "card shadow-sm", children: _jsxs("div", { className: "card-body", children: [_jsxs("div", { className: "historial-toolbar", children: [_jsxs("div", { className: "historial-toggle", role: "tablist", "aria-label": "Tipo de movimiento", children: [_jsx("button", { type: "button", className: showingRegistro ? "active" : "", "aria-pressed": showingRegistro, onClick: () => setTab("registro"), children: "Puntos" }), _jsx("button", { type: "button", className: !showingRegistro ? "active" : "", "aria-pressed": !showingRegistro, onClick: () => setTab("canje"), children: "Canjes" })] }), _jsxs("div", { className: "search-input input-group", children: [_jsx("span", { className: "input-group-text", children: _jsx(FiSearch, {}) }), _jsx("input", { type: "search", className: "form-control", placeholder: "Buscar por cliente, correo o identidad", value: search, onChange: (event) => setSearch(event.target.value), disabled: busy })] }), _jsxs("div", { className: "toolbar-actions", children: [_jsxs("div", { className: "toolbar-meta text-secondary", children: [busy
                                                    ? "Cargando historial..."
                                                    : `Mostrando ${rows.length} de ${totalRows} registros`, lastUpdated && !busy && (_jsxs("span", { className: "d-block small", children: ["Actualizado: ", dateFormatter.format(lastUpdated)] }))] }), _jsxs("button", { type: "button", className: "btn btn-light refresh-btn", onClick: handleRefresh, disabled: busy || !emprendedorId, children: [_jsx(FiRefreshCcw, {}), _jsx("span", { children: "Actualizar" })] })] })] }), _jsx("div", { className: "table-responsive", children: _jsxs("table", { className: "table align-middle historial-table", children: [_jsx("thead", { children: showingRegistro ? (_jsxs("tr", { children: [_jsx("th", { children: "Fecha" }), _jsx("th", { children: "Cliente" }), _jsx("th", { children: "Correo" }), _jsx("th", { children: "Comercio" }), _jsx("th", { children: "Factura" }), _jsx("th", { className: "text-end", children: "Total compra" }), _jsx("th", { className: "text-end", children: "Puntos" }), _jsx("th", { className: "text-end", children: "Estado" })] })) : (_jsxs("tr", { children: [_jsx("th", { children: "Fecha" }), _jsx("th", { children: "Cliente" }), _jsx("th", { children: "Correo" }), _jsx("th", { children: "Beneficio" }), _jsx("th", { children: "Canal" }), _jsx("th", { className: "text-end", children: "Valor" }), _jsx("th", { className: "text-end", children: "Puntos" }), _jsx("th", { className: "text-end", children: "Estado" })] })) }), _jsx("tbody", { children: busy ? (_jsx("tr", { children: _jsx("td", { colSpan: columnsCount, children: _jsxs("div", { className: "loading-state text-center", children: [_jsx("span", { className: "spinner-border spinner-border-sm me-2", role: "status", "aria-hidden": "true" }), "Cargando historial..."] }) }) })) : rows.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: columnsCount, children: _jsx("div", { className: "empty-state text-center", children: "No se encontraron movimientos con el filtro seleccionado." }) }) })) : showingRegistro ? (rows.map((item) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("div", { className: "fw-semibold", children: dateFormatter.format(item.fecha) }), _jsxs("div", { className: "text-muted small", children: ["#", item.id] })] }), _jsxs("td", { children: [_jsx("div", { className: "fw-semibold", children: item.cliente }), _jsx("div", { className: "text-muted small", children: item.identidad })] }), _jsx("td", { children: item.correo }), _jsx("td", { children: item.comercio }), _jsx("td", { children: item.factura }), _jsx("td", { className: "text-end", children: currencyFormatter.format(item.total) }), _jsx("td", { className: "text-end", children: numberFormatter.format(item.puntos) }), _jsx("td", { className: "text-end", children: renderMeta(item.estado, registroMeta) })] }, item.id)))) : (rows.map((item) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("div", { className: "fw-semibold", children: dateFormatter.format(item.fecha) }), _jsxs("div", { className: "text-muted small", children: ["#", item.id] })] }), _jsxs("td", { children: [_jsx("div", { className: "fw-semibold", children: item.cliente }), _jsx("div", { className: "text-muted small", children: item.identidad })] }), _jsx("td", { children: item.correo }), _jsx("td", { children: item.premio }), _jsx("td", { children: item.canal }), _jsx("td", { className: "text-end", children: currencyFormatter.format(item.valor) }), _jsx("td", { className: "text-end", children: numberFormatter.format(item.puntos) }), _jsx("td", { className: "text-end", children: renderMeta(item.estado, canjeMeta) })] }, item.id)))) })] }) })] }) })] }));
};
export default HistorialEmp;
