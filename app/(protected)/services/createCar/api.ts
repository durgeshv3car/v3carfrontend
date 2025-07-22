import { data } from "./../../../../components/partials/auth/components/data";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


export const addCar = async (formData: any, mobileFile: File, type: string) => {
  try {
    let dimensions = {};

    if (formData.Dimensions) {
      const data = formData.Dimensions.split("X");

      if (data.length === 4) {
        dimensions = {
          length: parseInt(data[0], 10),
          width: parseInt(data[1], 10),
          height: parseInt(data[2], 10),
          wheelbase: parseInt(data[3], 10),
        };
      }
    }

    const data = new FormData();
    data.append("brand", formData.Brand);
    data.append("model", formData.Model);
    data.append("bodyType",formData["Body Type"]);
    data.append("pageType", type);
    data.append("fuelType", JSON.stringify(formData["Fuel Type"]));
    data.append("transmissions", JSON.stringify(formData["Transmission"]));
    data.append("mileage", formData.Mileage);
    data.append("engine", formData.Engine);
    data.append("seatCapacity", formData["Seat Capacity"]);
    data.append("priceRange", formData["Price Range"]);
    data.append("description", formData.Description);
    data.append("dimensions", JSON.stringify(dimensions));

    if (mobileFile) {
      data.append("image", mobileFile.file);
    }

    const response = await axios.post(`${API_BASE_URL}/cars/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true, response };
  } catch (error) {
    console.error("Error adding car:", error);
    return { success: false };
  }
};

export const addVariant = async (carId: string, name: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cars/variant/${carId}`,
      { name },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, response };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
};
export const addVariantDetails = async (
  details: any,
  carId: string,
  name: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cars/variant/detail/${carId}`,
      {
        variantName: name,
        price: details.price,
        fuel: details.fuel,
        transmission: details.transmission,
        mileage: details.mileage,
        description: details.description,
        specifications: details.specifications || {},
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return { success: true, response };
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
};

export const fetchCar = async (type: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/cars/fetch?pageType=${type}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    return { success: false };
  }
};

export const deleteVariantDetail = async (carId, variantId, detailId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}/detail/${detailId}`
    );
    // Update state or refetch data
    return response
  } catch (error) {
    console.error("Error deleting detail:", error);
  }
};

export const deleteVariant = async (carId, variantId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}`
    );
    // Update state or refetch data
    return response
  } catch (error) {
    console.error("Error deleting detail:", error);
  }
};
export const deleteCar = async (carId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cars/${carId}`);
    // Update state or refetch data
    console.log(response);
    return response
  } catch (error) {
    console.error("Error deleting detail:", error);
  }
};

export const updateCarVariantName = async (name, carId, variantId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}`,
      { name }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating variant name:", error); // ✅ correct log
    throw error;
  }
};

export const updateCarVariant = async (data, carId, variantId, detailId) => {
  try {
    const updateData={
        fuel: data.fuel,
        transmission: data.transmission,
        mileage: data.mileage,
        price: data.price,
        description: data.description,
        specifications: data.specifications,
    }
    const response = await axios.put(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}/detail/${detailId}`,
      {
        updateData
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating variant name:", error); // ✅ correct log
    throw error;
  }
};
export const updateCar = async (carId, data, mobileFile,preview) => {
  try {
    const formData = new FormData();

    formData.append("fuelType", JSON.stringify(data.fuelType));
    formData.append("transmissions", JSON.stringify(data.transmissions));
    formData.append("mileage", data.mileage);
    formData.append("priceRange", data.priceRange);
    formData.append("description", data.description);
    formData.append("engine", data.engine);
    formData.append("seatCapacity", data.seatCapacity);
    formData.append("bodyType", data.bodyType);
    formData.append("dimensions", JSON.stringify(data.dimensions));
    if (mobileFile?.file){
      formData.append("image",mobileFile.file)
    }
   
    

    const response = await axios.put(`${API_BASE_URL}/cars/${carId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating car:", error);
    throw error;
  }
};


