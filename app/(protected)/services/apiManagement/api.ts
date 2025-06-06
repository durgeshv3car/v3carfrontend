import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deleteAPi = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/api-management/${id}`, {
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
export const updateApi = async (id: string, name?: string, isActive?: boolean) => {
    try {
      const updatePayload: any = {};
  
      if (name !== undefined) updatePayload.name = name;
      if (isActive !== undefined) updatePayload.isActive = String(isActive);
  
  
      await axios.put(`${API_BASE_URL}/api-management/${id}`, updatePayload, {
        headers: { "Content-Type": "application/json" },
      });
  
      return { success: true };
    } catch (error) {
      console.error("Error updating category:", error);
      return { success: false };
    }
  };
  


export const addApi = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api-management`,
      { name },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
};


export const fetchApis = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api-management`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched api:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};