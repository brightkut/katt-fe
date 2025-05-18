import React from "react";
import "./TransactionHistory.css";

function TransactionHistory({ 
  transactions, 
  allTransactions,
  categories, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  pagination, 
  onPageChange,
  historyLoading 
}) {
  // Function to filter transactions based on filters
  const filterTransactions = (transactionsToFilter = transactions) => {
    // Apply filters to transactions
    let filteredData = [...transactionsToFilter];

    if (filters.type) {
      filteredData = filteredData.filter(t => t.transactionType === filters.type);
    }

    if (filters.category) {
      filteredData = filteredData.filter(t => t.categoryName === filters.category);
    }

    if (filters.fromDate) {
      const fromDateObj = new Date(filters.fromDate);
      filteredData = filteredData.filter(t => new Date(t.createdAt) >= fromDateObj);
    }

    if (filters.toDate) {
      const toDateObj = new Date(filters.toDate);
      filteredData = filteredData.filter(t => new Date(t.createdAt) <= toDateObj);
    }

    return filteredData;
  };

  // Calculate transaction totals
  const calculateTotals = () => {
    // Use allTransactions if available, otherwise use current transactions
    const dataToUse = allTransactions && allTransactions.length > 0 ? allTransactions : transactions;
    const filteredData = filterTransactions(dataToUse);

    const totals = {
      deposit: 0,
      withdraw: 0,
      balance: 0
    };

    filteredData.forEach(transaction => {
      if (transaction.transactionType === "DEPOSIT") {
        totals.deposit += parseFloat(transaction.amount);
        totals.balance += parseFloat(transaction.amount);
      } else if (transaction.transactionType === "WITHDRAW") {
        totals.withdraw += parseFloat(transaction.amount);
        totals.balance -= parseFloat(transaction.amount);
      }
    });

    return totals;
  };

  return (
    <div className="transaction-history-section">
      <h2>Transaction History</h2>
      <div className="transaction-card">
        {historyLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="no-data">
            <p>No transactions found. Make a deposit or withdrawal to get started.</p>
          </div>
        ) : (
          <>
            <div className="filters-section">
              <div className="filter-group">
                <label>Transaction Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={onFilterChange}
                >
                  <option value="">All Types</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAW">Withdraw</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={onFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.CategoryId} value={category.CategoryName}>
                      {category.CategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={onFilterChange}
                />
              </div>

              <div className="filter-group">
                <label>To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={onFilterChange}
                />
              </div>

              <button
                className="filter-button"
                onClick={onClearFilters}
              >
                Clear Filters
              </button>
            </div>

            {/* Transaction Summary Section */}
            <div className="transaction-summary">
              <h3>Transaction Summary</h3>
              <div className="summary-cards">
                <div className="summary-card deposit">
                  <h4>Total Deposits</h4>
                  <p className="amount">+${calculateTotals().deposit.toFixed(2)}</p>
                </div>
                <div className="summary-card withdraw">
                  <h4>Total Withdrawals</h4>
                  <p className="amount">-${calculateTotals().withdraw.toFixed(2)}</p>
                </div>
                <div className="summary-card balance">
                  <h4>Net Balance</h4>
                  <p className="amount">${calculateTotals().balance.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Name</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filterTransactions().map(transaction => (
                  <tr key={transaction.transactionId} className=''>
                    <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`transaction-badge ${transaction.transactionType.toLowerCase()}-txn`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td>{transaction.categoryName}</td>
                    <td>{transaction.transactionName}</td>
                    <td className=''>
                      {transaction.transactionType === "DEPOSIT" ? "+" : "-"}${transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button
                className="pagination-button"
                disabled={pagination.page === 1}
                onClick={() => onPageChange(pagination.page - 1)}
              >
                &laquo; Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>
              <button
                className="pagination-button"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => onPageChange(pagination.page + 1)}
              >
                Next &raquo;
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TransactionHistory;
