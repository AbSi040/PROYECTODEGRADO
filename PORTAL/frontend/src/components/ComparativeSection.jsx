import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ComparativeSection() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/informes/comparativa");
        setDatos(res.data || []);
      } catch (err) {
        console.error("❌ Error al cargar comparativas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return <p style={styles.loading}>⏳ Cargando comparativas...</p>;

  if (!datos.length)
    return (
      <section style={styles.section}>
        <h2 style={styles.title}>📊 Comparativa por curso y paralelo</h2>
        <p style={styles.empty}>Aún no hay suficientes datos para comparar decisiones.</p>
      </section>
    );

  // Normalizamos datos (para evitar valores null)
  const cursos = datos.map((d) => ({
    paralelo: d.paralelo || d.curso || "—",
    reflexivas: Number(d.prom_reflexivo || 0),
    inseguras: Number(d.prom_inseguro || 0),
    riesgo: Number(d.prom_riesgo || 0),
  }));

  const max = Math.max(
    ...cursos.map((d) =>
      Math.max(d.reflexivas, d.inseguras, d.riesgo)
    ),
    100
  );

  return (
    <section style={styles.section}>
      <h2 style={styles.title}>📊 Comparativa por curso y paralelo</h2>
      <div style={styles.chartContainer}>
        <SvgBars data={cursos} max={max} />
      </div>
    </section>
  );
}

/* =====================================================
   🟢 SUBCOMPONENTE: BARRAS SVG
===================================================== */
function SvgBars({ data, max }) {
  const colors = {
    reflexivas: "#5F736A",
    inseguras: "#C57A3D",
    riesgo: "#a94442",
  };

  const barHeight = 22;
  const spacing = 12;
  const width = 650;
  const totalHeight = data.length * (barHeight * 3 + spacing * 2) + 40;

  return (
    <svg
      width="100%"
      height={totalHeight}
      viewBox={`0 0 ${width} ${totalHeight}`}
    >
      {data.map((d, i) => {
        const baseY = i * (barHeight * 3 + spacing * 2) + 25;
        const x0 = 120; // margen izquierdo
        const maxWidth = width - x0 - 60;

        const reflexivasW = (d.reflexivas / max) * maxWidth;
        const insegurasW = (d.inseguras / max) * maxWidth;
        const riesgoW = (d.riesgo / max) * maxWidth;

        return (
          <g key={i}>
            <text
              x="10"
              y={baseY + barHeight}
              fill="#FFDAB3"
              fontSize="20"
              fontWeight="bold"
            >
              {d.paralelo}
            </text>

            {/* Reflexivas */}
            <rect
              x={x0}
              y={baseY}
              width={reflexivasW}
              height={barHeight}
              fill={colors.reflexivas}
              rx="4"
            />
            <text
              x={x0 + reflexivasW + 5}
              y={baseY + 16}
              fill="#fff"
              fontSize="15"
            >
              {d.reflexivas.toFixed(1)}%
            </text>

            {/* Inseguras */}
            <rect
              x={x0}
              y={baseY + barHeight + spacing / 2}
              width={insegurasW}
              height={barHeight}
              fill={colors.inseguras}
              rx="4"
            />
            <text
              x={x0 + insegurasW + 5}
              y={baseY + barHeight + spacing / 2 + 16}
              fill="#fff"
              fontSize="15"
            >
              {d.inseguras.toFixed(1)}%
            </text>

            {/* Riesgo */}
            <rect
              x={x0}
              y={baseY + barHeight * 2 + spacing}
              width={riesgoW}
              height={barHeight}
              fill={colors.riesgo}
              rx="4"
            />
            <text
              x={x0 + riesgoW + 5}
              y={baseY + barHeight * 2 + spacing + 16}
              fill="#fff"
              fontSize="15"
            >
              {d.riesgo.toFixed(1)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* =====================================================
   🎨 ESTILOS
===================================================== */
const styles = {
  section: {
    padding: "1rem",
    backgroundColor: "#eeeeeeff",
    borderRadius: "12px",
    margin: "0.1rem auto",
    maxWidth: "1300px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
  },
  title: {
    color: "#1C2B29",
    fontWeight: "800",
    marginBottom: "1rem",
    fontSize: "1.5rem",
  },
  empty: {
    textAlign: "center",
    color: "#333",
    backgroundColor: "#D9D9D9",
    borderRadius: "8px",
    padding: "1rem",
  },
  chartContainer: {
    backgroundColor: "#1C2B29",
    borderRadius: "10px",
    padding: "1.5rem",
    boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
    overflowX: "auto",
  },
  loading: {
    textAlign: "center",
    color: "#5F736A",
  },
};
