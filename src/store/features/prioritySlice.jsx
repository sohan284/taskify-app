// Inside your Redux slice (e.g., `projectSlice.js`)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  priorities: null,
  reloadPriorities: false,
};

const prioritySlice = createSlice({
  name: "priority",
  initialState,
  reducers: {
    setPriorities(state, action) {
      state.priorities = action.payload;
    },
    setReloadPriorities(state, action) {
      state.reloadPriorities = action.payload;
    },
  },
});

export const { setPriorities, setReloadPriorities } = prioritySlice.actions;
export default prioritySlice.reducer;
