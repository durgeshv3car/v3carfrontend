import React, { useState, useEffect } from "react";
import { SelectedValues } from "../page";

import { DataProps } from "../table/columns";
import CategoryMultiSelect from "./CreateMultiSelect";

interface FilterProps {
  selectedValues: SelectedValues;
  setSelectedValues: React.Dispatch<React.SetStateAction<SelectedValues>>;
  data: DataProps[];
  allFilterOptions: Record<string, Set<string>>;
}

export default function Filter({
  selectedValues,
  setSelectedValues,
  data,
  allFilterOptions,
}: FilterProps) {
  const [dropdownOptions, setDropdownOptions] = useState<
    Record<string, { id: string; title: string }[]>
  >({});

  useEffect(() => {
    const newDropdowns: Record<string, { id: string; title: string }[]> = {};
    for (const field in allFilterOptions) {
      newDropdowns[field] = Array.from(allFilterOptions[field])
        .sort()
        .map((value) => ({ id: value, title: value }));
    }
    setDropdownOptions(newDropdowns);
  }, [allFilterOptions]);

  const handleSelectChange = (field: string, newValues: string[]) => {
    setSelectedValues((prev) => ({
      ...prev,
      [field]: newValues,
    }));
  };

  return (
    <div className="card flex flex-wrap gap-4">
      {Object.keys(selectedValues).map((field) => (
        <div key={field} className="w-[250px] dark:bg-slate-800 bg-white">
          <CategoryMultiSelect
            label={field}
            selectedIds={selectedValues[field] || []}
            onChange={(newValues) => handleSelectChange(field, newValues)}
            options={dropdownOptions[field] || []}
          />
        </div>
      ))}
    </div>
  );
}
