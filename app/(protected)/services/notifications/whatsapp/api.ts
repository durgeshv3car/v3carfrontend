import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";


export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getallnotifications?type=whatsapp`, {
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};
