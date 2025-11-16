import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardSection() {
  const [distribucion, setDistribucion] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [decisiones, setDecisiones] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDistribucion, resProgreso, resDecisiones] = await Promise.all(
          [
            api.get("/informes/distribucion"),
            api.get("/informes/progreso"),
            api.get("/informes/decisiones"),
          ]
        );
        setDistribucion(resDistribucion.data || []);
        setProgreso(resProgreso.data || []);
        setDecisiones(resDecisiones.data || []);
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p style={styles.loading}>⏳ Cargando estadísticas...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>📊 Dashboard general</h2>
      <p style={styles.subtitleGlobal}>
        Distribución de estudiantes por clúster, progreso en historias y mapa de
        decisiones
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.subtitle}>Distribución por clúster (K-Means)</h3>
          <ClusterChart data={distribucion} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.subtitle}>Progreso promedio por historia</h3>
          <ProgressBars data={progreso} />
        </div>

        <div style={styles.cardWide}>
          <h3 style={styles.subtitle}>Mapa de calor de decisiones</h3>
          <Heatmap data={decisiones} />
        </div>
      </div>
    </section>
  );
}

/* ==============================
   🟣 Gráfico circular
   ============================== */
function ClusterChart({ data }) {
  if (!data.length) return <p style={styles.text}>Sin datos de clúster.</p>;

  const total = data.reduce((sum, d) => sum + Number(d.cantidad || 0), 0);
  let startAngle = 0;
  const radius = 80;
  const colors = ["#C57A3D", "#FFDAB3", "#5F736A", "#1C2B29"];

  const slices = data.map((d, i) => {
    const val = Number(d.cantidad) || 0;
    const angle = (val / total) * 2 * Math.PI;
    const x1 = radius + radius * Math.sin(startAngle);
    const y1 = radius - radius * Math.cos(startAngle);
    const x2 = radius + radius * Math.sin(startAngle + angle);
    const y2 = radius - radius * Math.cos(startAngle + angle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = `
      M${radius},${radius}
      L${x1},${y1}
      A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2}
      Z
    `;
    startAngle += angle;
    return { path, color: colors[i % colors.length], label: d.cluster };
  });

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="180" height="180" viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill={s.color}
            stroke="#fff"
            strokeWidth="1"
          />
        ))}
      </svg>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
        {data.map((d, i) => (
          <li key={i} style={{ color: "#FFDAB3", fontSize: "0.9rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: colors[i % colors.length],
                marginRight: "6px",
                borderRadius: "2px",
              }}
            ></span>
            {d.cluster}: {((d.cantidad / total) * 100).toFixed(1)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ==============================
   🟠 Barras de progreso
   ============================== */
function ProgressBars({ data }) {
  if (!data.length) return <p style={styles.text}>Sin datos de progreso.</p>;

  const max = Math.max(...data.map((d) => Number(d.progreso) || 0), 100);

  return (
    <div>
      {data.map((d, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0, color: "#FFDAB3", fontWeight: "bold" }}>
            {d.historia}
          </p>
          <div style={styles.barContainer}>
            <div
              style={{
                ...styles.barFill,
                width: `${Math.min((Number(d.progreso) / max) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.9rem" }}>
            {(Number(d.progreso) || 0).toFixed(1)}%
          </p>
        </div>
      ))}
    </div>
  );
}

/* ==============================
   🔴 Mapa de calor de decisiones
   ============================== */
function Heatmap({ data }) {
  if (!data.length) return <p style={styles.text}>Sin datos de decisiones.</p>;

  const total = data.reduce((sum, d) => sum + Number(d.total || 0), 0);

  return (
    <div style={styles.heatmap}>
      {data.map((d, i) => {
        const intensity = Number(d.total || 0) / total;
        const bg = `rgba(197, 122, 61, ${0.3 + intensity * 0.7})`; // escala de calor
        return (
          <div key={i} style={{ ...styles.heatCell, backgroundColor: bg }}>
            <p style={styles.heatLabel}>
              {d.tipo || "Sin tipo"} <br />
              <span style={{ fontSize: "0.8rem" }}>
                {(intensity * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ==============================
   🎨 Estilos
   ============================== */
const styles = {
  section: {
    padding: "2rem",
    backgroundColor: "#eeeeeeff",
    borderRadius: "12px",
    margin: "2rem auto",
    maxWidth: "1300px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
  },
  title: {
    color: "#1C2B29",
    fontSize: "1.6rem",
    fontWeight: "700",
    textAlign: "center",
  },
  subtitleGlobal: {
    color: "#5F736A",
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
    gridTemplateRows: "auto auto",
  },
  card: {
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
    textAlign: "center",
  },
  cardWide: {
    gridColumn: "1 / span 2",
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 3px 6px rgba(0,0,0,0.25)",
  },
  subtitle: {
    color: "#FFDAB3",
    fontWeight: "bold",
    marginBottom: "1rem",
    fontSize: "1.1rem",
  },
  text: {
    color: "#fff",
    opacity: 0.8,
    fontSize: "0.95rem",
  },
  barContainer: {
    height: "18px",
    backgroundColor: "#5F736A",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "0.4rem",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#C57A3D",
    borderRadius: "10px",
    transition: "width 0.6s ease",
  },
  heatmap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1rem",
  },
  heatCell: {
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    color: "white",
    boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)",
  },
  heatLabel: {
    fontWeight: "bold",
    lineHeight: "1.3",
  },
  loading: {
    textAlign: "center",
    color: "#5F736A",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
};
