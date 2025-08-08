import axios from "axios";

export const uploadSliderImage = async (formData: {
  carUrl?:string
  name?: string;
  mobileFile?: File | null;
}) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("name", formData.name || "");
    formDataSend.append("carUrl",formData.carUrl || "")

    if (formData.mobileFile) {
      formDataSend.append("image", formData.mobileFile); // 'image' must match multer field name
    }

    const response = await axios.post(
      "http://localhost:5000/api/banners/create",
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

export const fetchSliderImages = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/banners/all");

    return response.data;
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
};

export const deleteSliderImage = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/banners/${id}`, {
      method: "DELETE",
    });
    const data = await response.data;

    return { data };
  } catch (error) {
    console.error("Error deleting slider image:", error);
    return { success: false };
  }
};
export const updateSliderImage = async (
  id: string,
  editedData: { name?: string; carUrl?: string; active?: boolean },
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
    if (editedData.carUrl)
      formDataSend.append("carUrl", editedData.carUrl);
    if (editedData.active !== undefined)
      formDataSend.append("active", String(editedData.active));

    const response = await axios.put(
      `http://localhost:5000/api/banners/${id}`,
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



