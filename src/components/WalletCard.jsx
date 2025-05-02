import React from "react";
import "./WalletCard.css";

function WalletCard({ wallet, onDepositClick, onWithdrawClick, onHistoryClick, showTransactionHistory }) {
  return (
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
            })} / {new Date(wallet.CreatedAt).getFullYear() + 543}
          </span>
        </div>
      </div>
      <div className="wallet-actions">
        <button className="action-button deposit" onClick={onDepositClick}>Deposit</button>
        <button className="action-button withdraw" onClick={onWithdrawClick}>Withdraw</button>
        <button className="action-button history" onClick={onHistoryClick}>
          {showTransactionHistory ? "Hide History" : "Transaction History"}
        </button>
      </div>
    </div>
  );
}

export default WalletCard;