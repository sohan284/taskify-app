import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadPage: false,
  resetTodos: false,
  resetTasks: false,
  pendingTodos: 0,
};
const reloadSlice = createSlice({
  name: "reload",
  initialState,
  reducers: {
    setReloadPage: (state, action) => {
      state.reloadPage = action.payload;
    },
    setResetTodos: (state, action) => {
      state.resetTodos = action.payload;
    },
    setPendingTodos: (state, action) => {
      state.pendingTodos = action.payload;
    },
  },
});
export const { setReloadPage, setResetTodos, setPendingTodos } =
  reloadSlice.actions;
export default reloadSlice.reducer;
