import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiDownloadCloud,
  FiSearch,
  FiPlusCircle,
  FiGift,
  FiTrendingUp,
  FiRefreshCcw,
} from "react-icons/fi";
import { useAuth as useClienteAuth } from "../../../clientes/auth/hooks/useAuth";
import {
  loadHistorialCanjes,
  loadHistorialRegistros,
  type CanjeHistorial,
  type RegistroHistorial,
} from "../services/historial.service";
import "./Styles/HistorialEmp.scss";

type TabKey = "registro" | "canje";

type Summary = {
  registros: number;
  totalFactura: number;
  puntosGenerados: number;
  canjes: number;
  valorCanjeado: number;
  puntosCanjeados: number;
  saldoEstimado: number;
};

type StatusTone = "success" | "warning" | "danger";

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

const registroMeta: Record<string, { label: string; tone: StatusTone }> = {
  acreditado: { label: "Acreditado", tone: "success" },
  pendiente: { label: "Pendiente", tone: "warning" },
  anulado: { label: "Anulado", tone: "danger" },
};

const canjeMeta: Record<string, { label: string; tone: StatusTone }> = {
  completado: { label: "Completado", tone: "success" },
  pendiente: { label: "Pendiente", tone: "warning" },
  rechazado: { label: "Rechazado", tone: "danger" },
};

const columnsCount = 8;

const toCsvValue = (value: string | number) => {
  const str = String(value ?? "").replace(/\r?\n|\r/g, " ");
  if (str.includes(",") || str.includes("\"")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const HistorialEmp: React.FC = () => {
  const { user, loading: authLoading } = useClienteAuth();
  const emprendedorId = user?.uid ?? null;

  const [tab, setTab] = useState<TabKey>("registro");
  const [search, setSearch] = useState("");
  const [registros, setRegistros] = useState<RegistroHistorial[]>([]);
  const [canjes, setCanjes] = useState<CanjeHistorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async (id: string) => {
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
    } catch (err) {
      console.error("Error cargando historial", err);
      const message =
        err instanceof Error ? err.message : "No se pudo cargar el historial.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

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
    if (!emprendedorId) return;
    loadData(emprendedorId);
  }, [emprendedorId, loadData]);

  const filteredRegistros = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return registros;

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
    if (!term) return canjes;

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

  const summary: Summary = useMemo(() => {
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
    if (rows.length === 0) return;
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
        const registro = item as RegistroHistorial;
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

      const canje = item as CanjeHistorial;
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

  const renderMeta = (estado: string, mapSource: typeof registroMeta | typeof canjeMeta) => {
    const meta = mapSource[estado] ?? {
      label: estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : "Pendiente",
      tone: "warning" as StatusTone,
    };
    return (
      <span className={`status-badge tone-${meta.tone}`}>
        {meta.label}
      </span>
    );
  };

  return (
    <div className="historial-emp">
      <div className="page-header">
        <div>
          <h1 className="h4 mb-1">Historial de movimientos</h1>
          <p className="text-secondary mb-0">
            Visualiza el detalle de registros de puntos y canjes realizados por tu negocio.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-light border d-inline-flex align-items-center gap-2 export-btn"
          onClick={handleExport}
          disabled={exportDisabled}
        >
          <FiDownloadCloud />
          <span>Exportar CSV</span>
        </button>
      </div>

      {error && (
        <div className="historial-warning" role="alert">
          <span>{error}</span>
          {emprendedorId && (
            <button type="button" onClick={handleRefresh} disabled={busy}>
              <FiRefreshCcw />
              Reintentar
            </button>
          )}
        </div>
      )}

      <div className="row g-3 summary-cards">
        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="summary-icon primary">
                <FiPlusCircle />
              </div>
              <div className="summary-label">Registros de puntos</div>
              <div className="summary-value">{summary.registros}</div>
              <div className="summary-sub">
                {numberFormatter.format(summary.puntosGenerados)} pts generados
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="summary-icon warning">
                <FiGift />
              </div>
              <div className="summary-label">Canjes completados</div>
              <div className="summary-value">{summary.canjes}</div>
              <div className="summary-sub">
                {numberFormatter.format(summary.puntosCanjeados)} pts canjeados
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="summary-icon success">
                <FiTrendingUp />
              </div>
              <div className="summary-label">Saldo estimado</div>
              <div className="summary-value">
                {numberFormatter.format(summary.saldoEstimado)} pts
              </div>
              <div className="summary-sub">
                {currencyFormatter.format(summary.totalFactura)} en compras
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="historial-toolbar">
            <div
              className="historial-toggle"
              role="tablist"
              aria-label="Tipo de movimiento"
            >
              <button
                type="button"
                className={showingRegistro ? "active" : ""}
                aria-pressed={showingRegistro}
                onClick={() => setTab("registro")}
              >
                Puntos
              </button>
              <button
                type="button"
                className={!showingRegistro ? "active" : ""}
                aria-pressed={!showingRegistro}
                onClick={() => setTab("canje")}
              >
                Canjes
              </button>
            </div>

            <div className="search-input input-group">
              <span className="input-group-text">
                <FiSearch />
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Buscar por cliente, correo o identidad"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                disabled={busy}
              />
            </div>

            <div className="toolbar-actions">
              <div className="toolbar-meta text-secondary">
                {busy
                  ? "Cargando historial..."
                  : `Mostrando ${rows.length} de ${totalRows} registros`}
                {lastUpdated && !busy && (
                  <span className="d-block small">
                    Actualizado: {dateFormatter.format(lastUpdated)}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-light refresh-btn"
                onClick={handleRefresh}
                disabled={busy || !emprendedorId}
              >
                <FiRefreshCcw />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle historial-table">
              <thead>
                {showingRegistro ? (
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Comercio</th>
                    <th>Factura</th>
                    <th className="text-end">Total compra</th>
                    <th className="text-end">Puntos</th>
                    <th className="text-end">Estado</th>
                  </tr>
                ) : (
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Beneficio</th>
                    <th>Canal</th>
                    <th className="text-end">Valor</th>
                    <th className="text-end">Puntos</th>
                    <th className="text-end">Estado</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {busy ? (
                  <tr>
                    <td colSpan={columnsCount}>
                      <div className="loading-state text-center">
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        />
                        Cargando historial...
                      </div>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={columnsCount}>
                      <div className="empty-state text-center">
                        No se encontraron movimientos con el filtro seleccionado.
                      </div>
                    </td>
                  </tr>
                ) : showingRegistro ? (
                  (rows as RegistroHistorial[]).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold">
                          {dateFormatter.format(item.fecha)}
                        </div>
                        <div className="text-muted small">#{item.id}</div>
                      </td>
                      <td>
                        <div className="fw-semibold">{item.cliente}</div>
                        <div className="text-muted small">{item.identidad}</div>
                      </td>
                      <td>{item.correo}</td>
                      <td>{item.comercio}</td>
                      <td>{item.factura}</td>
                      <td className="text-end">
                        {currencyFormatter.format(item.total)}
                      </td>
                      <td className="text-end">
                        {numberFormatter.format(item.puntos)}
                      </td>
                      <td className="text-end">
                        {renderMeta(item.estado, registroMeta)}
                      </td>
                    </tr>
                  ))
                ) : (
                  (rows as CanjeHistorial[]).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="fw-semibold">
                          {dateFormatter.format(item.fecha)}
                        </div>
                        <div className="text-muted small">#{item.id}</div>
                      </td>
                      <td>
                        <div className="fw-semibold">{item.cliente}</div>
                        <div className="text-muted small">{item.identidad}</div>
                      </td>
                      <td>{item.correo}</td>
                      <td>{item.premio}</td>
                      <td>{item.canal}</td>
                      <td className="text-end">
                        {currencyFormatter.format(item.valor)}
                      </td>
                      <td className="text-end">
                        {numberFormatter.format(item.puntos)}
                      </td>
                      <td className="text-end">
                        {renderMeta(item.estado, canjeMeta)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialEmp;