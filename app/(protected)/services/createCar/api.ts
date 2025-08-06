import { data } from "./../../../../components/partials/auth/components/data";
import axios from "axios";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface CarVariantData {
  fuel: string;
  transmission: string;
  mileage: {
    city: number;
    highway: number;
  };
  price: number;
  description: string;
  specifications: string;
}

interface CarFormData {
  fuelType: string[];
  transmissions: string[];
  mileage: string;
  priceRange: string;
  description: string;
  engine: string;
  seatCapacity: string;
  bodyType: string;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
    wheelbase?: number;
  };
}


export const addCar = async (formData: any, type: string, mobileFile?: { file: File }) => {
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
    data.append("brandId", formData.Brand);
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
      data.append("image", mobileFile?.file);
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

export const deleteVariantDetail = async (carId: string, variantId: string, detailId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}/detail/${detailId}`
    );
    // Update state or refetch data
    return response;
  } catch (error) {
    console.error("Error deleting detail:", error);
    throw error;
  }
};

export const deleteVariant = async (carId: string, variantId: string) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}`
    );
    // Update state or refetch data
    return response;
  } catch (error) {
    console.error("Error deleting detail:", error);
    throw error;
  }
};
export const deleteCar = async (carId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cars/${carId}`);
    // Update state or refetch data
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error deleting detail:", error);
    throw error;
  }
};

export const updateCarVariantName = async (name: string, carId: string, variantId: string) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}`,
      { name }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating variant name:", error);
    throw error;
  }
};

export const updateCarVariant = async (data: CarVariantData, carId: string, variantId: string, detailId: string) => {
  try {
    const updateData = {
      fuel: data.fuel,
      transmission: data.transmission,
      mileage: data.mileage,
      price: data.price,
      description: data.description,
      specifications: data.specifications,
    };
    const response = await axios.put(
      `${API_BASE_URL}/cars/${carId}/variant/${variantId}/detail/${detailId}`,
      {
        updateData
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating variant details:", error);
    throw error;
  }
};
export const updateCar = async (carId: string, data: Partial<CarFormData>, mobileFile?: { file: File }) => {
  try {
    const formData = new FormData();

    if (data.fuelType) formData.append("fuelType", JSON.stringify(data.fuelType));
    if (data.transmissions) formData.append("transmissions", JSON.stringify(data.transmissions));
    if (data.mileage) formData.append("mileage", data.mileage);
    if (data.priceRange) formData.append("priceRange", data.priceRange);
    if (data.description) formData.append("description", data.description);
    if (data.engine) formData.append("engine", data.engine);
    if (data.seatCapacity) formData.append("seatCapacity", data.seatCapacity);
    if (data.bodyType) formData.append("bodyType", data.bodyType);
    if (data.dimensions) formData.append("dimensions", JSON.stringify(data.dimensions));
    if (mobileFile?.file) formData.append("image", mobileFile.file);

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


