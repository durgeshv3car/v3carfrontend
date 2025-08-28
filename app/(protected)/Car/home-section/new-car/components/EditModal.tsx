"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import TextEditor from "../../../components/SunEditor";
import { MultiSelectShadcn } from "./MultiSelectShadcn";
import {
  addVariant,
  addVariantDetails,
  updateCar,
} from "@/app/(protected)/services/createCar/api";
import type { FileWithPreview } from "../../../components/ImageUpload";
import { MultiSelect } from "primereact/multiselect";
import { fetchBrandsImages } from "@/app/(protected)/services/brands/api";

interface TableRow {
  id: string;
  _id?: string;
  title?: string;
  imageUrl?: string;
  mobileUrl?: string;
  webUrl?: string;
  active?: boolean;
  dimensions?: Record<string, any>;
  fueltype?: string[];
  transmissions?: string[];
  [key: string]: any;
}

interface EditModalProps {
  id: string | null;
  onClose: () => void;
  tableData: TableRow[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

interface VariantDetails {
  fuel: string;
  transmission: string;
  mileage: { city: number; highway: number };
  price: number;
  description: string;
  specifications: string;
}

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
}) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<TableRow>>({});
  const [step, setStep] = useState(1);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);

  // New state for variant management
  const [variants, setVariants] = useState<string[]>([]);
  const [variantInput, setVariantInput] = useState("");
  const [variantDetails, setVariantDetails] = useState<
    Record<string, VariantDetails>
  >({});
  const [carId, setCarId] = useState<string>("");
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

  const LOGO_DIMENSIONS = { width: 150 * 2, height: 150 * 2 };
  const WEB_DIMENSIONS = { width: 1920, height: 970 };
  const MOBILE_DIMENSIONS = { width: 150 * 2, height: 150 * 2 };
  const dimensions = {
    web: WEB_DIMENSIONS,
    mobile: MOBILE_DIMENSIONS,
  };

  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row._id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});
      setCarId(foundRow?._id || "");

      if (foundRow?.image) {
        setMobileFile({ preview: foundRow.image } as FileWithPreview);
      }
    }
  }, [id, tableData]);


  const handleClose = () => {
    onClose();
    router.push("/Car/home-section/new-car", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "newCar";

  const handleStep1 = async () => {
    if (!id) return;

    try {
      const fileData = mobileFile?.file ? { file: mobileFile.file } : undefined;
      const result = await updateCar(id, editedData, fileData);

      if (result.message) {
        toast.success("Basic data updated");
      } else {
        toast.error("Failed to update basic data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update basic data");
    }
  };

  const handleStep2 = async (key: string) => {
    try {
      const response = await addVariant(carId, key);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(`Failed to add variant: ${key}`);
    }
  };

  const handleStep3 = async (key: string) => {
    try {
      await addVariantDetails(variantDetails[key], carId, key);
      toast.success(`Variant details added for: ${key}`);
    } catch (error) {
      console.log(error);
      toast.error(`Failed to add variant details for: ${key}`);
    }
  };

  const handleNext = async () => {
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

  const handleUpdateData = async () => {
    if (!id) return;
    console.log(editedData);

    try {
      const fileData = mobileFile?.file ? { file: mobileFile.file } : undefined;
      const result = await updateCar(id, editedData, fileData);

      if (result.message) {
        refreshData();
        handleClose();
        toast.success("Data updated successfully");
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update data");
    }
  };

  if (!selectedRow) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Right-Side Modal */}
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Edit Row - Step {step} of 3</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            {Object.keys(selectedRow).map((key) => {
              const lowerKey = key.toLowerCase();

              if (
                [
                  "_id",
                  "action",
                  "webUrl",
                  "createdAt",
                  "updatedAt",
                  "type",
                  "thumbnail",
                  "deletionDate",
                  "variants",
                  "__v",
                ].includes(key)
              ) {
                return null;
              }

              if (lowerKey === "dimensions") {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium">
                      Dimensions
                    </label>
                    {typeof selectedRow[key] === "object" &&
                      Object.entries(selectedRow[key]).map(
                        ([dimKey, dimValue]) => (
                          <div key={dimKey}>
                            <label className="block text-xs font-medium text-gray-500">
                              {dimKey}
                            </label>
                            <Input
                              type="text"
                              value={
                                editedData.dimensions?.[dimKey] ??
                                dimValue ??
                                ""
                              }
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  dimensions: {
                                    ...(prev.dimensions || {}),
                                    [dimKey]: e.target.value,
                                  },
                                }))
                              }
                              className="w-full mb-2"
                            />
                          </div>
                        )
                      )}
                  </div>
                );
              }

          

      if (["fueltype", "transmissions"].includes(lowerKey)) {
        return (
          <MultiSelectShadcn
            key={key}
            label={key}
            name={key}
            type={lowerKey}
            value={editedData[key] || []}
            onChange={(val) =>
              setEditedData((prev) => ({
                ...prev,
                [key]: val,
              }))
            }
          />
        )
      }
    
             

              if (lowerKey === "image") {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium">Image</label>
                    <ImageUpload
                      files={mobileFile ? [mobileFile] : []}
                      setFiles={(files: FileWithPreview[]) =>
                        setMobileFile(files[0] || null)
                      }
                      label="Logo"
                    />
                  </div>
                );
              }

              if (lowerKey === "brand") {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium">Brand</label>
                    <select
                      value={editedData[key] || ""}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="w-full border px-2 py-2 rounded"
                    >
                      {brands.map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label className="block text-sm font-medium">{key}</label>
                  <Input
                    name={key}
                    value={editedData[key] || ""}
                    onChange={onInputChange}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Variant Name
            </label>
            <div className="flex gap-2">
              <Input
                value={variantInput}
                onChange={(e) => setVariantInput(e.target.value)}
                placeholder="Enter variant name"
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
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVariants((prev) => prev.filter((item) => item !== v));
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
                  <label className="block text-sm font-medium mb-1">Fuel</label>
                  <Input
                    value={variantDetails[variant]?.fuel || ""}
                    onChange={(e) =>
                      handleDetailChange(variant, "fuel", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Transmission
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Mileage (City)
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
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
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <TextEditor
                    value={variantDetails[variant]?.description || ""}
                    onChange={(value) =>
                      handleDetailChange(variant, "description", value)
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Specifications
                  </label>
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

        <div className="mt-6 flex justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            {step === 1 && (
              <>
                <Button onClick={handleUpdateData}>Save Changes</Button>
                <Button onClick={handleNext}>Update and Continue</Button>
              </>
            )}

            {(step === 2 || step === 3) && (
              <Button onClick={handleNext}>
                {step === 3 ? "Complete" : "Next"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditModal;
