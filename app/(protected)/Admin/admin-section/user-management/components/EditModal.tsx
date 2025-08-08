"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateApi } from "@/app/(protected)/services/apiManagement/api";
import PermissionPage from "./PermissionView";
import { updateUser } from "@/app/(protected)/services/adminUsers/api";

// Match the same interface structure as in the main component
interface EditModalProps<T> {
  id: string;
  onClose: () => void;
  tableData: T[];
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  adminId: string;
  role: string;
  permissions: string[];
}

const EditModal = <T extends Record<string, any>>({
  id,
  onClose,
  tableData,
  setRefresh,
  role,
  permissions,
}: EditModalProps<T>) => {
  const router = useRouter();
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [permissionList, setPermissionList] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    // Type assertion to handle the possibility that id might be a different type
    const foundRow = tableData?.find((row) => (row as any).id === id) || null;
    setSelectedRow(foundRow);
    setEditedData(foundRow ? { ...foundRow } : {});
  }, [id, tableData]);

  const handleClose = () => {
    onClose();
    router.push("/Admin/admin-section/user-management", { scroll: false });
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const refreshData = () => setRefresh((prev) => !prev);

  const handleUpdate = async () => {
    if (!id) return;

    try {
      const result = await updateUser(
        id,
        editedData.name,
        editedData.email,
        editedData.role,
        selectedPermissions
      );
      if (result.success) {
        toast.success("User data updated successfully.");
        refreshData();
        handleClose();
      } else {
        toast.error("Failed to update User data.");
      }
    } catch (error) {
      console.error("Error updating User:", error);
      toast.error("An error occurred while updating the User.");
    }
  };

  const handleEditPermissions = (data: string[]) => {
    setIsOpen(true);
    router.push(`/Admin/admin-section/user-management?id=${id}`);
    setPermissionList(data);
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
          {Object.keys(selectedRow).map((key) => {
            // Skip these fields
            if (
              [
                "id",
                "action",
                "createdAt",
                "updatedAt",
                "type",
                "password",
              ].includes(key)
            ) {
              return null;
            }

            // Render appropriate input based on field type
            if (
              key.toLowerCase() === "active" ||
              typeof editedData[key] === "boolean"
            ) {
              return (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">{key}</label>
                  <Switch
                    checked={Boolean(editedData[key])}
                    onCheckedChange={(value) =>
                      setEditedData((prev) => ({ ...prev, [key]: value }))
                    }
                  />
                </div>
              );
            } else if (key === "permissions") {
              return (
                <div
                  key={key}
                  className="flex items-center justify-between border px-3 py-2 rounded bg-gray-100"
                >
                  <span className="text-sm font-medium">Permissions</span>
                  <button
                    onClick={() => handleEditPermissions(editedData[key])}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit Permissions"
                  >
                    ✏️
                  </button>
                </div>
              );
            } else {
              return (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="text-sm font-medium">{key}</label>
                  <Input
                    name={key}
                    value={editedData[key] || ""}
                    onChange={onInputChange}
                  />
                </div>
              );
            }
          })}
        </div>
        {isOpen && (
          <PermissionPage
            role={role}
            permissions={permissions}
            data={{ permissions: permissionList }}
            setIsOpen={setIsOpen}
            selectedPermissions={selectedPermissions}
            setSelectedPermissions={setSelectedPermissions}
          />
        )}

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
