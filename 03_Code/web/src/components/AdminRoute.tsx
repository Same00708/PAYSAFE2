import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="loading">Chargement…</p>;
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: "/admin" }} replace />;
  }

  if (user.role !== "admin") {
    return (
      <section>
        <h1 className="page-title">Page introuvable</h1>
        <p>Cette adresse n&apos;existe pas ou vous n&apos;y avez pas accès.</p>
        <p>
          <Link to="/transactions">Retour à l&apos;accueil</Link>
        </p>
      </section>
    );
  }

  return <>{children}</>;
}
