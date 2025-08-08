"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUser } from "@/app/(protected)/services/users/api";
import { DataProps } from "../table/columns";


interface EditModalProps {
  id: string;
  onClose: () => void;
  tableData: DataProps[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
}: EditModalProps) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<DataProps | null>(null);

  useEffect(() => {
    if (!id) return;

    const foundRow = tableData?.find((row) => row.id === id) || null;
    setSelectedRow(foundRow);
    setEditedData(foundRow ? { ...foundRow } : {});
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Lms/lms-section/leads", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  console.log(editedData.title)
  const handleUpdate = async () => {
    if (!id) return;
  
    try {
      const result = await updateUser(id, editedData);
      if (result.success) {
        toast.success("Category data updated successfully.");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update category data.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };
  

  if (!selectedRow) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Right-Side Modal */}
      <div className="fixed right-0 top-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 translate-x-0 z-50 p-6 overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Edit Row</h2>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-black"
          >
            ✖
          </button>
        </div>

        <div className="space-y-3">
          {Object.keys(selectedRow).map((key) =>
            !["id", "action", "createdAt", "updatedAt", "type",'otp','otpExpiry','fcm_token','jwt_token','whatsApp','movieGenres','isCompleted',"LoanApplication"].includes(
              key
            ) ? (
              <div key={key}>
                <label className="block text-sm font-medium">{key}</label>
                <Input
                  name={key}
                  value={editedData[key] || ""}
                  onChange={onInputChange}
                  className="w-full"
                />
              </div>
            ) : null
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
