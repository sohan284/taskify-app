

import { configureStore } from "@reduxjs/toolkit";
import project from "./features/projectSlice";
import user from './features/userSlice'
const store = configureStore({
  reducer: {
    project: project,
    user:user,
  },
});
export default store;