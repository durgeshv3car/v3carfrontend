import { useState } from "react";
import VariantsModal from "./VariantsModal";

function VariantsModalTrigger({ row,refreshData }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    localStorage.setItem("carId", row._id);
    setIsOpen(true);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Car Variants
      </button>
      {isOpen && (
        <VariantsModal
          variants={row.variants}
          onClose={() => setIsOpen(false)}
          refreshData={refreshData}
        />
      )}
    </>
  );
}

export default VariantsModalTrigger;
