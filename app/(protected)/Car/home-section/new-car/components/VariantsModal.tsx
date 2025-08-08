import { useEffect, useState } from "react";
import { Variant, VariantDetail } from './columnsLogo';


interface VariantsModalProps {
  variants: Variant[];
  onClose: () => void;
  refreshData: () => void;
}
import { PlusCircle, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteVariant,
  deleteVariantDetail,
  updateCarVariant,
  updateCarVariantName,
} from "@/app/(protected)/services/createCar/api";
import TextEditor from "../../../components/SunEditor";
import CreateModal from "./createModal";
import { toast } from "sonner";



interface VariantsModalProps {
  variants: Variant[];
  onClose: () => void;
  refreshData: () => void;
}

const VariantsModal: React.FC<VariantsModalProps> = ({ variants = [], onClose, refreshData }) => {
  const [variantList, setVariantList] = useState<Variant[]>(variants);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [carId, setCarId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const handleAdd=()=>{
    setIsModalOpen(true)
  }

  useEffect(() => {
    const storedId = localStorage.getItem("carId");
    if (storedId) setCarId(storedId);
  }, []);

  const handleEdit = (
    variantIndex: number,
    detailIndex: number,
    field: keyof VariantDetail,
    value: string | number
  ) => {
    try {
      const updated = [...variantList];
      if (updated[variantIndex]?.details[detailIndex]) {
        updated[variantIndex].details[detailIndex] = {
          ...updated[variantIndex].details[detailIndex],
          [field]: value
        };
        setVariantList(updated);
      }
    } catch (error) {
      console.error("Error updating field:", error);
      toast.error("Failed to update field");
    }
  };

  const handleUpdateDetails = async (
    variantIndex: number,
    detailIndex: number,
    variantId: string,
    detailId: string
  ) => {
    try {
      const updated = [...variantList];
      if (!updated[variantIndex]?.details[detailIndex]) {
        throw new Error("Variant or detail not found");
      }

      const data = updated[variantIndex].details[detailIndex];
      const res = await updateCarVariant(data, carId, variantId, detailId);
      
      if (res?.message) {
        refreshData();
        toast.success("Variant details updated successfully");
      } else {
        throw new Error("Failed to update variant details");
      }
    } catch (error) {
      console.error("Error updating variant details:", error);
      toast.error("Failed to update variant details");
    }
  };

  const handleEditNested = (
    variantIndex: number,
    detailIndex: number,
    parentKey: 'mileage',
    subKey: 'city' | 'highway',
    value: number
  ) => {
    try {
      const updated = [...variantList];
      if (updated[variantIndex]?.details[detailIndex]) {
        updated[variantIndex].details[detailIndex] = {
          ...updated[variantIndex].details[detailIndex],
          [parentKey]: {
            ...updated[variantIndex].details[detailIndex][parentKey],
            [subKey]: value
          }
        };
        setVariantList(updated);
      }
    } catch (error) {
      console.error("Error updating nested field:", error);
      toast.error("Failed to update field");
    }
  };

  const handleDeleteVariant = async (variantId: string, detailId: string) => {
    try {
      const res = await deleteVariantDetail(carId, variantId, detailId);
      if (res?.data?.message) {
        refreshData();
        toast.success("Variant detail deleted successfully");
      } else {
        throw new Error("Failed to delete variant detail");
      }
    } catch (error) {
      console.error("Error deleting variant detail:", error);
      toast.error("Failed to delete variant detail");
    }
  };

  const handleDelete = async (variantId: string) => {
    try {
      const res = await deleteVariant(carId, variantId);
      if (res?.data?.message) {
        refreshData();
        toast.success("Variant deleted successfully");
      } else {
        throw new Error("Failed to delete variant");
      }
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    }
  };

  const handleVariantNameChange = (index: number, newName: string) => {
    try {
      const updated = [...variantList];
      if (updated[index]) {
        updated[index].name = newName;
        setVariantList(updated);
      }
    } catch (error) {
      console.error("Error updating variant name:", error);
      toast.error("Failed to update variant name");
    }
  };

  const handleUpdateName = async (name: string, id: string) => {
    try {
      if (!name.trim() || !id) {
        throw new Error("Name and ID are required");
      }
      const res = await updateCarVariantName(name, carId, id);
      if (res?.message) {
        refreshData();
        toast.success("Variant name updated successfully");
      } else {
        throw new Error("Failed to update variant name");
      }
    } catch (error) {
      console.error("Error updating variant name:", error);
      toast.error("Failed to update variant name");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-lg font-semibold mb-4">Car Variants</h2>

        {variantList.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className="border p-4 rounded-lg mb-4 bg-gray-50"
          >
            <input
              type="text"
              value={variant.name ?? ""}
              onChange={(e) =>
                handleVariantNameChange(variantIndex, e.target.value)
              }
              className="font-semibold text-md mb-2 w-full border border-gray-300 rounded px-2 py-1"
              placeholder={`Variant ${variantIndex + 1}`}
            />

            {variant.details?.map((detail, detailIndex) => (
              <div
                key={detailIndex}
                className="border border-gray-200 rounded p-3 mb-4 bg-white"
              >
                <h4 className="text-sm font-semibold mb-2">
                  Variant Detail {detailIndex + 1}
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(detail).map(([key, value]) => {
                    if (key === "_id") return null;
                    if (key === "mileage" && typeof value === "object" && value !== null) {
                      return (
                        <div key={key} className="space-y-2">
                          {['city', 'highway'].map((subKey) => (
                            <div key={`${key}.${subKey}`}>
                              <label className="block text-sm font-medium">
                                {`${key}.${subKey}`}
                              </label>
                              <input
                                type="number"
                                value={(value as any)[subKey] ?? ""}
                                onChange={(e) =>
                                  handleEditNested(
                                    variantIndex,
                                    detailIndex,
                                    'mileage',
                                    subKey as 'city' | 'highway',
                                    Number(e.target.value)
                                  )
                                }
                                className="w-full border px-2 py-1 rounded"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium mb-1">
                          {key}
                        </label>

                        {key === "description" ? (
                          <TextEditor
                            value={(value as string) ?? ""}
                            onChange={(val) =>
                              handleEdit(variantIndex, detailIndex, key as keyof VariantDetail, val)
                            }
                          />
                        ) : (
                          <input
                            type={typeof value === "number" ? "number" : "text"}
                            value={value?.toString() ?? ""}
                            onChange={(e) =>
                              handleEdit(
                                variantIndex,
                                detailIndex,
                                key as keyof VariantDetail,
                                typeof value === "number"
                                  ? Number(e.target.value)
                                  : e.target.value
                              )
                            }
                            className="w-full border px-2 py-1 rounded"
                          />
                        )}
                      </div>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-default-200 dark:border-default-300 text-default-400"
                    onClick={() => handleDeleteVariant(variant._id, detail._id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
               
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 border-default-200 dark:border-default-300 text-default-400"
                    onClick={() =>
                      handleUpdateDetails(
                        variantIndex,
                        detailIndex,
                        variant._id,
                        detail._id
                      )
                    }
                  >
                    Update Variant Data
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleUpdateName(variant.name, variant._id)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                Update Variant Name
              </button>
                 <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-default-200 dark:border-default-300 text-default-400"
                      onClick={handleAdd}
                    >
                      <PlusCircle className="w-4 h-4" />
                    </Button>

                    {isModalOpen && (
                      <CreateModal  carId={carId} name={variant.name} onClose={() => setIsModalOpen(false)} refreshData={refreshData} />
                    )}
                  </>
              <button
                onClick={() => handleDelete(variant._id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete Variant
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VariantsModal;
