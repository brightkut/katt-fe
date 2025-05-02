import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Landing.css";

// Import components
import Header from "./Header";
import WalletCard from "./WalletCard";
import TransactionHistory from "./TransactionHistory";
import TransactionModal from "./TransactionModal";
import SuccessPopup from "./SuccessPopup";

function Landing() {
  // Access Token and Auth0
  const { getAccessTokenSilently, user } = useAuth0();
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

  // Transaction history
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 5,
    totalPages: 0
  });
  const [historyLoading, setHistoryLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    fromDate: '',
    toDate: ''
  });

  useEffect(() => {
    async function fetchWallets() {
      try {
        setLoading(true);
        const token = await getAccessTokenSilently();
        setAccessToken(token);

        const response = await axios.post(url + '/wallets-by-email', {email: user.email}, {
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
      await axios.post(url + '/wallets', {email: user.email, totalMoney: 0}, {
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

    const res = await axios.post(url + '/categories-by-wallet-id', {walletId: wallet.WalletId}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    setCategories(res.data.data);
  }

  async function handleOpenWithdrawModal() {
    setShowWithdrawModal(true);

    const res = await axios.post(url + '/categories-by-wallet-id', {walletId: wallet.WalletId}, {
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
    const {name, value} = e.target;
    setDepositForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleWithdrawInputChange(e) {
    const {name, value} = e.target;
    setWithdrawForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleDepositSubmit(e) {
    e.preventDefault();

    try {
      setIsDeposit(true);
      await axios.post(url + '/transactions', {
        walletId: wallet.WalletId,
        categoryId: depositForm.categoryId,
        transactionType: "DEPOSIT",
        transactionName: depositForm.transactionName,
        amount: parseFloat(depositForm.amount)
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
      await axios.post(url + '/transactions', {
        walletId: wallet.WalletId,
        categoryId: withdrawForm.categoryId,
        transactionType: "WITHDRAW",
        transactionName: withdrawForm.transactionName,
        amount: parseFloat(withdrawForm.amount)
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      // Show success and close modal
      setShowTxnSuccessPopup(true);
      setTimeout(() => setShowTxnSuccessPopup(false), 3000);
      handleCloseWithdrawModal();
      setIsWithdraw(false);
    } catch (error) {
      console.error("Failed to make withdraw:", error);
    }
  }

  async function handleTransactionHistory() {
    // If already showing, hide it
    if (showTransactionHistory) {
      setShowTransactionHistory(false);
      return;
    }

    // Otherwise show and fetch data
    const res = await axios.post(url + '/categories-by-wallet-id', {walletId: wallet.WalletId}, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    setCategories(res.data.data);
    setShowTransactionHistory(true);
    fetchTransactionHistory(1);
  }

  async function fetchTransactionHistory(page = 1) {
    try {
      setHistoryLoading(true);

      // Using GET with query parameters instead of POST with request body
      const response = await axios.get(
        `${url}/transactions?walletId=${wallet.WalletId}&page=${page}&pageSize=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );

      setTransactions(response.data.data.data || []);
      setPagination({
        ...pagination,
        page: page,
        totalPages: response.data.data.totalPages || 0
      });
    } catch (error) {
      console.error("Failed to fetch transaction history:", error);
    } finally {
      setHistoryLoading(false);
    }
  }

  function handlePageChange(newPage) {
    fetchTransactionHistory(newPage);
  }

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      type: '',
      category: '',
      fromDate: '',
      toDate: ''
    });
  }

return (
  <div className="landing-container">
    <Header />

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
          <WalletCard 
            wallet={wallet} 
            onDepositClick={handleOpenDepositModal} 
            onWithdrawClick={handleOpenWithdrawModal} 
            onHistoryClick={handleTransactionHistory}
            showTransactionHistory={showTransactionHistory}
          />

          {/* Transaction History Section - only shown when button is clicked */}
          {showTransactionHistory && (
            <TransactionHistory 
              transactions={transactions}
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              pagination={pagination}
              onPageChange={handlePageChange}
              historyLoading={historyLoading}
            />
          )}
        </div>
      )}
    </main>

    {/* Success Popups */}
    <SuccessPopup 
      show={showSuccessPopup} 
      message="Your wallet has been created successfully." 
    />

    <SuccessPopup 
      show={showTxnSuccessPopup} 
      message="Your transaction has been created successfully." 
    />

    {/* Transaction Modals */}
    <TransactionModal 
      isOpen={showDepositModal}
      onClose={handleCloseDepositModal}
      onSubmit={handleDepositSubmit}
      formData={depositForm}
      onChange={handleDepositInputChange}
      categories={categories}
      type="deposit"
    />

    <TransactionModal 
      isOpen={showWithdrawModal}
      onClose={handleCloseWithdrawModal}
      onSubmit={handleWithdrawSubmit}
      formData={withdrawForm}
      onChange={handleWithdrawInputChange}
      categories={categories}
      type="withdraw"
    />
  </div>
);
}
export default Landing;
