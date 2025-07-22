import { useEffect, useState } from "react";
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

function VariantsModal({ variants = [], onClose, refreshData }) {
  const [variantList, setVariantList] = useState(variants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carId, setCarId] = useState("");
  const handleAdd=()=>{
    setIsModalOpen(true)
  }

  useEffect(() => {
    const storedId = localStorage.getItem("carId");
    if (storedId) setCarId(storedId);
  }, []);

  const handleEdit = (variantIndex, detailIndex, field, value) => {
    const updated = [...variantList];
    updated[variantIndex].details[detailIndex][field] = value;
    setVariantList(updated);

    // ✅ Log change
  };
  const handleUpdateDetails = async (
    variantIndex,
    detailIndex,
    variantId,
    detailId
  ) => {
    const updated = [...variantList];

    console.log("hsuc", updated[variantIndex]);
    console.log("Updated Detail:", updated[variantIndex].details[detailIndex]);
    const data = updated[variantIndex].details[detailIndex];
    const res = await updateCarVariant(data, carId, variantId, detailId);
    if (res.message) {
      refreshData();
    }
  };

  const handleEditNested = (
    variantIndex,
    detailIndex,
    parentKey,
    subKey,
    value
  ) => {
    const updated = [...variantList];
    updated[variantIndex].details[detailIndex][parentKey][subKey] = value;

    // ✅ Log nested change
    console.log(
      "Updated Nested Detail:",
      updated[variantIndex].details[detailIndex]
    );
  };

  const handleDeleteVariant = async (variantId, detailId) => {
    const res = await deleteVariantDetail(carId, variantId, detailId);
    console.log(res);
    if (res.data.message) {
      refreshData();
    }
  };

  const handleDelete = async (variantId) => {
    const res = await deleteVariant(carId, variantId);
    if (res.data.message) {
      refreshData();
    }
  };

  const handleVariantNameChange = (index, newName) => {
    const updated = [...variantList];
    updated[index].name = newName;
    console.log("hredfu", updated[index]);
    setVariantList(updated);
  };
  const handleUpdateName = async (name, id) => {
    const res = await updateCarVariantName(name, carId, id);
    if (res.message) {
      refreshData();
    }
    console.log(name, "ugsbych");
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
                    if (
                      typeof value === "object" &&
                      value !== null &&
                      !Array.isArray(value)
                    ) {
                      return Object.entries(value).map(([subKey, subVal]) => (
                        <div key={`${key}.${subKey}`}>
                          <label className="block text-sm font-medium">
                            {`${key}.${subKey}`}
                          </label>
                          <input
                            type="text"
                            value={subVal ?? ""}
                            onChange={(e) =>
                              handleEditNested(
                                variantIndex,
                                detailIndex,
                                key,
                                subKey,
                                e.target.value
                              )
                            }
                            className="w-full border px-2 py-1 rounded"
                          />
                        </div>
                      ));
                    }

                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium mb-1">
                          {key}
                        </label>

                        {key === "description" ? (
                          <TextEditor
                            value={value ?? ""}
                            onChange={(val) =>
                              handleEdit(variantIndex, detailIndex, key, val)
                            }
                          />
                        ) : (
                          <input
                            type={typeof value === "number" ? "number" : "text"}
                            value={value ?? ""}
                            onChange={(e) =>
                              handleEdit(
                                variantIndex,
                                detailIndex,
                                key,
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
