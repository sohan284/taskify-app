

import { configureStore } from "@reduxjs/toolkit";
import reload from "./features/reloadSlice";
import user from './features/userSlice'
const store = configureStore({
  reducer: {
    reload: reload,
    user:user,
  },
});
export default store;