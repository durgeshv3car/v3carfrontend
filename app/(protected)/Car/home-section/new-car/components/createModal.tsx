import React, { useState } from "react";
import TextEditor from "../../../components/SunEditor";
import { addVariantDetails } from "@/app/(protected)/services/createCar/api";

interface CreateModalProps {
  onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ onClose ,carId,name,refreshData}) => {
  const [price, setPrice] = useState("");
  const [fuel, setFuel] = useState("");
  const [mileageCity, setMileageCity] = useState("");
  const [mileageHighway, setMileageHighway] = useState("");
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");

  const handleSubmit = async() => {
    const data = {
      price,
      fuel,
      mileage: {
        city: mileageCity,
        highway: mileageHighway,
      },
      description,
      specifications,
    };
    console.log(data,carId,name)
    const res=await addVariantDetails(data, carId, name);
    if (res.message){
        refreshData()
    }
    onClose();
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
              onChange={(e) => setPrice(e.target.value)}
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
              onChange={(e) => setMileageCity(e.target.value)}
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
              onChange={(e) => setMileageHighway(e.target.value)}
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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
