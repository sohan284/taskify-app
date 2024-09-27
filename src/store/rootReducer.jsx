import { combineReducers } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import dashboard from "./features/dashboardSlice";
import user from "./features/userSlice";
import project from "./features/projectSlice";
import task from "./features/taskSlice";
import data from "./features/dataSlice";
import todo from "./features/todoSlice";
import client from "./features/clientSlice";
import status from "./features/statusSlice";
import meeting from "./features/meetingSlice";
import priority from "./features/prioritySlice";

const createReducer = () => (state, action) => {
  const combinedReducer = combineReducers({
    reload,
    dashboard,
    user,
    project,
    task,
    data,
    todo,
    client,
    status,
    meeting,
    priority,
  });

  return combinedReducer(state, action);
};

export default createReducer;
