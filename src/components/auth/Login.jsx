import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const { login, loginAdminOnly } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [keep, setKeep] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const from = loc.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await login(email.trim(), pw);
      nav(from, { replace: true });
    } catch (e) {
      setMsg(e.message || "Wrong email or password.");
    } finally {
      setLoading(false);
    }
  };

  const adminQuick = async () => {
    setMsg("");
    setLoading(true);
    try {
      await loginAdminOnly();             // one-click fixed admin
      nav("/admin", { replace: true });
    } catch (e) {
      setMsg(e.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-title">Login</div>

        {msg && <div className="error" style={{marginBottom:10}}>{msg}</div>}

        <div className="field">
          <input
            className="input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <Mail size={18} className="icon" />
        </div>

        <div className="field">
          <input
            className="input"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
            required
          />
          <Lock size={18} className="icon" />
        </div>

        <div className="row">
          <label className="check"><input type="checkbox" checked={keep} onChange={(e)=>setKeep(e.target.checked)} /> Remember me</label>
          <Link to="/forgot-password" className="muted">Forgot password?</Link>
        </div>

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>

        <div className="help">
          <button type="button" onClick={adminQuick}>Admin Login (1-click)</button>
        </div>

        <div className="linkline">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
