import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deleteDevice = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/devices/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false };
  }
};

  





export const fetchDevices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/devices`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched api:", response.data.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};