import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";
import { ShoppingCart, User, LogOut, Menu, Shield, Home } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <span>🛍️ HerLoom</span>
        </Link>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <Home size={18} /> Home
          </Link>
        </li>
        <li>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>
            Shop
          </Link>
        </li>
        <li className="nav-badge-container">
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            <ShoppingCart size={18} /> Cart
            {cartItemsCount > 0 && <span className="nav-badge">{cartItemsCount}</span>}
          </Link>
        </li>
        {userInfo ? (
          <>
            <li>
              <Link to="/orders" onClick={() => setMenuOpen(false)}>
                <User size={18} /> My Orders
              </Link>
            </li>
            {userInfo.role === "admin" && (
              <li>
                <Link to="/admin" onClick={() => setMenuOpen(false)}>
                  <Shield size={18} /> Admin Panel
                </Link>
              </li>
            )}
            <li>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={16} /> Logout ({userInfo.name})
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;