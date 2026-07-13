import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetOrderState } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { CreditCard, Truck, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

// Helper to load external scripts dynamically
const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const { success, error, loading } = useSelector((state) => state.orders);

  // Address State
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [payError, setPayError] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  // Math calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 2000 ? 0 : 99;
  const gstTax = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + shippingFee + gstTax;

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  useEffect(() => {
    if (success) {
      dispatch(clearCart());
      dispatch(resetOrderState());
      navigate("/orders");
    }
  }, [success, navigate, dispatch]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPayError(null);

    // Simple validation
    if (!address.street || !address.city || !address.state || !address.postalCode) {
      setPayError("Please complete all shipping address fields.");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    }));

    // Razorpay Integration
    setPayLoading(true);
    const isScriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!isScriptLoaded) {
      setPayError("Razorpay SDK failed to load. Please verify your connection.");
      setPayLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // 1. Create order on the backend (Razorpay Order creation)
      const resOrder = await fetch("/api/payment/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
        }),
      });
      const orderDetails = await resOrder.json();
      if (!resOrder.ok) {
        throw new Error(orderDetails.message || "Failed to create payment order");
      }

      // 2. Open Razorpay checkout interface
      const options = {
        key: "rzp_test_TBnjPqQbYvjWIp", // Loaded from project backend config
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        name: "HerLoom E-Commerce",
        description: "Payment for order checkout",
        order_id: orderDetails.id,
        handler: async function (response) {
          // Success Callback: response = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            // Verify payment on backend
            const resVerify = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
              },
              body: JSON.stringify(response),
            });
            const verifyDetails = await resVerify.json();
            if (!resVerify.ok) {
              throw new Error(verifyDetails.message || "Payment verification failed");
            }

            // Create actual Order in MongoDB
            dispatch(
              createOrder({
                items: orderItems,
                totalAmount,
                address,
                paymentId: response.razorpay_payment_id,
              })
            );
          } catch (err) {
            setPayError(err.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#ff85a2", // Matching our pink brand theme
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function (response) {
        setPayError(`Payment failed: ${response.error.description}`);
      });
    } catch (err) {
      setPayError(
        err.message ||
          "Error instantiating Razorpay order. The API keys may be invalid or not configured. Try using Sandbox Simulation instead."
      );
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <main>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px" }}>
        💳 Checkout
      </h1>

      <div className="cart-grid">
        {/* Shipping Form */}
        <div className="cart-items-card">
          <h2 style={{ fontSize: "20px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Truck size={20} color="var(--primary-hover)" /> Shipping Address
          </h2>

          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label className="form-label" htmlFor="street-input">Street Address</label>
              <input
                id="street-input"
                type="text"
                name="street"
                placeholder="Flat / House No. / Building / Street"
                className="form-input"
                value={address.street}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="city-input">City</label>
                <input
                  id="city-input"
                  type="text"
                  name="city"
                  placeholder="City"
                  className="form-input"
                  value={address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="state-input">State</label>
                <input
                  id="state-input"
                  type="text"
                  name="state"
                  placeholder="State"
                  className="form-input"
                  value={address.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="postal-input">Postal / PIN Code</label>
                <input
                  id="postal-input"
                  type="text"
                  name="postalCode"
                  placeholder="6 digit PIN code"
                  className="form-input"
                  value={address.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="country-select">Country</label>
                <select
                  id="country-select"
                  name="country"
                  className="form-input"
                  value={address.country}
                  onChange={handleInputChange}
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            {/* Payment Method Selector */}
            <h2 style={{ fontSize: "20px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", margin: "30px 0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={20} color="var(--primary-hover)" /> Payment Mode
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px",
                  border: "1px solid var(--primary)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--primary-light)",
                  fontWeight: "600",
                }}
              >
                💳 Razorpay Secure Gateway (UPI, Card, NetBanking, Wallets)
              </div>
            </div>

            {/* Error messaging */}
            {(error || payError) && (
              <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <AlertCircle size={20} />
                <span>{payError || error}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "14px", fontSize: "16px" }}
              disabled={payLoading || loading}
            >
              {payLoading || loading ? "Processing..." : "Place Order & Pay"} <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Order Info */}
        <div className="cart-summary-card">
          <h2 style={{ fontSize: "20px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "20px" }}>
            Summary ({cartItems.length} Products)
          </h2>

          <div style={{ maxHeight: "240px", overflowY: "auto", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px" }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", fontSize: "14px" }}>
                <span style={{ fontWeight: "500", display: "inline-block", maxWidth: "160px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.name} <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>x{item.quantity}</span>
                </span>
                <span style={{ fontWeight: "700" }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Tax (GST 18%)</span>
            <span>₹{gstTax}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
          </div>

          <div className="summary-row total">
            <span>Total Pay</span>
            <span>₹{totalAmount}</span>
          </div>

          <div style={{ marginTop: "25px", background: "#fff9fa", border: "1px dashed var(--secondary)", padding: "15px", borderRadius: "var(--radius-sm)", display: "flex", gap: "8px", alignItems: "flex-start", fontSize: "13px", color: "var(--text-muted)" }}>
            <ShieldCheck size={20} color="var(--primary-hover)" style={{ flexShrink: 0 }} />
            <span>
              Transactions are encrypted using banking grade security standards. We protect your billing address credentials.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
