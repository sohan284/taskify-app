import axios from "axios";

const createMeeting = async (meetingData) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/meetings`,
      meetingData
    );
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error creating the meeting:", error);
    throw error;
  }
};
const getMeetingList = async (
  status = "",
  user = "",
  client = "",
  start_date_from = "",
  start_date_to = "",
  end_date_from = "",
  end_date_to = "",
  search = ""
) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/meetings?status=${status}&user=${user}&client=${client}&start_date_from=${start_date_from}&start_date_to=${start_date_to}&end_date_from=${end_date_from}&end_date_to=${end_date_to}&search=${search}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch meeting list:", error);
    throw error;
  }
};
const updateMeeting = async (id, data) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/meetings/${id}`,
      data
    ); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update meeting list:", error);
    throw error;
  }
};
const deleteMeeting = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:5000/meetings/${id}`); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to update meeting list:", error);
    throw error;
  }
};
const updateMeetingstatus = async (meetingId, status) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/meetings/${meetingId}`,
      { status }
    );
    if (response.data.success) {
      console.log("Meeting status updated successfully");
    } else {
      console.error("Failed to update meeting status:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating meeting status:", error);
  }
};

const updateMeetingFavourite = async (meetingId, favourite) => {
  try {
    const response = await axios.put(
      `http://localhost:5000/meetings/${meetingId}`,
      { favourite }
    );
    if (response.data.success) {
      console.log("Meeting updated successfully");
    } else {
      console.error("Failed to update meeting:", response.data.message);
    }
  } catch (error) {
    console.error("Error updating meeting :", error);
  }
};

// Attach the functions to an object
const MeetingManagement = {
  getMeetingList,
  updateMeeting,
  deleteMeeting,
  updateMeetingstatus,
  createMeeting,
  updateMeetingFavourite,
};

// Export the object
export default MeetingManagement;
