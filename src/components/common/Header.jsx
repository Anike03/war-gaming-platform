import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks";
import warLogo from "../../assets/Gears-of-War-Logo.png";

const Header = () => {
  const { userData, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [open, setOpen] = useState(false);

  // Close mobile panel when navigating
  const closeMenu = () => setOpen(false);

  return (
    <header className={`site-header ${open ? "mobile-open" : ""}`}>
      <nav className="site-nav">
        {/* Brand */}
        <Link to="/" className="brand" onClick={closeMenu} aria-label="Go to Home">
          <div className={`brand-logo ${imageError ? "image-failed" : ""}`}>
            {!imageError ? (
              <img
                src={warLogo}
                alt="WAR Logo"
                className="logo-image"
                onError={() => setImageError(true)}
              />
            ) : (
              <span>W</span>
            )}
          </div>
          <div className="brand-text">WAR • WIN & RULE</div>
        </Link>

        {/* Desktop nav (hidden on mobile) */}
        <div className="nav-links desktop-only">
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/games" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Games
          </NavLink>
          <NavLink to="/leaderboard" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Leaderboard
          </NavLink>

          {userData && (
            <>
              <NavLink to="/redeem" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Redeem
              </NavLink>
              <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
              </NavLink>
            </>
          )}

          {userData?.isAdmin && (
            <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="nav-auth desktop-only">
          {userData ? (
            <>
              <span className="btn btn-ghost">
                Points: <b style={{ marginLeft: 6 }}>{userData.points || 0}</b>
              </span>
              <Link className="btn btn-secondary" to="/profile" onClick={closeMenu}>
                {userData.displayName ? userData.displayName.split(" ")[0] : "Profile"}
              </Link>
              <button className="btn btn-primary" onClick={() => { closeMenu(); logout(); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link className="btn btn-primary" to="/register" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger (shown on mobile) */}
        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(v => !v)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true">
        <div className="mobile-section">
          <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/games" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Games
          </NavLink>
          <NavLink to="/leaderboard" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Leaderboard
          </NavLink>

          {userData && (
            <>
              <NavLink to="/redeem" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Redeem
              </NavLink>
              <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
              </NavLink>
            </>
          )}

          {userData?.isAdmin && (
            <NavLink to="/admin" onClick={closeMenu} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="mobile-section mobile-auth">
          {userData ? (
            <>
              <div className="wallet-badge" style={{ justifyContent: "center" }}>
                Points: <b style={{ marginLeft: 6 }}>{userData.points || 0}</b>
              </div>
              <Link className="btn btn-secondary btn-full" to="/profile" onClick={closeMenu}>
                {userData.displayName ? userData.displayName.split(" ")[0] : "Profile"}
              </Link>
              <button className="btn btn-primary btn-full" onClick={() => { closeMenu(); logout(); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost btn-full" to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link className="btn btn-primary btn-full" to="/register" onClick={closeMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
