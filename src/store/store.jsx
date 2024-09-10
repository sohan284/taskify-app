
import rootReducer from "./rootReducer";
import { configureStore } from "@reduxjs/toolkit";
import project from "./features/projectSlice";
const store = configureStore({
  reducer: {
    project: project,
  },
});
export default store;