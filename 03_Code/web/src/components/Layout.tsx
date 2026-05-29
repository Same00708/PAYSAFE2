import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotificationBadge } from "../hooks/useNotificationBadge";
import "./Layout.css";
import "../styles/components.css";

export function Layout() {
  const { user, logout } = useAuth();
  const unreadNotifs = useNotificationBadge(Boolean(user));

  return (
    <div className="layout">
      <header className="header">
        <NavLink to="/" className="logo">
          <span className="logo-icon">🛡</span>
          PaySafe
        </NavLink>
        <nav className="nav">
          {user ? (
            <>
              <NavLink to="/transactions" className={({ isActive }) => (isActive ? "active" : "")}>
                Transactions
              </NavLink>
              <NavLink to="/transactions/nouvelle" className={({ isActive }) => (isActive ? "active" : "")}>
                + Créer
              </NavLink>
              <NavLink to="/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
                Notifications
                {unreadNotifs > 0 && (
                  <span className="nav-badge" aria-label={`${unreadNotifs} non lues`}>
                    {unreadNotifs > 99 ? "99+" : unreadNotifs}
                  </span>
                )}
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
                  Tableau de bord
                </NavLink>
              )}
              <div className="nav-profile">
                <span className="nav-avatar">{user.fullName.slice(0, 1)}</span>
                <span className="nav-user">{user.username}</span>
              </div>
              <button type="button" className="nav-logout" onClick={logout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion">Connexion</NavLink>
              <NavLink to="/inscription" className="nav-cta">
                Créer un compte
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>PaySafe — Compte requis · Chat sécurisé · FedaPay</p>
      </footer>
    </div>
  );
}
