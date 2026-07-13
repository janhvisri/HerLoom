import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  success: false,
};

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create order");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get current user's orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const res = await fetch("/api/orders/my", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const res = await fetch("/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update order status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const { auth: { userInfo } } = getState();
      const res = await fetch(`/api/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }
      return data.order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.success = false;
      state.error = null;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.success = true;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User's Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? { ...o, status: action.payload.status } : o
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
