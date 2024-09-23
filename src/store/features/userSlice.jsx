import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createUser: false,
  users: null,
  reloadUser: false,
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
  },
});
export const { setCreateUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
