import { createSlice } from "@reduxjs/toolkit";

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const initialState = {
  cartItems: cartItemsFromStorage,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // expects { product: id, name, price, imageUrl, qty, stock }
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product
            ? { ...x, quantity: Math.min(x.stock, x.quantity + (item.quantity || 1)) }
            : x
        );
      } else {
        state.cartItems.push({
          product: item.product,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: item.quantity || 1,
          stock: item.stock,
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    updateQuantity: (state, action) => {
      const { product, quantity } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x.product === product ? { ...x, quantity: Math.max(1, Math.min(x.stock, quantity)) } : x
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
