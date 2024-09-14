import { configureStore } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import user from "./features/userSlice";
import project from "./features/projectSlice";
const store = configureStore({
  reducer: {
    reload: reload,
    user: user,
    project: project,
  },
});
export default store;
