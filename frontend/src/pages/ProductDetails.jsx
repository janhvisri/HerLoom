import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, resetProductState } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { Star, ShoppingBag, ArrowLeft, ShieldCheck, Truck, RefreshCw } from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch, id]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity,
      })
    );
    navigate("/cart");
  };

  if (loading) {
    return (
      <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
          <p style={{ marginTop: "15px", color: "var(--text-muted)" }}>Fetching product details...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ textAlign: "center", padding: "80px 20px" }}>
        <div className="alert alert-danger" style={{ maxWidth: "500px", margin: "0 auto 20px" }}>
          Error: {error}
        </div>
        <Link to="/shop" className="btn btn-outline">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main>
      {/* Back button */}
      <Link to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "25px", color: "var(--text-muted)", fontWeight: "600" }}>
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="detail-container">
        {/* Product Image */}
        <div className="detail-gallery">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"}
            alt={product.name}
            className="detail-img"
          />
        </div>

        {/* Product Details */}
        <div className="detail-info">
          <span className="product-category" style={{ fontSize: "14px" }}>
            {product.category || "General"}
          </span>

          <h1>{product.name}</h1>

          <div className="product-rating" style={{ fontSize: "16px", marginBottom: "20px" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                fill={i < Math.round(product.rating || 4.5) ? "#ffb703" : "none"}
                color="#ffb703"
              />
            ))}
            <span style={{ color: "var(--text-muted)", marginLeft: "6px" }}>
              ({product.numReviews || 12} customer reviews)
            </span>
          </div>

          <h2 className="detail-price">₹{product.price}</h2>

          <p className="detail-desc">{product.description}</p>

          <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "600" }}>Availability:</span>
            <span className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`} style={{ display: "inline-block" }}>
              {product.stock > 0 ? `${product.stock} Units In Stock` : "Out of Stock"}
            </span>
          </div>

          {product.stock > 0 && (
            <>
              <div className="qty-selector">
                <span style={{ fontWeight: "600" }}>Quantity:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button className="qty-btn" onClick={handleDecrease} disabled={quantity <= 1}>
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button className="qty-btn" onClick={handleIncrease} disabled={quantity >= product.stock}>
                    +
                  </button>
                </div>
              </div>

              <button className="btn btn-primary" style={{ padding: "14px 40px", width: "100%", maxWidth: "300px" }} onClick={handleAddToCart}>
                <ShoppingBag size={18} /> Add To Shopping Cart
              </button>
            </>
          )}

          {/* Features checkmark */}
          <div style={{ marginTop: "40px", borderTop: "1px solid var(--border-color)", paddingTop: "25px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "var(--text-muted)" }}>
              <Truck size={16} color="var(--primary-hover)" /> Free Shipping
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "var(--text-muted)" }}>
              <RefreshCw size={16} color="var(--primary-hover)" /> 7 Days Returns
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "var(--text-muted)" }}>
              <ShieldCheck size={16} color="var(--primary-hover)" /> Secure Payments
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
