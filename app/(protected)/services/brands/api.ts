import axios from "axios";
export const uploadBrandsImage = async (formData: {
  description: string;
  name?: string;
  mobileFile?: File | null;
}) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("description", formData.description);
    formDataSend.append("name", formData.name || "");

    if (formData.mobileFile) {
      formDataSend.append("image", formData.mobileFile); 
    }

    const response = await axios.post(
      "http://localhost:5000/api/brands",
      formDataSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { data: response.data };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false };
  }
};

export const fetchBrandsImages = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/brands");

    return response.data.brands;
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
};

export const deleteBrandsImage = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/brands/${id}`, {
      method: "DELETE",
    });
    const data = await response.data;

    return { data };
  } catch (error) {
    console.error("Error deleting slider image:", error);
    return { success: false };
  }
};

export const updateBrandsImage = async (
  id: string,
  editedData: { name?: string; description?: string; active?: boolean },
  mobileFile?: File | null,
  mobileUrl?: string | null,
) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    console.log(editedData)



    if (!mobileUrl) formDataSend.append("image", "empty");
    if (editedData.name) formDataSend.append("name", editedData.name);
    if (mobileFile) formDataSend.append("image", mobileFile);
    if (editedData.description)
      formDataSend.append("description", editedData.description);
    if (editedData.active !== undefined)
      formDataSend.append("active", String(editedData.active));

    const response = await axios.put(
      `http://localhost:5000/api/brands/${id}`,
      formDataSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating slider image:", error);
    return { success: false };
  }
};

