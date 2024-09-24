import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadTasks: false,
  filter: false,
  tasks: null,
  gridView: false,
  loading: false,
  error: null,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setReloadTasks: (state, action) => {
      state.reloadTasks = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setGridView: (state, action) => {
      state.gridView = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});
export const { setReloadTasks, setFilter, setGridView, setTasks } =
  projectSlice.actions;
export default projectSlice.reducer;
