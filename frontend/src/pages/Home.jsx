import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw, HeartHandshake } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Categories list
  const categories = [
    { name: "Women", icon: "👗", path: "/shop?category=Women" },
    { name: "Ethnic", icon: "🏮", path: "/shop?category=Ethnic" },
    { name: "Electronics", icon: "⚡", path: "/shop?category=Electronics" },
    { name: "Accessories", icon: "👜", path: "/shop?category=Accessories" },
  ];

  // Get first 4 products for featured section
  const featuredProducts = products.slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-tagline">
            <Sparkles size={16} style={{ verticalAlign: "middle", marginRight: "6px" }} />
            New Season Arrivals
          </div>
          <h1 className="hero-title">
            Find Your Absolute <span>Dream Style</span> Here
          </h1>
          <p className="hero-desc">
            Explore curated collections tailored to perfection. Enjoy premium quality products, secure payments, and fast door-to-door delivery.
          </p>
          <Link to="/shop">
            <button className="btn btn-primary">
              Explore Collections <ArrowRight size={18} />
            </button>
          </Link>
        </div>
        <div className="hero-image-container">
          <div className="hero-circle"></div>
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
            alt="Fashion Model"
            className="hero-image"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ marginBottom: "60px", textAlign: "center" }}>
        <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "30px" }}>
          Shop by Category
        </h2>
        <div className="category-list">
          {categories.map((cat, idx) => (
            <Link to={cat.path} key={idx} className="category-item">
              <div className="category-circle" style={{ fontSize: "28px" }}>
                {cat.icon}
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800" }}>Featured Products</h2>
          <Link to="/shop" style={{ color: "var(--primary-hover)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
            <p style={{ marginTop: "15px", color: "var(--text-muted)" }}>Loading catalog...</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="products-container">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
            No products found. Please run backend seed script to insert dummy products.
          </p>
        )}
      </section>

      {/* Why Choose Us */}
      <section style={{
        backgroundColor: "white",
        borderRadius: "var(--radius-lg)",
        padding: "40px",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)"
      }}>
        <h2 style={{ fontSize: "26px", fontWeight: "800", textAlign: "center", marginBottom: "40px" }}>
          Why HerLoom?
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "30px",
          textAlign: "center"
        }}>
          <div>
            <div style={{ color: "var(--primary-hover)", marginBottom: "15px", display: "flex", justifyContent: "center" }}>
              <ShieldCheck size={36} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Secure Checkout</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              100% secure payment gateways integrated via Razorpay.
            </p>
          </div>

          <div>
            <div style={{ color: "var(--primary-hover)", marginBottom: "15px", display: "flex", justifyContent: "center" }}>
              <Truck size={36} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Fast Delivery</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Reliable delivery network delivering across all cities in India.
            </p>
          </div>

          <div>
            <div style={{ color: "var(--primary-hover)", marginBottom: "15px", display: "flex", justifyContent: "center" }}>
              <RefreshCw size={36} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>Easy Returns</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Hassle-free 7-day return policy on apparel and accessories.
            </p>
          </div>

          <div>
            <div style={{ color: "var(--primary-hover)", marginBottom: "15px", display: "flex", justifyContent: "center" }}>
              <HeartHandshake size={36} />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>24/7 Support</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Dedicated customer helpdesk resolving requests day and night.
            </p>
          </div>
        </div>
      </section>

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
};

export default Home;