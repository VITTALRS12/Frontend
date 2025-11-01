import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionList from "../components/TransactionList";
import "./WalletPage.css";

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please log in to access your wallet.");
      return;
    }
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("/api/wallet/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalance(res.data.walletBalance);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Could not load balance.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("/api/wallet/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Could not load transactions.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/wallet/add",
        { amount: formData.amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        setError("Could not initiate payment.");
      }
    } catch (err) {
      console.error("Error initiating payment:", err);
      setError("Error initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="wallet-page">
      <h2>Your Wallet</h2>
      <div className="balance-box">
        <strong>Balance:</strong>{" "}
        {new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
        }).format(balance)}
      </div>

      {error && <p className="error-message">{error}</p>}

      <form className="add-transaction-form" onSubmit={handleSubmit}>
        <h3>Add Funds</h3>
        <div>
          <label>Amount (₹):</label>
          <input
            type="number"
            step="1"
            min="1"
            pattern="\d*"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !formData.amount || formData.amount <= 0}
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>
      </form>

      <TransactionList transactions={transactions} />
    </div>
  );
};

export default WalletPage;
