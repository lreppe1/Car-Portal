import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminLoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const updateField = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setStatus("");

      const res = await api.post("/auth/login", form);

      localStorage.setItem("admin_user", JSON.stringify(res.data.user));
      navigate("/reports");
    } catch (error) {
      setStatus(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Admin Login</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            name="email"
            type="email"
            placeholder="Admin email"
            value={form.email}
            onChange={updateField}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={updateField}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  heading: {
    marginTop: 0,
    marginBottom: "20px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  button: {
    padding: "12px 16px",
    border: "none",
    borderRadius: "8px",
    background: "#111827",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
  },
  status: {
    marginTop: "16px",
  },
};