// src/components/common/Header.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks";
import warLogo from "../../assets/Gears-of-War-Logo.png";

const Header = () => {
  const { userData, logout } = useAuth();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <header className="site-header">
      <nav className="site-nav">
        {/* Brand */}
        <Link to="/" className="brand">
          <div className={`brand-logo ${imageError ? 'image-failed' : ''}`}>
            {!imageError ? (
              <img 
                src={warLogo} 
                alt="WAR Logo" 
                className="logo-image"
                onError={handleImageError}
              />
            ) : (
              <span>W</span>
            )}
          </div>
          <div className="brand-text">WAR • WIN & RULE</div>
        </Link>

        {/* Navigation */}
        <div className="nav-links">
          <NavLink to="/" end className={({isActive})=>`nav-link ${isActive?'active':''}`}>Home</NavLink>
          <NavLink to="/games" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Games</NavLink>
          <NavLink to="/leaderboard" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Leaderboard</NavLink>
          {userData && (
            <NavLink to="/redeem" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Redeem</NavLink>
          )}
          {userData?.isAdmin && (
            <NavLink to="/admin" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Admin</NavLink>
          )}
        </div>

        {/* Right side */}
        <div className="nav-auth">
          {userData ? (
            <>
              <span className="btn btn-ghost">Points: <b style={{marginLeft:6}}>{userData.points || 0}</b></span>
              <button className="btn btn-primary" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;