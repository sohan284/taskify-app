import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createUser: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCreateUser: (state, action) => {
      state.createUser = action.payload;
    },
  },
});
export const { setCreateUser } = userSlice.actions;
export default userSlice.reducer;
