import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("admin_user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin-login");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Car Booking Platform</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Book Car
        </Link>

        {!user && (
          <Link to="/admin-login" style={styles.link}>
            Admin Login
          </Link>
        )}

        {user && user.role === "admin" && (
          <>
            <Link to="/reports" style={styles.link}>
              Reports
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #ddd",
    background: "#111827",
  },
  logo: {
    color: "white",
    margin: 0,
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "600",
  },
  logoutButton: {
    padding: "8px 12px",
    border: "1px solid white",
    background: "transparent",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },
};