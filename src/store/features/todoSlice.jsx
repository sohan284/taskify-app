// Inside your Redux slice (e.g., `projectSlice.js`)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: null,
  reloadTodos: false,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setTodos(state, action) {
      state.todos = action.payload;
    },
    setReloadTodos(state, action) {
      state.reloadTodos = action.payload;
    },
  },
});

export const { setTodos, setReloadTodos } = todoSlice.actions;
export default todoSlice.reducer;
