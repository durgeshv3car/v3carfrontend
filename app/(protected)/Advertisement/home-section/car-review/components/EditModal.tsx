"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../../../components/ImageUpload";
import { toast } from "sonner";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import type { FileWithPreview } from "../../../components/ImageUpload";
import TextEditor from "@/app/(protected)/Car/components/SunEditor";
import { updateReviewImage } from "@/app/(protected)/services/carReviews/api";

interface TableRow {
  id: string;
  title?: string;
  imageUrl?: string;
  [key: string]: any;
}

interface EditModalProps {
  id: string | null;
  onClose: () => void;
  tableData: TableRow[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditModal: React.FC<EditModalProps> = ({
  id,
  onClose,
  tableData,
  setRefresh,
}) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Partial<TableRow>>({});
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [mobileFile, setMobileFile] = useState<FileWithPreview | null>(null);



 const Web_DIMENSIONS = { width: 1920, height: 970 };
 const Mobile_DIMENSIONS = { width: 365*2, height: 140*2 };
  const dimensions={
    web: Web_DIMENSIONS,
    mobile: Mobile_DIMENSIONS,
  }




  // Find the row data based on the id
  useEffect(() => {
    if (id && tableData) {
      const foundRow = tableData.find((row) => row._id === id) || null;
      setSelectedRow(foundRow);
      setEditedData(foundRow || {});
         
    if (foundRow?.image) {
      setMobileFile({ preview: foundRow.image } as FileWithPreview);
    }
    
    }
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Advertisement/home-section/car-review", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const refreshData = () => setRefresh((prev) => !prev);
  const type = "reviews";

  const handleUpdate = async () => {
    if (!id) return;

    const result = await updateReviewImage(
      id,
      editedData,
      mobileFile?.file,
      mobileFile?.preview,
    );

    if (result) {
      refreshData();
      handleClose();
      toast.success("Review data updated");
    } else {
      toast.error("Review data not updated");
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
            ![
              "_id",
              "userId",
              "action",
              "createdAt",
              "updatedAt",
              "type",
              "thumbnail",
              "deletionDate",
              "__v"
            ].includes(key) ? (
              <div key={key}>
                <div className="flex items-center">
                  <label className="block text-sm font-medium">
                    {
                      key}
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
                    setFiles={(files: FileWithPreview[]) => setMobileFile(files[0] || null)}
                    label="Mobile"
                  />
                ) : key.toLowerCase() === "active" ? (
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                )  : key.toLowerCase() === "description" ? (
                  <TextEditor
                    value={editedData[key] || ""}
                    onChange={(value: string) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                ): (
                  <Input
                    name={key}
                    value={editedData[key] || ""}
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
          <Button onClick={handleUpdate}>Save Changes</Button>
        </div>
      </div>
    </>
  );
};

export default EditModal;
