import ResourceCard from "./ResourceCard";

function ResourceGrid() {
  return (
    <section
      style={{
        backgroundColor: "#6B7E77",
        borderRadius: "10px",
        padding: "1rem",
        marginTop: "2rem"
      }}
    >
      <h2
  style={{
    color: "#4E3B2B",
    fontWeight: "700", // más negrilla
    textAlign: "center",
    marginBottom: "1rem",
  }}
>
  <strong>Panel de recursos</strong>
</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* De momento son tarjetas estáticas, luego las llenaremos con datos reales */}
        <ResourceCard />
        <ResourceCard />
        <ResourceCard />
        <ResourceCard />
        <ResourceCard />
        <ResourceCard />
      </div>
    </section>
  );
}

export default ResourceGrid;
