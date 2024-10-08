import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadProjects: false,
  filter: false,
  projects: null,
  gridView: false,
  loading: false,
  error: null,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setReloadProjects: (state, action) => {
      state.reloadProjects = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setGridView: (state, action) => {
      state.gridView = action.payload;
    },
    setProjects: (state, action) => {
      state.projects = action.payload;
    },
  },
});
export const { setReloadProjects, setFilter, setGridView, setProjects } =
  projectSlice.actions;
export default projectSlice.reducer;
