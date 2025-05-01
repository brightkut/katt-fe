import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Landing.css";

function Landing() {
  const [wallet, setWallet] = useState(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { getAccessTokenSilently, logout, user } = useAuth0();
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchWallets() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();

        const response = await axios.post(url + '/wallets-by-email', { email: user.email }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setWallet(response.data.data);
      } catch (error) {
        console.error("Failed to fetch wallets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWallets();
  }, [getAccessTokenSilently, user?.email, url, isCreatingWallet]);

  async function createWallet() {
    try {
      setIsCreatingWallet(true);
      const token = await getAccessTokenSilently();
      const response = await axios.post(url + '/wallets', { email: user.email, totalMoney: 0 }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error("Failed to create wallet:", error);
    }
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
    setIsCreatingWallet(false);
  }


  return (
    <div className="landing-container">
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
                  e.target.src = "https://via.placeholder.com/40";
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

      <main className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your wallet...</p>
          </div>
        ) : wallet === null ? (
          <div className="empty-wallet-container">
            <div className="empty-wallet-content">
              <h2>Welcome to Katt Wallet!</h2>
              <p>You don't have a wallet yet. Create one to get started.</p>
              <button className="create-wallet-button" onClick={createWallet}>
                Create Wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="wallet-details-container">
            <h2>Your Wallet</h2>
            <div className="wallet-card">
              <div className="wallet-header">
                <h3>Wallet Details</h3>
                <span className="wallet-balance">${wallet.TotalMoney || 0}</span>
              </div>
              <div className="wallet-info">
                <div className="info-row">
                  <span className="info-label">Wallet ID:</span>
                  <span className="info-value">{wallet.WalletId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Owner:</span>
                  <span className="info-value">{wallet.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Created:</span>
                  <span className="info-value">
                    {new Date(wallet.CreatedAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })} / {new Date(wallet.CreatedAt).getFullYear() + 543}</span>
                </div>
              </div>
              <div className="wallet-actions">
                <button className="action-button deposit">Deposit</button>
                <button className="action-button withdraw">Withdraw</button>
                <button className="action-button history">Transaction History</button>
              </div>
            </div>
          </div>
        )}
      </main>    {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-icon">✓</div>
          <div className="popup-message">
            <h3>Success!</h3>
            <p>Your wallet has been created successfully.</p>
          </div>
        </div>
    )}
    </div>
  );
}

export default Landing;