import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  success: false, // Used for tracking successful admin modifications
};

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch product details");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create product (Admin)
export const createProduct = createAsyncThunk(
  "products/create",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
      };
      
      let body;
      if (formData instanceof FormData) {
        body = formData; // Browser sets boundary automatically for FormData
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(formData);
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create product");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update product (Admin)
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const headers = {
        Authorization: `Bearer ${userInfo.token}`,
      };
      
      let body;
      if (formData instanceof FormData) {
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(formData);
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers,
        body,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product (Admin)
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.error = null;
      state.success = false;
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
