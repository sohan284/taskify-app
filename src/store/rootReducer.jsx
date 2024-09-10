import { combineReducers } from "@reduxjs/toolkit";
import project from "./features/projectSlice";

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    project,
  });

  return combinedReducer(state, action);
};

export default createReducer;