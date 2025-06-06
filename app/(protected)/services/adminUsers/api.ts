import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const deleteUser = async (id: string,adminId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/auth/user/${adminId}/${id}`, {
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
export const updateUser = async (
  id: string,
  name?: string,
  email?: string,
  role?: string,
  permissions?: any
) => {
  try {
    const updatePayload: any = {};

    if (name !== undefined) updatePayload.name = name;
    if (email !== undefined) updatePayload.email = email;
    if (role !== undefined) updatePayload.role = role;
    if (permissions !== undefined) updatePayload.permissions = permissions;

    await axios.put(
      `${API_BASE_URL}/auth/update/${id}`,
      updatePayload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false };
  }
};


export const addApi = async (title: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api-management`,
      { title },
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


export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`, {
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