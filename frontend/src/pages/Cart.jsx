import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal > 2000 || subtotal === 0 ? 0 : 99;
  const gstTax = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + shippingFee + gstTax;

  const handleQtyChange = (product, quantity, maxStock) => {
    const qty = Math.max(1, Math.min(maxStock, quantity));
    dispatch(updateQuantity({ product, quantity: qty }));
  };

  const handleCheckout = () => {
    if (!userInfo) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <main>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px" }}>
        🛒 Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <ShoppingBag size={64} style={{ color: "var(--primary)", marginBottom: "20px" }} />
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>Your Cart is Empty</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Add items to your cart to see them here.</p>
          <Link to="/shop" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-grid">
          {/* Cart Items List */}
          <div className="cart-items-card">
            <h2 style={{ fontSize: "20px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "15px" }}>
              Cart Items ({cartItems.length})
            </h2>

            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img
                  src={item.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&q=80"}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-details">
                  <Link to={`/product/${item.product}`}>
                    <h3 className="cart-item-title">{item.name}</h3>
                  </Link>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>

                {/* Quantity Editor */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <button
                    className="qty-btn"
                    style={{ width: "32px", height: "32px", fontSize: "16px" }}
                    onClick={() => handleQtyChange(item.product, item.quantity - 1, item.stock)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="qty-value" style={{ fontSize: "16px", width: "24px" }}>
                    {item.quantity}
                  </span>
                  <button
                    className="qty-btn"
                    style={{ width: "32px", height: "32px", fontSize: "16px" }}
                    onClick={() => handleQtyChange(item.product, item.quantity + 1, item.stock)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                {/* Delete button */}
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "8px",
                    transition: "var(--transition)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  onClick={() => dispatch(removeFromCart(item.product))}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-start" }}>
              <Link to="/shop" style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", color: "var(--primary-hover)" }}>
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary-card">
            <h2 style={{ fontSize: "20px", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "20px" }}>
              Order Summary
            </h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Tax (GST 18%)</span>
              <span>₹{gstTax}</span>
            </div>

            <div className="summary-row">
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? "FREE" : `₹${shippingFee}`}</span>
            </div>

            <div className="summary-row total">
              <span>Total Price</span>
              <span>₹{totalAmount}</span>
            </div>

            <button className="btn btn-primary" style={{ width: "100%", marginTop: "20px" }} onClick={handleCheckout}>
              Proceed To Checkout <ArrowRight size={18} />
            </button>

            <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "15px" }}>
              *Free shipping on orders above ₹2000
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
