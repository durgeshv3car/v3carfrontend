import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deletecompanyUrl = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/credit-score-url/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting companyUrl:", error);
    return { success: false };
  }
};

export const updatecompanyUrl = async (id: string, companyUrl: string) => {
  try {
    await axios.put(
      `${API_BASE_URL}/credit-score-url/${id}`,
      { companyUrl },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating companyUrl:", error);
    return { success: false };
  }
};


export const addcompanyUrl = async (companyUrl: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/credit-score-url`,
      { companyUrl },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error adding companyUrl:", error);
    return { success: false };
  }
};


export const fetchcompanyUrl = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-score-url`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Fetched categories:", response.data);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};