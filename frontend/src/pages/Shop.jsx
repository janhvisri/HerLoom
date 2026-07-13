import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { Filter, Search } from "lucide-react";

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading } = useSelector((state) => state.products);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);

  // Sync state with URL params
  useEffect(() => {
    dispatch(fetchProducts());
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [dispatch, searchParams]);

  const categories = ["All", "Women", "Ethnic", "Electronics", "Accessories"];

  // Filter products based on search, category and price
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <main>
      <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "30px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>🛍️ Explore Shop</span>
      </h1>

      <div className="filter-section">
        {/* Sidebar Filter Panel */}
        <aside className="sidebar-filters">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "20px" }}>
            <Filter size={18} color="var(--primary-hover)" />
            <h2 style={{ fontSize: "18px", fontWeight: "700" }}>Filters</h2>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label className="form-label" htmlFor="search-input">Search Product</label>
            <div style={{ position: "relative" }}>
              <input
                id="search-input"
                type="text"
                placeholder="Search..."
                className="form-input"
                style={{ paddingLeft: "35px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            </div>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <label className="form-label">Category</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid",
                    borderColor: selectedCategory === cat ? "var(--primary)" : "var(--border-color)",
                    backgroundColor: selectedCategory === cat ? "var(--primary-light)" : "transparent",
                    color: selectedCategory === cat ? "var(--primary-hover)" : "var(--text-main)",
                    fontWeight: selectedCategory === cat ? "700" : "500",
                    cursor: "pointer",
                    transition: "var(--transition)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label className="form-label" htmlFor="price-slider">Max Price</label>
              <span style={{ fontWeight: "700", color: "var(--primary-hover)" }}>₹{maxPrice}</span>
            </div>
            <input
              id="price-slider"
              type="range"
              min="100"
              max="10000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: "var(--primary-hover)",
                cursor: "pointer",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              <span>₹100</span>
              <span>₹10,000</span>
            </div>
          </div>

          {/* Reset Filters */}
          <button
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setMaxPrice(10000);
              setSearchParams({});
            }}
          >
            Clear All Filters
          </button>
        </aside>

        {/* Products Grid */}
        <section>
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
              <p style={{ marginTop: "15px", color: "var(--text-muted)" }}>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "15px" }}>
                Showing {filteredProducts.length} products
              </p>
              <div className="products-container" style={{ marginTop: "0" }}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "80px 20px", background: "white", borderRadius: "var(--radius)", border: "1px solid var(--border-color)" }}>
              <p style={{ fontSize: "18px", fontWeight: "600", color: "var(--text-main)", marginBottom: "10px" }}>No Products Found</p>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Try relaxing your search terms or filters.</p>
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

export default Shop;
