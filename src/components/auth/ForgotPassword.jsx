import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks";
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";

const ForgotPassword = () => {
  const { resetPassword, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr(""); clearError(); setLoading(true);
    try {
      await resetPassword(email.trim());
      setMsg("Check your inbox for a reset link. It may be in Spam/Promotions.");
    } catch (e) {
      setErr(e?.message || "We couldn't send the reset email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const mailtoHref = `mailto:aniketsharma9360@gmail.com?subject=${
    encodeURIComponent("Password reset help")
  }&body=${
    encodeURIComponent(
`Hi team,

I need help resetting my password for Win & Rule.

Registered email: ${email || "(enter your email here)"}

Thanks!`
    )
  }`;

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <Link to="/login" className="backlink">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter the email you used to sign up. We’ll send a secure link to reset your password.
        </p>

        {err && (
          <div className="banner banner-error">
            <AlertTriangle size={18} /> <span>{err}</span>
          </div>
        )}
        {msg && (
          <div className="banner banner-success">
            <CheckCircle2 size={18} /> <span>{msg}</span>
          </div>
        )}

        <div className="field">
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <Mail size={18} className="icon" />
        </div>

        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </button>

        <div className="help help-inline">
          <span className="muted">Need help?</span>
          <a className="contact-pulse" href={mailtoHref}>
            Contact support
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
