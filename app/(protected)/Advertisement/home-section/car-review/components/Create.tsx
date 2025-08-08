"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import TextEditor from "@/app/(protected)/Car/components/SunEditor";

import type { FileWithPreview } from "../../../components/ImageUpload";
import { uploadReviewImage } from "@/app/(protected)/services/carReviews/api";
interface CreateModalProps {
  onClose: () => void;
  columnsField: string[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  token:any
}

const CreateModal: React.FC<CreateModalProps> = ({
  onClose,
  columnsField,
  setRefresh,
  type,
  token
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);

  const Web_DIMENSIONS = { width: 1920, height: 970 };
  const Mobile_DIMENSIONS = { width: 365 * 2, height: 140 * 2 };
  const dimensions = {
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  };

  useEffect(() => {
    if (columnsField.length > 0) {
      const filteredColumns = columnsField.slice(1);
      const initialData = filteredColumns.reduce((acc, column) => {
        if (column !== "ID" && column !== "Action") {
          acc[column] = "";
        }
        return acc;
      }, {} as Record<string, string>);
      setFormData(initialData);
    }
  }, [columnsField]);

  const handleClose = () => {
    onClose();
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleSubmit = async () => {
    console.log("click")
    try {
      const result = await uploadReviewImage({
        token:token,
        type:type,
        title: formData.Title,
        description:formData.Description,
        mobileFile: mobileFile?.file || null,
      });

      if (result.data) {
        toast.success("Slider image added");
        console.log("Upload success:", result.data);
        setMobileFile(null);
        refreshData();
        handleClose();
      } else {
        toast.error("Slider image not added");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };
  const excludedFields = ["schedulexpire", "isactive", "user"];
  // Helper function to get input value for a key
  const getInputValue = (key: string) => {
    return formData[key] || "";
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Create New Entry</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3">
          {Object.keys(formData).map((key) =>
            !excludedFields.includes(key.toLowerCase()) ? (
              <div key={key}>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    {key === "mobile" ? "Mobile" : key === "web" ? "Web" : key}
                  </label>

                  {key.toLowerCase() === "image" && (
                    <span className="text-xs text-gray-500 ml-2">
                      ( {Mobile_DIMENSIONS.width} x {Mobile_DIMENSIONS.height} )
                    </span>
                  )}
                </div>
                {key.toLowerCase() === "image" ? (
                  <ImageUpload
                    files={mobileFile ? [mobileFile] : []}
                    setFiles={(files: FileWithPreview[]) =>
                      setMobileFile(files[0] || null)
                    }
                    label="Mobile"
                  />
                ) : key.toLowerCase() === "description" ? (
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
                    value={formData[key]}
                    onChange={onInputChange}
                    className="w-full"
                  />
                )}
              </div>
            ) : null
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </div>
    </>
  );
};

export default CreateModal;
