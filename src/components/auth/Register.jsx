import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Mail, Lock } from "lucide-react";

const ADMIN_EMAIL = "aniketsharma9360@gmail.com";

const Register = () => {
  const { signup } = useAuth();
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

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-title">Create Account</div>

        {msg && <div className="error" style={{marginBottom:10}}>{msg}</div>}

        <div className="field">
          <input
            className="input"
            type="text"
            placeholder="Display name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <input
            className="input"
            type="email"
            placeholder="Email"
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
            value={pw1}
            onChange={(e)=>setPw1(e.target.value)}
            required
          />
          <Lock size={18} className="icon" />
        </div>

        <div className="field">
          <input
            className="input"
            type="password"
            placeholder="Confirm password"
            value={pw2}
            onChange={(e)=>setPw2(e.target.value)}
            required
          />
          <Lock size={18} className="icon" />
        </div>

        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Register"}
        </button>

        <div className="linkline">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
