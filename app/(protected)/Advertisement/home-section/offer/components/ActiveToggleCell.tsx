// ActiveToggleCell.tsx
"use client";
import React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { toggleOfferStatus } from "@/app/(protected)/services/offers/api"; 

const ActiveToggleCell = ({ row,setRefresh }: { row: any }) => {
  const [isActive, setIsActive] = React.useState(row.original.isActive);

  const handleToggle = async (value: boolean) => {
    const previousState = isActive; 
    setIsActive(value); 
    try {
      const result = await toggleOfferStatus(row.original.id, value);
      if (result.success) {
        toast.success(`Offer ${value ? "activated" : "deactivated"} successfully`);
        setIsActive(value);
        setRefresh((prev) => !prev);
      } else {
        setIsActive(previousState); 
        toast.error("Failed to update status");
      }
    } catch (error) {
      setIsActive(previousState); 
      console.error("Error updating isActive:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <Switch checked={isActive} onCheckedChange={handleToggle} />
    </div>
  );
};

export default ActiveToggleCell;
