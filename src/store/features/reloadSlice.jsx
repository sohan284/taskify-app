import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadPage: false,
  resetTodos: false,
  reloadPage: false,
  resetTasks: false,
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
  },
});
export const { setReloadPage, setResetTodos } = reloadSlice.actions;
export default reloadSlice.reducer;
