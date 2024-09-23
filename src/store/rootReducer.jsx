import { combineReducers } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import user from "./features/userSlice";
import project from "./features/projectSlice";
import data from "./features/dataSlice";
import todo from "./features/todoSlice";

const createReducer = () => (state, action) => {
  const combinedReducer = combineReducers({
    reload,
    user,
    project,
    data,
    todo,
  });

  return combinedReducer(state, action);
};

export default createReducer;
