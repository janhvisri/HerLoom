import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { Star, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigating to detail page when clicking add to cart button
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity: 1,
      })
    );
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image-container">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"}
            alt={product.name}
            className="product-image"
          />
        </div>
      </Link>

      <div className="product-info">
        <span className="product-category">{product.category || "General"}</span>

        <Link to={`/product/${product._id}`}>
          <h2 className="product-name">{product.name}</h2>
        </Link>

        <p className="product-description">{product.description}</p>

        <div className="product-rating">
          <Star size={16} fill="#ffb703" color="#ffb703" />{" "}
          {product.rating || 4.5} ({product.numReviews || 12} Reviews)
        </div>

        <div className="product-bottom">
          <h3 className="product-price">₹{product.price}</h3>

          <span className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
            {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
          </span>
        </div>

        <button
          className="add-cart-btn"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;