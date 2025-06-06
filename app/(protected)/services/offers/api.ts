import { redirect } from './../../../../i18n/routing';
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const fetchOffers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/offer/offer`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.offers || [];
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
};

export const updateOffer = async (
  id: string,
  type: string,
  editedData: any,
  mobileFile?: File,
  webFile?: File,
  bannerFile?:File,
  brandLogoFile?: File,
  mobileUrl?: string | null,
  webUrl?: string | null,
  bannerUrl?: string | null,
  logoUrl?: string | null,
) => {
  if (!id) return { success: false, message: "ID is required" };

  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", type);
    if (!mobileUrl) formDataSend.append("mobileUrl", "empty");
    if (!webUrl) formDataSend.append("webUrl","empty");
    if (!bannerUrl) formDataSend.append("bannerUrl", "empty");
    if (!logoUrl) formDataSend.append("logoUrl", "empty");

    if (editedData.title) formDataSend.append("title", editedData.title);
    if (editedData.buttonType) formDataSend.append("buttonType", editedData.buttonType);
    if (editedData.brandName) formDataSend.append("brandName", editedData.brandName);
    if (editedData.category) formDataSend.append("category", editedData.category);
    if (editedData.description)
      formDataSend.append("description", editedData.description);
    if (editedData.detailDescription) formDataSend.append("detailDescription", editedData.detailDescription);
    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (bannerFile) formDataSend.append("banner", bannerFile);
    if (brandLogoFile) formDataSend.append("brandLogo", brandLogoFile);
   
    if (editedData.redirectUrl)
      formDataSend.append("redirectUrl", editedData.redirectUrl);
    if (editedData.isActive !== undefined)
      formDataSend.append("isActive", editedData.isActive);
    if (editedData.isHome !== undefined)
      formDataSend.append("isHome", editedData.isHome);

    await axios.put(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, message: "Offer updated successfully" };
  } catch (error) {
    console.error("Error updating offer:", error);
    return { success: false, message: "Failed to update offer" };
  }
};

export const addOffer = async (
  type: string,
  dimensions: any,
  formData: any,
  mobileFile?: File,
  webFile?: File,
  bannerFile?: File,
  brandLogoFile?: File,
) => {
  try {
    
    const formDataSend = new FormData();
    formDataSend.append("type", type);
    formDataSend.append("dimensions", JSON.stringify(dimensions));
    formDataSend.append("title", formData["Title"] || "");
    formDataSend.append("description", formData["Description"] || "");
    formDataSend.append("category", formData["Category Name"] || "");
    formDataSend.append("buttonType", formData["Button Name"] || "");
    formDataSend.append("detailDescription", formData.fieldDescription || "");
    formDataSend.append("brandName", formData["Brand Name"] || "");

    if (mobileFile) formDataSend.append("mobile", mobileFile);
    if (webFile) formDataSend.append("web", webFile);
    if (brandLogoFile) formDataSend.append("brandLogo", brandLogoFile);
    if (bannerFile) formDataSend.append("banner", bannerFile);
   

    formDataSend.append("redirectUrl", formData["Company URL"] || "");

    const response = await axios.post(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: "Recommended image added",
      data: response.data,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: "Recommended image not added" };
  }
};

export const toggleOfferStatus = async (id: string, isActive: boolean) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", "offer");
    formDataSend.append("isActive", String(isActive));

    await axios.put(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: `Recommendedit ${isActive ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Error updating isActive:", error);
    return { success: false, message: "Failed to update status" };
  }
};
export const toggleHomeStatus = async (id: string, isHome: boolean) => {
  try {
    const formDataSend = new FormData();
    formDataSend.append("id", id);
    formDataSend.append("type", "offer");
    formDataSend.append("isHome", String(isHome));

    await axios.put(`${API_BASE_URL}/offers`, formDataSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      success: true,
      message: `Recommend ${isHome ? "activated" : "deactivated"} successfully`,
    };
  } catch (error) {
    console.error("Error updating isActive:", error);
    return { success: false, message: "Failed to update status" };
  }
};


export const deleteOffer = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/offers/${id}`, {
      headers: { "Content-Type": "application/json" },
    });

    return { success: true, message: "Recommended data deleted" };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, message: "Recommended data not deleted" };
  }
};
