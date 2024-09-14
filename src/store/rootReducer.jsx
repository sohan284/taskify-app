import { combineReducers } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import user from './features/userSlice'
import project from './features/projectSlice'

const createReducer = () => (state, action) => {
  const combinedReducer = combineReducers({
    reload,
    user,
    project,
  });

  return combinedReducer(state, action);
};

export default createReducer;