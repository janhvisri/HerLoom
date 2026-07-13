import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, createProduct, updateProduct, deleteProduct, resetProductState } from "../redux/slices/productSlice";
import { FileText, ShoppingBag, Plus, Trash2, Edit2, AlertCircle, X, CheckCircle } from "lucide-react";

const AdminProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { products, loading, error, success } = useSelector((state) => state.products);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!userInfo || userInfo.role !== "admin") {
      navigate("/login");
      return;
    }
    dispatch(fetchProducts());
  }, [userInfo, navigate, dispatch]);

  useEffect(() => {
    if (success) {
      setModalOpen(false);
      resetForm();
      dispatch(fetchProducts());
      dispatch(resetProductState());
    }
  }, [success, dispatch]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: "",
    });
    setImageFile(null);
    setProductId(null);
    setEditMode(false);
    setSubmitError(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setEditMode(false);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      imageUrl: product.imageUrl,
    });
    setImageFile(null);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Simple validations
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      setSubmitError("Please fill out all fields.");
      return;
    }

    // Determine payload format: multipart/form-data if uploading file, otherwise json
    let payload;
    if (imageFile) {
      payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("category", formData.category);
      payload.append("stock", formData.stock);
      payload.append("image", imageFile);
    } else {
      payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        imageUrl: formData.imageUrl,
      };
    }

    if (editMode) {
      dispatch(updateProduct({ id: productId, formData: payload }));
    } else {
      dispatch(createProduct(payload));
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
          <Link to="/admin" className="admin-menu-link">
            <FileText size={18} /> Orders & Dashboard
          </Link>
          <div className="admin-menu-link active">
            <ShoppingBag size={18} /> Product Catalog
          </div>
        </aside>

        {/* Catalog Table */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800" }}>Manage Catalog Products</h2>
            <button className="btn btn-primary" onClick={handleOpenCreateModal}>
              <Plus size={16} /> Add New Product
            </button>
          </div>

          {loading && !modalOpen ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner" style={{ border: "4px solid #f3f3f3", borderTop: "4px solid var(--primary)", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite", margin: "0 auto" }}></div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={18} />
              <span>Catalog Error: {error}</span>
            </div>
          ) : (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item Preview</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      {/* Image Preview */}
                      <td>
                        <img
                          src={product.imageUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80"}
                          alt={product.name}
                          style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "#fff9fa" }}
                        />
                      </td>

                      {/* Name */}
                      <td>
                        <div style={{ fontWeight: "700", fontSize: "15px" }}>{product.name}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: "250px" }}>
                          {product.description}
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", color: "var(--primary-hover)" }}>
                          {product.category || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td style={{ fontWeight: "800" }}>₹{product.price}</td>

                      {/* Stock */}
                      <td>
                        <span className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                          {product.stock} Units
                        </span>
                      </td>

                      {/* Edit / Delete Actions */}
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: "8px", borderRadius: "var(--radius-sm)", color: "var(--text-main)" }}
                            onClick={() => handleOpenEditModal(product)}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: "8px", borderRadius: "var(--radius-sm)", color: "var(--error)", borderColor: "#ffe6e6" }}
                            onClick={() => handleDelete(product._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Creation / Update Modal Overlay */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "550px", width: "95%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "800" }}>
                {editMode ? "Modify Product Details" : "Create New Product"}
              </h2>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {(error || submitError) && (
              <div className="alert alert-danger" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertCircle size={18} />
                <span>{submitError || error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-name">Product Title</label>
                  <input
                    id="product-name"
                    type="text"
                    name="name"
                    placeholder="Enter product title"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="product-category">Category</label>
                  <input
                    id="product-category"
                    type="text"
                    name="category"
                    placeholder="Women / Ethnic / Electronics / Accessories"
                    className="form-input"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="product-price">Price (₹)</label>
                  <input
                    id="product-price"
                    type="number"
                    name="price"
                    placeholder="1999"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="product-stock">Stock Quantity</label>
                  <input
                    id="product-stock"
                    type="number"
                    name="stock"
                    placeholder="50"
                    className="form-input"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="product-desc">Description</label>
                <textarea
                  id="product-desc"
                  name="description"
                  placeholder="Summarize product features..."
                  className="form-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group" style={{ border: "1px dashed var(--secondary)", padding: "15px", borderRadius: "var(--radius-sm)", backgroundColor: "#fffbfa" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "10px", color: "var(--text-main)" }}>Product Image Resource</h4>

                <div className="form-group">
                  <label className="form-label" htmlFor="product-image-url">Provide Image URL (Preferred)</label>
                  <input
                    id="product-image-url"
                    type="text"
                    name="imageUrl"
                    placeholder="Paste unsplash or external image link"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    disabled={imageFile !== null}
                  />
                </div>

                <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", margin: "8px 0" }}>— OR —</div>

                <div className="form-group" style={{ marginBottom: "0" }}>
                  <label className="form-label" htmlFor="product-image-file">Upload Image File (Cloudinary)</label>
                  <input
                    id="product-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ fontSize: "13px" }}
                    disabled={formData.imageUrl !== ""}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "25px", borderTop: "1px solid var(--border-color)", paddingTop: "15px", justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                  Close
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Saving..." : editMode ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
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

export default AdminProducts;
