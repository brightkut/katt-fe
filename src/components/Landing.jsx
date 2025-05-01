import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Landing.css";

function Landing() {
  // Access Token and Auth0
  const { getAccessTokenSilently, logout, user } = useAuth0();
  const [accessToken, setAccessToken] = useState(null);
  const url = import.meta.env.VITE_API_URL;

  // Wallet
  const [wallet, setWallet] = useState(null);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);

  // Categories
  const [categories, setCategories] = useState([]);

  // Success Popup
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showTxnSuccessPopup, setShowTxnSuccessPopup] = useState(false);

  // loading state
  const [loading, setLoading] = useState(true);

  // Deposit Modal
  const [isDeposit, setIsDeposit] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositForm, setDepositForm] = useState({
    categoryId: "",
    transactionName: "",
    amount: ""
  });


  // Withdraw Modal
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    categoryId: "",
    transactionName: "",
    amount: ""
  });

  useEffect(() => {
    async function fetchWallets() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        setAccessToken(token);

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
  }, [getAccessTokenSilently, user?.email, url, isCreatingWallet, isDeposit, isWithdraw]);

  async function createWallet() {
    try {
      setIsCreatingWallet(true);
      const token = await getAccessTokenSilently();
      await axios.post(url + '/wallets', { email: user.email, totalMoney: 0 }, {
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

  async function handleOpenDepositModal() {
    setShowDepositModal(true);

    const res = await axios.post(url + '/categories-by-wallet-id', { walletId: wallet.WalletId}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    setCategories(res.data.data);
  }

  async function handleOpenWithdrawModal() {
    setShowWithdrawModal(true);

    const res = await axios.post(url + '/categories-by-wallet-id', { walletId: wallet.WalletId}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    setCategories(res.data.data);
  }

  function handleCloseDepositModal() {
    setShowDepositModal(false);
    // Reset form
    setDepositForm({
      categoryId: "",
      transactionName: "",
      amount: ""
    });
  }

  function handleCloseWithdrawModal() {
    setShowWithdrawModal(false);
    // Reset form
    setWithdrawForm({
      categoryId: "",
      transactionName: "",
      amount: ""
    });
  }

  function handleDepositInputChange(e) {
    const { name, value } = e.target;
    setDepositForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleWithdrawInputChange(e) {
    const { name, value } = e.target;
    setWithdrawForm(prev => ({
      ...prev,
      [name]: value
    }));
  }
  async function handleDepositSubmit(e) {
    e.preventDefault();

    try {
      setIsDeposit(true);
      const token = await getAccessTokenSilently();
      await axios.post(url + '/transactions', {
        walletId: wallet.WalletId,
        categoryId: depositForm.categoryId,
        transactionType: "DEPOSIT",
        transactionName: depositForm.transactionName,
        amount: parseFloat(depositForm.amount)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Show success and close modal
      setShowTxnSuccessPopup(true);
      setTimeout(() => setShowTxnSuccessPopup(false), 3000);
      handleCloseDepositModal();
      setIsDeposit(false);
    } catch (error) {
      console.error("Failed to make deposit:", error);
    }
  }

  async function handleWithdrawSubmit(e) {
    e.preventDefault();

    try {
      setIsWithdraw(true);
      const token = await getAccessTokenSilently();
      await axios.post(url + '/transactions', {
        walletId: wallet.WalletId,
        categoryId: withdrawForm.categoryId,
        transactionType: "WITHDRAW",
        transactionName: withdrawForm.transactionName,
        amount: parseFloat(withdrawForm.amount)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Show success and close modal
      setShowTxnSuccessPopup(true);
      setTimeout(() => setShowTxnSuccessPopup(false), 3000);
      handleCloseWithdrawModal();
      setIsWithdraw(false);
    } catch (error) {
      console.error("Failed to make deposit:", error);
    }

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
                <button className="action-button deposit" onClick={handleOpenDepositModal}>Deposit</button>
                <button className="action-button withdraw" onClick={handleOpenWithdrawModal}>Withdraw</button>
                <button className="action-button history">Transaction History</button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showSuccessPopup && (
        <div className="success-popup">
          <div className="popup-icon">✓</div>
          <div className="popup-message">
            <h3>Success!</h3>
            <p>Your wallet has been created successfully.</p>
          </div>
        </div>
      )}
      {showTxnSuccessPopup && (
          <div className="success-popup">
            <div className="popup-icon">✓</div>
            <div className="popup-message">
              <h3>Success!</h3>
              <p>Your transaction has been created successfully.</p>
            </div>
          </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Make a Deposit</h2>
              <button className="modal-close" onClick={handleCloseDepositModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleDepositSubmit}>
              <div className="form-group">
                <label htmlFor="categoryId">Category:</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={depositForm.categoryId}
                  onChange={handleDepositInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.CategoryId} value={category.CategoryId}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="transactionName">Transaction Name:</label>
                <input
                  type="text"
                  id="transactionName"
                  name="transactionName"
                  value={depositForm.transactionName}
                  onChange={handleDepositInputChange}
                  placeholder="e.g., Salary, Bonus, etc."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount ($):</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={depositForm.amount}
                  onChange={handleDepositInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="button-secondary" onClick={handleCloseDepositModal}>Cancel</button>
                <button type="submit" className="button-primary">Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* Withdraw Modal */}
      {showWithdrawModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Make a Withdraw</h2>
                <button className="modal-close" onClick={handleCloseWithdrawModal}>×</button>
              </div>
              <form className="modal-form" onSubmit={handleWithdrawSubmit}>
                <div className="form-group">
                  <label htmlFor="categoryId">Category:</label>
                  <select
                      id="categoryId"
                      name="categoryId"
                      value={withdrawForm.categoryId}
                      onChange={handleWithdrawInputChange}
                      required
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category.CategoryId} value={category.CategoryId}>
                          {category.CategoryName}
                        </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="transactionName">Transaction Name:</label>
                  <input
                      type="text"
                      id="transactionName"
                      name="transactionName"
                      value={withdrawForm.transactionName}
                      onChange={handleWithdrawInputChange}
                      placeholder="e.g., Salary, Bonus, etc."
                      required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="amount">Amount ($):</label>
                  <input
                      type="number"
                      id="amount"
                      name="amount"
                      min="0.01"
                      step="0.01"
                      value={withdrawForm.amount}
                      onChange={handleWithdrawInputChange}
                      placeholder="0.00"
                      required
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="button-secondary" onClick={handleCloseWithdrawModal}>Cancel</button>
                  <button type="submit" className="button-primary">Withdraw</button>
                </div>
              </form>
            </div>
          </div>
      )}  </div>
  );
}

export default Landing;