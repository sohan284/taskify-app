import { combineReducers } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import user from './features/userSlice'

const createReducer = () => (state, action) => {
  const combinedReducer = combineReducers({
    reload,
    user,
  });

  return combinedReducer(state, action);
};

export default createReducer;