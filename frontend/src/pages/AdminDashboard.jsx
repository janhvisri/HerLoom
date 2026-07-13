import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../redux/slices/orderSlice";
import { Users, ShoppingBag, Landmark, Award, Shield, FileText, Settings, AlertCircle } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.orders);

  // Local Analytics state
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }

    dispatch(fetchAllOrders());

    const getStats = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch("/api/analytics/stats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(data.analytics);
        }
      } catch (err) {
        console.error("Failed to load analytics: ", err);
      } finally {
        setStatsLoading(false);
      }
    };

    getStats();
  }, [userInfo, navigate, dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "badge-status badge-pending";
      case "paid": return "badge-status badge-paid";
      case "shipped": return "badge-status badge-shipped";
      case "delivered": return "badge-status badge-delivered";
      case "cancelled": return "badge-status badge-cancelled";
      default: return "badge-status";
    }
  };

  return (
    <main>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px" }}>
        🛡️ Admin Workspace
      </h1>

      <div className="admin-grid">
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar">
          <h3 style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", paddingLeft: "15px", marginBottom: "15px" }}>
            Management
          </h3>
          <div className="admin-menu-link active">
            <FileText size={18} /> Orders & Dashboard
          </div>
          <Link to="/admin/products" className="admin-menu-link">
            <ShoppingBag size={18} /> Product Catalog
          </Link>
        </aside>

        {/* Workspace Content */}
        <section>
          {/* Analytics Cards */}
          {statsLoading ? (
            <div style={{ textAlign: "center", padding: "10px" }}>Loading stats...</div>
          ) : (
            <div className="analytics-cards">
              <div className="analytics-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Total Revenue</span>
                  <Landmark size={20} color="var(--primary-hover)" />
                </div>
                <span className="analytics-num">₹{stats.totalRevenue}</span>
              </div>

              <div className="analytics-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Orders Placed</span>
                  <Award size={20} color="var(--primary-hover)" />
                </div>
                <span className="analytics-num">{stats.totalOrders}</span>
              </div>

              <div className="analytics-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Active Products</span>
                  <ShoppingBag size={20} color="var(--primary-hover)" />
                </div>
                <span className="analytics-num">{stats.totalProducts}</span>
              </div>

              <div className="analytics-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Registered Customers</span>
                  <Users size={20} color="var(--primary-hover)" />
                </div>
                <span className="analytics-num">{stats.totalUsers}</span>
              </div>
            </div>
          )}

          {/* Orders Log */}
          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "20px" }}>Customer Orders Log</h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={18} />
              <span>Failed to load orders: {error}</span>
            </div>
          ) : orders.length === 0 ? (
            <p style={{ color: "var(--text-muted)" }}>No customer orders placed yet.</p>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Details</th>
                    <th>Customer Info</th>
                    <th>Billing Total</th>
                    <th>Order Status</th>
                    <th>Update State</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      {/* Products */}
                      <td>
                        <span style={{ fontWeight: "700", fontFamily: "var(--mono)", fontSize: "12px", color: "var(--primary-hover)" }}>
                          #{order._id.substring(0, 10)}...
                        </span>
                        <div style={{ marginTop: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
                          {order.items?.map((item, index) => (
                            <div key={index}>
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td>
                        <div style={{ fontWeight: "700", fontSize: "14px" }}>
                          {order.user?.name || "Deleted User"}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {order.user?.email || "N/A"}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                          {order.address?.city}, {order.address?.state}
                        </div>
                      </td>

                      {/* Total price */}
                      <td style={{ fontWeight: "800", fontSize: "16px" }}>₹{order.totalAmount}</td>

                      {/* Status */}
                      <td>
                        <span className={getStatusClass(order.status)}>{order.status}</span>
                      </td>

                      {/* Action selector */}
                      <td>
                        <select
                          className="form-input"
                          style={{
                            padding: "6px 12px",
                            fontSize: "13px",
                            width: "auto",
                            borderColor: "var(--secondary)",
                            cursor: "pointer",
                            backgroundColor: "var(--bg-main)",
                          }}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default AdminDashboard;
