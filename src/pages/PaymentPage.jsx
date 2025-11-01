import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css";

function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/shop/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handlePayment = async () => {
    if (!product) return;
    setProcessing(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in.");
      setProcessing(false);
      return;
    }

    try {
      // 1️⃣ Initiate payment order
      const { data } = await axios.post(
        "/api/shop/buy/initiate",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2️⃣ Razorpay Checkout options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "My Shop",
        description: product.name,
        image: product.image,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment
            await axios.post(
              "/api/shop/buy/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(true);
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com"
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment initiation failed.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!product) return null;

  return (
    <div className="payment-container">
      <h1 className="payment-title">Checkout</h1>
      <div className="payment-card">
        <h2 className="payment-product-name">{product.name}</h2>
        <p className="payment-product-price">Price: ₹{product.price}</p>
        <img
          src={product.image}
          alt={product.name}
          className="payment-product-image"
        />
        {success ? (
          <div className="payment-success">
            Payment successful!
            <br />
            <Link to="/my-orders" className="payment-orders-link">
              View My Orders
            </Link>
          </div>
        ) : (
          <button
            onClick={handlePayment}
            className="payment-button"
            disabled={processing}
          >
            {processing ? "Processing..." : "Pay with Razorpay"}
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
