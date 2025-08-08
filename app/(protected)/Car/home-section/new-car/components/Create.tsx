"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { MultiSelect } from "primereact/multiselect";
import TextEditor from "../../../components/SunEditor";

import {
  addCar,
  addVariant,
  addVariantDetails,
} from "@/app/(protected)/services/createCar/api";
import { fetchBrandsImages } from "@/app/(protected)/services/brands/api";

interface FileWithPreview {
  preview: string;
  file: File;
}

interface CarFormData extends Record<string, string | string[] | undefined> {
  Brand: string;
  Model: string;
  "Body Type": string;
  "Fuel Type": string[];
  Transmission: string[];
  Mileage: string;
  Engine: string;
  "Seat Capacity": string;
  "Price Range": string;
  Description: string;
  Dimensions: string;
  Image?: string;
}

type FormValue = string | string[] | undefined;

interface VariantDetail {
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

interface CreateModalProps {
  onClose: () => void;
  columnsField: string[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}

const CreateModal: React.FC<CreateModalProps> = ({
  onClose,
  columnsField,
  setRefresh,
  type,
}) => {
  const [carId, setCarId] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CarFormData>>({});

  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);

  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState("");
  const [variantDetails, setVariantDetails] = useState<
    Record<string, VariantDetail>
  >({});
  const [brands, setBrands] = useState<{ _id: string; name: string }[]>([]);

  const fetchData = async () => {
    try {
      const result = await fetchBrandsImages();
      setBrands(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Logo_DIMENSIONS = { width: 150 * 2, height: 150 * 2 };
  const WEB_DIMENSIONS = { width: 1920, height: 970 };
  const MOBILE_DIMENSIONS = { width: 150 * 2, height: 150 * 2 };
  const dimensions = {
    web: WEB_DIMENSIONS,
    mobile: MOBILE_DIMENSIONS,
  };
  useEffect(() => {
    if (columnsField.length > 0) {
      const filteredColumns = columnsField.slice(1);
      const initialData = filteredColumns.reduce((acc, column) => {
        if (column !== "ID" && column !== "Action") {
          const key = column.toLowerCase();
          if (key === "fuel type" || key === "transmission") {
            acc[column] = []; // <-- initialize as array
          } else {
            acc[column] = "";
          }
        }
        return acc;
      }, {} as Record<string, string | string[]>);
      setFormData(initialData);
    }
  }, [columnsField]);

  const handleClose = () => {
    onClose();
    setStep(1);
    setVariants([]);
    setVariantDetails({});
    setMobileFile(null);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const getInputValue = (key: string): string => {
    const value = formData[key];
    return typeof value === "string" ? value : "";
  };

  const getMultiSelectValue = (key: string): string[] => {
    const value = formData[key];
    return Array.isArray(value) ? value : [];
  };

  const handleStep1 = async () => {
    try {
      console.log(formData);
      const fileData = mobileFile ? { file: mobileFile.file } : undefined;
      const response = await addCar(formData as CarFormData, type, fileData);
      if (response?.response?.data?._id) {
        setCarId(response.response.data._id);
        refreshData();
      } else {
        throw new Error("Failed to create car");
      }
    } catch (error) {
      console.error("Error creating car:", error);
      // You might want to show a toast message here
    }
  };

  const handleStep2 = async (key: string) => {
    try {
      if (!carId) throw new Error("Car ID not found");
      const response = await addVariant(carId, key);
      if (response?.success) {
        refreshData();
      } else {
        throw new Error("Failed to add variant");
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      // You might want to show a toast message here
    }
  };

  const handleNext = async () => {
    try {
      if (step === 1) {
        await handleStep1();
        setStep(2);
      } else if (step === 2) {
        const keyValue = Object.keys(variantDetails);
        for (const key of keyValue) {
          await handleStep2(key);
        }
        setStep(3);
      } else {
        const keyValue = Object.keys(variantDetails);
        for (const key of keyValue) {
          await handleStep3(key);
        }
        handleClose();
        refreshData();
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      // You might want to show a toast message here
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddVariant = () => {
    if (variantInput.trim()) {
      setVariants((prev) => [...prev, variantInput.trim()]);
      setVariantDetails((prev) => ({
        ...prev,
        [variantInput.trim()]: {
          fuel: "",
          transmission: "",
          mileage: { city: 0, highway: 0 },
          price: 0,
          description: "",
          specifications: "",
        },
      }));
      setVariantInput("");
    }
  };

  const handleDetailChange = (variant: string, key: string, value: any) => {
    setVariantDetails((prev) => ({
      ...prev,
      [variant]: {
        ...prev[variant],
        [key]:
          key === "mileage" ? { ...prev[variant]?.mileage, ...value } : value,
      },
    }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const handleStep3 = async (key: string) => {
    try {
      if (!carId) throw new Error("Car ID not found");
      const detail = variantDetails[key];
      if (!detail) throw new Error("Variant details not found");

      const response = await addVariantDetails(detail, carId, key);
      if (response?.success) {
        handleClose();
        refreshData();
      } else {
        throw new Error("Failed to add variant details");
      }
    } catch (error) {
      console.error("Error adding variant details:", error);
      // You might want to show a toast message here
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {step === 1
              ? "Create New Entry"
              : step === 2
              ? "Add Variants"
              : "Add Variant Details"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3">
          {step === 1 &&
            Object.keys(formData).map((key) => {
              const lowerKey = key.toLowerCase();
              if (["isActive", "Variants"].includes(key)) {
                return null;
              }

              return (
                <div key={key} className="mb-3">
                  <label className="block text-sm font-medium mb-1">
                    {key}
                  </label>

                  {["fuel type", "transmission"].includes(lowerKey) ? (
                    <MultiSelect
                      name={key}
                      value={getMultiSelectValue(key)}
                      options={
                        lowerKey === "fuel type"
                          ? [
                              { label: "Petrol", value: "Petrol" },
                              { label: "Diesel", value: "Diesel" },
                              { label: "Electric", value: "Electric" },
                              { label: "Hybrid", value: "Hybrid" },
                              { label: "CNG", value: "CNG" },
                              { label: "LPG", value: "LPG" },
                            ]
                          : [
                              { label: "Manual", value: "Manual" },
                              { label: "Automatic", value: "Automatic" },
                            ]
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.value,
                        }))
                      }
                      display="chip"
                      className="w-full"
                      placeholder="Select Options"
                    />
                  ) : lowerKey === "brand" ? (
                    <select
                      value={formData[key] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="w-full border px-2 py-2 rounded"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  ) : lowerKey === "image" ? (
                    <ImageUpload
                      files={mobileFile ? [mobileFile] : []}
                      setFiles={(files: FileWithPreview[]) =>
                        setMobileFile(files[0] || null)
                      }
                      label="Logo"
                    />
                  ) : lowerKey === "description" ? (
                    <TextEditor
                      value={getInputValue(key)}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          [key]: val,
                        }))
                      }
                    />
                  ) : (
                    <Input
                      name={key}
                      value={getInputValue(key)}
                      onChange={onInputChange}
                      className="w-full"
                    />
                  )}
                </div>
              );
            })}

          {step === 2 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Variant Name
              </label>
              <div className="flex gap-2">
                <Input
                  value={variantInput}
                  onChange={(e) => setVariantInput(e.target.value)}
                />
                <Button onClick={handleAddVariant}>Add</Button>
              </div>

              <ul className="mt-2 space-y-2">
                {variants.map((v) => (
                  <li
                    key={v}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>{v}</span>
                    <Button
                      variant="shadow"
                      size="sm"
                      onClick={() => {
                        setVariants((prev) =>
                          prev.filter((item) => item !== v)
                        );
                        setVariantDetails((prev) => {
                          const updated = { ...prev };
                          delete updated[v];
                          return updated;
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant} className="border p-3 rounded space-y-3">
                  <h3 className="font-medium">{variant}</h3>

                  <div>
                    <label className="text-sm capitalize">Fuel</label>
                    <Input
                      value={variantDetails[variant]?.fuel || ""}
                      onChange={(e) =>
                        handleDetailChange(variant, "fuel", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm capitalize">Transmission</label>
                    <Input
                      value={variantDetails[variant]?.transmission || ""}
                      onChange={(e) =>
                        handleDetailChange(
                          variant,
                          "transmission",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm capitalize">Mileage (City)</label>
                    <Input
                      type="number"
                      value={variantDetails[variant]?.mileage?.city || ""}
                      onChange={(e) =>
                        handleDetailChange(variant, "mileage", {
                          city: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm capitalize">
                      Mileage (Highway)
                    </label>
                    <Input
                      type="number"
                      value={variantDetails[variant]?.mileage?.highway || ""}
                      onChange={(e) =>
                        handleDetailChange(variant, "mileage", {
                          highway: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm capitalize">Price</label>
                    <Input
                      type="number"
                      value={variantDetails[variant]?.price || ""}
                      onChange={(e) =>
                        handleDetailChange(
                          variant,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm capitalize">Description</label>

                    <TextEditor
                      value={variantDetails[variant]?.description || ""}
                      onChange={(value) =>
                        handleDetailChange(variant, "description", value)
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm capitalize">Specifications</label>
                    <Input
                      value={variantDetails[variant]?.specifications || ""}
                      onChange={(e) =>
                        handleDetailChange(
                          variant,
                          "specifications",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button onClick={handleNext}>
            {step === 3 ? "Save Data" : "Save & Next"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
