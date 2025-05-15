import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";





export const fetchLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logs`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched user:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};