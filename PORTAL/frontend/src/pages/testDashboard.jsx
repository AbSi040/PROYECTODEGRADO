import React from "react";
import DashboardSection from "../components/DashboardSection";

export default function TestDashboard() {
  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#D9D9D9",
        minHeight: "100vh",
      }}
    >
      <h1>Prueba de Dashboard</h1>
      <DashboardSection />
    </div>
  );
}
