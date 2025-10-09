// src/components/common/Header.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks";
import warLogo from "../../assets/Gears-of-War-Logo.png";

const Header = () => {
  const { userData, logout } = useAuth();
  const [imageError, setImageError] = useState(false);

  return (
    <header className="site-header">
      <nav className="site-nav">
        {/* Brand */}
        <Link to="/" className="brand">
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

        {/* Navigation */}
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>
          <NavLink to="/games" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Games
          </NavLink>
          {/* Make Leaderboard protected or not based on your routes; this just shows the link */}
          <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Leaderboard
          </NavLink>

          {/* Show only for signed-in users */}
          {userData && (
            <>
              <NavLink to="/redeem" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Redeem
              </NavLink>
              {/* 🔗 Added Profile link */}
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Profile
              </NavLink>
            </>
          )}

          {/* Admin link */}
          {userData?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Admin
            </NavLink>
          )}
        </div>

        {/* Right side */}
        <div className="nav-auth">
          {userData ? (
            <>
              <span className="btn btn-ghost">
                Points: <b style={{ marginLeft: 6 }}>{userData.points || 0}</b>
              </span>
              <Link className="btn btn-secondary" to="/profile">
                {userData.displayName ? userData.displayName.split(" ")[0] : "Profile"}
              </Link>
              <button className="btn btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
