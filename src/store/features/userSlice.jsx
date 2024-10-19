import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createUser: false,
  users: null,
  reloadUsers: false,
  userRole: null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCreateUser: (state, action) => {
      state.createUser = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setReloadUsers: (state, action) => {
      state.reloadUsers = action.payload;
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
});
export const { setCreateUser, setUsers, setReloadUsers, setUserRole } =
  userSlice.actions;
export default userSlice.reducer;
