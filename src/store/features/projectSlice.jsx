import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  resetProjects: false,
};
const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setResetProjects: (state, action) => {
      state.resetProjects = action.payload;
    },
  },
});
export const { setResetProjects } = projectSlice.actions;
export default projectSlice.reducer;
