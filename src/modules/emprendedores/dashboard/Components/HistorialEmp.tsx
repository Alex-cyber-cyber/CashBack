import React, { useCallback, useMemo, useState } from "react";
import {
  FiDownloadCloud,
  FiSearch,
  FiPlusCircle,
  FiGift,
  FiTrendingUp,
  FiRefreshCcw,
} from "react-icons/fi";
import "./Styles/HistorialEmp.scss";

type TabKey = "registro" | "canje";
type StatusTone = "success" | "warning" | "danger";

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

type RegistroRow = {
  id: string;
  fecha: Date;
  cliente: string;
  identidad: string;
  correo: string;
  comercio: string;
  factura: string;
  total: number;
  puntos: number;
  estado: keyof typeof registroMeta;
};

type CanjeRow = {
  id: string;
  fecha: Date;
  cliente: string;
  identidad: string;
  correo: string;
  premio: string;
  canal: string;
  puntos: number;
  valor: number;
  estado: keyof typeof canjeMeta;
};

type Summary = {
  registros: number;
  totalFactura: number;
  puntosGenerados: number;
  canjes: number;
  valorCanjeado: number;
  puntosCanjeados: number;
  saldoEstimado: number;
};

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

const mockRegistros: RegistroRow[] = [
  {
    id: "REG-1045",
    fecha: new Date("2024-08-12T10:30:00"),
    cliente: "Maria Hernandez",
    identidad: "0801-1994-12345",
    correo: "maria.hdz@example.com",
    comercio: "Cafe La Taza",
    factura: "F-2345",
    total: 1560.45,
    puntos: 156,
    estado: "acreditado",
  },
  {
    id: "REG-1046",
    fecha: new Date("2024-08-13T09:05:00"),
    cliente: "Carlos Mejia",
    identidad: "0801-1988-54321",
    correo: "carlos.mejia@example.com",
    comercio: "Mercadito Central",
    factura: "F-2338",
    total: 820.0,
    puntos: 82,
    estado: "pendiente",
  },
  {
    id: "REG-1038",
    fecha: new Date("2024-08-10T16:45:00"),
    cliente: "Luisa Torres",
    identidad: "0801-1990-87654",
    correo: "luisa.torres@example.com",
    comercio: "Moda Express",
    factura: "F-2297",
    total: 2350.85,
    puntos: 235,
    estado: "acreditado",
  },
  {
    id: "REG-1029",
    fecha: new Date("2024-08-08T12:15:00"),
    cliente: "Jorge Alvarez",
    identidad: "0801-1985-45981",
    correo: "jorge.alvarez@example.com",
    comercio: "TechHub",
    factura: "F-2251",
    total: 5120.0,
    puntos: 512,
    estado: "anulado",
  },
];

const mockCanjes: CanjeRow[] = [
  {
    id: "CAN-2090",
    fecha: new Date("2024-08-14T11:20:00"),
    cliente: "Maria Hernandez",
    identidad: "0801-1994-12345",
    correo: "maria.hdz@example.com",
    premio: "Giftcard Cafe",
    canal: "Canal web",
    puntos: 120,
    valor: 600,
    estado: "completado",
  },
  {
    id: "CAN-2087",
    fecha: new Date("2024-08-12T15:40:00"),
    cliente: "Carlos Mejia",
    identidad: "0801-1988-54321",
    correo: "carlos.mejia@example.com",
    premio: "Descuento 15%",
    canal: "Punto de venta",
    puntos: 80,
    valor: 400,
    estado: "pendiente",
  },
  {
    id: "CAN-2079",
    fecha: new Date("2024-08-09T18:05:00"),
    cliente: "Luisa Torres",
    identidad: "0801-1990-87654",
    correo: "luisa.torres@example.com",
    premio: "Kit de bienvenida",
    canal: "App movil",
    puntos: 150,
    valor: 750,
    estado: "completado",
  },
  {
    id: "CAN-2072",
    fecha: new Date("2024-08-07T09:55:00"),
    cliente: "Jorge Alvarez",
    identidad: "0801-1985-45981",
    correo: "jorge.alvarez@example.com",
    premio: "Cupon 2x1",
    canal: "Punto de venta",
    puntos: 90,
    valor: 450,
    estado: "rechazado",
  },
];

const columnsCount = 8;

const toCsvValue = (value: string | number) => {
  const str = String(value ?? "").replace(/\r?\n|\r/g, " ");
  if (str.includes(",") || str.includes("\"")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const HistorialEmp: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("registro");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date>(
    new Date("2024-09-05T09:15:00Z")
  );

  const filteredRegistros = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mockRegistros;

    return mockRegistros.filter((item) => {
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
  }, [search]);

  const filteredCanjes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mockCanjes;

    return mockCanjes.filter((item) => {
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
  }, [search]);

  const summary = useMemo<Summary>(() => {
    const totalFactura = mockRegistros.reduce((acc, item) => acc + item.total, 0);
    const puntosGenerados = mockRegistros.reduce(
      (acc, item) => acc + item.puntos,
      0
    );
    const valorCanjeado = mockCanjes.reduce((acc, item) => acc + item.valor, 0);
    const puntosCanjeados = mockCanjes.reduce(
      (acc, item) => acc + item.puntos,
      0
    );
    return {
      registros: mockRegistros.length,
      totalFactura,
      puntosGenerados,
      canjes: mockCanjes.length,
      valorCanjeado,
      puntosCanjeados,
      saldoEstimado: Math.max(puntosGenerados - puntosCanjeados, 0),
    };
  }, []);

  const showingRegistro = tab === "registro";
  const rows = useMemo(
    () => (showingRegistro ? filteredRegistros : filteredCanjes),
    [filteredCanjes, filteredRegistros, showingRegistro]
  );
  const totalRows = showingRegistro
    ? mockRegistros.length
    : mockCanjes.length;
  const busy = false;
  const exportDisabled = rows.length === 0;

  const handleRefresh = useCallback(() => {
    setLastUpdated(new Date());
  }, []);

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
        const registro = item as RegistroRow;
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

      const canje = item as CanjeRow;
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

  const renderMeta = (
    estado: string,
    mapSource: typeof registroMeta | typeof canjeMeta
  ) => {
    const meta =
      mapSource[estado] ?? {
        label: estado
          ? estado.charAt(0).toUpperCase() + estado.slice(1)
          : "Pendiente",
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
              <div className="summary-icon secondary">
                <FiGift />
              </div>
              <div className="summary-label">Canjes procesados</div>
              <div className="summary-value">{summary.canjes}</div>
              <div className="summary-sub">
                {currencyFormatter.format(summary.valorCanjeado)} canjeados
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
                {!busy && lastUpdated && (
                  <span className="d-block small">
                    Actualizado: {dateFormatter.format(lastUpdated)}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn btn-light refresh-btn"
                onClick={handleRefresh}
                disabled={busy}
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
                  (rows as RegistroRow[]).map((item) => (
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
                  (rows as CanjeRow[]).map((item) => (
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