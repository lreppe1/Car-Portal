import { useEffect, useState } from "react";
import api from "../api";

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await api.get("/reports/summary");
        setReport(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load report");
      }
    };

    loadReport();
  }, []);

  if (error) {
    return (
      <div style={styles.page}>
        <p>{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={styles.page}>
        <p>Loading report...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Bookings</h3>
          <p>{report.totalBookings}</p>
        </div>

        <div style={styles.card}>
          <h3>Paid Bookings</h3>
          <p>{report.paidBookings}</p>
        </div>

        <div style={styles.card}>
          <h3>Pending Bookings</h3>
          <p>{report.pendingBookings}</p>
        </div>

        <div style={styles.card}>
          <h3>Failed Bookings</h3>
          <p>{report.failedBookings}</p>
        </div>

        <div style={styles.cardWide}>
          <h3>Total Revenue</h3>
          <p>${report.totalRevenue}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  cardWide: {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    gridColumn: "1 / -1",
  },
};