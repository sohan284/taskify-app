import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { data } from "autoprefixer";
import axios from "axios";

const initialState = {
  reloadPage: false,
  filter: false,
  projects: [],
  gridView: false,
  loading: false,
  error: null,
};
export const fetchProjects = createAsyncThunk("data/fetchUsers", async () => {
  const response = await axios.get(
    "https://taskify-server-iota.vercel.app/projects"
  );
  return response.data;
});
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export const { setReloadPage, setFilter, setGridView } = projectSlice.actions;
export default projectSlice.reducer;
