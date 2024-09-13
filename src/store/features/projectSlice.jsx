import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadPage: false,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setReloadPage: (state, action) => {
      state.reloadPage = action.payload;
    },
  },
});
export const { setReloadPage } = projectSlice.actions;
export default projectSlice.reducer;
