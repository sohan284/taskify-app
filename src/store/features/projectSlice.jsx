import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadPages: false,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setReloadPages: (state, action) => {
      state.reloadPages = action.payload;
    },
  },
});
export const { setReloadPages } = projectSlice.actions;
export default projectSlice.reducer;
