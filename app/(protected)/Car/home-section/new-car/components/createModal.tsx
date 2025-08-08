import React, { useState } from "react";
import TextEditor from "../../../components/SunEditor";
import { addVariantDetails } from "@/app/(protected)/services/createCar/api";

interface CreateModalProps {
  onClose: () => void;
  carId: string;
  name: string;
  refreshData: () => void;
}

interface VariantFormData {
  price: number;
  fuel: string;
  mileage: {
    city: number;
    highway: number;
  };
  description: string;
  specifications: string;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose, carId, name, refreshData }) => {
  const [price, setPrice] = useState<string>("");
  const [fuel, setFuel] = useState<string>("");
  const [mileageCity, setMileageCity] = useState<string>("");
  const [mileageHighway, setMileageHighway] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [specifications, setSpecifications] = useState<string>("");

  const handleSubmit = async () => {
    try {
      if (!carId || !name) {
        throw new Error("Car ID and name are required");
      }

      const data: VariantFormData = {
        price: Number(price) || 0,
        fuel: fuel.trim(),
        mileage: {
          city: Number(mileageCity) || 0,
          highway: Number(mileageHighway) || 0,
        },
        description,
        specifications,
      };

      const response = await addVariantDetails(data, carId, name);
      
      if (response.success) {
        refreshData();
        onClose();
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
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 w-[600px] transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-lg z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Create New Entry</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✖
          </button>
        </div>

        {/* Inputs in grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fuel</label>
            <input
              type="text"
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter fuel type"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /^\d*\.?\d*$/.test(value)) {
                  setPrice(value);
                }
              }}
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mileage (City)
            </label>
            <input
              type="number"
              value={mileageCity}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /^\d*\.?\d*$/.test(value)) {
                  setMileageCity(value);
                }
              }}
              className="w-full border px-3 py-2 rounded"
              placeholder="City mileage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Mileage (Highway)
            </label>
            <input
              type="number"
              value={mileageHighway}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /^\d*\.?\d*$/.test(value)) {
                  setMileageHighway(value);
                }
              }}
              className="w-full border px-3 py-2 rounded"
              placeholder="Highway mileage"
            />
          </div>
        </div>

        {/* TextEditor separate */}
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Descriptions
          </label>
          <TextEditor value={description} onChange={setDescription} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Specifications
          </label>
          <input
            type="text"
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Specification"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!fuel.trim() || !price || !mileageCity || !mileageHighway}
            className={`px-4 py-2 rounded ${
              !fuel.trim() || !price || !mileageCity || !mileageHighway
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
