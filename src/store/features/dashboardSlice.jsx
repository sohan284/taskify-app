import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reloadDashboard: true,
  filter: false,
  projects: null,
  gridView: false,
  loading: false,
  error: null,

  projectsCount: 0,
  tasksCount: 0,
  usersCount: 0,
  clientsCount: 0,

  chartDetails: [],
};
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setReloadDashboard: (state, action) => {
      state.reloadDashboard = action.payload;
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
    setProjectsCount: (state, action) => {
      state.projectsCount = action.payload;
    },
    setTasksCount: (state, action) => {
      state.tasksCount = action.payload;
    },
    setUsersCount: (state, action) => {
      state.usersCount = action.payload;
    },
    setClientsCount: (state, action) => {
      state.clientsCount = action.payload;
    },
    setChartDetails: (state, action) => {
      state.chartDetails = action.payload;
    },
  },
});
export const {
  setClientsCount,
  setProjectsCount,
  setFilter,
  setGridView,
  setTasksCount,
  setUsersCount,
  setProjects,
  setReloadDashboard,
  setChartDetails,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
