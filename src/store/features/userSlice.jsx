import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createUser: false,
  users: null,
  reloadUsers: false,
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
  },
});
export const { setCreateUser, setUsers, setReloadUsers } = userSlice.actions;
export default userSlice.reducer;
