import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { Package, Calendar, MapPin, Receipt, ArrowRight, ShoppingBag } from "lucide-react";

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchMyOrders());
    }
  }, [userInfo, navigate, dispatch]);

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "badge-status badge-pending";
      case "paid":
        return "badge-status badge-paid";
      case "shipped":
        return "badge-status badge-shipped";
      case "delivered":
        return "badge-status badge-delivered";
      case "cancelled":
        return "badge-status badge-cancelled";
      default:
        return "badge-status";
    }
  };

  return (
    <main>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>📦 My Order History</span>
      </h1>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <p style={{ marginTop: "15px", color: "var(--text-muted)" }}>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" style={{ maxWidth: "500px", margin: "0 auto 20px" }}>
          Failed to fetch orders: {error}
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", boxShadow: "var(--shadow-sm)" }}>
          <ShoppingBag size={64} style={{ color: "var(--primary)", marginBottom: "20px" }} />
          <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>No Orders Placed Yet</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>You haven't bought anything from HerLoom yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Browse Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: "white",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border-color)",
                padding: "25px",
                boxShadow: "var(--shadow-sm)",
                transition: "var(--transition)",
              }}
            >
              {/* Order Header info */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: "1px solid var(--border-color)",
                  paddingBottom: "15px",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>
                    Order ID:
                  </span>
                  <p style={{ fontWeight: "700", fontFamily: "var(--mono)", fontSize: "14px", color: "var(--text-main)" }}>
                    #{order._id}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--text-muted)" }}>
                    <Calendar size={16} />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "var(--text-muted)" }}>
                    <Receipt size={16} />
                    <span>Txn ID: <b style={{ fontFamily: "var(--mono)", fontSize: "13px" }}>{order.paymentId || "Simulated"}</b></span>
                  </div>

                  <div>
                    <span className={getStatusClass(order.status)}>{order.status}</span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "20px" }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <img
                      src={item.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80"}
                      alt={item.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <h4 style={{ fontSize: "15px", fontWeight: "700" }}>{item.name}</h4>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        Quantity: {item.quantity} | Price: ₹{item.price}
                      </p>
                    </div>
                    <span style={{ fontWeight: "700" }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order footer summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: "1px dashed var(--border-color)",
                  paddingTop: "15px",
                  flexWrap: "wrap",
                  gap: "15px",
                }}
              >
                {/* Shipping address details */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "13px", color: "var(--text-muted)", maxWidth: "450px" }}>
                  <MapPin size={16} color="var(--primary-hover)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>
                    Deliver to: {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.postalCode}, {order.address?.country}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Total Paid:</span>
                  <span style={{ fontSize: "22px", fontWeight: "800", marginLeft: "10px", color: "var(--primary-hover)" }}>
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Orders;
