import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Header.css";

function Header() {
  const { logout, user } = useAuth0();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">K</div>
          <h1>Katt Wallet</h1>
        </div>
        <div className="user-section">
          <div className="user-info">
            <img
              src={user?.picture}
              alt={user?.name}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "";
              }}
            />
            <span className="user-name">{user?.name}</span>
          </div>
          <button className="logout-button" onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;