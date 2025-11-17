import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function DashboardSection() {
  const [distribucion, setDistribucion] = useState([]);
  const [progreso, setProgreso] = useState([]);
  const [decisiones, setDecisiones] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======= PLACEHOLDER (mientras no haya ML ni datos reales) =======
  const datosPlaceholder = {
    distribucion: [
      { cluster: "Reflexivo", cantidad: 12 },
      { cluster: "Impulsivo", cantidad: 8 },
      { cluster: "Empático", cantidad: 15 },
    ],
    progreso: [
      { historia: "Historia 1", progreso: 60 },
      { historia: "Historia 2", progreso: 45 },
      { historia: "Historia 3", progreso: 30 },
    ],
    decisiones: [
      { tipo: "Violencia física", total: 20 },
      { tipo: "Violencia psicológica", total: 35 },
      { tipo: "Violencia digital", total: 10 },
      { tipo: "Violencia simbólica", total: 18 },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Intentar obtener datos REALES si existieran
        const res = await api.get("/informes"); // No falla, porque sí existe

        // Como tu backend aún no genera estadísticas,
        // usamos los datos temporales:
        setDistribucion(datosPlaceholder.distribucion);
        setProgreso(datosPlaceholder.progreso);
        setDecisiones(datosPlaceholder.decisiones);
      } catch (err) {
        console.error("⚠ Error al cargar datos, usando placeholder:", err);
        setDistribucion(datosPlaceholder.distribucion);
        setProgreso(datosPlaceholder.progreso);
        setDecisiones(datosPlaceholder.decisiones);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p style={styles.loading}>⏳ Cargando estadísticas...</p>;

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>📊 Dashboard general</h2>
      <p style={styles.subtitleGlobal}>
        Distribución por clúster, progreso en historias y mapa de decisiones
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.subtitle}>Distribución de clúster (K-Means)</h3>
          <ClusterChart data={distribucion} />
        </div>

        <div style={styles.card}>
          <h3 style={styles.subtitle}>Progreso en historias</h3>
          <ProgressBars data={progreso} />
        </div>

        <div style={styles.cardWide}>
          <h3 style={styles.subtitle}>Mapa de decisiones</h3>
          <Heatmap data={decisiones} />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   GRÁFICO CIRCULAR
   ============================================================ */
function ClusterChart({ data }) {
  if (!data.length) return <p style={styles.text}>Sin datos.</p>;

  const total = data.reduce((s, d) => s + d.cantidad, 0);
  let startAngle = 0;
  const radius = 80;
  const colors = ["#C57A3D", "#FFDAB3", "#5F736A", "#1C2B29"];

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="180" height="180" viewBox="0 0 160 160">
        {data.map((d, i) => {
          const angle = (d.cantidad / total) * 2 * Math.PI;
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

          return (
            <path
              key={i}
              d={path}
              fill={colors[i % colors.length]}
              stroke="#fff"
              strokeWidth="1"
            />
          );
        })}
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

/* ============================================================
   BARRAS DE PROGRESO
   ============================================================ */
function ProgressBars({ data }) {
  if (!data.length) return <p style={styles.text}>Sin datos.</p>;

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
                width: `${d.progreso}%`,
              }}
            ></div>
          </div>

          <p style={{ margin: "0.3rem 0 0 0" }}>{d.progreso}%</p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   MAPA DE CALOR
   ============================================================ */
function Heatmap({ data }) {
  if (!data.length) return <p style={styles.text}>Sin datos.</p>;

  const total = data.reduce((s, d) => s + d.total, 0);

  return (
    <div style={styles.heatmap}>
      {data.map((d, i) => {
        const intensity = d.total / total;
        const bg = `rgba(197, 122, 61, ${0.3 + intensity * 0.7})`;
        return (
          <div key={i} style={{ ...styles.heatCell, backgroundColor: bg }}>
            <p style={styles.heatLabel}>
              {d.tipo} <br />
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

/* ============================================================
   ESTILOS
   ============================================================ */
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
  },
  card: {
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
    textAlign: "center",
  },
  cardWide: {
    gridColumn: "1 / span 2",
    backgroundColor: "#1C2B29",
    color: "white",
    borderRadius: "10px",
    padding: "1.5rem",
  },
  subtitle: {
    color: "#FFDAB3",
    fontWeight: "bold",
    marginBottom: "1rem",
  },
  text: {
    color: "#fff",
    opacity: 0.8,
  },
  barContainer: {
    height: "18px",
    backgroundColor: "#5F736A",
    borderRadius: "10px",
    overflow: "hidden",
    marginTop: "0.3rem",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#C57A3D",
  },
  heatmap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1rem",
  },
  heatCell: {
    borderRadius: "10px",
    padding: "1rem",
    textAlign: "center",
    color: "white",
  },
  heatLabel: {
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    color: "#5F736A",
  },
};
