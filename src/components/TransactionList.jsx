import React from "react";
import "./TransactionList.css"; // optional styling

const TransactionList = ({ transactions }) => {
  if (!transactions.length) {
    return <p>No transactions found.</p>;
  }

  return (
    <div className="transaction-list">
      <h3>Transaction History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount (₹)</th>
            <th>Source</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id}>
              <td>{new Date(tx.createdAt).toLocaleString()}</td>
              <td>{tx.amount.toFixed(2)}</td>
              <td>{tx.source}</td>
              <td>{tx.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
