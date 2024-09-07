// src/components/Dashboard.jsx
import axios from "axios";

// Define a function to fetch data
export const getDashboardCount = async () => {
  try {
    const response = await axios.get("http://localhost:5000/dashboardCount"); // Replace with your API endpoint
    return response.data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};
