import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadPage: false,
  filter: false,
  gridView: false,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setReloadPage: (state, action) => {
      state.reloadPage = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setGridView: (state, action) => {
      state.gridView = action.payload;
    },
  },
});
export const { setReloadPage, setFilter, setGridView } = projectSlice.actions;
export default projectSlice.reducer;
