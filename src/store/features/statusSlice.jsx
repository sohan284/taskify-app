// Inside your Redux slice (e.g., `projectSlice.js`)
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statuses: null,
  reloadStatuses: false,
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setStatuses(state, action) {
      state.statuses = action.payload;
    },
    setReloadStatuses(state, action) {
      state.reloadStatuses = action.payload;
    },
  },
});

export const { setStatuses, setReloadStatuses } = statusSlice.actions;
export default statusSlice.reducer;
