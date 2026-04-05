import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  role: "admin",
  filter: "all",
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    deleteTransaction(state, action) {
      state.transactions = state.transactions.filter(
        (t) => String(t.id) !== String(action.payload),
      );
    },
    editTransaction(state, action) {
      const idx = state.transactions.findIndex(
        (t) => String(t.id) === String(action.payload.id),
      );
      if (idx !== -1) state.transactions[idx] = action.payload;
    },
  },
});

export const {
  addTransaction,
  setRole,
  setFilter,
  setTransactions,
  deleteTransaction,
  editTransaction,
} = transactionSlice.actions;
export default transactionSlice.reducer;
