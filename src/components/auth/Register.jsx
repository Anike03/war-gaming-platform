import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Mail, Lock } from "lucide-react";

const ADMIN_EMAIL = "aniketsharma9360@gmail.com";

const Register = () => {
  const { signup, googleSignIn } = useAuth(); // Added googleSignIn
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!name.trim()) return setMsg("Please enter a display name.");
    if (email.trim().toLowerCase() === ADMIN_EMAIL) return setMsg("This email is reserved for Admin. Use another email.");
    if (pw1.length < 6) return setMsg("Password must be at least 6 characters.");
    if (pw1 !== pw2) return setMsg("Passwords do not match.");

    setLoading(true);
    try {
      await signup(email.trim(), pw1, { displayName: name.trim() });
      nav("/");
    } catch (e) {
      setMsg(e.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setMsg("");
    setLoading(true);
    try {
      await googleSignIn();
      nav("/");
    } catch (err) {
      setMsg(err?.message || "Google registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us today! Create your account to get started.</p>

        {msg && (
          <div className="banner banner-error" role="alert" style={{ marginBottom: 10 }}>
            {msg}
          </div>
        )}

        {/* Display Name */}
        <div className="field">
          <label htmlFor="name" className="form-label">Display Name</label>
          <input
            id="name"
            className="input"
            type="text"
            placeholder="Your display name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        {/* Email */}
        <div className="field">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <Mail size={18} className="icon icon-right" aria-hidden="true" />
        </div>

        {/* Password */}
        <div className="field">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            placeholder="••••••••"
            value={pw1}
            onChange={(e)=>setPw1(e.target.value)}
            required
          />
          <Lock size={18} className="icon icon-right" aria-hidden="true" />
        </div>

        {/* Confirm Password */}
        <div className="field">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            id="confirmPassword"
            className="input"
            type="password"
            placeholder="••••••••"
            value={pw2}
            onChange={(e)=>setPw2(e.target.value)}
            required
          />
          <Lock size={18} className="icon icon-right" aria-hidden="true" />
        </div>

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Creating Account…" : "Create Account"}
        </button>

        {/* Divider */}
        <div className="oauth-divider"><span>or</span></div>

        {/* Google registration */}
        <button
          type="button"
          className="oauth-btn oauth-google"
          onClick={handleGoogleRegister}
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

        <div className="linkline">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;