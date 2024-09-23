import { configureStore } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import user from "./features/userSlice";
import project from "./features/projectSlice";
import data from './features/dataSlice'
import todo from './features/todoSlice'
const store = configureStore({
  reducer: {
    reload: reload,
    user: user,
    project: project,
    data : data,
    todo:todo,
  },
});
export default store;
