// src/features/dataSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch data
export const fetchData = createAsyncThunk("data/fetchData", async () => {
  const response = await axios.get(
    "https://taskify-server-iota.vercel.app/users"
  );
  return response.data;
});
export const fetchProjects = createAsyncThunk(
  "data/fetchProjects",
  async () => {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/projects"
    );
    return response.data;
  }
);
export const fetchStatuses = createAsyncThunk(
  "data/fetchStatuses",
  async () => {
    const response = await axios.get(
      "https://taskify-server-iota.vercel.app/statuses"
    );
    return response.data;
  }
);

const dataSlice = createSlice({
  name: "data",
  initialState: {
    data: [],
    projects: [],
    statuses: [],
    todos: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default dataSlice.reducer;
