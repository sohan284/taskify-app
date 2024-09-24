import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createMeeting: false,
  meetings: null,
  reloadMeetings: false,
};
const meetingSlice = createSlice({
  name: "meeting",
  initialState,
  reducers: {
    setCreateMeeting: (state, action) => {
      state.createMeeting = action.payload;
    },
    setMeetings: (state, action) => {
      state.meetings = action.payload;
    },
    setReloadMeetings: (state, action) => {
      state.reloadMeetings = action.payload;
    },
  },
});
export const { setCreateMeeting, setMeetings, setReloadMeetings } =
  meetingSlice.actions;
export default meetingSlice.reducer;
