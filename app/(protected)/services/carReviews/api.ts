import axios from "axios";


export const uploadReviewImage = async (formData: {
  token:any
  type?:string
  title?: string;
  description:string;
  mobileFile?: File | null;
}) => {
  console.log(formData.token)
    
  try {
    const formDataSend = new FormData();
    formDataSend.append("title", formData.title || "");
    formDataSend.append("description",formData.description || "")
    formDataSend.append("type",formData.type || "")

    if (formData.mobileFile) {
      formDataSend.append("image", formData.mobileFile); 
    }

    const response = await axios.post(
      "http://localhost:5000/api/reviews",
      formDataSend,
      {
        headers: {
            "Authorization":`Bearer ${formData.token}`,
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

export const fetchReviewImages = async (token:any) => {
  try {
    const response = await axios.get("http://localhost:5000/api/reviews",{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return [];
  }
};

export const deleteReviewImage = async (id: string) => {
  try {
    const response = await axios.delete(`http://localhost:5000/api/reviews/${id}`, {
      method: "DELETE",
    });
    const data = await response.data;

    return { data };
  } catch (error) {
    console.error("Error deleting slider image:", error);
    return { success: false };
  }
};
export const updateReviewImage = async (
  id: string,
  editedData: { title?: string; description?: string; active?: boolean },
  mobileFile?: File | null,
  mobileUrl?: string | null,
) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    console.log(editedData)



    if (!mobileUrl) formDataSend.append("image", "empty");
    if (editedData.title) formDataSend.append("title", editedData.title);
    if (mobileFile) formDataSend.append("image", mobileFile);
    if (editedData.description)
      formDataSend.append("description", editedData.description);
    if (editedData.active !== undefined)
      formDataSend.append("active", String(editedData.active));

    const response = await axios.put(
      `http://localhost:5000/api/reviews/${id}`,
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



