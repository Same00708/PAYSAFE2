import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { getPostLoginPath } from "../utils/postLoginPath";
import "./pages.css";
import "./auth.css";

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(getPostLoginPath(user, from), { replace: true });
    }
  }, [user, navigate, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(phone);
      login(res.token, res.user);
      navigate(getPostLoginPath(res.user, from), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h1 className="page-title">Connexion</h1>
      <div className="card login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Numéro de téléphone</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="90123456"
              required
            />
            <p className="form-hint">
              Mobile Togo : 8 chiffres (90–93 Yas, 96–99 Moov), ex. 90123456
            </p>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        {error && <p className="chat-error" style={{ marginTop: "1rem" }}>{error}</p>}
      </div>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Pas de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </section>
  );
}
