import { useState } from "react";
import VariantsModal from "./VariantsModal";
import { toast } from "sonner";
import { LogoData } from "./columnsLogo";




interface VariantsModalTriggerProps {
  row:LogoData
  refreshData: () => void;
}

const VariantsModalTrigger: React.FC<VariantsModalTriggerProps> = ({ row, refreshData }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    try {
      if (!row._id) {
        throw new Error("Car ID is missing");
      }
      localStorage.setItem("carId", row._id);
      setIsOpen(true);
    } catch (error) {
      console.error("Error opening variants modal:", error);
      toast.error("Failed to open variants");
    }
  };

  const handleClose = () => {
    try {
      setIsOpen(false);
      localStorage.removeItem("carId");
    } catch (error) {
      console.error("Error closing variants modal:", error);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        aria-label="Open car variants"
        disabled={!row?._id}
      >
        Car Variants
      </button>
      {isOpen && Array.isArray(row?.variants) && (
        <VariantsModal
          variants={row?.variants || []}
          onClose={handleClose}
          refreshData={refreshData}
        />
      )}
    </>
  );
};

export default VariantsModalTrigger;
