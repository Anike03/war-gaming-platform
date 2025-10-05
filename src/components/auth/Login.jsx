import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Mail, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { login, loginAdminOnly, googleSignIn } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const from = loc.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await login(email.trim(), pw);
      if (remember) localStorage.setItem("rememberMe", "1");
      else localStorage.removeItem("rememberMe");
      nav(from, { replace: true });
    } catch (err) {
      setMsg(err?.message || "Wrong email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdmin = async () => {
    setMsg("");
    setLoading(true);
    try {
      await loginAdminOnly();
      nav("/admin", { replace: true });
    } catch (err) {
      setMsg(err?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setMsg("");
    setLoading(true);
    try {
      await googleSignIn();
      nav(from, { replace: true });
    } catch (err) {
      setMsg(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Login</h1>
        <p className="auth-subtitle">Welcome back! Please sign in to continue.</p>

        {msg && (
          <div className="banner banner-error" role="alert" style={{ marginBottom: 10 }}>
            {msg}
          </div>
        )}

        {/* Email */}
        <div className="field">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            autoFocus
          />
          {/* decorative icon on the right */}
          <Mail size={18} className="icon icon-right" aria-hidden="true" />
        </div>

        {/* Password with show/hide toggle */}
        <div className="field">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            className="input"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            value={pw}
            onChange={(e)=>setPw(e.target.value)}
            required
          />
          <button
            type="button"
            className="icon-btn"
            aria-label={showPw ? "Hide password" : "Show password"}
            onClick={()=>setShowPw(s => !s)}
          >
            {showPw ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>

        <div className="row">
          <label className="check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e)=>setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <Link to="/forgot-password" className="link-inline">
            Forgot password?
          </Link>
        </div>

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>

        {/* Divider */}
        <div className="oauth-divider"><span>or</span></div>

        {/* Google sign-in */}
        <button
          type="button"
          className="oauth-btn oauth-google"
          onClick={handleGoogle}
          disabled={loading}
          aria-label="Continue with Google"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="oauth-icon" aria-hidden="true">
            <path fill="#EA4335" d="M533.5 278.4c0-18.6-1.7-36.6-4.9-54H272v102.3h147.2c-6.3 34-25.2 62.9-53.7 82.1v67h86.8c50.7-46.7 81.2-115.5 81.2-197.4z"/>
            <path fill="#34A853" d="M272 544.3c73.5 0 135.2-24.3 180.3-66.1l-86.8-67c-24.1 16.2-55 25.8-93.5 25.8-71.8 0-132.6-48.4-154.4-113.4H28.7v70.9C73.5 487.2 166.3 544.3 272 544.3z"/>
            <path fill="#4A90E2" d="M117.6 323.6c-5.8-17.2-9.1-35.6-9.1-54.6s3.3-37.4 9.1-54.6v-70.9H28.7C10.4 178.5 1 225.6 1 269s9.4 90.5 27.7 125.5l88.9-71z"/>
            <path fill="#FBBC05" d="M272 106.4c39.9 0 75.7 13.7 104 40.7l78.1-78.1C407.2 24.1 345.5 0 272 0 166.3 0 73.5 57.1 28.7 143.1l88.9 70.9C139.4 154.8 200.2 106.4 272 106.4z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Admin quick login */}
        <div className="help" style={{ marginTop: 10 }}>
          <button type="button" onClick={handleAdmin} className="btn btn-ghost">
            Admin Login (1-click)
          </button>
        </div>

        <div className="linkline">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
