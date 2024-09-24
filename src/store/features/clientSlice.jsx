import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: null,
  reloadClients: false,
};
const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    setReloadClients: (state, action) => {
      state.reloadClients = action.payload;
    },
  },
});
export const { setClients, setReloadClients } = clientSlice.actions;
export default clientSlice.reducer;
