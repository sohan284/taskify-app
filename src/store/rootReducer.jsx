import { combineReducers } from "@reduxjs/toolkit";
import project from "./features/projectSlice";
import user from './features/userSlice'

const createReducer = () => (state, action) => {
  const combinedReducer = combineReducers({
    project,
    user,
  });

  return combinedReducer(state, action);
};

export default createReducer;