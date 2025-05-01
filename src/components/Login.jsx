import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { loginWithPopup, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <div className="logo">K</div>
        </div>
        <h1 className="login-title">Welcome to Katt</h1>
        <p className="login-subtitle">
          <span className="highlight">Simplify</span> your finances.
          <span className="highlight">Secure</span> your future.
          <br />
          The smart way to manage your wallet.
        </p>
        <button className="login-button" onClick={() => loginWithPopup()}>
          <span className="button-text">Login</span>
          <span className="button-icon">→</span>
        </button>
      </div>
    </div>
  );
}

export default Login;