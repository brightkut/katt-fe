import React from "react";
import "./TransactionModal.css";

function TransactionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  onChange, 
  categories, 
  type 
}) {
  if (!isOpen) return null;

  const isDeposit = type === "deposit";
  const title = isDeposit ? "Make a Deposit" : "Make a Withdraw";
  const actionText = isDeposit ? "Deposit" : "Withdraw";
  const placeholder = isDeposit ? "e.g., Salary, Bonus, etc." : "e.g., Rent, Groceries, etc.";

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="categoryId">Category:</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={onChange}
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
              value={formData.transactionName}
              onChange={onChange}
              placeholder={placeholder}
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
              value={formData.amount}
              onChange={onChange}
              placeholder="0.00"
              required
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="button-primary">{actionText}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;